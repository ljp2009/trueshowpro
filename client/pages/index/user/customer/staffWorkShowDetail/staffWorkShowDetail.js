// pages/index/user/staff/staffWorkShowDetail/staffWorkShowDetail.js
const app = getApp();
// 弹幕js
var that = undefined;
var doommList = [];
var i = 0;
var ids = 0;
var cycle = null  //计时器
// 弹幕参数
class Doomm {
  constructor(text, top, time, color) {  //内容，顶部距离，运行时间，颜色（参数可自定义增加）
    this.text = text["text"];
    this.nickname = text["nickname"];
   // this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    this.id = i++;
  }
}
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
    // 星星
    stars1: [{
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '非常不满意，各方面都很差'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '不满意，比较差'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      flag: 0,
      message: '一般，还要改善'
    }],
    imgs: [
      "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522069454.jpg",
      "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2522778567.jpg",
      "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2523516430.jpg",
    ],
    webRoot: app.globalData.webroot, 
    serviceName:"",  //服务项目名称
    swiperIndex:0,  //当前的滑块
    favorDate:"",  //收藏的时间
    staffInfo:"",  //技师信息
    // 弹幕变量
    bulletsArr:[],  //临时的弹幕
    doommList: [],
    doommData: [],
    arr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    // 弹幕
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

    //得到穿过来的pokerId staffId
    var pokerId = options.pokerId;
    var staffId = options.staffId;
    var favorDate = options.favorDate;
    console.log('pokerId=======' + pokerId + 'staffId==' + staffId + 'favorDate==' + favorDate)
    //得到详细信息
    wx.request({
      //url: app.globalData.webroot + '/index/user/getFavorDetail ',
      url: app.globalData.webroot1 + '/index/user/getFavorDetail',
      method: "post",
      data: {
        staffId:staffId,
        pokerId: pokerId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var serverData = res.data.msg['serverData']; //服务项目
        var bullets = res.data.msg['bullets'];     //弹幕
        var staffInfo = res.data.msg['staffInfo'];  //技师信息
        var satisfection = staffInfo['Satisfection'] / 10;//评分
        var num = Math.round(satisfection);//四舍五入分
        staffInfo['stars'] = num;     //给staffInfo增加一个键 stars
        console.log("小星星---"+num)
        console.log('技师信息---'+staffInfo);
        var customerPic = JSON.parse(res.data.msg['serverData']['CustomerPic']);  //整理顾客上传的图片
        var staffPic = JSON.parse(res.data.msg['serverData']['StaffPic']);  //整理顾客上传的图片
       // console.log(that.data.webRoot + '/static/images/index/' + staffPic.main);
        var picList = res.data.msg['picList'];  //图片
        var laterimg = picList['laterimg'];
        var pokerPicList = picList['finalPokerPic'];
        console.log("图片列表是-----")
        console.log(pokerPicList);
        console.log(pokerPicList[0])
        var imgsArr = [];
        for (var i = 0; i < pokerPicList.length; i++) {
          console.log(pokerPicList[i])
          if (pokerPicList[i]['imgname'] != "") {
            imgsArr.push(pokerPicList[i])
          }
        }
        console.log('第一个是---' + imgsArr[0]['imgname'])
        console.log('---'+imgsArr);
        console.log(JSON.stringify(imgsArr))  //为了方便看
       
        console.log('弹幕是---'+bullets)
        console.log(JSON.stringify(bullets))
        that.setData({
          imgs: imgsArr,
          aaa: laterimg,
          staffInfo:staffInfo,
          bulletsArr: bullets
        })
        // console.log(that.data.imgsArr);
        // console.log(that.data.aaa)
        // console.log(that.data.bulletsArr);
        console.log(bullets.length+'----------------')
        // 弹幕
        let arr = [];
        if (bullets.length==0) return;
        for (var m = 0; m < bullets.length; m++) {
          console.log("text=" + bullets[m]["text"] + "----" + bullets[m]["nickName"])

          var _obj = {
            text: bullets[m]["text"],
            nickname: bullets[m]["nickName"],
          }
          arr.push(_obj)
        }

        console.log(arr)
     
      
        clearInterval(cycle)
        cycle = setInterval(function () {
          // let arr = [22,3,4,4]
          var _currentTop = Math.ceil(10 + Math.random() * 60);
          // console.log(doommList.length)
          if (doommList.length > 1) {

            var _lastTop = doommList[doommList.length - 1].top;

            if (Math.abs(_currentTop - _lastTop) < 30) {

              _currentTop = _currentTop + 30;

            }
          }




          if (arr[ids] == undefined) {
            ids = 0
            // 1.循环一次，清除计时器


            // 2.无限循环弹幕  内容，顶部距离，运行时间，颜色（参数可自定义增加）



            doommList.push(new Doomm(arr[ids], _currentTop, 5, '#ffffff'));
            if (doommList.length > 10) {   //删除运行过后的dom
              doommList.splice(0, 1)
            }
            that.setData({
              doommData: doommList
            })
            ids++
          } else {




            //内容，顶部距离，运行时间，颜色（参数可自定义增加）
            doommList.push(new Doomm(arr[ids], _currentTop, 5, '#ffffff'));
            if (doommList.length > 10) {
              doommList.splice(0, 1)
            }
            that.setData({
              doommData: doommList
            })
            ids++
          }
        }, 1000)
        console.log(that.data.doommData);
        // 弹幕结束
        // var imgs=[];
        // imgs.push(that.data.webRoot + '/static/images/index/' + staffPic.main, that.data.webRoot + '/static/images/index/' + staffPic.vicefir, that.data.webRoot + '/static/images/index/' + staffPic.vicefir, that.data.webRoot + '/static/images/index/' + staffPic.vicefir, that.data.webRoot + '/static/images/index/' + staffPic.vicefir, that.data.webRoot + '/static/images/index/' + staffPic.vicefir, that.data.webRoot + '/static/images/index/' + staffPic.vicefir, that.data.webRoot + '/static/images/index/' + staffPic.vicefir)
        console.log(serverData)
        that.setData({
          serviceName: serverData.ServiceName
        })


        


      }
    })
   

    that.setData({
      favorDate: favorDate
    })
   
  },
  //点击回退
  backIndex:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  // 弹幕
  bullet: function () {
   var that=this;
    let arr = [];
    var bulletsArr = that.data.bulletsArr;
    console.log(bulletsArr);
   
    for (var m = 0; m < currentObj["text"].length; m++) {
      console.log("text=" + currentObj["text"][m] + "----" + currentObj["nickName"][m])

      var _obj = {
        text: currentObj["text"][m],
        nickname: currentObj["nickName"][m],
      }
      arr.push(_obj)
    }

    console.log(arr)
    var that = this;
    clearInterval(cycle)
    cycle = setInterval(function () {
      // let arr = [22,3,4,4]
      var _currentTop = Math.ceil(10 + Math.random() * 60);
      // console.log(doommList.length)
      if (doommList.length > 1) {

        var _lastTop = doommList[doommList.length - 1].top;

        if (Math.abs(_currentTop - _lastTop) < 30) {

          _currentTop = _currentTop + 30;

        }
      }




      if (arr[ids] == undefined) {
        ids = 0
        // 1.循环一次，清除计时器


        // 2.无限循环弹幕  内容，顶部距离，运行时间，颜色（参数可自定义增加）



        doommList.push(new Doomm(arr[ids], _currentTop, 5, '#ffffff'));
        if (doommList.length > 10) {   //删除运行过后的dom
          doommList.splice(0, 1)
        }
        that.setData({
          doommData: doommList
        })
        ids++
      } else {




        //内容，顶部距离，运行时间，颜色（参数可自定义增加）
        doommList.push(new Doomm(arr[ids], _currentTop, 5, '#ffffff'));
        if (doommList.length > 10) {
          doommList.splice(0, 1)
        }
        that.setData({
          doommData: doommList
        })
        ids++
      }
    }, 1000)
    console.log(that.data.doommData);
  },
  swiperChange:function(e){
    var that=this;
    that.setData({
      swiperIndex: e.detail.current
    })
    console.log(e.detail.current)
    console.log(that.data.swiperIndex)

  },
  // 弹幕
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
  // 点击<回退事件
  backStaffWorkShow:function(){
    console.log("点击了回退");
    wx.navigateTo({
      url: '../staffWorkShow/staffWorkShow'
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