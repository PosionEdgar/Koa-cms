/**
 * Created by qiangxl on 2018/12/25.
 */


let router = require('koa-router')();


let login = require('./admin/login'),
  user = require('./admin/user');

//配置中间件、获取Url的地址

router.use(async (ctx, next) => {

  // console.log(ctx.request.header.host);
  //模板引擎配置全部的变量

  ctx.state.__HOST__ = 'http://' + ctx.request.header.host

  await next();

});



router.get('/', async (ctx) => {

  ctx.body = "后台管理系统"

});

router.use('/login', login);

router.use('/user', user);

module.exports = router.routes();