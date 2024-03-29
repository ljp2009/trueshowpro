// pages/index/firm/finance/expenses/expenses.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    sliderVal:"",  //滑动的值
    rakeOffLogData:[],//佣金修改记录数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var commission = options.commission;
    var userArr = wx.getStorageSync("user");
    var nickName = JSON.parse(userArr)["userinfo"]["nickName"];
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    console.log(commission);
    this.setData({
      sliderVal:commission
    })
    //佣金修改记录  请求后端
  
    wx.request({
      url: app.globalData.webroot + '/index/promote/getFrimRakeOffLogs',
      method: "post",
      data: {
        firmId: 1,
        nickName: nickName,
        uid: uid,
       
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
       // console.log(res.data.msg);
        if (res.data.code==1){
          //数据才有值
          that.setData({
            rakeOffLogData: res.data.msg
        })
       }
      
        
      }
    })
  },
  // 滑动事件
  slider4change:function(e){
    
      console.log(e.detail.value)
      // console.log(console.log('slider' + '发生change事件，携带值为', e.detail.value));
      var that = this;
      that.setData({
        sliderVal: e.detail.value
      })
   
 
  },
  confirmBtn:function(){
    var that=this;
    var userArr = wx.getStorageSync("user");
    var nickName = JSON.parse(userArr)["userinfo"]["nickName"];
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    //发给后端   //先去查看日志当前时间与写入日志的时间判断
    //
    wx.request({
      url: app.globalData.webroot + '/index/firm/updateFirmRakeOff',
      method: "post",
      data: {
        firmId: 1,
        nickName: nickName,
        uid: uid,
        rakeOff: that.data.sliderVal
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        // return
        if (res.data.code!=1){
            //
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
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