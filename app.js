/**
 * Created by qiangxl on 2018/12/25.
 */


let Koa = require('koa'),
  render = require('koa-art-template'),
  sd = require('silly-datetime'),
  path = require('path'),
  static = require('koa-static'),
  session = require('koa-session'),
  bodyParser = require('koa-bodyparser'),
  jsonp = require('koa-jsonp'),
  router = require('koa-router')();

//实例化
let app = new Koa();


//配置jsonp的中间件
app.use(jsonp());


//配置模板引擎
render(app, {

  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production',
  dateFormat:dateFormat = function (value) {
    return sd.format(value,'YYYY-MM-DD HH:mm')
  }

});

//配置根目录中间件
// app.use(static('.')); 不安全
//配置静态资源

app.use(static(__dirname + '/public'));

//配置session的中间件
app.keys = ['some secret hurr'];

const CONFIG = {

  key: 'koa:sess',
  maxAge: 864000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  renew: false

};


app.use(session(CONFIG, app));

//配置post提交数据中间件
app.use(bodyParser());


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