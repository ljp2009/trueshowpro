// pages/index/user/staff/code/code.js
var app = getApp();
var QRCode = require('../../../../../utils/weapp-qrcode.js');
var staffQrcode;
var firmQrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    staffId:0,  // 技师id
    firmId:0,  //机构id
    staffCard:"/pages/index/user/staff/staffCard/staffCard",
    firmIndex:"/pages/index/firm/firmIndex/firmIndex",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      staffId:options.staffId,
      firmId:options.firmId,
      staffCard: this.data.staffCard+"?staffId="+options.staffId+"&firmId="+options.firmId,
      firmIndex: this.data.firmIndex+"?staffId="+options.firmId
    })
    console.log(this.data)
    // url = '/pages/index/user/staff/code/code?firmId={{staffId}}&staffId={{firmId}}'
    // 生成二维码--扫码进入个人名片页面
    // pages / index / user / staff / staffCard / staffCard
    // var staffId = options.staffId;   机构id
    // var firmId = options.firmId;   技师id

    staffQrcode = new QRCode('staffCanvas', {
      text: "",
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    staffQrcode.makeCode(this.data.staffCard); //用元素对应的code更新二维码

    firmQrcode = new QRCode('firmCanvas', {
      text: "",
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    firmQrcode.makeCode(this.data.firmIndex); //用元素对应的code更新二维码



    // 生成二维码--扫码进入机构主页页面
    // /pages/index / firm / firmIndex / firmIndex / firmIndex.wxml 
    // options.staffId   机构id



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