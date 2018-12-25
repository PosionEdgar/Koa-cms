/**
 * Created by qiangxl on 2018/12/25.
 */


let router = require('koa-router')();

router.get('/', async (ctx) => {

  ctx.body = "前端首页"

});

module.exports = router.routes();