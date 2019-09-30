// pages/index/user/customer/pokerDetail/pokerDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex:0,  //滑块索引
    webRoot: app.globalData.webroot, 
    webRoot1: app.globalData.webroot1,
    pokerCount:0,  //几个服务项目 已经晒单
    imgs:[],
    ifPicTrue:0,   //照片是否属实 0-属实 1-不属实
    ifAnonymous:0,  //是否匿名  0-匿名  1-不匿名
    ifHasFace:0,  //是否含有人脸  0-有人脸  1-没有
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    var that=this;
    //得到已晒单技师的 晒单信息
    wx.request({
      //url: app.globalData.webroot + '/index/service/getMyServiceRESN',
      url: app.globalData.webroot1 + '/index/service/getMyServiceRESN',
      method: "post",
      data: {
        customerId: uid,

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {

        console.log(res.data.msg);
        
        var pokerCount=res.data.others;
        console.log(pokerCount)
        var imgs = res.data.msg;
     
        console.log(imgs);
        that.setData({
          pokerCount: pokerCount,  //已晒单的个数
          imgs:imgs   //已晒单详情信息
        })
        //人脸识别  imgs每一项的图片整理
        var servicesImgs = that.data.imgs[that.data.swiperIndex]['imgList'];
        console.log(servicesImgs);
       
        wx.request({
          //url: app.globalData.webroot + '/index/service/faceRecognition',
          url: app.globalData.webroot1 + '/index/service/faceRecognition',
          method: "post",
          data: {
            servicesImgs: JSON.stringify(servicesImgs)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' //post请求
          },
          success(res) {
            console.log(res.data.msg);
          }
        })
      }
    })
  },
  /**
   * 点击返回
   */
  backIndex:function(){
    wx.navigateBack({
      url: "/pages/index/user/customer/index/index"
    })
  },
  /**
   * 滑块滑动
   */
  swiperChange:function(e){
    console.log(e.detail.current);
    var that=this;
    that.setData({
      swiperIndex:e.detail.current
    })
    //人脸识别  imgs每一项的图片整理
    var servicesImgs = that.data.imgs[that.data.swiperIndex]['imgList'];
    console.log(servicesImgs);
   
    wx.request({
      //url: app.globalData.webroot + '/index/service/getMyServiceRESN',
      url: app.globalData.webroot1 + '/index/service/faceRecognition',
      method: "post",
      data: {
        servicesImgs: JSON.stringify(servicesImgs)

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
      }
    })
  },
  /**
   * 照片是否属实 0-属实  1-不属实
   */
  ifPicTrue:function(e){
    var that=this;
    console.log(e.detail.value)
    var ifPicTrue=e.detail.value;
    that.setData({
      ifPicTrue: ifPicTrue
    })
  },
  /**
   * 是否 匿名  0-是  1-否
   */
  anonymous:function(e){
    var that = this;
    console.log(e.detail.value)
    var ifAnonymous = e.detail.value;
    that.setData({
      ifAnonymous: ifAnonymous
    })  
  },
  /**
   * 是否含有 人脸 0-是   1-否
   */
  hasFace:function(e){
    var that = this;
    console.log(e.detail.value)
    var ifHasFace = e.detail.value;
    that.setData({
      ifHasFace: ifHasFace
    })  

  },
  /**
   * 点击完成
   */
  finishPoker:function(e){
    var that=this;
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
      console.log("----")
    console.log(e.currentTarget.dataset)
    var pokerId = e.currentTarget.dataset.pokerid;  
    var resnId = e.currentTarget.dataset.resnid;
    //在点击完成时 得到是否属实  是否匿名  是否删除  pokerid resnId 传到后端 进行处理
    var ifPicTrue = that.data.ifPicTrue;  //照片是否属实 0-属实 1-不属实
    var ifAnonymous = that.data.ifAnonymous;  //是否匿名  0-匿名  1-不匿名
    var ifHasFace = that.data.ifHasFace;     //是否有人脸  0-有  1-否
    wx.request({
      //url: app.globalData.webroot + '/index/poker/savePoker',
      url: app.globalData.webroot1 + '/index/poker/savePoker',
      method: "post",
      data: {
        customerId: uid,
        pokerId: pokerId,
        resnId: resnId, 
        ifPicTrue: ifPicTrue,   //照片是否属实
        ifAnonymous: ifAnonymous, //是否匿名 
        ifHasFace: ifHasFace,      //是否有人脸
       // imgList: JSON.stringify(that.data.imgs[that.data.swiperIndex]['imgList'])
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        if (res.data.code== -1){
          console.log("照片不属实，全部删除")
          //照片不属实  删除这个数组中的这一条信息
          that.data.imgs.splice(that.data.swiperIndex,1);
          that.setData({
            imgs:that.data.imgs
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