// pages/index/firm/firmIndex/firmIndex/firmIndex.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      staffId:'',// 机构id
      firmInfo:{},
      isDisable:1, // 是否禁用营业/暂停按钮   1 - 禁用  ， 0 - 不禁用
      status:"",// 营业状态
  },

  /**
   * 认证按钮事件
   */
  certificate: function() {
    // 跳转到认证页面
    var firmId = this.data.staffId;
    wx.navigateTo({
      url: '/pages/index/firm/certificate/manageCert/manageCert?firmId=' + firmId,
    })
  },
  /**
   * 进入机构详情页面
   */
  firmDetail: function() {
    var firmId = this.data.staffId;
    console.log(this.data.staffId)
    wx.navigateTo({
      url: '/pages/index/firm/firmIndex/firmInfo/firmInfo?firmId=' + firmId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var firmId=options.firmId;
    // 获取机构id
    var that = this;
    this.setData({
      // staffId:options.staffId
      staffId: firmId
    })
    // 获取指定机构的信息 名字 地址 是否认证 负责人姓名 负责人电话 服务项目的数量 
    wx.request({
      url: app.globalData.webroot +  '/index/firm/firmIndex',
      method: 'POST',
      data: {
        firmId: that.data.staffId
      },
      header: {
        'content-type': 'application/json' // 默认值
        // 'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        
        that.setData({
          firmInfo:res.data.msg
        })
        console.log(res)
        // substr_replace($res[$i]["Mobile"], '****', 3, 4);
        var start = res.data.msg.Mobile.substr(0,3);
        var end = res.data.msg.Mobile.substr(7, 4);
        var firmInfo = that.data.firmInfo;
        var isDisable;
        var status = '';
        console.log(firmInfo.Status)
        console.log(firmInfo.serviceCount)
        if (firmInfo.Status > 1 || firmInfo.serviceCount==0){
          that.setData({
            isDisable: 1
          })
        }else{
          that.setData({
            isDisable: 0
          })
        }
        
        
        if(firmInfo.Status == 0){
          status = "暂停营业";
        }else if(firmInfo.Status == 1){
          status = "营业中";
        }else{
          status = "被禁用";
        }

        firmInfo['Mobile'] = start+'****'+end;
        that.setData({
          firmInfo:firmInfo,
          status:status
        })
      }
    })
    
  },

  /**
   * 营业/暂停营业
   */
  SetShadow: function(e){
    console.log('营业')
    console.log(e)
    var check = e.detail.value; 
    var status = this.data.status;
    var firmId = this.data.staffId;
    var sss = 0;
    if(check == true){
      status = "营业中";
      sss = 1;
    }else{
      status = "暂停营业";
      sss = 0;
    }
    this.setData({
      status: status
    })
    // 请求后台，修改状态
    wx.request({
      url: app.globalData.webroot + '/index/firm/upFirmStatus',
      method: "POST",
      data: {
        firmId: firmId,
        status:sss
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
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