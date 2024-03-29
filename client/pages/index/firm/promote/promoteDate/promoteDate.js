// pages/index/firm/promote/promoteDate/promoteDate.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    showModal: false,
    startDate:"", //开始日期
    startTime:'',     //开始时间
    effectiveDate: "", //优惠执行日期
    effectiveTime: "",     //优惠执行时间
    stillDays: 7,      //持续天数
    performDays:7,  //执行天数
    performDaysTemp:0 //临时记录执行天数
   
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    var that = this;
    //getCurrentDatetime 通过后端获取的当前时间更准确
    wx.request({
      url: app.globalData.webroot + '/index/promote/getCurrentDatetime',
      method: "post",
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var date = res.data.msg["date"];//年月日
        var time = res.data.msg["time"];//时分
        that.setData({
          startDate: date,
          startTime: time,
          effectiveDate: date,
          effectiveTime: time,
        })
      }
    })

  },
  /**
   * 选择开始日期点击事件
   */
  startDateChange: function(e) {
    var that = this;
    that.setData({
      startDate: e.detail.value
    })
    console.log('日期是----' + that.data.startDate);
    ////////////////////////////////////////////////////
    /////////////与执行日期时间关联/////////////////////////
    that.commonFun();
  },
 
  /**
   * 选择开始时间点击事件
   */
  startTimeChange(e) {
    var that = this;
    this.setData({
      startTime: e.detail.value
    })
    console.log("时间是---" + this.data.startTime)
//////////////////////////////////////////////////////
    /////////////与执行日期时间关联/////////////////////////
    that.commonFun();
  },
  
  /**
   * 优惠执行天数
   */
  performDays:function(e){
    var that=this;
    var value = e.detail.value;
    console.log(value);
    that.setData({
      performDaysTemp: value
    })
    console.log('优惠执行天数---' + that.data.performDaysTemp);
   
   
  },
  /**
   * 优惠持续天数 input事件
   */
  stillDaysInput:function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      stillDays: value
    })
    console.log(that.data.stillDays);
    if (Number(that.data.stillDays) < Number(that.data.performDays) || that.data.stillDays==""){
      wx.showToast({
        title: '提示:持续天数必须>=执行天数！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
  
   
    ///////////////////////////////////////////////////
    /////////////与执行日期时间关联/////////////////////////
    that.commonFun();
  
  },
  //计算当前的执行日期时间
  computePerformDateTime: function (startDateTime, performDays, stillDays) {
    var that=this;
    wx.request({
      url: app.globalData.webroot + '/index/promote/computePerformDateTime',
      method: "post",
      data: {
        stillDays: stillDays,//持续天数
        startDateTime: startDateTime,//开始日期时间
        performDays: performDays //执行天数
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
       // console.log(res.data.msg);// {date: "2019-09-12", time: "16:46"}
        var arr=res.data.msg;
        that.setData({
          effectiveDate: arr["date"],
          effectiveTime: arr["time"]
        })
      }
    })
  },
  /**
   * 点击发布
   */
  addNewPromote:function(){
    var that=this;
    var startDate = that.data.startDate;   //活动开始 日期
    var startTime = that.data.startTime;   //活动开始 时间
    //整理开始日期时间
    var startDateTime = startDate + " " + startTime+":00";
    var effectiveDate = that.data.effectiveDate;  //优惠生效日期
    var effectiveTime = that.data.effectiveTime;   //优惠生效 时间 
    //整理执行日期时间
    var effectiveDateTime = effectiveDate + " " + effectiveTime + ":00";
    var stillDays = that.data.stillDays;  //持续天数
    var performDays = that.data.performDays; //优惠执行天数
    //wx.getStorageSync("activityinfo")
   // return;
    console.log("------点击了发布")
    //需要判断之前是否已经选择优惠活动 
    if (!wx.getStorageSync("activityinfo")){
      wx.showToast({
        title: '提示:还未添加优惠活动！！',
        icon: 'none',
        duration: 1500
      })
      setTimeout(function(){
        //跳转回
        wx.redirectTo({
          url: '/pages/index/firm/promote/addPromote/addPromote'
        })
      },1500)
     
      return;
    }
   
    wx.request({
      url: app.globalData.webroot + '/index/promote/newPromote',
      method: "post",
      data: {   
        startDateTime: startDateTime,  
        effectiveDateTime: effectiveDateTime,
        performDays: performDays,
        stillDays: that.data.stillDays,
        activityinfo: wx.getStorageSync("activityinfo")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
        if (res.data.code==1){
            //删除缓存 activityinfo
          wx.removeStorage({
            key: 'activityinfo',
            success(res) {
              console.log(res);
              setTimeout(function(){
                //跳转页面
                wx.redirectTo({
                  url: '/pages/index/firm/promote/promoteList/promoteList'
                })
              },1500)
              
            }
          })
        }

        //pages/index/firm/promote/promoteList/promoteList
      }
    })
  },
  /**
   * 返回上一个页面
   */
  backAddPromote:function(){
    wx.redirectTo({
      url:'/pages/index/firm/promote/addPromote/addPromote'
    })
  },
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
    });
  },
  // 对话框取消按钮点击事件

  onCancel: function () {
    this.hideModal();
  },
  //对话框确认按钮点击事件
  onConfirm: function () {
    //用户点击了选择按钮
    var that = this;
    //改变当前输入得执行天数
    console.log("--用户点击了选择按钮")
    console.log(that.data.performDaysTemp + "--" + that.data.stillDays)
    if (Number(that.data.performDaysTemp) <= 0) {
      wx.showToast({
        title: '提示:执行天数必须>=1！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    console.log(that.data.performDaysTemp + "---" + that.data.stillDays)
    if (Number(that.data.performDaysTemp) > Number(that.data.stillDays)) {
      console.log(that.data.performDaysTemp + "---" + that.data.stillDays)
      wx.showToast({
        title: '提示:执行天数必须小于持续天数！',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    console.log(that.data.performDaysTemp + "--111-" + that.data.stillDays)
    that.setData({
      performDays: that.data.performDaysTemp
    })
    console.log(that.data.performDays);
    /////////////与执行日期时间关联/////////////////////////
     that.commonFun();
    //隐藏模态框
    that.hideModal();
  },
  //公共部分 通过参数显示执行日前和时间
  commonFun: function (that){
    var that=this;
     var stillDays = that.data.stillDays; //持续天数
     var performDays = that.data.performDays;//执行天数
     //计算执行日期时间 //得到开始日期 执行天数 
     var performDays = that.data.performDays;//执行天数  
     //得到当前的活动开始时间
     var startDate = that.data.startDate;//开始日期
     var startTime = that.data.startTime;//开始时间
     var startDateTime = startDate + " " + startTime;
     that.computePerformDateTime(startDateTime, performDays, stillDays);
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