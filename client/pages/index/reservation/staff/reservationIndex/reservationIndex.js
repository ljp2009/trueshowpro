// pages/index/reservation/customer/reservationIndex/reservationIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    showModal1:false,
    showModal2:false
  },

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

  },
  //弹窗
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  // 隐藏模态对话框
  hideModal: function () {
    this.setData({
      showModal: false
    })
  },
  // 对话框取消按钮点击事件
  onCancel: function () {
    this.hideModal()
  },
  //对话框确认按钮点击事件
  onConfirm: function () {
    this.hideModal();
  },


  // 第二个对话框
  showDialogBtn1: function () {
    this.setData({
      showModal1: true
    })
  },
  onCancel1: function () {
    // this.hideModal()
    this.setData({
      showModal1: false
    })
  },
  onConfirm1: function () {
    // this.hideModal();
    this.setData({
      showModal1: false
    })
  },
// 第三个模态框
  showDialogBtn2: function () {
    this.setData({
      showModal2: true
    })
  },
  onCancel2: function () {
    // this.hideModal()
    this.setData({
      showModal2: false
    })
  },
  onConfirm2: function () {
    // this.hideModal();
    this.setData({
      showModal2: false
    })
  }

})