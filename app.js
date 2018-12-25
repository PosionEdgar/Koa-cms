/**
 * Created by qiangxl on 2018/12/25.
 */


let Koa = require('koa'),
  render = require('koa-art-template'),
  path = require('path'),
  static = require('koa-static'),
  router = require('koa-router')();

//实例化
let app = new Koa();

//配置模板引擎
render(app, {

  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'

});
//配置静态资源

app.use(static(__dirname + '/public'));


//引入模块
let index = require('./routes/index'),
  admin = require('./routes/admin'),
  api = require('./routes/api');





//admin
router.use('/admin', admin);

//api
router.use('/api',api);

//index
router.use(index);


app.use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);