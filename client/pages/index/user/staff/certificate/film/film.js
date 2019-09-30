// pages/index/user/staff/certificate/film/film.js
Page({
  data: {
    basicsList: [{
      icon: 'radioboxfill',
      name: '填写信息'
    }, {
      icon: 'radioboxfill',
      name: '人脸验证'
    }, {
      icon: 'roundclosefill',
      name: '审核'
    }, {
      icon: 'roundcheckfill',
      name: '支付'
    }, {
      icon: 'roundcheckfill',
      name: '完成'
    },],
    basics: 0,
    numList: [{
      name: '信息'
    }, {
      name: '经营者信息'
    }, {
      name: '审核'
    }, {
      name: '支付'
    }, {
      name: '完成'
    },
    ],
    num: 0,
    scroll: 0,
    imgList: [],

  }, ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  /**
   * 页面的初始数据
   */
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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