const hSwiper = require("../../../../component/hSwiper/hSwiper.js");

// 弹幕js
var that = undefined;
var doommList = [];
var i = 0;
var ids = 0;
var cycle = null  //计时器

// 弹幕参数
class Doomm {
  constructor(text, top, time, color,headImg) {  //内容，顶部距离，运行时间，颜色（参数可自定义增加）
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.headImg = headImg;
    this.display = true;
    this.id = i++;
  }
}
// 弹幕字体颜色
function getRandomColor() {
  // let rgb = []
  // for (let i = 0; i < 3; ++i) {
  //   let color = Math.floor(Math.random() * 256).toString(16)
  //   color = color.length == 1 ? '0' + color : color
  //   rgb.push(color)
  // }
  return '#ffffff' 
}   
const app = getApp();
Page({
  data: {

    // 第一次进入提示
    hiddenName: "flex",
    starDesc: '非常满意，无可挑剔',
    stars: [{
      lightImg: 'http://ljp.jujiaoweb.com/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/images/index/star_black.png',
      flag: 1,
      message: '非常不满意，各方面都很差'
    }, {
        lightImg: 'http://ljp.jujiaoweb.com/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/images/index/star_black.png',
      flag: 1,
      message: '不满意，比较差'
    }, {
        lightImg: 'http://ljp.jujiaoweb.com/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/images/index/star_black.png',
      flag: 1,
      message: '一般，还要改善'
      }, {
        lightImg: 'http://ljp.jujiaoweb.com/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/images/index/star_black.png',
        flag: 0,
        message: '一般，还要改善'
      }, {
        lightImg: 'http://ljp.jujiaoweb.com/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/images/index/star_black.png',
        flag: 0,
        message: '一般，还要改善'
      }],
    webRoot: app.globalData.webroot,
    data1:'data1的',
    // 滑块的
    imgs: [],
    userInfo: {},           //用户头像
    PageCur: 'show',      //当前是秀页面 是show
    // 弹幕变量
    doommData: [],
    arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

    bind_value: "",
    // 弹幕变量结束
    // 发送弹幕显示隐藏
    showView: false
  },
  onLoad: function (options) {
    ///////////////////////////缓存存个变量 看是不是第一次进入小程序
    wx.removeStorageSync("firstInto")
    if (wx.getStorageSync('firstInto')) {
      //不是第一次进入
      console.log("不是第一次进入");
      this.setData({
        hiddenName:"none"  
      })
      
    } else {
      console.log("第一次进入");
      //第一次进入
      // this.setData({
      //   hiddenName: "flex"
      // })
      wx.setStorageSync("firstInto", "123");
    } 
    // 背景图片
    var swiperList = [{
     
      'shopname': '美容美甲店',
      'url': this.data.webRoot + '/images/index/hand.png'
    }, {
     
      'shopname': '2健身店',
      'url': this.data.webRoot + '/images/index/test1.jpg',
    },
    {
     
      'shopname': '3美甲店',
      'url': this.data.webRoot + '/images/index/test2.jpg',
    }];
    this.setData({
      imgs: swiperList
    })
    // this.data.imgs = swiperList
    // 加载微信头像信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log(options);
    // 模态框
    var that = this;
    that.setData({
      modalName: 'Modal'
    }) 
    //模态框结束
    // 弹幕
    cycle = setInterval(function () {
      let arr = that.data.arr
      if (arr[ids] == undefined) {
        ids = 0
        // 1.循环一次，清除计时器
        // doommList = []
        // clearInterval(cycle)

        // 2.无限循环弹幕  内容，顶部距离，运行时间，颜色（参数可自定义增加）
        doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 100), 5, getRandomColor(), that.data.userInfo.avatarUrl));
        if (doommList.length > 5) {   //删除运行过后的dom
          doommList.splice(0, 1)
        }  
        that.setData({
          doommData: doommList
        })
        ids++
      } else {
        //内容，顶部距离，运行时间，颜色（参数可自定义增加）
        doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 100), 5, getRandomColor(), that.data.userInfo.avatarUrl));
        if (doommList.length > 5) {
          doommList.splice(0, 1)
        }
        that.setData({
          doommData: doommList
        })
        ids++
      }
    }, 1000)
    // 弹幕内容发送显示隐藏
    showView: (options.showView == "true" ? false : true)
  },
  // 第一次进入的提示
  firstLeadInfo: function () {
    console.log("---")
    this.setData({
      hiddenName: "none"
    })
  },
  //点击弹幕按钮事件
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 点击 秀 约 问 我 事件
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
    if (this.data.PageCur == 'reservation') {
      wx.navigateTo({
        url: '../../reservation/customer/reservationIndex/reservationIndex'
      })
    }
    console.log(this.data.PageCur);
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 弹幕的js
  onHide() {
    clearInterval(cycle)
    ids = 0;
    doommList = []
  },
  onUnload() {
    clearInterval(cycle)
    ids = 0;
    doommList = []
  },
  bindbt: function () {

    // var that=this;

    // 把发送弹幕的内容放进arr数组中
    console.log("发送的弹幕是"+this.data.bind_value)
    doommList.push(new Doomm(this.data.bind_value, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
    this.setData({
      doommData: doommList
    });
    console.log("data是============");
    console.log(this.data.doommList);
    //arr
    this.data.arr.push(this.data.bind_value);
    // this.setData({
    //   bind_value: "",
    //   showView: (!this.data.showView)     // 设置发送完弹幕隐藏按钮
    // })
    // 设置发送完弹幕隐藏按钮
    // this.setData({
    //   showView: (!this.data.showView)
    // })
  },
  //绑定发射输入框，将值传递给data里的bind_shootValue，发射的时候调用
  bind_shoot: function (e) {

    this.setData({
      bind_value: e.detail.value,
    })


    console.log(this.data.bind_value)
    doommList.push(new Doomm(this.data.bind_value, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
    this.setData({
      doommData: doommList
    });
    //arr
    this.data.arr.push(this.data.bind_value);

    this.setData({  
      bind_value: "",
      showView: false     // 设置发送完弹幕隐藏按钮
    })
  },
  jumpdetail:function(){
    // 跳转到晒单详情页面
    console.log("***********")
    wx.navigateTo({
      url: '/pages/index/poker/pokerDetail/pokerDetail',
    })
  },
  jumpfilter:function(){
    console.log("00000filter")
    // 跳到筛选页面
    wx.navigateTo({
      url: '/pages/index/poker/pokerFilter/pokerFilter',
    })
  },
  jumpstaff:function(){
    // 点击技师头像的时候切换到技师的名片页
    wx.navigateTo({
      url: '/pages/index/user/staff/staffCard/staffCard',
    }) 
  },
  jumpres: function () {
    console.log("&&&&&&&&")
    wx.navigateTo({
      url: '/pages/index/reservation/customer/reservationIndex/reservationIndex',
    })
  }

})