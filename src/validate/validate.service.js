import { Global, Injectable, Scope, Dependencies, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import Validator from 'validatorjs';

@Global()
@Injectable({ scope: Scope.REQUEST })
@Dependencies(REQUEST)
export class ValidateService {
  constructor (request) {
    this.request = request;
  }
  
  async validate (data, schema) {
    const validation = new Validator(data, schema, this.request.getCatalog(this.request.locale).validator || {});
    if (validation.fails()) {
      throw new BadRequestException([validation.errors.all()]);
    }
  }
}
