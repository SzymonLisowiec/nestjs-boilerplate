export default () => ({
  users: {
    username: {
      length: [3, 16],
      charset: 'A-Za-z0-9_',
    },

    password: {
      length: [8, 128],
    },

    sendRegistrationConfirmation: process.env.SEND_REGISTRATION_CONFIRMATION === 'true',
    registrationConfirmationExpireTime: parseInt(process.env.REGISTRATION_CONFIRMATION_EXPIRE_TIME) || 86400,
  },
});
