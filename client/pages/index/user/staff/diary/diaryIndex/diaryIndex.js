// pages/index/user/staff/diaryIndex/diaryIndex.js
var app = getApp()
// 弹幕js
var that = undefined;
var doommList = [];
var i = 0;
var ids = 0;
var cycle = null  //计时器
// 弹幕参数
// class Doomm {
//   constructor(text, top, time, color) {  //内容，顶部距离，运行时间，颜色（参数可自定义增加）
//     // this.text = text["text"];
//     // this.nickname = text["nickname"];
//     this.text = text;
//     this.top = top;
//     this.time = time;
//     this.color = color;
//     this.display = true;
//     this.id = i++;
//   }
// }
// 弹幕字体颜色
function getRandomColor() {
  return '#ffffff'
}
// 弹幕js结束
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 弹幕
   // bulletsArr: [],  //临时的弹幕
    //doommList: [],
    //doommData: [],
    // doommData: [],
    // arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

    // 弹幕结束
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    staffId: 0, // 技师id
    userId: 0, // 是否是顾客  
    info: {}, // 技师信息
    diary: {}, // 技师日记
    isStaff: 0, // 是否是技师，默认不是技师
    pages: 0, // 分页请求数据的页数
    pageCount: 5, // 分页访问数据的每页数据量
    isMore: 1,// 是否加载更多
    ifDommShow: 0,  //默认显示弹幕
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.nFormatter(999, 2))
    var that = this;
    // 弹幕
    // 弹幕

    // cycle = setInterval(function () {
    //   let arr = that.data.arr
    //   if (arr[ids] == undefined) {
    //     ids = 0
    //     // 1.循环一次，清除计时器
    //     // doommList = []
    //     // clearInterval(cycle)

    //     // 2.无限循环弹幕
    //     doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 100), 5, getRandomColor()));
    //     if (doommList.length > 5) {   //删除运行过后的dom
    //       doommList.splice(0, 1)
    //     }
    //     that.setData({
    //       doommData: doommList
    //     })
    //     ids++
    //   } else {
    //     doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 100), 5, getRandomColor()));
    //     if (doommList.length > 5) {
    //       doommList.splice(0, 1)
    //     }
    //     that.setData({
    //       doommData: doommList
    //     })
    //     ids++
    //   }
    // }, 1000)

  
    // 弹幕结束
    var staffId = options.staffId;
    var userId = options.userId;
    var isStaff = 0;
    var pages = this.data.pages;
    var pageCount = this.data.pageCount;
    if (staffId == userId) isStaff = 1;
    // staffId ==-1  顾客访问关注的技师的日记
    // staffId != -1 技师访问自己的日记

    this.setData({
      staffId: staffId,
      userId: userId
    })
    console.log(this.data.staffId);

    // 请求得到技师的基本信息
    wx.request({
      url: app.globalData.webroot1 + '/index/user/getDiary',
      method: "POST",
      data: {
        staffId: staffId,
        userId: userId,
        pages: pages,
        pageCount: pageCount
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        var diary = res.data.msg;
        var diaryCount = that.data.diaryCount;
        var isMore = that.data.isMore;
        if (diary.length < diaryCount) {
          isMore = 0;
        }
        var pages = that.data.pages;
        pages++;
        // 处理图片字符串，将字符串转化成数组
        for (var i = 0; i < diary.length; i++) {
          diary[i].formatLike = that.nFormatter(diary[i].Liked, 2); // 格式化点赞数
          if (diary[i].Pic == null) continue;
          diary[i].Pic = diary[i].Pic.split(',');
          for (var j = 0; j < diary[i].Pic.length; j++) {
            diary[i].Pic[j] = app.globalData.webroot1 + '/static/images/uploads/' + diary[i].Pic[j];
          }
        }
        console.log(diary)
        that.setData({
          diary: diary,
          pages: pages,
          isMore: isMore
        })
        console.log('!!!!!!!' + that.data.diary)
      }
    })
    //请求弹幕
    return;
    wx.request({
      url: app.globalData.webroot1 + '/index/user/getDiaryDoomm',
      method: "POST",
      data: {
        staffId: staffId,
        userId: userId,
        pages: pages,
        pageCount: pageCount
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('返回的----' + res.data.msg)
        var diary = res.data.msg;
        for (var i = 0; i < diary.length; i++) {
          var doommData = diary[i]['doomInfo'];
          console.log(doommData)
        }

      }
    })
  },
  /**
   * 是否开启弹幕按钮
   */
  ifDommBtn: function () {
    var that = this;
    var ifDommShow = that.data.ifDommShow;
    if (ifDommShow == 0) {
      that.setData({
        ifDommShow: 1
      })
    } else {
      that.setData({
        ifDommShow: 0
      })
    }

    console.log(that.data.ifDommShow);
  },
  /**
   * 添加动态
   */
  // / pages / index / user / staff / diary / addDiary / addDiary
  addDiary: function () {
    wx.navigateTo({
      url: '/pages/index/user/staff/diary/addDiary/addDiary?staffId=' + this.data.staffId
    })
  },
  /**
   * 点赞
   */
  thumbUp: function (e) {
    console.log(e);
    let iszan = e.currentTarget.dataset.iszan;
    let like = e.currentTarget.dataset.Like;
    if (iszan == 0) {
      // 点赞
      type = 1;
    } else {
      // 取消赞
      type = 0;
    }
    let id = e.currentTarget.dataset.id; // 日记id
    let userId = this.data.userId; // 用户id
    let staffId = this.data.staffId; // 技师id
    let diary = this.data.diary;
    let type;
    // 改变样式
    for (var i = 0; i < diary.length; i++) {
      var item = diary[i];
      if (item.DiaryId == id) {
        diary[i].isZan = diary[i].isZan == 0 ? 1 : 0;
        console.log(diary[i].Liked)
        if (iszan == 1) {
          diary[i].Liked--;
        } else {
          diary[i].Liked++;
        }
        diary[i].formatLike = this.nFormatter(diary[i].Liked, 2);
        break;
      }
    }
    this.setData({
      diary: diary
    })
    console.log(this.data.diary);


    wx.request({
      url: app.globalData.webroot1 + '/index/user/likeDiary',
      method: "POST",
      data: {
        id: id,
        userId: userId,
        diaryId: id,
        type: type
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
    //弹幕
    clearInterval(cycle)
    ids = 0;
    doommList = []
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(cycle)
    ids = 0;
    doommList = []
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
    console.log("加载日记")
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 加载更多
   */
  loadMore: function () {
    var isMore = this.data.isMore;
    var that = this;
    if (isMore == 0) return;
    var staffId = this.data.staffId;
    var userId = this.data.userId;
    var pages = this.data.pages;
    var pageCount = this.data.pageCount;
    wx.request({
      url: app.globalData.webroot1 + '/index/user/getDiary',
      method: "POST",
      data: {
        staffId: staffId,
        userId: userId,
        pages: pages,
        pageCount: pageCount
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        var diary = res.data.msg;
        var isMore = that.data.isMore;
        var pageCount = that.data.pageCount;
        if (diary.length < pageCount) {
          isMore = 0;
        }
        var oldDiary = that.data.diary;
        var newDiary = oldDiary.concat(diary);
        var pages = that.data.pages;
        pages++;
        // 处理图片字符串，将字符串转化成数组
        for (var i = 0; i < diary.length; i++) {
          diary[i].formatLike = that.nFormatter(diary[i].Liked, 1);
          if (diary[i].Pic == null) continue;
          diary[i].Pic = diary[i].Pic.split(',');

          for (var j = 0; j < diary[i].Pic.length; j++) {
            diary[i].Pic[j] = app.globalData.webroot1 + '/static/images/uploads/' + diary[i].Pic[j];
          }
        }
        that.setData({
          diary: newDiary,
          pages: pages,
          isMore: isMore

        })
        console.log('----' + that.data.diary);
      }
    })
  },
  nFormatter: function (num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "W" },
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