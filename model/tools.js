/**
 * Created by qiangxl on 2018/12/26.
 */


let md5 = require('md5');

//图片上传模块
const multer = require('koa-multer');
let tools = {

  md5(str) {

    return md5(str)

  },
  cateTolList(data) {

    //获取一级分类

    let firstArr = [];

    for (let i = 0; i < data.length; i ++) {

      if (data[i].pid === '0') {
        firstArr.push(data[i]); //一级分类

      }

    }
    //获取二级分类
    for (let i = 0; i < firstArr.length; i ++) {
      firstArr[i].list = [];
      //遍历所有的数据 看哪个数据的pid等于当前的数据id
      for (let j = 0; j < data.length; j ++) {
        if (firstArr[i]._id == data[j].pid) {
          firstArr[i].list.push(data[j])
        }
      }
    }
    return firstArr;
  },
  getTime() {

    return new Date();
  },
  multer() {


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

    return upload;
  }

};

module.exports = tools;