import { Injectable, Dependencies, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { EventEmitter } from 'events';
import { ConfirmedEvent } from './confirmed.event';

@Injectable()
@Dependencies(getModelToken('Confirmation'), ConfigService)
export class ConfirmationsService extends EventEmitter {
  
  constructor (confirmationModel, configService) {
    super();
    this.confirmationModel = confirmationModel;
    this.configService = configService;
  }

  getExpireTime (type) {
    return this.configService.get(`confirmations.types.${type}`) || this.configService.get('confirmations.expireTime');
  }

  generateToken () {
    let token = '';
    const length = this.configService.get('confirmations.token.length');
    const charset = this.configService.get('confirmations.token.charset');
    for (let i = 0; i < length; ++i) {
      token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return token;
  }

  async getPendingConfirmations (user, filters) {
    return await this.confirmationModel.find({
      user: user.id,
      ...filters,
    });
  }

  async create (user, type) {
    const token = this.generateToken();
    const confirmation = new this.confirmationModel({
      user: user.id,
      type,
      token,
      expiresAt: Date.now() + this.getExpireTime(type) * 1000,
    });
    confirmation.save();
    return confirmation;
  }

  async refreshOrCreate (user, type) {
    const token = this.generateToken();
    let confirmation = await this.confirmationModel.findOne({
      user: user.id,
      type,
    });
    if (!confirmation) {
      confirmation = new this.confirmationModel({
        user: user.id,
        type,
      });
    }
    confirmation.token = token;
    confirmation.expiresAt = Date.now() + this.getExpireTime(type) * 1000;
    confirmation.save();
    return confirmation;
  }

  async confirm (token) { // TODO: Add rate limit
    const confirmation = await this.confirmationModel.findOne({
      token,
    }).populate('user');
    if (!confirmation) {
      throw new BadRequestException('Confirmation not exists.');
    }
    await confirmation.remove();
    this.emit(`confirmed#${confirmation.type}`, new ConfirmedEvent(confirmation));
    return confirmation;
  }

}
