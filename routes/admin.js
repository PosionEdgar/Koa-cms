/**
 * Created by qiangxl on 2018/12/25.
 */


let router = require('koa-router')();
let url = require('url');


let login = require('./admin/login'),
  index = require('./admin/index'),
  user = require('./admin/user'),
  manage = require('./admin/manage'),
  articlecate = require('./admin/articlecate'),
  article = require('./admin/article');


//配置中间件、获取Url的地址

router.use(async (ctx, next) => {

  // console.log(ctx.request.header.host);
  //模板引擎配置全部的变量

  ctx.state.__HOST__ = 'http://' + ctx.request.header.host;


  let pathname = url.parse(ctx.request.url).pathname.substring(1);

  var splitUrl = pathname.split('/');


  //配置全局信息
  ctx.state.G = {
    url: splitUrl,
    userInfo: ctx.session.userInfo,
    prevPage: ctx.request.header['referer']  /*上一页的地址*/
  };


  //权限判断
  if (ctx.session.userInfo) {

    await next();

  } else {

    //没有登录返回登录页面
    if (pathname == 'admin/login' || pathname == 'admin/login/dologin' || pathname == 'admin/login/code') {

      await next();

    } else {

      ctx.redirect('/admin/login')
    }

  }
});







router.get('/', async (ctx) => {

  await ctx.render('admin/index')

});
//后台的首页
router.use(index);

router.use('/login', login);

router.use('/user', user);

router.use('/manage', manage);

router.use('/articlecate',articlecate);

router.use('/article',article);

module.exports = router.routes();