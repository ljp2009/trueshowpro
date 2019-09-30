// pages/index/firm/firmCard/serveItem/serveItem.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    firmId: 0,//机构id
    serviceId: 0,//服务项目id
    firmPromoteInfo:[],//机构优惠活动
    serviceInfo:[],//服务项目信息
    serviceInquiry:[], //服务项目问询列表
    userAvatar:"", //当前登录用户的头像
    userNickName: "",//当前登录用户的昵称
    consultInputValue:"", //咨询输入框的值
    uid:0,//当前登录用户的id
    serviceStaffInfo:[], //得到当前项目的一个服务技师
    firmBasicInfo:{},//机构基本信息
    // 星星
    stars1: [{
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '非常不满意，各方面都很差'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '不满意，比较差'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }],
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    //firmId=' + firmid + '&serviceId
    var that=this;
    //好了打开
    // var firmId = options.firmId;//机构id
    // var serviceId = options.serviceId;//服务项目id
    //机构优惠活动 读缓存
    var firmPromoteInfo = JSON.parse(wx.getStorageSync("firmPromoteInfo"));//
    var firmBasicInfo = JSON.parse(wx.getStorageSync("firmBasicInfo"));//机构基本信息
    //读取当前登录用户的头像和昵称
    var userAvatar = JSON.parse(wx.getStorageSync("user"))["userinfo"]["avatarUrl"];
    var userNickName = JSON.parse(wx.getStorageSync("user"))["userinfo"]["nickName"];
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    ///这个才是需要得到的
    // that.setData({
    //   firmId: firmId,
    //   serviceId: serviceId
    //   firmPromoteInfo: firmPromoteInfo,
    //   firmBasicInfo: firmBasicInfo,
    //   userAvatar: userAvatar,
    //   userNickName: userNickName,
    //   uid:uid
    // })
/////////////////////好了之后要改
    that.setData({
      firmId: 1,
      serviceId: 1,
      firmPromoteInfo: firmPromoteInfo,
      firmBasicInfo: firmBasicInfo,
      userAvatar: userAvatar,
      userNickName: userNickName,
      uid: uid
    })
   
    ///getServiceById //得到机构服务项目的信息
    wx.request({
      //url: app.globalData.webroot + '/index/service/getServiceById',
      url: app.globalData.webroot1 + '/index/service/getServiceById',
      method: "post",
      data: {
        firmId: that.data.firmId,
        serviceId: that.data.serviceId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        var data = res.data.msg;
        if (data["Pic"]!=""){
          data["Pic"] = data["Pic"].split(",")
        }
        that.setData({
          serviceInfo: data
        })
        console.log(that.data.serviceInfo)
      }
    })

///////////////得到当前服务项目的问询列表
    wx.request({
      //url: app.globalData.webroot + '/index/service/getServiceById',
      url: app.globalData.webroot1 + '/index/inquiry/getInquiryByService',
      method: "post",
      data: {
        firmId: that.data.firmId,
        serviceId: that.data.serviceId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        var data = res.data.msg;
        that.setData({
          serviceInquiry: data
        })
        console.log(that.data.serviceInquiry)
      }
    })



    /////////////////////得到当前服务这个项目的一个技师信息  inquiry/getServiceStaffInfoById
    wx.request({
      //url: app.globalData.webroot + '/index/user/inquiry/getServiceStaffInfoById',
      url: app.globalData.webroot1 + '/index/service/getServiceStaffInfoById',
      method: "post",
      data: {
        firmId: that.data.firmId,
        serviceId: that.data.serviceId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        var data = res.data.msg;
        var satisfection = data["Satisfection"]/10;
        var num = Math.round(satisfection);//四舍五入分
        data["Satisfection"] = num;
        that.setData({
          serviceStaffInfo: data
        })
        console.log(that.data.serviceStaffInfo)
      }
    })


  },
  jump:function(){
    console.log("----")
    // wx.navigateBack({
    //   detal:1
    // })
    // wx.navigateTo({
    //   url: '',
    // })

    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
   
  },
  //咨询输入框的值
  textareaAInput:function(e){
    var that=this;
    var value = e.detail.value;
    console.log(value);
    that.setData({
      consultInputValue: value
    })
  },
  //点击咨询按钮 事件
  consultBtn:function(){
    var that=this;
    //获取咨询输入框的值
    var consultInputValue = that.data.consultInputValue;
    var serviceId = that.data.serviceInfo["ServiceId"];//当前服务项目id
    var uid = that.data.uid;//登录用户的id
    var userNickName = that.data.userNickName;//登录用户的昵称
    //新建一条问询问题
    wx.request({
      //url: app.globalData.webroot + '/index/user/updateUserMySubCat',
      url: app.globalData.webroot1 + '/index/inquiry/addInquiry',
      method: "post",
      data: {
        firmId: that.data.firmId,
        uid: uid,
        nickName: userNickName,
        serviceId: serviceId,//服务项目ID
        contents: that.data.consultInputValue, //内文
        type: 0,//0：问，1：答 （顾客问，技师答）
        reply: 0 //0：未回复，1：已回复
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        if (res.data.code==1){
          var inquiryId = res.data.msg;
            //发送成功
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
          //需要在当前页面显示出来我刚刚发送的问题
          console.log(that.data.serviceInquiry)
          var serviceInquiry = that.data.serviceInquiry;
          var obj={
            Avatar: that.data.userAvatar,
            Contents: that.data.consultInputValue,
            FirmId: that.data.firmId,
            Id: inquiryId,
            NickName: userNickName,
            Reply: 0,
            ServiceId: serviceId,
            Type: 0,
            UserId: uid,
            askId: "",
          }
          serviceInquiry.push(obj);
          that.setData({
            serviceInquiry: serviceInquiry,
            consultInputValue:""
          })
        }
      }
    })


  },
  rebackBtn:function(){
    wx.navigateBack({
        delta: 1
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