// app.js
'use strict';

const Hapi = require('hapi');
require('env2')('./.env');
const config = require('./config');

// 配置服务器启动的 host 和端口
const server = new Hapi.Server(config);
const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

init();