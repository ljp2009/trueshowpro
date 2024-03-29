// pages/index/user/staff/pokerByStaff/pokerByStaff.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffId:0, //技师id
    pokerList:[], // 晒单/作品列表
    isSuccess:true,
    page:0, //按需加载次数
    isMore:true,  // 是否存在更多的数据
    loadCount:5, // 加载的个数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      staffId:options.firmId
    })
    var that = this;
    wx.request({
      url: app.globalData.webroot + '/index/poker/getPoker',
      method: "POST",
      data: {
        staffId:options.firmId,
        page:that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.msg)
        var code = res.data.code;
        var loadCount = that.data.loadCount;
        var isMore = that.data.isMore;
        if(code == 1){
          var page = that.data.page;
          page = page+1;
          // 加载成功
          var list = res.data.msg.list;
          for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].length;j++){
              list[i][j].Favor = that.nFormatter(list[i][j].Favor,1)
              list[i][j].Read = that.nFormatter(list[i][j].Read, 1)
            }
          }
          that.setData({
            pokerList:list,
            page:page,
            isMore: isMore
          })
        }else{
          // 加载失败
          that.setData({
            isSuccess:false
          })
        }
      }
    })
  },
  /**
   * moreLoad  加载更多
   */
  moreLoad : function (){
    var that = this;
    console.log(this.data.page)
    var isMore = this.data.isMore;
    var loadCount = this.data.loadCount;
    if(isMore == false) return;
    wx.request({
      url: app.globalData.webroot + '/index/poker/getPoker',
      method: "POST",
      data: {
        staffId: that.data.staffId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var code = res.data.code;
        if (code == 1) {
          var page = that.data.page;
          var oldList = that.data.pokerList; //y原来的数据
          var isMore = that.data.isMore; // 
          page = page+1;
          // 加载成功
          var list = res.data.msg.list; // 请求得到的数据
          if (list.length < loadCount){
            // 请求到的数组为空
            isMore = false;
          }
            for (var i = 0; i < list.length; i++) {
              for (var j = 0; j < list[i].length; j++) {
                list[i][j].Favor = that.nFormatter(list[i][j].Favor, 1)
                list[i][j].Read = that.nFormatter(list[i][j].Read, 1)
              }
              oldList.push(list[i]);
            }
          that.setData({
            pokerList: oldList,
            page: page,
            isMore :isMore
          })
        } else {
          // 加载失败
          that.setData({
            isSuccess: false
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
    console.log("下拉动作")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.moreLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  nFormatter: function (num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  },
})