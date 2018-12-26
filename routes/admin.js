/**
 * Created by qiangxl on 2018/12/25.
 */


let router = require('koa-router')();
let url = require('url');


let login = require('./admin/login'),
  user = require('./admin/user');

//配置中间件、获取Url的地址

router.use(async (ctx, next) => {

  // console.log(ctx.request.header.host);
  //模板引擎配置全部的变量

  ctx.state.__HOST__ = 'http://' + ctx.request.header.host;


  let pathname = url.parse(ctx.request.url).pathname;

  //权限判断
  if (ctx.session.userInfo) {

    await next();

  } else {

    //没有登录返回登录页面
    if (pathname == '/admin/login' || pathname == '/admin/login/dologin' || pathname == '/admin/login/code') {

      await next();

    } else {

      ctx.redirect('/admin/login')
    }

  }
});



router.get('/', async (ctx) => {

  await ctx.render('admin/index')

});

router.use('/login', login);

router.use('/user', user);

module.exports = router.routes();