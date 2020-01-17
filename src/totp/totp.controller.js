import { Controller, Dependencies, UseGuards, Post, Request, Body, Put, Bind } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TotpService } from './totp.service';
import { ValidateService } from '../validate/validate.service';

@Controller('totp')
@Dependencies(TotpService, ValidateService)
export class TotpController {
  constructor (totpService, validateService) {
    this.totpService = totpService;
    this.validateService = validateService;
  }

  @UseGuards(AuthGuard('bearer'))
  @Post('generate')
  @Bind(Request())
  async generate({ user }) {
    return await this.totpService.generate(user);
  }

  @UseGuards(AuthGuard('bearer'))
  @Put('enable')
  @Bind(Request(), Body())
  async enable({ user }, payload) {
    await this.validateService.validate(payload, {
      token: `required|string`,
    });
    await this.totpService.enable(user, payload.token);
    return {};
  }

  @UseGuards(AuthGuard('bearer'))
  @Put('disableWithToken')
  @Bind(Request(), Body())
  async disableWithToken({ user }, payload) {
    await this.validateService.validate(payload, {
      token: `required|string`,
    });
    await this.totpService.disableWithToken(user, payload.token);
    return {};
  }
  
  @Put('disableWithBackupCode')
  @Bind(Request(), Body())
  async disableWithBackupCode({ user }, payload) {
    await this.validateService.validate(payload, {
      code: `required|string`,
    });
    await this.totpService.disableWithBackupCode(user, payload.code);
    return {};
  }
  
}
