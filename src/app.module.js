import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nest-modules/mailer';
import { AccessControlModule } from 'nest-access-control';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TotpModule } from './totp/totp.module';
import { CacheModule } from './cache';
import { ConfirmationsModule } from './confirmations/confirmations.module';
import configuration from './config';
import { MailerHandlebarsAdapter } from './helpers/MailerHandlebarsAdapter'
import { ValidateModule } from './validate/validate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
    }),

    ValidateModule,
    
    UsersModule,
    AuthModule,
    TotpModule,
    ConfirmationsModule,

    AccessControlModule.forRootAsync({
      useFactory: (configService) => configService.get('roles'),
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      useFactory: (configService) => configService.get('database'),
      inject: [ConfigService],
    }),
    
    CacheModule.forRootAsync({
      useFactory: (configService) => configService.get('cache'),
      inject: [ConfigService],
    }),
    
    MailerModule.forRootAsync({
      useFactory: (configService) => ({
        transport: configService.get('mailer.transport'),
        defaults: configService.get('mailer.defaults'),
        template: {
          adapter: new MailerHandlebarsAdapter(configService.get('mailer.template', {})),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
