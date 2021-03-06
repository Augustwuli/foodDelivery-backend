const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');
const hello = require('./routes/hello');
const users = require('./routes/users');
const stores = require('./routes/stores');
const orders = require('./routes/orders');
const takers = require('./routes/takers');
const pluginHapiSwagger = require('./plugins/hapi-swagger');

// 配置服务器启动的 host 和端口
const server = new Hapi.Server();
server.connection({
  host: config.host,
  port: config.port
});
const init = async () => {
  await server.register([
    // 为系统使用 hapi-swagger
    ...pluginHapiSwagger,
  ]);
  server.route([
    ...hello,
    ...users,
    ...stores,
    ...orders,
    ...takers,
  ]);
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

init();