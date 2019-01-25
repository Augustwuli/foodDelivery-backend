const models = require('../node_modules/.bin/models');
const Joi = require('joi');
const GROUP_NAME = 'orders';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/add`,
    handler: async (request, reply) => {
      const { storeId, name, phone, address, longitude, latitude, } = request.payload;
      await models.orders.upsert({

      })
    }
  }
];