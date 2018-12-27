/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();

router.get('/', async (ctx) => {

  await ctx.render('admin/article')

});
router.get('/add', async (ctx) => {

  await ctx.render('admin/article/add');

});
router.get('/edit', async (ctx) => {

  ctx.body = "修改用户"

});
router.get('/delete', async (ctx) => {

  ctx.body = "删除用户"

});

module.exports = router.routes();