# nestjs-boilerplate

## Description
This is try to build a NestJS boilerplate with all frequent needed features. At the same time this is my first project in NestJS.
__Development in progress, currently this is very early version.__

## Features
- Users system with token-session authentication
- Universal confirmations system
- Time-based One-time Password (TOTP)
- Ready mailer ([nest-modules/mailer](https://github.com/nest-modules/mailer))
- E-mail templates using [Handlebars](https://handlebarsjs.com)
- Permissions and Roles system shipped by [nest-access-control](https://github.com/nestjsx/nest-access-control) which is using [accesscontrol](https://github.com/onury/accesscontrol)

## Endpoints
### POST /auth/register
### POST /auth/login
### GET /auth/user
### PUT /confirmations/confirm
### POST /totp/generate
### PUT /totp/enable
### PUT /totp/disableWithToken
### PUT /totp/disableWithBackupCode
### GET /users/:userId
### POST /users/resetPassword

## TODO:
- [x] TOTP
- [x] Permissions and Roles system
- [x] Password recovering
- [ ] Changing password
- [ ] Add rate limiting in some places
- [ ] Move all values to configuration files
- [ ] E-mails internationalization templates

## Installation

```bash
$ git clone https://github.com/SzymonLisowiec/nestjs-boilerplate
$ cd nestjs-boilerplate
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test (project have no tests at the moment)

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
