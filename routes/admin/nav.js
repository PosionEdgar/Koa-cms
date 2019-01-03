/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();
let Db = require('../../model/db');
let tools = require('../../model/tools');




router.get('/', async (ctx) => {

  let result = await Db.find('nav', {});

  await ctx.render('admin/nav/list', {
    list:result
  })
});
router.get('/add', async (ctx) => {

  await ctx.render('admin/nav/add');


});
router.post('/doAdd', async (ctx) => {

  let title = ctx.request.body.title,
    url = ctx.request.body.url,
    sort = ctx.request.body.sort,
    status = ctx.request.body.status,
    add_time = tools.getTime();


  let result = await Db.insert('nav', {
    title,url,sort,status,add_time
  });

  //增加完成后跳转

  ctx.redirect(ctx.state.__HOST__ + '/admin/nav');

});
router.get('/edit', async (ctx) => {

  let id = ctx.query.id;

  let result = await Db.find('nav', {"_id":Db.ObjectID(id)});

  await ctx.render('admin/nav/edit', {
    result
  });

});
router.post('/doEdit',  async (ctx) => {

  let id = ctx.request.body.id,
    title = ctx.request.body.title,
    url = ctx.request.body.url,
    sort = ctx.request.body.sort,
    status = ctx.request.body.status,
    add_time = ctx.request.body.add_time;



  let result = await Db.update('nav', {"_id":Db.ObjectID(id)}, {
    title,url,sort,status,add_time
  });

  ctx.redirect(ctx.state.__HOST__ + '/admin/nav')

});


module.exports = router.routes();