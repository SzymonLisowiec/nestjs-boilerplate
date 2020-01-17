import { Controller, Dependencies, UseGuards, Get, Bind, Param, NotFoundException, UnauthorizedException, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserRoles, ROLES_BUILDER_TOKEN } from 'nest-access-control';
import { UsersService } from './users.service';
import { ValidateService } from '../validate/validate.service';

@Controller('users')
@Dependencies(UsersService, ROLES_BUILDER_TOKEN, ValidateService, ConfigService)
export class UsersController {
  constructor(usersService, rolesBuilder, validateService, configService) {
    this.usersService = usersService;
    this.roles = rolesBuilder;
    this.validateService = validateService;
    this.configService = configService;
  }
  
  @Post('resetPassword')
  @Bind(Body())
  async resetPassword(payload) {
    const [ minPasswordLength, maxPasswordLength ] = await this.configService.get('users.password.length');
    await this.validateService.validate(payload, {
      email: 'required_without:token|email',
      token: 'required_without:email|string|min:16',
      password: `required|string|min:${minPasswordLength}|max:${maxPasswordLength}`,
    });
    return this.usersService.resetPassword(payload);
  }

  @UseGuards(AuthGuard('bearer'))
  @Get(':userId')
  @Bind(UserRoles(), Param())
  async test (roles, params) {
    await this.validateService.validate(params, {
      userId: 'required|hex|size:24',
    });
    const user = await this.usersService.findOneById(params.userId);
    if (!user) throw new NotFoundException();
    const permission = this.roles.permission({
      role: roles,
      resource: 'user',
      action: 'read:any',
    });
    if (!permission.granted) throw new UnauthorizedException();
    return permission.filter(user.toObject());
  }
}
