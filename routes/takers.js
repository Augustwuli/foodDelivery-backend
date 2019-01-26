const models = require('../node_modules/.bin/models');
const Joi = require('joi');
const GROUP_NAME = 'takers';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/save`,
    handler: async (request, reply) => {
      const { takerId, name, phone } = request.payload;
      let result = {
        success: false,
        message: '保存派送员信息失败',
        data: {},
        statu: 0
      }
      await models.takers.update({
        taker_name: name,
        phone: phone,
      },
      {
        where: {
          id: takerId
        }
      }).then((row) => {
        result.success = true;
        if(row){
          result.message = '保存派送员信息成功'
          result.statu = 1;
        }
      }).catch((err) => {
        console.log(err)
        console.log('保存派送员信息失败')
      })
      reply(result);
    },
    config: {
      validate :{
        payload: {
          takerId: Joi.string().required(),
          name: Joi.string().required(),
          phone: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '保存派送员信息接口'
    }
  },
  {
    method: 'GET',
    path: `/${GROUP_NAME}/info/{takerId}`,
    handler: async (request, reply) => {
      const { takerId } = request.params;
      let result = {
        success: false,
        message: '获取派送员信息失败',
        data: {},
        statu: 0
      }
      await models.takers.findOne({
        where: {
          'id': takerId
        }
      }).then((user)=>{
        result.success = true;
        if(user){
          result.message = '获取派送员信息成功';
          result.data.name = user.get('taker_name');
          result.data.phone = user.get('phone');
          result.statu = 1;
        }
      }).catch((err)=>{
        console.log(err);
        console.log('获取派送员信息失败');
      })
      reply(result);
    },
    config: {
      validate :{
        params: {
          takerId: Joi.string().required(),
        }
      },
      tags: ['api', GROUP_NAME],
      description: '获取商家信息接口'
    }
  }
];