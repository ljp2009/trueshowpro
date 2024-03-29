// pages/index/reservation/staff/modules/jordanMoadlOne/jordanModalOne.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    showModal: false,
    staffId:0, //技师id
    workStartTime:"09:00", //技师上班时间
    workEndTime:"20:00" //技师下班那时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
     var staffId = options.staffId;//当前技师id
    //var staffId =115
     that.setData({
       staffId: staffId
     })
    //通过当前技师id 读取她之前设置的上下班时间 然后显示再页面上
    wx.request({
      //url: app.globalData.webroot + '/index/user/getStaffById',
      url: app.globalData.webroot1 + '/index/user/getStaffById',
      method: "post",
      data: {
        uid: that.data.staffId
        // uid: 115
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var data = res.data.msg;
        var workStartTime = data["WorkStartTime"];
        var workEndTime = data["WorkEndTime"];
        that.setData({
          workStartTime: workStartTime,
          workEndTime: workEndTime
        })
        console.log(that.data.workStartTime + "---" + that.data.workEndTime)
      }
    })


  },
  //上班时间输入框的输入值
  workstarttimeChange:function(e){
    var that = this;
    var value = e.detail.value;
    console.log(e.detail.value);
    that.setData({
      workStartTime: value
    })
  },
   //下班时间输入框的输入值
  workendtimeChange: function (e) {
    var that = this;
    var value = e.detail.value;
    console.log(e.detail.value);
    that.setData({
      workEndTime: value
    })
  },
  //点击确认按钮的事件
  confirmBtn:function(){
    var that=this;
    var workStartTime = that.data.workStartTime;
    var workEndTime = that.data.workEndTime;
    console.log(workStartTime + "---" + workEndTime);
   
    var workStartTime1 = Number(workStartTime.split(':').join(''));
    var workEndTime1 = Number(workEndTime.split(':').join(''));
    console.log("---" + workStartTime1 + "---" + workEndTime1)
   
    if (workStartTime == "" || workEndTime==""){
        //
      wx.showToast({
        title: '时间不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (workEndTime1 <= workStartTime1) {
      //
      wx.showToast({
        title: '下班时间必须晚于上班时间',
        icon: 'none',
        duration: 1000
      })
      return;
    }
   
    //需要更新user 的上下班时间
    wx.request({
      //url: app.globalData.webroot + '/index/user/updateUserWorkTime',
      url: app.globalData.webroot1 + '/index/user/updateUserWorkTime',
      method: "post",
      data: {
        workStartTime: workStartTime+":00",
        workEndTime: workEndTime + ":00",
        uid: that.data.staffId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var code = res.data.code;
         wx.showToast({
           title: res.data.msg,
           icon: code==0 ?"none" :"success",
          duration: 1000
        })

        setTimeout(function(){
          //跳转页面
          //pages/index/reservation/staff/modules/jordan/jordan
          wx.navigateTo({
            url: '/pages/index/reservation/staff/modules/jordan/jordan',
          })
        },500)
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

  },
  //弹窗
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  //弹出框蒙层截断touchmove事件
  preventTouchMove: function () {
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
  }
})