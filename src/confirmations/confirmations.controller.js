import { Controller, Put, Body, Dependencies, Bind } from '@nestjs/common';
import { ConfirmationsService } from './confirmations.service';

@Controller('confirmations')
@Dependencies(ConfirmationsService)
export class ConfirmationsController {
  constructor(confirmationsService) {
    this.confirmationsService = confirmationsService;
  }

  @Put('confirm')
  @Bind(Body())
  async create (payload) {
    await this.validateService.validate(payload, {
      token: 'required|string',
    });
    await this.confirmationsService.confirm(payload.token);
    return {};
  }

}
