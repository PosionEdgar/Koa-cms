/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();
let tools = require('../../model/tools');
let Db = require('../../model/db');

router.get('/', async (ctx) => {

  let data = await Db.find('articlecate', {});



  let result = tools.cateTolList(data);



  ctx.render('admin/articlecate/list', {
    result
  })

});
router.get('/add', async (ctx) => {

  //获取一级分类
  let result = await Db.find('articlecate', {'pid':'0'});

  // console.log(result);

  ctx.render('admin/articlecate/add', {
    result
  })

});
router.post('/doAdd', async (ctx) => {

  // console.log(ctx.request.body);

  let addData = ctx.request.body;

  let result = await Db.insert('articlecate', addData);

  ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')

});
router.get('/edit', async (ctx) => {

  let id = ctx.query.id;

  let result = await Db.find('articlecate', {'_id': Db.ObjectID(id)});

  let data = await Db.find('articlecate', {});

  let cateList = tools.cateTolList(data);

  ctx.render('admin/articlecate/edit',{
    result:result[0],
    cateList
  } )

});

router.post('/doEdit', async (ctx) => {

  console.log(ctx.request.body);

  let id = ctx.request.body.id,
    title = ctx.request.body.title,
    pid =ctx.request.body.pid,
    keywords=ctx.request.body.keywords,
    status =ctx.request.body.status,
    description = ctx.request.body.description;

  let result = await Db.update('articlecate', {'_id':Db.ObjectID(id)},{
    title,pid,keywords,status,descriptionn
  });

  ctx.redirect(ctx.state.__HOST__+'/admin/articlecate')

});
router.get('/delete', async (ctx) => {

  ctx.body = "删除用户"

});

module.exports = router.routes();