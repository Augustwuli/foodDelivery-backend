const models = require('../node_modules/.bin/models');
const Joi = require('joi');
const GROUP_NAME = 'orders';
const { paginationDefine } = require('../utils/router-helper');
models.orders.belongsTo(models.stores, {foreignKey:'store_id',as:'stores'});
models.orders.belongsTo(models.takers, {foreignKey:'taker_id',as:'takers'});

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
        include:[{
          model: models.takers,
          as: 'takers',
          attributes: ['phone','taker_name'] 
        }],
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
  // {
  //   method: 'GET',
  //   path: `/${GROUP_NAME}/table/{takerId}`,
  //   handler: async (request, reply) => {
  //     let result = {
  //       success: false,
  //       message: '获取订单列表失败',
  //       data: {},
  //       statu: 0
  //     };
  //     let {takerId} = request.params;
  //     console.log(takerId)
      // await models.orders.findAndCountAll({
      //   attributes: ['id', 'address', 'order_phone','statu'],
      //   where:{
      //     taker_id: takerId,
      //     statu: statu
      //   },
      //   limit: request.query.limit,
      //   offset: (request.query.page - 1) * request.query.limit,
      // }).then((orders) => {
      //   result.success = true;
      //   if(orders){
      //     result.data.orders = orders.rows;
      //     result.data.count = orders.count;
      //     result.message = '获取订单列表成功';
      //     result.statu = 1;
      //   }
      // }).catch((err) => {
      //   console.log(err)
      //   console.log('获取订单列表失败');
      // })
      // reply(result);
  //   },
  //   config: {
  //     validate :{
  //       params: {
  //         takerId: Joi.number().required,
  //       },
  //       query: {
  //         ...paginationDefine
  //       }
  //     },
  //     tags: ['api', GROUP_NAME],
  //     description: '获取订单接口'
  //   }
  // },
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
      await models.orders.findOne(
        { 
          include:[{
            model: models.stores,
            as: 'stores',
            attributes: ['phone','address','store_name','longitude','latitude'] 
          }],
          where: {id: orderId}
        }).then((order) => {
        result.success = true;
        if(order){
          result.data.name = order.name;
          result.data.phone = order.order_phone;
          result.data.address = order.address;
          result.data.storePhone = order.stores.phone;
          result.data.storeAddress = order.stores.address;
          result.data.storeName = order.stores.store_name;
          result.data.olongitude = order.longitude;
          result.data.olatitude = order.latitude;
          result.data.slongitude = order.stores.longitude;
          result.data.slatitude = order.stores.latitude;
          result.message = '获取订单信息成功';
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err)
        console.log('获取订单信息失败')
      })
      reply(result);
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
    method: 'POST',
    path: `/${GROUP_NAME}/accept`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '接受订单失败',
        data: {},
        statu: 0
      }
      let { orderId ,takerId } = request.payload;
      await models.orders.update(
        {
          statu: 1,
          taker_id: takerId
        },
        {
          where: {
            id: orderId
          }
        }).then((row) => {
          result.success = true;
          if(row){
            result.message = '接受订单成功';
            result.statu = 1;
          }
        }).catch((err) => {
          console.log('接受订单失败')
          console.log(err)
        }
      )
      reply(result);
    },
    config: {
      validate: {
        payload: {
          orderId: Joi.number().required(),
          takerId: Joi.number().required()
        }
      },
      tags: ['api', GROUP_NAME],
      description: '接受订单'
    }
  },
  {
    method: 'POST',
    path: `/${GROUP_NAME}/sure`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '确认收货失败',
        data: {},
        statu: 0
      }
      let { orderId } = request.payload;
      await models.orders.update(
        {
          statu: 2,
        },
        {
          where: {
            id: orderId
          }
        }).then((row) => {
          result.success = true;
          if(row){
            result.message = '确认收货成功';
            result.statu = 1;
          }
        }).catch((err) => {
          console.log('确认收货失败')
          console.log(err)
        }
      )
      reply(result);
    },
    config: {
      validate: {
        payload: {
          orderId: Joi.number().required()
        }
      },
      tags: ['api', GROUP_NAME],
      description: '确认收货'
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
        include:[{
          model: models.stores,
          as: 'stores',
          attributes: ['address'] 
        }],
        attributes: ['id', 'address', 'order_phone','created_at'],
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
        attributes: ['id', 'address', 'order_phone','statu'],
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
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/taker/{takerId}/{statu}`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '获取派送员所有订单失败',
        data: {},
        statu: 0
      }
      const {takerId,statu} = request.params;
      await models.orders.findAndCountAll({
        attributes: ['id', 'address', 'order_phone','statu'],
        where:{
          taker_id: takerId,
          statu: statu
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
          takerId: Joi.string().required(),
          statu: Joi.number().required()
        },
        query: {
          ...paginationDefine
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取派送员所有订单'
    }
  },
  {
    method: 'GET',
    path:`/${GROUP_NAME}/orderinfo/{orderId}`,
    handler: async (request,reply) => {
      let result = {
        success: false,
        message: '获取订单详情失败',
        data: {},
        statu: 0
      };
      let { orderId } = request.params;
      await models.orders.findOne(
        { 
          include:[{
            model: models.takers,
            as: 'takers',
            attributes: ['phone','taker_name'] 
          }],
          where: {id: orderId}
        }).then((order) => {
        result.success = true;
        if(order){
          result.data.name = order.name;
          result.data.phone = order.order_phone;
          result.data.address = order.address;
          result.data.takerPhone = order.takers.phone;
          result.data.takerName = order.takers.taker_name;
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
      validate:{
        params:{
          orderId: Joi.number().required()
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取订单详情'
    },
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/list/{storeId}/{statu}`,
    handler: async (request, reply) => {
      let result = {
        success: false,
        message: '获取商家所有订单失败',
        data: {},
        statu: 0
      }
      const { storeId,statu } = request.params;
      await models.orders.findAndCountAll({
        include:[{
          model: models.takers,
          as: 'takers',
          attributes: ['phone','taker_name'] 
        }],
        attributes: ['id', 'taker_id', 'address', 'order_phone'],
        where:{
          store_id: storeId,
          statu: statu
        },
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      }).then((orders) => {
        result.success = true;
        if(orders){
          result.data.orders = orders.rows;
          result.data.count = orders.count;
          result.message = '获取商家所有订单成功';
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err)
        console.log('获取商家所有订单失败');
      })
      reply(result);
    },
    config: {
      validate: {
        params: {
          storeId: Joi.string().required(),
          statu: Joi.number().required()
        },
        query: {
          ...paginationDefine
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取派送员所有订单'
    }
  },
];