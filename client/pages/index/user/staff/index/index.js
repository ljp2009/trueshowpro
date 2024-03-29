// pages/index/user/staff/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectArray: [
      { "name": "机", "id": "0" },
      { "name": "约", "id": "1" },
      { "name": "问", "id": "2" },
      { "name": "我", "id": "3" }
    ],
    firmId:0,  // 技师id
    staffId:0,  // 机构id
    info:{},
    pokerCount:0,
    marqueePace: 0.5,//滚动速度
    
    marquee2copy_status: true, // 没有用到
   
    orientation: 'left',//滚动方向
    interval: 30, // 时间间隔
    
    advan:{
      marqueeDistance2: 0,//初始滚动距离
      size: 14,  // 走马灯字体大小
      length: 0, // 走马灯擅长字符长度
    },
    realName:{
      marqueeDistance2: 0,//初始滚动距离
      size: 18,  // 走马灯字体大小
      length: 0, // 走马灯擅长字符长度
    },
    windowWidth:0,// 屏幕宽度
    avatar:"", // 头像
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    // var uid = 29;
    this.setData({
      firmId: uid
    })
    var that = this;
    // 获取技师的所有信息
    wx.request({
      url: app.globalData.webroot + '/index/user/getStaffById',
      method: "POST",
      data: {
        uid:uid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var data = res.data.msg;
        console.log(data);
        // 处理经验值 Experience  作品赞 WorkLike  关注数 Followers
        data.Experience = that.nFormatter(data.Experience,1);
        data.Fans = that.nFormatter(data.Fans, 1);
        data.WorkLike = that.nFormatter(data.WorkLike, 1);
        data.Satisfection = Math.round(data.Satisfection/10);// 星级评价
        data.Skill = data.Skill.join(',');
        var advan = that.data.advan;  // 走马灯 -- 擅长
        var realName = that.data.realName; // 走马灯 -- 真实姓名
        advan.length = data.Skill.length * advan.size;//走马灯 -- 擅长  文字长度
        realName.length = data.RealName.length * realName.size;//走马灯 -- 真实姓名    文字长度
        var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
        that.setData({
          info: data,
          advan:advan,
          windowWidth: windowWidth * 0.2,
          avatar:data.Avatar,
          realName: realName,
          staffId: data.FirmId
        })
        if (advan.length > that.data.windowWidth) {
          that.run1();// 水平一行字滚动完了再按照原来的方向滚动
        }
        if (realName.length > that.data.windowWidth) {
          that.run2();// 水平一行字滚动完了再按照原来的方向滚动
        }

      }
    })
    // 获取晒单作品数量
    wx.request({
      url: app.globalData.webroot + '/index/poker/countPokerByUser',
      method: "POST",
      data: {
        staffId: uid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var data = res.data.msg;
        that.setData({
          pokerCount: data
        })
      }
    })
  },
  
/**
 * changeAvatar  切换头像
 */
  changeAvatar: function (){
    console.log("切换头像")
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({ avatar: res.tempFilePaths })

        //
        var tempFilePaths = res.tempFilePaths
        console.log(that.data.avatar[0])
        wx.uploadFile({
          url: app.globalData.webroot + '/index/user/changeAvatar',
          filePath: tempFilePaths[0],
          name: 'avatar',
          formData: {
            userId:that.data.firmId,
            oldAvatar:that.data.avatar[0]
          },
          success: function (res) {
            var data = res.data
            console.log(data)
          }
        })

      },
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
  onShow: function (options) {
  },
  // 水平一行字滚动完了再按照原来的方向滚动
  run1: function () {
    var vm = this;
    var advan = this.data.advan;
    
    var interval = setInterval(function () {
      if (-(advan.marqueeDistance2) < (advan.length - vm.data.windowWidth)) {
        advan.marqueeDistance2 = advan.marqueeDistance2 - vm.data.marqueePace;
        vm.setData({
          advan: advan

        });
      } else {
        clearInterval(interval);
        advan.marqueeDistance2 = 20;
        vm.setData({
          advan:advan
        });
        vm.run1();
      }
    }, vm.data.interval);
  },
  // 水平一行字滚动完了再按照原来的方向滚动
  run2: function () {
    var vm = this;
    var realName = this.data.realName;

    var interval = setInterval(function () {
      if (-(realName.marqueeDistance2) < (realName.length - vm.data.windowWidth)) {
        realName.marqueeDistance2 = realName.marqueeDistance2 - vm.data.marqueePace;
        vm.setData({
          realName: realName

        });
      } else {
        clearInterval(interval);
        realName.marqueeDistance2 = 20;
        vm.setData({
          realName: realName
        });
        vm.run2();
      }
    }, vm.data.interval);
  },

  /**
   * 切换身份   修改entry的值为0
   */
  changeEntry: function(){
    console.log(123123123)
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    wx.request({
      url: app.globalData.webroot + '/index/user/changeEntry',
      method: "POST",
      data: {
        userId: uid,
        entry:0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
       
        wx.setStorageSync("entry", 0)
        wx.navigateTo({
          url: '/pages/index/user/customer/index/index'
        })
      }
    })
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
  switchTab: function (e) {
    let id = e.currentTarget.dataset.id,

      index = parseInt(e.currentTarget.dataset.index),
      num = parseInt(e.currentTarget.dataset.index),
      url = parseInt(e.currentTarget.dataset.url)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    console.log(e)
    var that = this
    this.setData({
      curNavId: id,
      curIndex: index,
      num: index

    })
    console.log(this.data.curIndex);
    if (this.data.curIndex == 0) {
      this.setData({
        num: 0
      })
      wx.navigateTo({
        url: '/pages/index/firm/firmIndex/firmIndex/firmIndex?firmId='+this.data.staffId,
      })
    } else if (this.data.curIndex == 1) {
      this.setData({
        num: 1
      })
      // wx.redirectTo({
      //   url: '/pages/index/reservation/customer/reservationIndex/reservationIndex',
      //   // url:"/pages/index/reservation/staff/modules/jordan/jordan"
      // })


      var entry = wx.getStorageSync("entry");
      if (entry == 1) {
        //技师
        wx.navigateTo({

          url: "/pages/index/reservation/staff/modules/jordan/jordan"
        })
      } else {
        //顾客
        wx.navigateTo({
          url: '/pages/index/reservation/customer/reservationIndex/reservationIndex'

        })
      }



    } else if (this.data.curIndex == 2) {
      this.setData({
        num: 2
      })
      wx.redirectTo({
        url: '/pages/index/qa/qaIndex/qaIndex',
      })
    } else {
      this.setData({
        num: 3
      })

      if (wx.getStorageSync("entry") == 1) {
        //技师
        wx.navigateTo({
          url: '/pages/index/user/staff/index/index',
        })
      } else {
        //用户
        wx.navigateTo({
          url: '/pages/index/user/customer/index/index',
        })
      }


    }

  },

})