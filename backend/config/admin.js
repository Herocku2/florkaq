module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'florka-admin-jwt-secret-2024-secure-key'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'florka-api-token-salt-2024-secure-hash'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'florka-transfer-token-salt-2024-secure'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});