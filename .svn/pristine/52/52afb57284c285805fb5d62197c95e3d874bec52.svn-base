// pages/index/poker/pokerDetail/pokerDetail.js
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图片的
    swiperList: [{
      id: 0,
      type: 'image',
      url: '../../../../assets/images/index/poker/1.jpg'
    }, {
      id: 1,
      type: 'image',
        url: '../../../../assets/images/index/poker/44.jpg',
    }],
    // 弹幕变量
    doommData: [],
    arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //轮播图片
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
    // 弹幕onload 
    var that = this;
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
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 弹幕js
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
     // showView: false     // 设置发送完弹幕隐藏按钮
    })
    // this.setData({
    //   bind_value: e.detail.value
    // })
  },
  //轮播图片
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
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