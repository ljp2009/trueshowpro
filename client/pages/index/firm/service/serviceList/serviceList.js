const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffId: '',  // 机构id
    oldData:[],
    TabCur: 0,
    scrollLeft: 0,
    classifyList:[],  // 分类数组
    pullOffCount:0,  // 下架数量
    services:[], //服务列表
    serviceCount:0, // 服务总数
    lastId:0,
    page:0,
    delBtnWidth: 180,
    btnIsShow:false
    
  },
    


onLoad: function (options) {
  var that = this;
  this.setData({
    staffId:options.staffId
// staffId:90
  })
  var staffId = this.data.staffId
  // 获取所有的分类
  wx.request({
    url: app.globalData.webroot + '/index/service/getServiceProData',
    method: "get",
    data: {
      staffId:staffId
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res)
      var msg = res.data.msg;
      var cats = msg.cat;
      console.log(msg.services)
      for(var i=0;i<msg.services.length;i++){
        msg.services[i].thumbnail = app.globalData.webroot + "/static/images/service/" + msg.services[i].thumbnail;
      }
      that.setData({
        classifyList:msg.cat,
        pullOffCount: msg.pullOff.pullOffCount,
        services:msg.services,
        serviceCount: msg.countService.countService,
        lastId:msg.lastId,
        time:1
      })
    }
  })
},
/**
 * 分类的点击事件
 */
  changeCat(e) {
    
    var seq = e.currentTarget.dataset.seq;  // 点击的分类seq
    var services = this.data.services;
    console.log(seq)
    var cats = this.data.classifyList;  
    for(var i=0;i<cats.length;i++){
      var item=cats[i];
      var isChoose = item.isChoose;
      if(item.Seq == seq){
        console.log(isChoose)
        isChoose = isChoose == true?false:true;
        cats[i].isChoose = isChoose;
      }
      // 筛选出符合分类的数据    修改每一天的isShow
      for (var j = 0; j < services.length; j++) {
        var sitem = services[j];
        
        if(sitem.MainCat == item.Seq){
          console.log(sitem.MainCat + '----' + item.Seq)
          services[j].isShow = isChoose;
        }
      }

    }
    console.log(services)

    
    this.setData({
      classifyList:cats,
      services:services
    })
},
/**
 * 左滑上架下架按钮显示
 */
  delItem: function (e) {
    console.log(e)
    // 重置所有按钮
    this.data.services.forEach(function (v, i) {
      if (v.txtStyle)//只操作为true的
        v.txtStyle = '';
    })
    
    var id = e.currentTarget.dataset.id;
    var pull = e.currentTarget.dataset.pull;
    var that = this;
    pull = pull==1?0:1;
    wx.request({
      url: app.globalData.webroot + '/index/service/arrangeService',
      method: "POST",
      data: {
        ServiceId: id,
        PullOff:pull
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var code = res.data.code;
        if(code == 1){
          // 操作成功   修改这个服务的 pullOff   遍历服务数组，将这个值的pullOff值改变
          var pullCount = that.data.pullOffCount;
          var services = that.data.services;
          if(pull == 1){
            pullCount++;
          }else{
            pullCount--;
          }
          
          for (var i = 0; i < services.length;i++){
            if (services[i]['ServiceId'] == id){
              services[i]['PullOff'] = pull;
            }
          }
          that.setData({
            pullOffCount: pullCount,
            services:services
          })


        }else{
          // 操作失败
        }
      }
    })
  },
  detail: function(e) {
    var id = e.currentTarget.dataset.sid;
    // /pages/index / firm / service / addService / addService
    wx.navigateTo({
      url: '/pages/index/firm/service/addService/addService?serviceId=' + id + "&staffId=" + this.data.staffId,
    })
  },
  touchS: function (e) {
    //重置所有按钮
    this.data.services.forEach(function (v, i) {
      if (v.txtStyle)//只操作为true的
        v.txtStyle = '';
    })
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.services;
      list[index]['txtStyle'] = txtStyle;
      //更新列表的状态
      this.setData({
        services: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.services;
      var del_index = '';
      disX > delBtnWidth / 2 ? del_index = index : del_index = '';
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        services: list,
        del_index: del_index
      });
    }
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
    var that = this;
    console.log("页面上啦触底，加载更过服务项目");
    var time = this.data.time;
    var services = this.data.services;
    var staffId = this.data.staffId;
    if(this.data.lastId == -1){
      return 0;
    }else{
      wx.request({
        url: app.globalData.webroot + '/index/service/getServiceProData',
        method: "get",
        data: {
          staffId: staffId,
          time: time*5
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          var msg = res.data.msg;
          var lastId = msg.lastId;
          var s = services.concat(msg.services);
          that.setData({
            time:time+1,
            services: s,
            lastId:lastId
          })
        }
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  changeAddServiceHidOne:function(){
    getApp().data.addServiceOne = "block";
    getApp().data.addServiceTwo = "none";
  },

  changeAddServiceHidTwo: function () {
    getApp().data.addServiceOne = "none";
    getApp().data.addServiceTwo = "block";
  },

})