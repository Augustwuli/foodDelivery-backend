const models = require('../node_modules/.bin/models');
const Joi = require('joi');
const GROUP_NAME = 'stores';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/save`,
    handler: async (request, reply) => {
      const { storeId, name, phone, address, longitude, latitude} = request.payload;
      let result = {
        success: false,
        message: '保存商家信息失败',
        data: {},
        statu: 0
      }
      await models.stores.update({
        store_name: name,
        phone: phone,
        address: address,
        longitude: longitude,
        latitude: latitude
      },
      {
        where: {
          id: storeId
        }
      }).then((row) => {
        result.success = true;
        if(row){
          result.message = '保存商家信息成功'
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err)
        console.log('保存商家信息失败')
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
      description: '保存商家信息接口'
    }
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/info/{storeId}`,
    handler: async (request, reply) => {
      const { storeId } = request.params;
      let result = {
        success: false,
        message: '获取商家信息失败',
        data: {},
        statu: 0
      }
      await models.stores.findOne({
        where: {
          'id': storeId
        }
      }).then((user)=>{
        result.success = true;
        if(user){
          result.message = '获取商家信息成功';
          result.data.name = user.get('store_name');
          result.data.phone = user.get('phone');
          result.data.longitude = user.get('longitude');
          result.data.latitude = user.get('latitude');
          result.data.address = user.get('address');
          result.statu = 1;
        }
      }).catch((err)=>{
        console.log(err);
        console.log('获取商家信息失败');
      })
      reply(result);
    },
    config: {
      validate :{
        params: {
          storeId: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取商家信息接口'
    }
  }
];