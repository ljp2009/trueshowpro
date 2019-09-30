// pages/index/user/customer/pokerByCustomer/pokerByCustomer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    beauteList:[],  //美丽档案列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    //美丽档案 列表
    wx.request({
      //url: app.globalData.webroot + '/index/poker/getPokerByUser',
      url: app.globalData.webroot1 + '/index/poker/getPokerByUser',
      method: "post",
      data: {
        customerId: uid
       
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var beauteList = res.data.msg;
        that.setData({
          beauteList: beauteList
        })
        console.log(that.data.beauteList);
      }
    })
  },
  /**
   * 
   */
  jumpFavoriteDetail:function(e){
      console.log("跳转到详细页面---")
    console.log(e.currentTarget.dataset)
    var pokerId = e.currentTarget.dataset.pokerid;  //pokerid
    var staffId = e.currentTarget.dataset.staffid;  //staffid
    var favorDate = e.currentTarget.dataset.favordate;
   
    //传pokerId staffId
    wx.navigateTo({
      url: "/pages/index/user/customer/staffWorkShowDetail/staffWorkShowDetail?pokerId=" + pokerId + "&&staffId=" + staffId + "&&favorDate=" + favorDate
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