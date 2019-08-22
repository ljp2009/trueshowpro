// pages/index/user/staff/staffCard/staffCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 锚点
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    //
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: ['个人信息', '服务项目', '作品', '评价'],
    //
    load: true,
    // 锚点结束
    navList:['个人信息','服务项目','作品','评价'],
    // 导航隐藏
    navHid:true,
    // 服务项目的滑块
    TabCur:0,
    scrollLeft: 0,
    webRoot: app.globalData.webroot, 
    // 中医滑块的
    imgs:[1,2,3],
    //滑块的
    serviceList: 
      {'items': ['美发', '美睫/眉', '化妆', '护肤', '美甲', '美体', '保健', '健身', '非主流']}
    ,
    imgUrls: [
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg',
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
   
    //时间的变量
    dateArr: []   //放时间的
    //模态框
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 锚点
   
    // let list = [{}];
    // for (let i = 0; i < 26; i++) {
    //   list[i] = {};
    //   list[i].name = String.fromCharCode(65 + i);
    //   list[i].id = i;
    // }
    // var list=['个人信息','服务项目','作品','评价'];
    // this.setData({
     
    //   listCur: list[0]
    // })
    // console.log("!!!!!!!")
    // console.log(this.data.list);
    // 锚点结束
    //时间js
    // 关于日期的js
    var date = new Date();
    var arr = [];
    var showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    console.log("今天日期是" + showDate)   //今天日期
    arr.push(date.getDate());
    for (var i = 1; i <= 6; i++) {//后7天
      date.setDate(date.getDate() + 1);
      showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      // console.log(showDate)
      arr.push(date.getDate());
      console.log(date.getDate())
    }
    this.setData({
      dateArr: arr
    })
    console.log(this.data.dateArr);
  },
  // 锚点js
  getStatus(e) {  
    this.setData({ status: e.currentTarget.dataset.index })
  },
  // 页面滑动 导航栏出现
  onPageScroll(e) {
    if(e){
      this.setData({
        navHid: false
      }) 
    }
    console.log(e)
  },
  // 服务项目的滑块
  tabSelect1(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    console.log(this.data.TabCur);
  },
  // 模态框
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
    console.log(this.data.modalName);

  },
  // 模态框消失
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 点击作品展示箭头事件
  showWorks:function(){
    console.log("点击了作品展示更多");
    wx.navigateTo({
      url: '../staffWorkShow/staffWorkShow'
    })
  },  
  // 时间
  // 选择日期点击事件
  chooseDate: function (e) {
    console.log("选择的日期是" + e.currentTarget.dataset.item);
    console.log("点击选择的index是" + e.currentTarget.dataset.index);
  },
  // 点击约
  reservationFun:function(){
    console.log("点击了约--");
  },
  // 跳到约单页面  
  intoReservation:function(){
    console.log("点击了转到约单按钮");
    wx.navigateTo({
      url: '../../../reservation/customer/reservationIndex/reservationIndex'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
  },
  // 锚点js
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
        console.log(list[i].top);
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
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