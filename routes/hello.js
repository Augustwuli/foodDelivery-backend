module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply)=>{
      let data = {
        success: true,
        message: '成功',
        data: {
          list:[]
        }
      }
      reply('Hello ' + encodeURIComponent(request.params.user) + '!');
      // reply(data);
    },
    config: {
      tags: ['api','tests'],
      description: '测试hello'
    }
  },
  {
    method: 'GET',
    path: '/test',
    handler: (request, reply)=>{
      let data = {
        success: true,
        message: '成功',
        data: {
          list:[]
        }
      }
      reply(data);
    },
    config: {
      tags: ['api','tests'],
      description: '测试hello'
    }
  }
]