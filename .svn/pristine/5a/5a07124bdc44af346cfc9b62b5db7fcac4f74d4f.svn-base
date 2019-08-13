//滑块的js
const hSwiper = require("../../../../component/hSwiper/hSwiper.js");
// 弹幕js
var that = undefined;
var doommList = [];
var i = 0;
var ids = 0;
var cycle = null  //计时器

// 弹幕参数
class Doomm {
  constructor(text, top, time, color) {  //内容，顶部距离，运行时间，颜色（参数可自定义增加）
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    this.id = i++;
  }
}
// 弹幕字体颜色
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
const app = getApp();
var option = {
  data: {
    userInfo: {},           //用户头像
    PageCur: 'show',      //当前是秀页面 是show
    // 弹幕变量
    doommData: [],
    arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    bind_value: "",
    // 弹幕变量结束
    // 发送弹幕显示隐藏
    showView: false,
    //swiper插件变量
    hSwiperVar: {}
  },
  onLoad: function () {
  },
  onLoad: function (options) {
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
    var that = this;
    that.setData({
      modalName: 'Modal'
    })
    // 弹幕
    cycle = setInterval(function () {
      let arr = that.data.arr
      if (arr[ids] == undefined) {
        ids = 0
        // 1.循环一次，清除计时器
        // doommList = []
        // clearInterval(cycle)

        // 2.无限循环弹幕
        doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 100), 5, getRandomColor()));
        if (doommList.length > 5) {   //删除运行过后的dom
          doommList.splice(0, 1)
        }
        that.setData({
          doommData: doommList
        })
        ids++
      } else {
        doommList.push(new Doomm(arr[ids], Math.ceil(Math.random() * 100), 5, getRandomColor()));
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
  //点击弹幕按钮事件
  onChangeShowState: function () {
    console.log("点击弹幕事件");
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 点击 秀事件
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
    console.log("-----------")

    // var that=this;

    // 把发送弹幕的内容放进arr数组中
    console.log(this.data.bind_value)
    doommList.push(new Doomm(this.data.bind_value, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
    this.setData({
      doommData: doommList
    });
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
      bind_value: e.detail.value
    })
  },
  onReady: function () {
    // var list = [1, 2, 3, 4, 5];
    var list = [{ 'shopName': '美甲店' }, { 'shopName': '化妆店' }, { 'shopName': '护肤店' }, { 'shopName': '健身店' }, { 'shopName': '护肤店'}]
    var swiper = new hSwiper({ reduceDistance: 60, varStr: "hSwiperVar", list: list});

    swiper.onFirstView = function (data, index) {
      console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };
    swiper.onLastView = function (data, index) {
      console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };
    swiper.afterViewChange = function (data, index) {
      console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };
    swiper.beforeViewChange = function (data, index) {
      console.log("当前是第" + (index + 1) + "视图", "数据是：" + data);
    };

    //更新数据 
    setTimeout(() => {
      console.log("3 s 后更新列表数据");
      //3 s 后更新列表数据
      this.setData({
        "hSwiperVar.list[0]": "修改"
      });
    }, 3000);



    setTimeout(() => {
      console.log("5s后更新数据 并且更新视图");

      //5s后更新数据 并且更新视图
      var oldList = swiper.getList();
      swiper.updateList(oldList.concat([11, 23, 45]));
    }, 5000);

  }
};

Page(option);





  
  
