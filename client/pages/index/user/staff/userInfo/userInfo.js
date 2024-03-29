// pages/index/user/staff/userInfo/userInfo.js
import WxValidate from '../../../../../utils/WxValidata.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firmId:0,
    info:{},
    descLen:0, // 个人简介长度

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      firmId:options.firmId
    })
    wx.request({
      url: app.globalData.webroot + '/index/user/getStaffById',
      method: "get",
      data: {
        uid: options.firmId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        var msg = res.data.msg;
        var descLen = 0;
        console.log(msg.staffDesc)
        if (msg.staffDesc != null){
          descLen = msg.staffDesc.length
        }
        that.setData({
          info:msg,
          descLen: descLen
        })
      }
    })
    this.initValidata()
  },
/**
 * 提交数据
 */
save:function(e) {
  var that = this;
  var RealName = e.detail.value.RealName;
  var desc = e.detail.value.staffDesc;
  var nickName = e.detail.value.NickName;
  var params = e.detail.value;
  console.log(JSON.stringify(params))
  //校验表单
  if (!this.WxValidate.checkForm(params)) {
    const error = this.WxValidate.errorList[0]
    this.showModal(error)
    return false;
  }
  // console.log("验证通过");
  wx.request({
    url: app.globalData.webroot + '/index/user/updUser',
    method: "POST",
    data: {
      Act:0,
      UserId: that.data.firmId,
      data: JSON.stringify(params)
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      wx.navigateTo({
        url: '/pages/index/user/staff/index/index'
      })
    }
  })

},
/**
 * 监听个人简介字数
 */
  textareaAInput: function (e) {
    console.log(e)
    var len = e.detail.value.length;
    this.setData({
      descLen:len
    })
  },

  /**
   * 表单错误信息提示框
   */
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false
    })
  },

  /**
     * 验证函数
     */
  initValidata: function () {
    const rules = {
      NickName: {
        required: true,
        maxlength: 30
      },
      RealName: {
        required: true,
        maxlength: 30
      },
      staffDesc: {
        maxlength: 500
      }

    }
    const message = {
      NickName: {
        required: '请填写昵称',
        maxlength: '昵称长度不能超过30字符'
      },
      RealName : {
        required: '请填写真实姓名',
        maxlength: "真实姓名长度不能超过30字符"
      },
      staffDesc: {
        maxlength: "个人简介最长不能超过500字符"
      }
    }
    this.WxValidate = new WxValidate(rules, message);
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