/**
 * Created by qiangxl on 2018/12/25.
 */

let router = require('koa-router')(),
  Db = require('../../model/db');

router.get('/', async (ctx) => {

  ctx.render('admin/index');

});
router.get('/changeStatus', async (ctx) => {

  // console.log(ctx.query);

  let collectionName = ctx.query.collectionName,
    attr = ctx.query.attr,
    id = ctx.query.id;

  let data = await Db.find(collectionName, {"_id":Db.ObjectID(id)});

  if (data.length > 0) {

    if (data[0][attr] == 1) {
      var json = {
        [attr]: 0
      }
    } else {
      var json = {
        [attr]:1
      }
    }
    let updateResult = await Db.update(collectionName,{"_id":Db.ObjectID(id)}, json)

    if (updateResult) {
      ctx.body = {"message":"更新成功","success":true}
    } else {
      ctx.body = {"message":"更新失败","success":false}
    }
  } else {
    ctx.body = {"message":"更新失败，参数错误","success":false}
  }



});
router.get('/delete', async (ctx) => {

  try {
    let collection = ctx.query.collection,
      id = ctx.query.id;

    let result = await Db.remove(collection, {"_id": Db.ObjectID(id)})

    //返回
    ctx.redirect(ctx.state.G.prevPage)
  }catch (err) {
    //返回
    ctx.redirect(ctx.state.G.prevPage)
  }

});

router.get('/changeSort', async (ctx) => {

  let collectionName = ctx.query.collectionName,
    id = ctx.query.id,
    value = ctx.query.value;

  //更新的数据
  let json = {
    sort:value
  };

  let result = await Db.update(collectionName, {'_id':Db.ObjectID(id)},json)
  if (result) {
    ctx.body = {"message":"更新成功","success":true}
  } else {
    ctx.body = {"message":"更新失败","success":false}
  }
});


module.exports = router.routes();