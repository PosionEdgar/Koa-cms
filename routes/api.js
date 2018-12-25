/**
 * Created by qiangxl on 2018/12/25.
 */


let router = require('koa-router')();

router.get('/', async (ctx) => {

  ctx.body = "api接口"

});

module.exports = router.routes();