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
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aaa:"",
    userInfo: {},
    webRoot: app.globalData.webroot,
    //轮播图片的
    swiperList: [],
    // 弹幕变量
    doommData: [],
    arr: [],
    bind_value:'',
    swipeIndex:'',
    serverData:'',   //服务项目信息
    staffData:'',     //技师信息
    firmData:'',       //机构信息
    customData:''      //顾客信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 点击发送弹幕按钮
  bindbt: function () {
    var that=this;
    // 把发送弹幕的内容放进arr数组中
    console.log("发送的弹幕是" + this.data.bind_value)
    let index = this.data.swipeIndex;
   
    console.log("index=" + index)
    //////
    var _value = this.data.bind_value;
    var _pokerId = JSON.parse(wx.getStorageSync("pokerIdList"))[index]["Id"];
    var _uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    var _nickname = app.globalData.userInfo.nickName;
    console.log(_value + "---" + index + "---" + _pokerId)
    //放入缓存中
    var _bullet = JSON.parse(wx.getStorageSync("bullet"));
    if (!_bullet[index]["text"]) {
      _bullet[index]["text"] = [_value];
      _bullet[index]["nickName"] = [_nickname];
    } else {
      _bullet[index]["text"].push(_value);
      _bullet[index]["nickName"].push(_nickname);
    }
    console.log(_bullet[index]);

    //村回到缓存中
    wx.setStorageSync("bullet", JSON.stringify(_bullet))
    console.log(wx.getStorageSync("bullet"))
    console.log(JSON.parse(wx.getStorageSync("bullet")));
    //////////////////////////////////////////////
    //弹幕
    
    that.bulletFun();
    //弹幕结束
   

   

  

    this.setData({
      bind_value: "",

    })



  },
  //绑定发射输入框，将值传递给data里的bind_shootValue，发射的时候调用
  bind_shoot: function (e) {
    this.setData({
      bind_value: e.detail.value,
    })
  }, 

  onLoad: function (options) {
    var that = this; 
   
    console.log("2222222222222222222222222222222");
    console.log(options.lists)
    // console.log(options.otherStaffAndFirmList['firmName'])
    // console.log(JSON.stringify(options.otherStaffAndFirmList))
    console.log(JSON.parse(options.lists))
  
     // 从pokerindex接收的 接收穿过来的关于机构技师等的参数
    console.log("1111111111111111111")
  
    
    var bullet = JSON.parse(options.lists)['bullet'];
    console.log(bullet);
   
    var swipeIndex = JSON.parse(options.lists)['swipeIndex'];
    console.log(swipeIndex)
   
    //给 swipeIndex赋值
    that.setData({
      swipeIndex: swipeIndex
    })
   
   //把技师机构id等信息发给server端
    wx.request({
      url: app.globalData.webroot + '/index/poker/getPokerDetail', //仅为示例，并非真实的接口地址
      method: "get",
      data: {
        firmId: JSON.parse(options.lists)['firmId'],
        staffId: JSON.parse(options.lists)['staffId'],
        customerId: JSON.parse(options.lists)['customerId'],
        serviceId: JSON.parse(options.lists)['serviceId'],
        uid: JSON.parse(options.lists)['uid'],
        pokerId: JSON.parse(options.lists)['pokerid'],
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("@@@@@@@@@@@@@@@")
        console.log(res.data);
        console.log(res.data.msg['City']);
        //整理的服务项目数据
        var serverLists={
          serviceName: JSON.parse(options.lists)['serviceName'],
          serviceDiscription:res.data.msg['Discription'],
          serviceTime:res.data.msg['Duration'],
        }
        //整理的技师信息数据
        console.log(2222222222222222);
        console.log(JSON.parse(options.lists));
        var staffLists={
          staffAvatar: JSON.parse(options.lists)['avatar'],
          staffName: JSON.parse(options.lists)['nickName'],
          ifFollower:res.data.msg['iffollower'],  //是否关注 0-没有 1-有
          satisfection: JSON.parse(options.lists)['satisfection'],  //评分
          experience: JSON.parse(options.lists)['experience'],   //接单数
          like:res.data.msg['WorkLike'],   //赞
          pigeonStaff:res.data.msg['PigeonStaff'],     //爽约！！！！！！！要问一下
          skills:res.data.msg['SkillName'],            //擅长  数组
          skillsCount: res.data.msg['SkillName'].length
        }  
        // 机构信息
        var firmLists={
          firmName: JSON.parse(options.lists)['firmName'],  //机构名字
          firmAddr:res.data.msg['Province']+res.data.msg['City']+res.data.msg['District']+res.data.msg['FirmAddr'],
          firmCert: JSON.parse(options.lists)['firmCert'],   //机构类型
          firmType: JSON.parse(options.lists)['firmType'],  
          dis: JSON.parse(options.lists)['dis'],      //距离
          staffs: JSON.parse(options.lists)['staffs'],  //成员数
          proTitle: JSON.parse(options.lists)['proTitle']  //活动
        }
        //顾客信息
        var customLists={
          customAvatat:res.data.msg['customerAvatar'],  //顾客头像
          customNickName:res.data.msg['customerNickName'],  //顾客昵称
          customDiscription: res.data.msg['Discription'],  //顾客评价
        }
        var laterimg = res.data.msg['laterimg'];
        var pokerPicList = res.data.msg['pokerPic'];
        console.log("图片列表是-----")
        console.log(pokerPicList);
        console.log(pokerPicList[0])
        var imgsArr=[];
        for (var i = 0; i < pokerPicList.length;i++){
          console.log(pokerPicList[i])
          if (pokerPicList[i]['imgname']!=""){
            imgsArr.push(pokerPicList[i])
          }
        }
        console.log('第一个是---'+imgsArr[0]['imgname'])
        that.setData({
          swiperList: imgsArr,
          aaa: laterimg
        })
        console.log('整理后的json格式得图片List' + JSON.stringify(imgsArr));
        // experience: undefined
       // ifFollower: 0
       // like: 0
       // pigeonStaff: 0
       // satisfection: undefined
        //skills: (4)["美发", "美睫/眉", "化妆", "美甲"]
        //staffAvatar: undefined
       // staffName: undefined
        that.setData({
          serverData:serverLists,
          staffData: staffLists,
          firmData: firmLists,
          customData: customLists
        })
        console.log("!!!!!!!!!!!!!!!")
       
      }
    })

    //滑块信息
    // var swiperList = [{
    //   id: 1,
    //   type: 'image',
    //   url: 'hand.png',
    //   // url: this.data.webRoot + '/static/images/index/hand.png'
    // }, {
    //   id: 0,
    //   type: 'image',
    //   // url: this.data.webRoot + '/static/images/index/test1.jpg',
    //   url: 'test1.jpg'
    // },

    // {
    //   id: 1,
    //   type: 'image',
    //   // url: this.data.webRoot + '/static/images/index/test2.jpg',
    //   url: 'test2.jpg'
    // },
      
    // ];
    // this.data.swiperList = swiperList
    // 头像
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
    };
    //轮播图片
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
    // 弹幕onload 

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
    
    // var bullet = otherstaffAndFirmIdList['bullet'];
    // bullet=JSON.parse(bullet);
    //弹幕
    that.bulletFun();
   
    // 弹幕结束


    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bulletFun:function(){
    var that=this;
    var currentObj = JSON.parse(wx.getStorageSync("bullet"))[that.data.swipeIndex];
    // 显示弹幕 
    console.log("---发送弹幕-----------" + that.data.swipeIndex + "----doommList.length=")

    console.log(currentObj)
    if (currentObj == undefined) return;
    if (!currentObj["text"]) return;

    let arr = [];
    for (var m = 0; m < currentObj["text"].length; m++) {
      console.log("text=" + currentObj["text"][m] + "----" + currentObj["nickName"][m])
      var _obj = {
        text: currentObj["text"][m],
        nickname: currentObj["nickName"][m],
      }
      arr.push(_obj)
    }
    console.log("弹幕arr==============" + arr);
    console.log(arr)
    that.setData({
      arr: arr
    })
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
  // 发送弹幕  
  // bindbt: function () {
  //   console.log("------------")
  //   // var that=this;

  //   // 把发送弹幕的内容放进arr数组中
  //   console.log(this.data.bind_value)
  //   doommList.push(new Doomm(this.data.bind_value, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
  //   this.setData({
  //     doommData: doommList
  //   });
  //   //arr
  //   this.data.arr.push(this.data.bind_value);   //发送的内容
  // },
  //绑定发射输入框，将值传递给data里的bind_shootValue，发射的时候调用
  // bind_shoot: function (e) {
  //   this.setData({
  //     bind_value: e.detail.value,
  //   })


  //   console.log(this.data.bind_value)
  //   doommList.push(new Doomm(this.data.bind_value, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor()));
  //   this.setData({
  //     doommData: doommList
  //   });
  //   //arr
  //   this.data.arr.push(this.data.bind_value);

  //   this.setData({
  //     bind_value: "",
  //     // showView: false     // 设置发送完弹幕隐藏按钮
  //   })
  //   // this.setData({
  //   //   bind_value: e.detail.value
  //   // })
  //   console.log("发过后总的弹幕内容是---------");
  //   console.log(this.data.doommData);
  // },
  //////////////////////轮播图片
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

  },
  backhome: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})