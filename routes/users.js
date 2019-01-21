const models = require('../node_modules/.bin/models');
const GROUP_NAME = 'users';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/login`,
    handler: async (request, reply)=>{
      const { userName, password, type } = request.payload;
      let result = {
        success: false,
        message: '登录失败',
        statu: 0
      }
      if (type === '1') {
        await models.stores.findOne({
          where: {
            'name': userName,
          }
        }).then((user) => {
          result.success = true;
          if(user){
            let pwd = user.get('password');
            if(pwd === password){
              result.message = '登录成功';
              result.statu = 1;
            }
          }else{
            result.message = '没有此用户';
          }
        }).catch((err) => {
          console.log(err)
          console.log('查询用户失败');
        })
      }else if(type === '2') {
        await models.takers.findOne({
          where: {
            'name': userName,
          }
        }).then((user) => {
          result.success = true;
          if(user){
            let pwd = user.get('password');
            if(pwd === password){
              result.message = '登录成功';
              result.statu = 1;
            }
          }else{
            result.message = '没有此用户';
          }
        }).catch((err) => {
          console.log(err)
          console.log('查询用户失败');
        })
      }
      reply(result);
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '登录接口'
    }
  }
]