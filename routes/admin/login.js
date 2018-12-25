/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();

router.get('/', async (ctx) => {

  await ctx.render('admin/login')

});

module.exports = router.routes();