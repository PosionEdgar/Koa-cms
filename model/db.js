/**
 * Created by qiangxl on 2018/12/21.
 */

let MongoDB = require('mongodb'),

  MongoClient = MongoDB.MongoClient,

  Config = require('./config');

const ObjectId = MongoDB.ObjectID;

class Db {


  static getInstance () {

    if (!Db.instance) {

      Db.instance = new Db();

    }

    return Db.instance;

  }

  constructor () {

    this.dbClient = ''; //存放db对象

    this.connect()

  }

  connect() {/*链接数据库*/

    return new Promise((resolve, reject) => {

      if (!this.dbClient) { /*解决数据库多次链接的问题*/

        MongoClient.connect(Config.dbUrl, (err, client) => {

          if (err) {

            reject(err)

          }else {

            let db = client.db(Config.dbName)

            resolve(db)

          }

        })
      } else {

        resolve(this.dbClient)

      }
    })

  }

  find (collectionName, json1, json2, json3) {

    if (arguments.length === 2) {

      var attr = {},
        slipNum = 0,
        pageSize = 0;

    } else if (arguments.length === 3) {

      var attr = json2,
        slipNum = 0,
        pageSize = 0;

    }else if (arguments.length === 4) {

      var attr = json2,
        page = json3.page || 1,
        pageSize = json3.pageSize || 20,
        slipNum =  (page - 1) * pageSize;

      if(json3.sortJson) {

        var sortJson = json3.sortJson
      } else {

        var sortJson = {}
      }


    } else {
      console.log('参数传入错误');
    }

    return new Promise((resolve, reject) => {

      this.connect().then((db) => {

        // let result = db.collection(collectionName).find(json);

        let result = db.collection(collectionName).find(json1, {fields:attr}).skip(slipNum).limit(pageSize).sort(sortJson);

        result.toArray((err, docs) => {

          if (err) {

            reject(err)

            return;
          }

          resolve(docs);

        })


      })

    })

  }
  insert (collectionName, json) {

    return new Promise((resolve, reject) => {

      this.connect().then((db) => {

        db.collection(collectionName).insertOne(json, (err, result) => {

          if (err) {

            reject(err)

          } else {

            resolve(result)

          }

        })

      })

    })

  }

   update(collectionName, json1, json2) {

    return new Promise((resolve, reject) => {

      this.connect().then((db) => {

        db.collection(collectionName).updateOne(json1, {
          $set: json2
        }, (err, result) => {

          if (err) {

            reject(err)

          } else {

            resolve(result)

          }

        })

      })

    })


  }
  remove(collectionName, json) {

    return new Promise((resolve, reject) => {

      this.connect().then((db) => {

        db.collection(collectionName).removeOne(json, (err, result) => {

          if (err) {

            reject(err)

          } else {

            resolve(result)

          }

        })

      })

    })

  }

  ObjectID(id) { //把一个id 查询——id字符转转换为对象

    return new ObjectId(id);

  }

  //统计数量的方法
  count(collectionName, json) {
    return new Promise((resolve, reject) => {

      this.connect().then((db) => {
       let result = db.collection(collectionName).count(json)
        result.then((count) => {
         resolve(count)
        })
      })

    })
  }

}


module.exports = Db.getInstance();

