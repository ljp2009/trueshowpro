const app = getApp();
function queryExp(result) {
  wx.request({
    url: app.globalData.webroot+'examine/getexaminetime',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': wx.getStorageSync('token')
    },
    data: {
      datetimes:""
    },
    success: function (res) {
      var d = res.data.data;
      // console.log(d);
      result(d);
    }
  })
}

//转化成小程序模板语言 这一步非常重要 不然无法正确调用
module.exports = {
  queryExp: queryExp
};