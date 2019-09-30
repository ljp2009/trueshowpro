// pages/index/firm/joinStaff/join/join.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firmId:'',
    firmName: ''
  },
  /**
   * 确定按钮
   */
  defineBtn: function (){
    // 和接口对接，修改当前用户的staffLevel
    // 修改对应的隶属机构id
    var userArr = JSON.parse(wx.getStorageSync("user"));
    var uid = userArr['userinfo']['uid'];
    var firmId = this.data.firmId;
    console.log(userArr)
    wx.request({
      url: app.globalData.webroot +  '/index/user/applyForFirm',
      method: 'POST',
      //仅为示例，并非真实的接口地址
      data: {
        uid: uid,
        firmId: firmId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // 修改缓冲中user 的staffLevel的值
        var obj = JSON.parse(wx.getStorageSync("user"));
        obj["userinfo"]["staffLevel"]=1;
        wx.setStorageSync("user", JSON.stringify(obj));
        wx.redirectTo({
          url: '/pages/index/firm/joinStaff/staffIndex/staffIndex?staffLevel=1',
        })
      },
      fail(res) {
        
      }
    })
  },
  cancelBtn: function(){
    wx.navigateBack({//返回
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      firmId: options.id,
      firmName: options.name
    })
    console.log(this.data.firmId+'---'+this.data.firmName)
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