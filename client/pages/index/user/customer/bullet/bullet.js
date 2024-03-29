const app = getApp();
Page({
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    ColorList: app.globalData.ColorList,
    color: 'red',
    myBulletList: [],//弹幕列表

    start: 0, // 获取弹幕时的加载起始数
    quantity: 30, //单次请求加载数量（晒单编组数），默认30
    uid:0,
  },
  onLoad() {
    let that = this;
    setTimeout(function () {
      that.setData({
        loading: true
      })
    }, 500)
    //用户id
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    that.setData({
      uid: uid
    })
    ////获取用户基于晒单弹幕  getBulletsByUserId
    wx.request({
      //url: app.globalData.webroot + '/index/bullet/countMyBullet',
      url: app.globalData.webroot1 + '/index/bullet/getBulletsByUserId',
      method: "post",
      data: {
        uid: uid,
        start: that.data.start,
        quantity: that.data.quantity
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {

        console.log(res.data.msg);
        //others
        that.setData({
          myBulletList: res.data.msg,
          start: res.data.others+1 //当前到那个索引值了
        })
        console.log(that.data.start);
      }
    })
  },
  //侦听滚动条到底了事件
  lower: function () {
    wx.showNavigationBarLoading();
    var that = this;

    setTimeout(function () {
      wx.hideNavigationBarLoading();
      that.nextLoad();
    }, 1000);


    console.log("lower")
    console.log("到底了---")
  },
  //加载 下面12条
  nextLoad: function () {
    var that=this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    var myBulletList = that.data.myBulletList;
    ////获取用户基于晒单弹幕  getBulletsByUserId
    wx.request({
      //url: app.globalData.webroot + '/index/bullet/countMyBullet',
      url: app.globalData.webroot1 + '/index/bullet/getBulletsByUserId',
      method: "post",
      data: {
        uid: that.data.uid,
        start: that.data.start,
        quantity: that.data.quantity
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {

        console.log(res.data.msg);
        var data = res.data.msg;
        if (data.length==0){
          wx.showToast({
            title: '没有数据了',
            icon: 'none',
            duration: 2000
          })
            return;
        }
       
        myBulletList.push(data);
        //others
        that.setData({
          myBulletList: myBulletList,
          start: res.data.others + 1 //当前到那个索引值了
        })
        console.log(that.data.start);
        setTimeout(function () {
          wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 1000
          })
        }, 1000)
      }
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  SetColor(e) {
    this.setData({
      color: e.currentTarget.dataset.color,
      modalName: null
    })
  },
  SetActive(e) {
    this.setData({
      active: e.detail.value
    })
  }
})