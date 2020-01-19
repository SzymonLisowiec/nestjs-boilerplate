export default () => ({
  confirmations: {
    token: {
      length: 128,
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    },
    expireTime: 43200,

    types: {

      registration: {
        enabled: true,
        expireTime: 86400,
      },
      
    },
  },
});
