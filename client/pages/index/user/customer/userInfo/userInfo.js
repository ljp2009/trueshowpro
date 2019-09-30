// pages/index/user/customer/userInfo/userInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    newName:"",   //修改昵称
    userNickName:"",  //昵称
    userGender:1,   //性别  1-男  2-女
    changeSex:0,   //改之后的性别
    type:0,  //是哪个页面 编辑头像 还是编辑用户基本信息页 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var type = options.type;  //在index页面传过来的类型  是编辑头像还是 编辑基本信息
    console.log(type);
    that.setData({
      type: type 
    })
   
   
    var userNickName = JSON.parse(wx.getStorageSync("user"))["userinfo"]["nickName"];
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    var userGender = JSON.parse(wx.getStorageSync("user"))["userinfo"]["gender"];
    console.log("nickname===="+userNickName+"gender==="+userGender);
    that.setData({
      userNickName: userNickName,
      userGender: userGender,
    }) 
  },
  /**
   * 修改昵称
   */
  changeName:function(e){
    var that=this;
    console.log(e.detail.value);
    that.setData({
      userNickName: e.detail.value
    })
    console.log(that.data.userNickName);
  },
  /**
   * 选择姓名点击事件
   */
  changeSex:function(e){
    var that=this;
    // console.log(e.detail.value)
    that.setData({
      changeSex: e.detail.value
    })
    console.log(that.data.changeSex)
  },
  /**
   * 保存用户更改的信息
   */
  saveUserInfo:function(){
    var that=this;
    console.log("----")
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    var userNickName = that.data.userNickName;  //更改后的昵称
    var changeSex = that.data.changeSex;        //更改都的性别
    console.log("更改后的昵称----"+userNickName+"更改后的性别--"+changeSex);
    wx.request({
      //url: app.globalData.webroot + '/index/user/updateCusInfo',
      url: app.globalData.webroot1 + '/index/user/updateCusInfo',
      method: "post",
      data: {
        customerId: uid,
        userNickName: userNickName,
        changeSex: changeSex
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        //wx.setStorageSync("user")["userinfo"]["nickName"] = JSON.stringify( that.data.userNickName);
        //wx.setStorageSync("bullet", JSON.stringify(_bullet))
        // wx.setStorageSync("user")["userinfo"]["nickName"]=that.data.userNickName;
        // console.log(JSON.parse(wx.getStorageSync("user"))["userinfo"]["nickName"]);
        // var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
        // var userGender = JSON.parse(wx.getStorageSync("user"))["userinfo"]["gender"];
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