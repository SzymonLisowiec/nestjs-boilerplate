export default () => ({
  auth: {
    token: {
      length: 64,
      expireTime: 3600,
    },
    canLoginWithoutConfirmation: false,
  },
});
