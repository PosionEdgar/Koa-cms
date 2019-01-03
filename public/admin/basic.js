/**
 * Created by qiangxl on 2018/12/26.
 */

$(function () {
  app
  app.confirmDelete()
});
let app = {

  toggle(el, collectionName, attr, id) {

    $.get('/admin/changeStatus', {collectionName:collectionName, attr:attr, id:id}, (data) => {

      if (data.success) {

        if (el.src.indexOf('yes') !== -1) {

          el.src = '/admin/images/no.gif';

        } else {

          el.src = '/admin/images/yes.gif';

        }

      }

    })

  },

  confirmDelete() {
    $('.delete').click(function () {
      let flag = confirm('您确定删除吗？')
      return flag;
    })
  },
  changeSort(el, collectionName, id) {

    let value = el.value;
    $.get('/admin/changeSort', {collectionName:collectionName, id:id, value:value}, function (data) {

      if (data.success) {
        if (el.src.indexOf('yes') !== 1) {
          el.src = '/admin/imgaes/no.gif';
        } else {
          el.src = '/admin/images/yes.gif'
        }
      }

    })


  }
};