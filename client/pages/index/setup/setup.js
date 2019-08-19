// pages/index/setup/setup.js
var QRCode = require('../../../utils/weapp-qrcode.js');
var qrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     code:Math.random(0,999999),
    //  扫码
    show: "",
  },
  // 扫码
  click: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        console.log(res);
        this.show = "结果:" + '测试数据' + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        that.setData({
          show: this.show
        })
        wx.showToast({
          title: '成功',    
          icon: 'success',
          duration: 2000   
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qrcode = new QRCode('canvas', {
      text: "",
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
   
  },
  //点击  生成二维码
  tapHandler: function (e) {  
    console.log(e);
    qrcode.makeCode(e.target.dataset.code); //用元素对应的code更新二维码
    console.log(e.target.dataset.code);
    wx.setStorageSync("customCode", e.target.dataset.code);
  },
// ***************************************
//扫描
  
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