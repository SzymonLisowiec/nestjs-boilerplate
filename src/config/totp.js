export default () => ({
  totp: {
    issuer: 'nestjs-boilerplate',
    drift: 2,
    period: 30,
    key: {
      length: 32,
    },
    backupCodes: {
      pattern: 'xxxx-xxxx-xxxx',
      count: 3,
    },
  },
});
