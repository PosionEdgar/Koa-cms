/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();
let Db = require('../../model/db'),
  tools = require('../../model/tools');

//图片上传模块
const multer = require('koa-multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload'); /*上传图片的目录*/
  },
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split('.');
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
});

var upload = multer({storage:storage});

router.get('/', async (ctx) => {

  let page = ctx.query.page || 1;

  let pageSize = 3;

  let result = await Db.find('article',{}, {}, {
    page, pageSize, sortJson:{
      "add_time": -1
    }
  });

  //查询总数量

  let count = await Db.count('article', {});


  ctx.render('admin/article/index', {
    list:result,
    page,
    totalPages: Math.ceil(count/pageSize)

  })

});
router.get('/add', async (ctx) => {

  //查询分类数据
  let catelist = await Db.find("articlecate", {});



  await ctx.render('admin/article/add', {
    catelist:tools.cateTolList(catelist)
  });

});

router.post('/doAdd',upload.single('img_url'), async (ctx) => {


  /*ctx.body = {
    filename: ctx.req.file ? ctx.req.file.filename : '', // 返回文件名
    body: ctx.req.body
  }*/

  let pid = ctx.req.body.pid,
    catename = ctx.req.body.catename.trim(),
    title = ctx.req.body.title.trim(),
    author = ctx.req.body.author.trim(),
    status = ctx.req.body.status,
    is_best = ctx.req.body.is_best,
    is_hot = ctx.req.body.is_hot,
    is_new = ctx.req.body.is_new,
    keywords = ctx.req.body.keywords,
    description = ctx.req.body.description || '',
    add_time = tools.getTime();
    content = ctx.req.body.editorValue || '';

  let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : '';

  let json = {
    pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url,add_time
  }

  let result = Db.insert('article', json);

  ctx.redirect(ctx.state.__HOST__ + '/admin/article');



});

router.get('/edit', async (ctx) => {

  //获取id

  let id = ctx.query.id;

  let result = await Db.find('article', {"_id": Db.ObjectID(id)});

  //查询分类数据
  let catelist = await Db.find("articlecate", {});


  await ctx.render('admin/article/edit', {
    result,
    catelist:tools.cateTolList(catelist),
    prevPage:ctx.state.G.prevPage
  })

});

router.post('/doEdit', upload.single('img_url'),  async (ctx, next) => {

  let id = ctx.req.body.id,
    prevPage = ctx.req.body.prevPage,
    pid = ctx.req.body.pid,
    catename = ctx.req.body.catename.trim(),
    title = ctx.req.body.title,
    author = ctx.req.body.author,
    status = ctx.req.body.status,
    is_best = ctx.req.body.is_best,
    is_hot = ctx.req.body.is_hot,
    is_new = ctx.req.body.is_new,
    keywords = ctx.req.body.keywords,
    description = ctx.req.body.description || '',
    img_url = ctx.req.file ? ctx.req.file.path.substr(7) : '',
    content = ctx.req.body.editorValue || '';

  if (img_url){
    var json = {
      pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
    }
  } else {
    var json = {
      pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content
    }
  }

  let result = await Db.update('article',{"_id":Db.ObjectID(id)}, json);

  if(prevPage) {
    ctx.redirect(prevPage)

  } else{
    ctx.redirect(ctx.state.__HOST__+'/admin/article')
  }


});


module.exports = router.routes();