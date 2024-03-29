// pages/index/user/staff/statisticsStaff/statisticsStaff.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffId:0, // 技师id
    info:[],  // 技师人气统计所有数据
    isNull:true, //判断数据是否为空
    page:0, // 加载次数
    isMore:true, // 是否还存在数据
    dataCount:3, //每次请求的数据数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var staffId = options.staffId;
    this.setData({
      staffId: staffId
    })
    var that =this;
    var page = this.data.page;
    // getStatisticsStaff
    wx.request({
      url: app.globalData.webroot + '/index/user/getStatisticsStaff',
      method: "POST",
      data: {
        StaffId: staffId,
        page: page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var code = res.data.code;
        var msg = res.data.msg;
        var page = that.data.page;
        var dataCount = that.data.dataCount; // 每次请求的数据数量
        
        page++;
        if(msg.length < dataCount){
          that.setData({
            isMore:false
          })
        }
        if(code == 0){
          
        }else{
          that.setData({
            info: msg,
            isNull:false,
            page:page
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
    this.loadMore(); // 按需加载函数
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 加载更多数据
   */
  loadMore:function (){
    
    var isMore = this.data.isMore;
    var page = this.data.page;
    var staffId = this.data.staffId;
    var that = this;
    console.log(page)
    if(isMore){
      wx.request({
        url: app.globalData.webroot + '/index/user/getStatisticsStaff',
        method: "POST",
        data: {
          page:page,
          StaffId:staffId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res);
          var code = res.data.code;
          var msg = res.data.msg;
          var page = that.data.page;
          var dataCount = that.data.dataCount; // 每次请求的数据数量
          var oldInfo = that.data.info; // 原来的数据
          var newInfo = oldInfo.concat(msg);
          page++;
          if (msg.length < dataCount) {
            that.setData({
              isMore: false
            })
          }
          if (code == 0) {

          } else {
            that.setData({
              info:newInfo,
              page: page
            })
          } 
        }
      })
    }else{
      return false;
    }
  }
})