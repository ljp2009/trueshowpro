// pages/index/user/customer/getFollow/getFollow.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    staffLists:[], //技师信息数组
    // 星星
    stars1: [{
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '非常不满意，各方面都很差'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '不满意，比较差'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    wx.request({
      //url: app.globalData.webroot + '/index/user/getStaffsByFollow',
      url: app.globalData.webroot1 + '/index/user/getStaffsByFollow',
      method: "post",
      data: {
        customerId: uid,
      
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var staffLists = res.data.msg;
        console.log(staffLists);
        //
        that.setData({
          staffCount: staffLists[0]['count']
        })

        for (var i = 0; i < staffLists.length; i++) {
          console.log(i);
          var satisfection = staffLists[i]['Satisfection'] / 10;//评分
          var num = Math.round(satisfection);//四舍五入分
          console.log(satisfection + "========");
          console.log(num + "-----")


          staffLists[i]['stars'] = num;
        }
        console.log("整理得---");
        console.log(staffLists);
        that.setData({
          staffLists: staffLists
        })
        console.log(that.data.staffLists)

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})