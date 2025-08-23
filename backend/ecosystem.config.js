module.exports = {
  apps: [
    {
      name: 'florkafun-backend',
      script: './node_modules/@strapi/strapi/bin/strapi.js',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        DATABASE_CLIENT: 'sqlite',
        HOST: '0.0.0.0',
        PORT: process.env.PORT || 1337,
      },
    },
  ],
};