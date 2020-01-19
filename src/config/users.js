export default () => ({
  users: {
    username: {
      length: [3, 16],
      charset: 'A-Za-z0-9_',
    },

    password: {
      length: [8, 128],
    },
  },
});
