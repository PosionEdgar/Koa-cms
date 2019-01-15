/**
 * Created by qiangxl on 2018/12/25.
 */


let router = require('koa-router')();
let Db = require('../model/db');
router.get('/', async (ctx) => {

  ctx.body = "api接口"

});

router.get('/catelist', async (ctx) => {

  var result = await Db.find('articlecate', {});
  ctx.body = {
    result
  }

});
router.get('/newslist', async (ctx) => {

  var page = ctx.query.page;
  var pageSize = 20;
  var result = await Db.find('article',{}, {"_id":1, "title": 1}, {
    page,
    pageSize
  });

  ctx.body = {
    result
  }

});

module.exports = router.routes();