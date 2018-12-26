/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();

const svgCaptcha = require('svg-captcha');

let tools = require('../../model/tools'),
  Db = require('../../model/db');

router.get('/', async (ctx) => {

  await ctx.render('admin/login')

});
router.post('/dologin', async (ctx) => {

  //数据库匹配

  let username = ctx.request.body.username;

  let password = ctx.request.body.password;

  let code = ctx.request.body.code;

  //1.验证密码是否合法

  //2.数据库匹配

  //3.查询成功之后信息写入session

  if (code.toLocaleLowerCase() === ctx.session.code.toLocaleLowerCase()) {

    //后台验证用户名密码是否合法
    let result = await Db.find('admin',{"username":username, "password":tools.md5(password)});

    if (result.length > 0) {

      ctx.session.userInfo = result[0];

      ctx.redirect(ctx.state.__HOST__+'/admin')

    } else {
      ctx.render('admin/error',{

        message:'用户名或密码错误',
        redirect: ctx.state.__HOST__ + '/admin/login'

      });
    }

  } else {

    ctx.render('admin/error',{

      message:'验证码错误',
      redirect: ctx.state.__HOST__ + '/admin/login'

    });

  }



});
//验证码
router.get('/code', async (ctx) => {

  let captcha = svgCaptcha.create({
    size: 4,
    fontSize: 50,
    width: 120,
    height: 34,
    background: '#cc9966'

  });
  //加法验证码
  /*let captcha = svgCaptcha.createMathExpr({
    size: 4,
    fontSize: 50,
    width: 100,
    height: 40,
    background: '#cc9966'
  });*/
  //保存生成的验证码
  ctx.session.code = captcha.text;
  //设置响应头

  ctx.response.type = 'image/svg+xml';
  ctx.body = captcha.data;

});

module.exports = router.routes();