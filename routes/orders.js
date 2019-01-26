const models = require('../node_modules/.bin/models');
const Joi = require('joi');
const GROUP_NAME = 'orders';
const { paginationDefine } = require('../utils/router-helper');

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/add`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '添加订单失败',
        data: {},
        statu: 0
      }
      const { storeId, name, phone, address, longitude, latitude, } = request.payload;
      await models.orders.upsert({
        store_id: Number(storeId),
        name: name,
        order_phone: phone,
        address: address,
        longitude: longitude,
        latitude: latitude
      }).then((user) => {
        console.log(user)
        result.success = true;
        if(user){
          result.message = '添加订单成功';
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err);
        console.log('添加订单失败');
      })
      reply(result);
    },
    config: {
      validate :{
        payload: {
          storeId: Joi.string().required(),
          name: Joi.string().required(),
          phone: Joi.string().required(),
          address: Joi.string().required(),
          longitude: Joi.string().required(),
          latitude: Joi.string().required()
        }
      },
      tags: ['api', GROUP_NAME],
      description: '添加订单接口'
    }
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/list/{storeId}`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '获取派送列表失败',
        data: {},
        statu: 0
      }
      let {storeId} = request.params;
      storeId = Number(storeId);
      await models.orders.findAndCountAll({
        attributes: ['id', 'taker_id', 'address', 'order_phone', 'statu'],
        where:{
          store_id: storeId
        },
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      }).then((orders) => {
        result.success = true;
        if(orders){
          result.data.orders = orders.rows;
          result.data.count = orders.count;
          result.message = '获取派送列表成功';
          result.statu = 1;
        }
      }).catch((err) => {
        console.error('获取派送列表失败');
        console.log(err);
      })
      reply(result);
    },
    config: {
      validate: {
        params: {
          storeId: Joi.string().required(),
        },
        query: {
          ...paginationDefine
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取派送单接口'
    }
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/update`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '更新订单失败',
        data: {},
        statu: 0
      }
      const { orderId, name , phone, address, longitude, latitude } = request.payload;
      await models.orders.update(
        {
          name: name,
          order_phone: phone,
          address: address,
          longitude: longitude,
          latitude: latitude
        },
        {
          where: {
            id: orderId
          }
        }).then((row) => {
          result.success = true;
          if(row){
            result.message = '更新订单成功';
            result.statu = 1;
          }
        }).catch((err) => {
          console.log('更新订单失败')
          console.log(err)
        })
      reply(result);
    },
    config: {
      validate: {
        payload: {
          orderId: Joi.string().required(),
          name: Joi.string().required(),
          phone: Joi.string().required(),
          address: Joi.string().required(),
          longitude: Joi.string().required(),
          latitude: Joi.string().required()
        }
      },
      tags: ['api', GROUP_NAME],
      description: '更新订单详情'
    }
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/info/{orderId}`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '获取订单信息失败',
        data: {},
        statu: 0
      }
      const { orderId } = request.params;
      await models.orders.findOne({
        where: {
          'id': orderId
        }
      }).then((order) => {
        result.success = true;
        if(order){
          result.data.name = order.get('name');
          result.data.phone = order.get('order_phone');
          result.data.address = order.get('address');
          result.data.longitude = order.get('longitude');
          result.data.latitude = order.get('latitude');
          result.message = '获取订单信息成功';
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err)
        console.log('获取订单信息失败')
      })
      reply(result)
    },
    config: {
      validate: {
        params: {
          orderId: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取订单详情'
    }
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/takerinfo/{orderId}`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '获取订单信息失败',
        data: {},
        statu: 0
      }
      let { orderId } = request.params;
      orderId = Number(orderId);
      console.log(orderId)
      let include = [{
        association: models.stores.hasMany(models.orders, 
          {
            foreignKey:'store_id',
            as:'order',
            scope: {
              id: orderId
            } 
          }),
      }]
      await models.stores.findOne({include:include})
      .then((order) => {
        result.success = true;
        if(order){
          result.data.name = order.name;
          result.data.phone = order.order.order_phone;
          result.data.address = order.address;
          result.data.storeAddress = order.order.address;
          result.data.storeName = order.store_name;
          result.message = '获取订单信息成功';
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err)
        console.log('获取订单信息失败')
      })
      reply(result)
    },
    config: {
      validate: {
        params: {
          orderId: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取订单详情'
    }
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/wait`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '获取未解决订单失败',
        data: {},
        statu: 0
      }
      await models.orders.findAndCountAll({
        attributes: ['id', 'address', 'order_phone'],
        where:{
          statu: 0
        },
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      }).then((orders) => {
        result.success = true;
        if(orders){
          result.data.orders = orders.rows;
          result.data.count = orders.count;
          result.message = '获取未解决订单成功';
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err)
        console.log('获取未解决订单失败');
      })
      reply(result);
    },
    config: {
      validate: {
        query: {
          ...paginationDefine
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取所有未解决订单'
    }
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/taker/{takerId}`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '获取派送员所有订单失败',
        data: {},
        statu: 0
      }
      const {takerId} = request.params;
      await models.orders.findAndCountAll({
        attributes: ['id', 'address', 'order_phone'],
        where:{
          taker_id: takerId
        },
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      }).then((orders) => {
        result.success = true;
        if(orders){
          result.data.orders = orders.rows;
          result.data.count = orders.count;
          result.message = '获取派送员所有订单成功';
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err)
        console.log('获取派送员所有订单失败');
      })
      reply(result);
    },
    config: {
      validate: {
        params: {
          takerId: Joi.string().required()
        },
        query: {
          ...paginationDefine
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取派送员所有订单'
    }
  }
];