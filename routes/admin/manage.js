/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();

const Db = require('../../model/db');

const tools = require('../../model/tools');

router.get('/', async (ctx) => {



  var result = await Db.find('admin', {});

  await ctx.render('admin/manage/list', {
    list: result
  });

});
router.get('/add', async (ctx) => {

  await ctx.render('admin/manage/add');

});
router.post('/doAdd', async (ctx) => {

  //1.获取表单提交的数据
  /*console.log(ctx.request.body);*/

  //2.验证数据是否合法

  //3.在数据库查询当前要增加的管理员是否存在
  //4.增加管理员

  let username = ctx.request.body.username,
    password = ctx.request.body.password,
    rpassword =  ctx.request.body.rpassword;

  if (!/^\w{4,20}/.test(username)) {

    await ctx.render('admin/error', {
      message:"用户名不合法",
      redirect:ctx.state.__HOST__ + '/admin/manage/add'
    })

  } else if (password !== rpassword || password.length < 6) {

    await ctx.render('admin/error', {
      message:"密码和确认密码不一致或长度不合法",
      redirect:ctx.state.__HOST__ + '/admin/manage/add'
    })

  } else {

    //获取数据库查询当前管理员是否存在

    let result = await Db.find('admin', {'username':username});

    if (result.length > 0) {

      await ctx.render('admin/error', {
        message:"此管理员已经存在",
        redirect:ctx.state.__HOST__ + '/admin/manage/add'
      })

    } else {

      let result = await Db.insert('admin', {"username":username,"password": tools.md5(password),"status":1,"last_time":'' })

      ctx.redirect(ctx.state.__HOST__ + '/admin/manage')

    }

  }


});
router.get('/edit', async (ctx) => {

  let id = ctx.query.id;

  let result = await Db.find('admin',{"_id":Db.ObjectID(id)});

  // console.log(result);

  await ctx.render('admin/manage/edit', {

    result

  })



});
router.post('/doEdit', async (ctx) => {

  try {

    let username = ctx.request.body.username,
      password = ctx.request.body.password,
      rpassword =  ctx.request.body.rpassword;
      id = ctx.request.body.id;
    if (password !== '') {

      if (password !== rpassword || password.length < 6) {

       await ctx.render('admin/error', {
          message:"密码和确认密码不一致或长度不合法",
          redirect:ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
        })

      } else {

        //更新密码

        let result = await Db.update('admin', {"_id": Db.ObjectID(id)},{"password":tools.md5(password)})
        ctx.redirect(ctx.state.__HOST__ + '/admin/manage')

      }

    } else {
      ctx.redirect(ctx.state.__HOST__ + '/admin/manage')
    }



  } catch (err){
    console.log(err);
    ctx.render('admin/error', {
      message:err,
      redirect:ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
    })

  }


});
router.get('/delete', async (ctx) => {

  ctx.body = "删除用户"

});

module.exports = router.routes();