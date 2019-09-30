// pages/admin/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CountRole: {},     //三指标 今日机构和技师数量和用户数量

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    //获取三指标
    wx.request({
      url: app.globalData.webroot + '/admin/index/CountRole',
      
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // 修改缓冲中user 的staffLevel的值
        console.log(res.data)
        that.setData(
          { "CountRole": res.data}
        )

        console.log(that.data.CountRole)
      },
      fail(res) {

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