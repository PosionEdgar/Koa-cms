/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();
let Db = require('../../model/db');
let tools = require('../../model/tools');




router.get('/', async (ctx) => {

  let page = ctx.query.page || 1;

  let pageSize = 3;

  let result = await Db.find('link',{}, {}, {
    page, pageSize, sortJson: {
      "add_time":-1
    }
  });

  //查询总数量

  let count = await Db.count('link', {});


  ctx.render('admin/link/list', {
    list:result,
    page,
    totalPages: Math.ceil(count/pageSize)
  })



});
router.get('/add', async (ctx) => {

  await ctx.render('admin/link/add');


});
router.get('/edit', async (ctx) => {

  let id = ctx.query.id;

  let result = await Db.find('link', {"_id":Db.ObjectID(id)});

  await ctx.render('admin/link/edit', {
    result,
    prevPage:ctx.state.G.prevPage
  });

});
router.post('/doEdit', tools.multer().single('pic'), async (ctx) => {

  let id = ctx.req.body.id,
    title = ctx.req.body.title,
    pic = ctx.req.file ? ctx.req.file.path.substr(7) : '',
    url = ctx.req.body.url,
    sort = ctx.req.body.sort,
    prevPage = ctx.req.body.prevPage,
    status = ctx.req.body.status;


  if (pic) {
    var json = {
      title,pic,url,sort,status
    }
  } else {
    var json = {
      title,url,sort,status
    }
  }

  let result = await Db.update('link', {"_id":Db.ObjectID(id)}, json);

  if (prevPage) {

    ctx.redirect(prevPage)

  } else {

    ctx.redirect(ctx.state.__HOST__ + '/admin/link')

  }


});
router.post('/doAdd', tools.multer().single('pic'), async (ctx) => {

  // 接受post数据, <注意：在模板中配置enctype="multipart/form-data">
  ctx.body = {
    filname: ctx.req.file ? ctx.req.file.filename : '', // 返回文件名
    body: ctx.req.body
  }

  //增加到数据库
  let title = ctx.req.body.title,
    pic = ctx.req.file ? ctx.req.file.path.substr(7) : '',
    url = ctx.req.body.url,
    sort = ctx.req.body.sort,
    status = ctx.req.body.status,
    add_time = tools.getTime();

  let result = await Db.insert('link', {
    title,pic,url,sort, status, add_time
  })
  //增加完成跳转
  ctx.redirect(ctx.state.__HOST__ + '/admin/link')

});

module.exports = router.routes();