const path = require('path');

module.exports = (config, webpack) => {
  // Personalizar el título de la aplicación
  config.plugins.push(
    new webpack.DefinePlugin({
      ADMIN_PATH: JSON.stringify(process.env.STRAPI_ADMIN_PATH || '/admin'),
      BACKEND_URL: JSON.stringify(process.env.STRAPI_ADMIN_BACKEND_URL || 'http://localhost:1337'),
    })
  );

  // Personalizar el HTML template
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  
  // Encontrar el plugin HTML existente y modificarlo
  const htmlPluginIndex = config.plugins.findIndex(
    plugin => plugin.constructor.name === 'HtmlWebpackPlugin'
  );
  
  if (htmlPluginIndex !== -1) {
    // Modificar el plugin HTML existente
    config.plugins[htmlPluginIndex] = new HtmlWebpackPlugin({
      ...config.plugins[htmlPluginIndex].options,
      title: 'FlorkafFun Admin Area',
      meta: {
        'application-name': 'FlorkafFun Admin Area',
        'description': 'FlorkafFun Token Platform Administration Panel',
        'viewport': 'width=device-width, initial-scale=1',
      }
    });
  }

  return config;
};