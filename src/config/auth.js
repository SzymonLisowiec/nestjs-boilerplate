export default () => ({
  auth: {
    token: {
      length: 64,
      expireTime: parseInt(process.env.AUTH_TOKEN_EXPIRE_TIME) || 3600,
    },
    canLoginWithoutConfirmation: process.env.AUTH_LOGIN_WITHOUT_CONFIRMATION === 'true',
  },
});
