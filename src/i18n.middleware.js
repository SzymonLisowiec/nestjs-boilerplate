import { Injectable, Dependencies, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import i18n from 'i18n';

@Injectable()
@Dependencies(ConfigService)
export class I18nMiddleware {

  constructor(configService) {
    this.logger = new Logger('i18n');
    this.configService = configService;
    i18n.configure({
      logDebugFn: (message) => {
        this.logger.debug(message);
      },
      
      logWarnFn: (message) => {
        this.logger.warn(message);
      },
      
      logErrorFn: (message) => {
        this.logger.error(message);
      },
      ...this.configService.get('i18n'),
    });    
  }

  use(request, response, next) {
    i18n.init(request, response, next); 
  }
}
