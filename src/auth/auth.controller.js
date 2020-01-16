import { Controller, Dependencies, UseGuards, Post, Request, Body, Get, Bind } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ValidateService } from '../validate/validate.service';

@Controller('auth')
@Dependencies(ValidateService, AuthService, ConfigService)
export class AuthController {
  constructor (validateService, authService, configService) {
    this.validateService = validateService;
    this.authService = authService;
    this.configService = configService;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @Bind(Request(), Body())
  async login(request, payload) {
    const [ minPasswordLength, maxPasswordLength ] = await this.configService.get('users.password.length');
    await this.validateService.validate(payload, {
      login: 'required|string',
      password: `required|string|min:${minPasswordLength}|max:${maxPasswordLength}`,
    });
    return this.authService.login(request.user, payload);
  }

  @Post('register')
  @Bind(Request(), Body())
  async register(request, payload) {
    const usernameCharset = await this.configService.get('users.username.charset');
    const [ minUsernameLength, maxUsernameLength ] = await this.configService.get('users.username.length');
    const [ minPasswordLength, maxPasswordLength ] = await this.configService.get('users.password.length');
    await this.validateService.validate(payload, {
      name: `required|string|min:${minUsernameLength}|max:${maxUsernameLength}|regex:/^[${usernameCharset}]{0,}$/`,
      email: 'required|email',
      password: `required|string|min:${minPasswordLength}|max:${maxPasswordLength}`,
      tos: 'required|boolean|accepted',
    });
    return this.authService.register(request, payload);
  }

  @UseGuards(AuthGuard('bearer'))
  @Get('user')
  @Bind(Request())
  async user(request) {
    return request.user;
  }
  
}
