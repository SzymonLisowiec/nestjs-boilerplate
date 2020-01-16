import { Global, Module } from '@nestjs/common';
import { ValidateService } from './validate.service';

@Global()
@Module({
  providers: [ValidateService],
  exports: [ValidateService],
})
export class ValidateModule {}
