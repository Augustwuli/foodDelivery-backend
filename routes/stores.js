const models = require('../node_modules/.bin/models');
const Joi = require('joi');
const GROUP_NAME = 'stores';

module.exports = [
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