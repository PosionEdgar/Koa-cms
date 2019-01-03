/**
 * Created by qiangxl on 2018/12/25.
 */
let router = require('koa-router')();
let Db = require('../../model/db'),
  tools = require('../../model/tools');

router.get('/', async (ctx) => {

  //获取设置的信息
  let result = await Db.find('setting', {});


  await ctx.render('admin/setting/index',{

    result:result[0]

  });

});

router.post('/doEdit', tools.multer().single('site_logo'), async (ctx) => {

  //对应的数据

  let site_title = ctx.req.body.site_title,
    site_logo = ctx.req.file ? ctx.req.file.path.substr(7) : '',
    site_keywords = ctx.req.body.site_keywords,
    site_description = ctx.req.body.site_description,
    site_icp = ctx.req.body.site_icp,
    site_qq = ctx.req.body.site_qq,
    site_tel = ctx.req.body.site_tel,
    site_address = ctx.req.body.site_address,
    add_time = tools.getTime();

  if (site_logo) {
    var json = {
      site_title,site_logo,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,add_time
    }
  } else {
    var json = {
      site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,add_time
    }
  }

  let result = await Db.update("setting", {}, json);

  ctx.redirect(ctx.state.__HOST__ + '/admin/setting');

});

module.exports = router.routes();