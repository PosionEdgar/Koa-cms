/**
 * Created by qiangxl on 2018/12/25.
 */


let router = require('koa-router')();
let Db = require('../model/db');
let url =require('url');

//配置中间件、获取Url的地址

router.use(async (ctx, next) => {

  // console.log(ctx.request.header.host);
  //模板引擎配置全部的变量
  let pathname = url.parse(ctx.request.url).pathname;

  //导航
  let navResult = await Db.find('nav', {}, {}, {
    sortJson: {sort: 1}
  });
  //获取系统信息
  let seoInfo = await Db.find('setting', {});


  ctx.state.setting = seoInfo[0]
  ctx.state.nav = navResult;
  ctx.state.pathname = pathname;

  await next();

});


router.get('/', async (ctx) => {


  //轮播 注意状态数据不一致的问题、建议后台增加数据转换为Number
  let focusResult = await Db.find('focus', {$or:[{"status":"1"},{"status":1}]}, {}, {
    sortJson: {sort: 1}
  });

  let linkResult = await Db.find('link', {$or:[{"status":"1"},{"status":1}]}, {}, {
    sortJson: {sort: 1}
  });


  await ctx.render('default/index', {
    focus: focusResult,
    link:linkResult
  })

});
router.get('/news', async (ctx) => {



  var pid = ctx.query.pid;

  let page = ctx.query.page || 1;

  let pageSize = 3;

  var cateResult = await Db.find('articlecate',{"pid":"5afa56bb416f21368039b05d"}, {}, {page, pageSize});

  if (pid) {
    var articleList = await Db.find('article', {"pid":pid});
    var articleNum = await Db.count('article',{"pid":pid});
  } else {
    var subCateArr = [];
    //循环子分类获取所有的内容

    for (let i = 0; i < cateResult.length; i ++) {
      subCateArr.push(cateResult[i]._id.toString())
    }

    var articleList = await Db.find('article', {"pid":{$in:subCateArr}}, {}, {page, pageSize});
    var articleNum = await Db.count('article',{"pid":{$in:subCateArr}});
  }


  ctx.state.setting.site_title = '新闻页面xxx';
  ctx.state.setting.site_keywords = '新闻页面xxx';
  ctx.state.setting.site_description = '新闻页面xxx';


  await ctx.render('default/news', {
    cateResult,
    articleList,
    pid,
    page,
    totalPages: Math.ceil(articleNum/pageSize)
  })

});

router.get('/about', async (ctx) => {

  ctx.state.setting.site_title = '关于我们xxx';
  ctx.state.setting.site_keywords = '关于我们xxx';
  ctx.state.setting.site_description = '关于我们xxx';

  await ctx.render('default/about')

});

router.get('/service', async (ctx) => {

  //查询分类

  let serviesList = await Db.find('article',{'pid':'5ab34b61c1348e1148e9b8c2'});
  ctx.state.setting.site_title = '开发服务xxx';
  ctx.state.setting.site_keywords = '开发服务xxx';
  ctx.state.setting.site_description = '开发服务xxx';

  await ctx.render('default/service', {
    serviesList
  })

});

router.get('/case', async (ctx) => {

  //获取成功案例下面的分类
  let cateResult = await Db.find('articlecate',{"pid":"5ab3209bdf373acae5da097e"});


  //获取cid

  let pid = ctx.query.pid;

  let page = ctx.query.page || 1;

  let pageSize = 3;

  if (pid) {
    /*如果存在*/


    var articleList = await Db.find('article', {"pid":pid}, {}, {page, pageSize});

    var articleNum = await Db.count('article',{"pid":pid});
  } else {

    var subCateArr = [];
    //循环子分类获取所有的内容

    for (let i = 0; i < cateResult.length; i ++) {
      subCateArr.push(cateResult[i]._id.toString())
    }

    var articleList = await Db.find('article', {"pid":{$in:subCateArr}}, {}, {page, pageSize});
    var articleNum = await Db.count('article',{"pid":{$in:subCateArr}});



  }
  ctx.state.setting.site_title = '成功案例xxx';
  ctx.state.setting.site_keywords = '成功案例xxx';
  ctx.state.setting.site_description = '成功案例xxx';

  await ctx.render('default/case', {
    cateResult,
    articleList,
    pid,
    page,
    totalPages: Math.ceil(articleNum/pageSize)
  })

});
router.get('/connect', async (ctx) => {

  await ctx.render('default/connect')

});
router.get('/content/:id', async (ctx) => {

  let id = ctx.params.id;

  let content = await Db.find('article', {"_id":Db.ObjectID(id)});

  /*
  *
  * 1.根据文章获取文章的分类信息
  * 2、根据文章的分类信息、去导航表里查找分类信息的url
  * 3、把url赋值给pathname
  * */
  //获取当前文章的分类信息
  var cateResult = await Db.find('articlecate',  {"_id":Db.ObjectID(content[0].pid)})
  //在导航查找当前分类的url

  if (cateResult[0].pid != 0) {

    //子分类 找到父分类
    var parentResult = await Db.find('articlecate', {"_id":Db.ObjectID(cateResult[0].pid)});

    var navResult = await Db.find('nav', { $or:[{"title":cateResult[0].title}, {"title":parentResult[0].title}]});


  } else {

    //父分类
    var navResult = await Db.find('nav', {"title":cateResult[0].title});

  }


  if (navResult.length > 0) {
    //把url赋值给pathname
    ctx.state.pathname = navResult[0]['url'];

  }else {
    ctx.state.pathname = '/'
  }



  await ctx.render('default/content', {
    content:content[0]
  })

});

module.exports = router.routes();