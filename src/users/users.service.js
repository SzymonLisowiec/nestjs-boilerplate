import { Injectable, Dependencies, Logger, InternalServerException, BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ConfirmationsService } from '../confirmations/confirmations.service';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nest-modules/mailer';
import * as Argon2 from 'argon2';

@Injectable()
@Dependencies(ConfigService, getModelToken('User'), ConfirmationsService, MailerService)
export class UsersService {
  constructor(configService, userModel, confirmationsService, mailerService) {
    this.logger = new Logger(UsersService.name);
    this.configService = configService;
    this.userModel = userModel;
    this.confirmationsService = confirmationsService;
    this.mailerService = mailerService;
  }

  async create(userData) {
    const duplicatedUser = await this.userModel.findOne({
      $or: [
        { email: userData.email },
        { name: userData.name },
      ],
    });
    if (duplicatedUser) {
      if (duplicatedUser.email.toLowerCase() === userData.email.toLowerCase()) {
        throw new BadRequestException('E-mail has already been registered');
      }
      throw new BadRequestException('Username has already been taken.');
    }

    const user = new this.userModel({
      name: userData.name,
      email: userData.email,
      password: await this.hashPassword(userData.password),
      localization: {
        language: userData.localization.language,
      },
    });
    await user.save();
    
    this.sendConfirmationEmail(user);

    return user;
  }


  async sendConfirmationEmail (user) {
    const isConfirmationEnabled = this.configService.get('confirmations.types.registration.enabled');
    if (!isConfirmationEnabled) return;
    const confirmation = await this.confirmationsService.refreshOrCreate(user, 'registration');
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Registration',
        template: 'user-registration',
        context: {
          token: confirmation.token,
          username: user.name,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async resendConfirmationEmail({ email }) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User with the given e-mail has not found!');
    }
    this.sendConfirmationEmail(user);
  }

  async findOneById(id) {
    return this.userModel.findById(id);
  }

  async findOneByLogin(login) {
    let user;
    if (login.indexOf('@') > -1) {
      user = this.userModel.findOne({
        email: login,
      });
    } else {
      user = this.userModel.findOne({
        name: login,
      });
    }
    return user;
  }

  async findOneByName(name) {
    return this.userModel.findOne({
      name,
    });
  }

  async findOneByEmail(email) {
    return this.userModel.findOne({
      email,
    });
  }

  async confirmRegistration(user) {
    user.registrationConfirmedAt = Date.now();
    await user.save();
  }

  async resetPassword ({ email, token, password }) {
    if (token) {
      const confirmation = await this.confirmationsService.confirm(token);
      this.updatePassword(confirmation.user, password);
      return;
    }
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    const confirmationExpireTime = this.configService.get('users.resetPasswordConfirmationExpireTime');
    const confirmation = await this.confirmationsService.create(user, 'password-reset', confirmationExpireTime);
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password reset',
        template: 'user-password-reset',
        context: {
          token: confirmation.token,
          username: user.name,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async updatePassword (user, password) {
    user.password = await this.hashPassword(password);
    user.save();
  }

  // async findByLogins(logins: Array<string>): Promise<Array<User>> {
  //   const emails = [];
  //   const names = [];
  //   logins.forEach((login) => {
  //     if (login.indexOf('@') > -1) {
  //       emails.push(login);
  //     } else {
  //       names.push(login);
  //     }
  //   });
  //   return this.userModel.find({
  //     $or: {
  //       name: {
  //         $in: names,
  //       },
  //       email: {
  //         $in: emails,
  //       },
  //     },
  //   });
  // }

  async hashPassword (password) {
    try {
      return await Argon2.hash(password);
    } catch (error) {
      throw new InternalServerException();
    }
  }

  onModuleInit () {
    this.confirmationsService.on('confirmed#registration', (event) => {
      this.confirmRegistration(event.confirmation.user);
    });
  }
}
