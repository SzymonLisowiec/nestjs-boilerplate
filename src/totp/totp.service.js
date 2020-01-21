import { Injectable, Dependencies, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import Otp from '2fa';
import { CacheManager } from '../cache';

@Injectable()
@Dependencies(UsersService, CacheManager, ConfigService)
export class TotpService {

  constructor(usersService, cache, configService) {
    this.usersService = usersService;
    this.configService = configService;
    this.cache = cache;

    this.options = {
      issuer: this.configService.get('totp.issuer'),
      drift: this.configService.get('totp.drift'),
      period: this.configService.get('totp.period'),
    };

  }

  getServerTime () {
    return Math.floor(Date.now() / 1000);
  }

  generateKey (length) {
    return new Promise((resolve, reject) => {
      Otp.generateKey(length, (error, key) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(key);
      });
    });
  }

  generateBackupCodes (count, pattern) {
    return new Promise((resolve, reject) => {
      Otp.generateBackupCodes (count, pattern, (error, key) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(key);
      });
    });
  }

  generateUrl (accountName, key) {
    return Otp.generateUrl(this.options.issuer, accountName, key) + '&period=' + this.options.period;
  }

  async generate (user) {
    if (user.totp && user.totp.isActive) {
      throw new BadRequestException('Cannot generate totp.');
    }
    const keyLength = this.configService.get('totp.backupCodes.key.length');
    const key = await this.generateKey(keyLength);
    const backupCodesCount = this.configService.get('totp.backupCodes.count');
    const backupCodesPattern = this.configService.get('totp.backupCodes.pattern');
    const backupCodes = await this.generateBackupCodes(backupCodesCount, backupCodesPattern);
    user.totp = {
      isActive: false,
      key,
      period: this.options.period,
      backupCodes,
    };
    await user.save();
    return {
      secret: Otp.base32Encode(key),
      url: this.generateUrl(user.name, key),
      period: this.options.period,
      drift: this.options.drift,
      backupCodes,
      serverTime: this.getServerTime(),
    };
  }

  verify (key, token, options) { // TODO: Add limit for failed attempts
    options = {
      ...this.options,
      ...options,
    };
    return Otp.verifyHOTP(key, token, Math.floor(this.getServerTime() / options.period), options);
  }

  async enable (user, token) {
    if (!user.totp || user.totp.isActive) {
      throw new BadRequestException('Cannot enable totp.');
    }
    if (!await this.verify(user.totp.key, token)) {
      throw new BadRequestException('Cannot verify totp.');
    }
    user.totp.isActive = true;
    await user.save();
    return true;
  }

  async disable (user) {
    user.totp.isActive = false;
    await user.save();
    return true;
  }

  async disableWithToken (user, token) {
    if (!user.totp || !user.totp.isActive || !token) {
      throw new BadRequestException('Cannot disable totp.');
    }
    if (!await this.verify(user.totp.key, token)) {
      throw new BadRequestException('Cannot verify totp.');
    }
    return await this.disable(user);
  }

  async disableWithBackupCode (user, backupCode) { // TODO: Add limit for failed attempts
    if (!user.totp || !user.totp.isActive || !backupCode) {
      throw new BadRequestException('Cannot disable totp.');
    }
    if (user.totp.backupCodes.indexOf(backupCode) === -1) {
      throw new BadRequestException('Given backup code not matching.');
    }
    return await this.disable(user);
  }
}
