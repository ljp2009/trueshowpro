const hSwiper = require("../../../../component/hSwiper/hSwiper.js");
// 弹幕js
var that = undefined;
var doommList = []
var i = 0;
var ids = 0;
var cycle = null  //计时器  

// 弹幕参数
class Doomm {
  constructor(text, top, time, color, headImg) {  //内容，顶部距离，运行时间，颜色（参数可自定义增加）
    this.text = text["text"];
    this.nickname = text["nickname"];
    this.top = top;
    this.time = time;
    this.color = color;
    // this.headImg = headImg;
    this.display = true;
    this.id = i++;
  }
}
const app = getApp();
Page({
  data: {
    webRoot:app.globalData.webRoot,
    save1:false,
    saveView:1,  //收藏按钮隐藏 显示
    favormsg:"",
    ifloading: 0,
    bbb:'',
    doommList: [],
    staffAndFirmIdList: '',
    otherStaffAndFirmList: '',
    advandPokerPoint: 2,
    // 星星
    num: 0,
    disShow: false,  //千米标签隐藏
  
    imgUrls: [

    ],
    // 第一次进入提示
    ifShow: false,
    hiddenName: "flex",   //第一此flex代表显示
    // 显示星级
    stars: [{
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      // flag: 1,
      message: '非常不满意，各方面都很差'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      // flag: 0,
      message: '不满意，比较差'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      // flag: 0,
      message: '一般，还要改善'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      // flag: 0,
      message: '一般，还要改善'
    }, {
      lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
      blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
      // flag: 0,
      message: '一般，还要改善'
    }],
    webRoot: app.globalData.webroot,
    // 滑块的
    imgs: [],
    userInfo: {},           //用户头像
    PageCur: 'show',      //当前是秀页面 是show
    smallIndex: 0,
    bigIndex: 0,
    swipeIndex: 0,   //记录的是当前2张图片滑动到了第几张
    // 弹幕变量
    doommData: [],
    arr: [],

    bind_value: "",
    // 弹幕变量结束
    // 发送弹幕显示隐藏
    showView: false,
    currentPokerList: [],   //临时的晒单的数组
    currentAdList: [],      //临时的广告的数组
    currentCommentList: [],  //临时的广告的数组
    backIndex: -1,
    sliderVal: 5,   //公里数
    disnone: 1,
    objectArray:[
      { "name": "秀", "id": "0" },
      { "name": "约", "id": "1" },
      { "name": "问", "id": "2" },
      { "name": "我", "id": "3" }
    ],
    showDatas:2
   
  },
  swiperChange(e) {
   
    doommList = [];
    this.setData({
      doommList: [],
      doommData: []
    })

    clearInterval(cycle);

    console.log(e.detail.current)
    
    var that = this;
    if ((e.detail.current) < (this.data.swipeIndex + 1)) {
      that.setData({
        backIndex: e.detail.current
      })
      that.bullet()
      return;
    }
    that.setData({
      backIndex: -1
    })
    ///当this.data.swipeIndex=0的时候直接从上次获取的数据中获取数据即可,

    var _list = JSON.parse(wx.getStorageSync('pokerIdList'));

    if (that.data.bigIndex < (_list.length - 1) && (this.data.swipeIndex % 2 == 0 || this.data.swipeIndex == 1)) {
      console.log(wx.getStorageSync('pokerIdList'));

      //////当this.data.swipeIndex=1的时候
      ///需要从服务器端继续获取数据存储到currentPokerList，currentAdList，currentCommentList
      var userArr = wx.getStorageSync("user");
      var lat = JSON.parse(userArr)["noLogin"]["lat"];//纬度
      var lng = JSON.parse(userArr)["noLogin"]["lng"];//经度
      var km = JSON.parse(userArr)["userinfo"]["km"];//公里数
      var mySubCat = JSON.parse(userArr)["userinfo"]["mySubCat"];//分类
      var staffLevel = JSON.parse(userArr)["userinfo"]["staffLevel"];//隶属状态
      var uid = JSON.parse(userArr)["userinfo"]["uid"];

      var _arr = []
      // if (!JSON.parse(wx.getStorageSync('pokerIdList'))[that.data.swipeIndex + 1]){
      //   _arr = [JSON.parse(wx.getStorageSync('pokerIdList'))[that.data.swipeIndex]]
      // }else{
      _arr = [JSON.parse(wx.getStorageSync('pokerIdList'))[that.data.bigIndex], JSON.parse(wx.getStorageSync('pokerIdList'))[that.data.bigIndex + 1]]
      // }


      //获取两条数据
      wx.request({
        url: app.globalData.webroot + '/index/poker/getPokerData', //仅为示例，并非真实的接口地址
        method: "get",
        data: {
          loadingPokerId: _arr,

          'uid': uid,
          lat: lat,
          lng: lng,
          km: km
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res);
         
          that.setData({
            currentPokerList: res.data.msg.pokerarr,
            currentAdList: res.data.msg.adarr,
            currentCommentList: res.data.msg.currentUserPoker
          })

          that.parseData();
          console.log("获取两条数据------------")
         


        }
      })

      // this.data.swipeIndex=0;
      this.data.swipeIndex++;
    } else {
      this.data.swipeIndex++;
    }
    console.log("this.data.swipeIndex=" + this.data.swipeIndex)
    if ((that.data.bigIndex >= (_list.length - 1))) {
      this.getPokerIdList()
    }

    console.log("----滑动了-----" + this.data.swipeIndex)
    that.bullet()
    console.log("@@@@@@@@@@@@@@@@@@@@");
    console.log(this.data.imgs);
    //得到看过的晒单传给后端
    console.log("准的数据是--------------------")
    console.log(this.data.imgs[this.data.swipeIndex]);

    // console.log(this.data.imgs[this.data.swipeIndex-1])

    var hasSeenPokerId = this.data.imgs[this.data.swipeIndex - 1]['pokerid'];
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    console.log(this.data.imgs[this.data.swipeIndex - 1]['pokerid'])
    console.log(uid);

    wx.request({
      url: app.globalData.webroot + '/index/poker/insertPoker_access',
      data: {
        uid: uid,
        pokerId: hasSeenPokerId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        // console.log(res.data.msg)
      }
    })


  },
  aaa:function(){
    console.log("aaaaaaaaaaaaaaaaaaa")
  },
  /**
* 生命周期函数--监听页面显示
*/
  onShow: function () {
    console.log("onshow---------")
    var that=this;
    that.parseData();
    
    // console.log("重新进入了----")
    // that.setData({
    //   imgs:that.data.imgs[that.data.swipeIndex]
    // })
    // console.log(that.data.swipeIndex);
   
    // if (!this.data.isClose) {
    //   this.onLoad();
    // }
  },
  onLoad: function (options) {
    console.log("进入了onload------")
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    // 用户选择的Km数
    if (!wx.getStorageSync('userChooseKm')) {
      wx.setStorageSync('userChooseKm', that.data.sliderVal);
    }
    console.log(wx.getStorageSync('userChooseKm'));
    that.setData({
      sliderVal: wx.getStorageSync('userChooseKm')
    })
    // 读取pokerIdArr 
    var imgList = {
      'main': 'http://ljp.jujiaoweb.com/static/images/index/hand.png',
      'sec': 'http://ljp.jujiaoweb.com/static/images/index/test.jpg',
      'third': 'http://ljp.jujiaoweb.com/static/images/index/test2.jpg'
    }


    //读取pokerIdArr结束    
    console.log(wx.getStorageSync("user"));
    var userArr = wx.getStorageSync("user");
    var lat = JSON.parse(userArr)["noLogin"]["lat"];//纬度
    var lng = JSON.parse(userArr)["noLogin"]["lng"];//经度
    var km = JSON.parse(userArr)["userinfo"]["km"];//公里数
    var mySubCat = JSON.parse(userArr)["userinfo"]["mySubCat"];//分类
    var staffLevel = JSON.parse(userArr)["userinfo"]["staffLevel"];//隶属状态
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    console.log(lat + "--" + lng + "---" + km + "---" + typeof mySubCat);
    ///判断用户是否是技师 技师需要写入技师在线表
    if (staffLevel >= 2) {
      //该用户是技师
      wx.request({
        url: app.globalData.webroot + '/index/userlogin/ifInsertStaffOnline',
        data: {
          StaffId: uid,//技师id
          type: 1  // 1-上线 0-下线
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          // console.log(res.data.msg)
        }
      })
    }


    that.getPokerIdList();





    // 弹幕模态框
    var that = this;
    that.setData({
      modalName: 'Modal'
    })
    //模态框结束


    // 弹幕内容发送显示隐藏
    showView: (options.showView == "true" ? false : true)
    //**********************************************************
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
    that.onShow(options.bookid);
  },
  getPokerIdList: function () {
    var that = this;
    var userArr = wx.getStorageSync("user");
    var lat = JSON.parse(userArr)["noLogin"]["lat"];//纬度
    var lng = JSON.parse(userArr)["noLogin"]["lng"];//经度
    var km = JSON.parse(userArr)["userinfo"]["km"];//公里数
    var mySubCat = JSON.parse(userArr)["userinfo"]["mySubCat"];//分类
    var staffLevel = JSON.parse(userArr)["userinfo"]["staffLevel"];//隶属状态
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    ////获取晒单id的集合
    //请求晒单数据
    wx.request({
      url: app.globalData.webroot + '/index/poker/getSeriesPoker', //仅为示例，并非真实的接口地址
      method: "get",
      data: {
        uid: uid,
        lat: lat,//纬度
        lng: lng,//经度
        km: km, //公里数
        mySubCat: mySubCat   //分类
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log(res.data);
        var code = res.data.code;
        var pokerIdData = res.data.msg;   //pokerIdList
        //console.log(pokerIdData);

        if (pokerIdData.length == 0) {
          //没有获取到一条晒单 需要给用户页面展示 当前无晒单数据
          that.setData({
            ifloading: 2 //表示没有数据
          })
          console.log("---没有数据")
          wx.hideLoading();
          return;
        }

        if (!wx.getStorageSync('pokerIdList')) {
          wx.setStorageSync("pokerIdList", JSON.stringify(pokerIdData));
        } else {
          var pokerList = JSON.parse(wx.getStorageSync('pokerIdList'));
          pokerList = pokerList.concat(pokerIdData);
          console.log(pokerList)
          wx.setStorageSync("pokerIdList", JSON.stringify(pokerList));
        }

        console.log(wx.getStorageSync('pokerIdList'));
        console.log("that.data.swipeIndex====" + that.data.swipeIndex)

        //获取两条数据
        wx.request({
          url: app.globalData.webroot + '/index/poker/getPokerData', //仅为示例，并非真实的接口地址
          method: "get",
          data: {
            loadingPokerId: [JSON.parse(wx.getStorageSync('pokerIdList'))[that.data.swipeIndex], JSON.parse(wx.getStorageSync('pokerIdList'))[that.data.swipeIndex + 1]],

            'uid': uid,
            lat: lat,
            lng: lng,
            km: km
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            //在获取到数据 加载完成
            that.setData({
              ifloading: 1
            })
            if (that.data.ifloading == 1) {
              wx.hideLoading()
            }
            that.setData({
              currentPokerList: res.data.msg.pokerarr,
              currentAdList: res.data.msg.adarr,
              currentCommentList: res.data.msg.currentUserPoker
            })
            console.log("准备获取两条数据--------------")
            that.parseData();



          }
        })




      }
    })
  },
  ///////////////////////
  parseData: function () {
   
    ////解析从服务器端获取的数据
    console.log("!!!!!!!!!!!!!!!!!!!!!!!");
    var that = this;
   
    while (that.data.smallIndex < that.data.currentPokerList.length) {
      //晒单  
      console.log("晒单----");
      var userArr = wx.getStorageSync("user");
      var uid = JSON.parse(userArr)["userinfo"]["uid"];
      console.log(that.data.currentPokerList[that.data.smallIndex]);
      console.log(that.data.currentPokerList[that.data.smallIndex]['PokerId']) + '----' + uid;
      // console.log(JSON.parse(that.data.currentPokerList[that.data.smallIndex])['pokerId'] + 'uid-----' + uid);   

      var item = that.data.currentPokerList[that.data.smallIndex];

      console.log(that.data.imgs[that.data.swipeIndex]);
    //  console.log(typeof that.data.imgs[that.data.swipeIndex])
    //  
      console.log("正确的值是----------")
      
      var proTitle = item['ProTitle'];
      console.log("优惠活动是----" + proTitle);
      console.log(JSON.stringify(proTitle));
    //[{"Title":"单笔满减","StartTime":"2019-09-03 10:38:00","EndTime":"2019-09-20 10:38:00"},{"Title":"折扣","StartTime":"2019-09-03 10:38:00","EndTime":"2019-09-20 10:38:00"}]
      console.log(proTitle.length)
      var activityList = [];     
      if (proTitle.length==0){
          activityList=[]
      }else{
        console.log(proTitle[0]['Title'])
        for (var i = 0; i < proTitle.length;i++){
          activityList.push(proTitle[i]['Title'])
        }
      }
      console.log("整理的优惠是----")
      console.log(activityList)
    
     

      console.log(item);
     
      var staffCert1 = item["StaffPic"];    //主图
      console.log("图片是-------------------" + staffCert1)
      console.log("---------" + JSON.parse(staffCert1))
  
     // console.log(JSON.parse(staffCert1)[0]['main'])
      //[{"img":"20190909\/3aa18f5e2c64f6590d547f69e2446d69.jpg","seq":"0"}]
      var comment = that.data.currentCommentList;  //评价
      console.log(that.data);
      console.log("======")
      console.log("comment=============" + comment);
      if (comment == null) {
        comment = ""
      }
    
      var satisfection = item['Satisfection'] / 10;//评分
      var num = Math.round(satisfection);//四舍五入分
      console.log(Math.round(num));
      var starArr = [{
        lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
        // flag: 1,
        message: '非常不满意，各方面都很差'
      }, {
        lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
        // flag: 0,
        message: '不满意，比较差'
      }, {
        lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
        // flag: 0,
        message: '一般，还要改善'
      }, {
        lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
        // flag: 0,
        message: '一般，还要改善'
      }, {
        lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
        blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
        // flag: 0,
        message: '一般，还要改善'
      }];

      for (var i = 0; i < starArr.length; i++) {
        if (i < num) {
          starArr[i]["flag"] = 1;
        } else {
          starArr[i]["flag"] = 0;
        }

      }

      var firmObg = {
        type: 1,    //1是晒单,
        firmId: item['pFirmId'],  //机构id
        staffId: item['pStaffId'], //技师id
        customerId: item['CustomerId'],  //顾客id
        serviceId: item['ServiceId'],  //服务项目id
        uid: uid,
        firmName: item['FirmName'],
        firmCert: item['FirmCert'],
        firmType: item['FirmType'],
        proTitle: activityList,
        staffs: item['Staffs'],
        staffPic: JSON.parse(staffCert1).main,
        nickName: item['NickName'],
        vatar: item['Avatar'],
        experience: item['Experience'],   //经验值
        staffCert: item['StaffCert'],
        satisfection: item['Satisfection'],  //评分
        stars: starArr,
        serviceName: item['ServiceName'],     //服务项目名称
        bulletDiscription: item['bulletDiscription'],   //弹幕
        bulletNickName: item['bulletNickName'],
        comment: comment.Comment,
        pokerid: item['PokerId'],
        dis: item['dis'],
        swipeIndex: that.data.swipeIndex,
        bullet: wx.getStorageSync("bullet"), //弹幕
        iffavor: item['iffavor']

       

       

      }
      //
      console.log(firmObg);


      console.log('评分是-----------------' + firmObg.satisfection + "名字是---" + firmObg['firmName'])
      // ['satisfection']
     
      //把值传给detail
      // var otherStaffAndFirmList = {
      //   serviceName: item['ServiceName'],    //服务项目名称
      //   avatar: item['Avatar'],               //技师头像
      //   nickName: item['NickName'],          //技师昵称
      //   satisfection: item['Satisfection'],  //评分
      //   experience: item['Experience'],      //接单数
      //   firmName: item['FirmName'],          //机构名称
      //   firmCert: item['FirmCert'],       //机构类型
      //   ids: item['dis'],                 //距离
      //   staffs: item['Staffs'],           //机构成员数
      //   proTitle: item['ProTitle'],       //活动
      //   bullet: wx.getStorageSync("bullet"), //弹幕
      //   swiperIndex: that.data.swipeIndex,   //滑块的索引值


      // }
      // staffAndFirmIdList = JSON.stringify(staffAndFirmIdList);
      // otherStaffAndFirmList = JSON.stringify(otherStaffAndFirmList);
      //把值staffAndFirmIdList赋值
      // that.setData({
      //   staffAndFirmIdList: staffAndFirmIdList,
      //   otherStaffAndFirmList: otherStaffAndFirmList
      // })
      // wx.setStorageSync('otherStaffAndFirmList', otherStaffAndFirmList);
      console.log('需要传到detail页面的数据是----' + that.data.otherStaffAndFirmList);
      // 把需要传给detial的值付给一个变量
      // var staffAndFirmIdList = {
      //   firmId: item['pFirmId'],   
      //   staffId: item['pStaffId'],
      //   customerId: item['CustomerId'],
      //   serviceId: item['ServiceId'],
      //   uid:uid,
      //   pokerId: item['PokerId']
      // }


      console.log("获取弹幕--------------")
      console.log(item['bulletDiscription'] + item['bulletNickName'])

      //////////////////////////////////弹幕的缓存
      if ((item['bulletDiscription'].length == 1 && item['bulletDiscription'][0] == "") || (!item['bulletDiscription'])) {
        console.log("---不存在弹幕")
        if (!wx.getStorageSync("bullet")) {

          var _arr = [{}]
          wx.setStorageSync("bullet", JSON.stringify(_arr));
        } else {
          var _arr = JSON.parse(wx.getStorageSync("bullet"));
          _arr.push({});
          wx.setStorageSync("bullet", JSON.stringify(_arr));
        }
      } else {


        var _bulletObj = {
          text: item['bulletDiscription'],
          nickName: item['bulletNickName']
        }
        console.log(wx.getStorageSync("bullet"))
        if (!wx.getStorageSync("bullet")) {

          var _arr = [_bulletObj]
          wx.setStorageSync("bullet", JSON.stringify(_arr));
        } else {
          var _arr = JSON.parse(wx.getStorageSync("bullet"));
          _arr.push(_bulletObj);
          wx.setStorageSync("bullet", JSON.stringify(_arr));
        }

        console.log("缓存" + wx.getStorageSync("bullet"))

        var doommList = this.data.doommList;
        var _currentBulletObj = JSON.parse(wx.getStorageSync("bullet"))[this.data.swipeIndex];
        console.log(_currentBulletObj)
        if (_currentBulletObj && _currentBulletObj["text"]) {
          for (var k = 0; k < _currentBulletObj["text"].length; k++) {
            var _text = _currentBulletObj["text"][k];
            var _nickname = _currentBulletObj["nickName"][k];
            var _obj = {
              text: _text,
              nickname: _nickname
            }
            doommList.push(_obj);
          }
          console.log(doommList)
          that.setData({
            doommList: doommList,
            doommData: doommList
          })
        }

      }
      console.log("---------------缓存中的弹幕------" + wx.getStorageSync("bullet"))




      ///////////
      var oldImgsList = that.data.imgs;
      // console.log('数据是-----'+oldImgsList);
      oldImgsList[that.data.bigIndex] = firmObg;
      //oldImgsList.push(firmObg);
      that.setData({
        imgs: oldImgsList
      })
      that.data.smallIndex++;
      that.data.bigIndex++;
      // console.log(smallIndex);
    }

    if (that.data.smallIndex >= 2) {
      //两条数据都是晒单 不需要再走广告了
      that.setData({
        smallIndex: 0
      })

      that.bullet()
      return;
    }
    that.setData({
      smallIndex: 0
    })
    //需要继续读取广告
    console.log(that.data.smallIndex);
    while (that.data.smallIndex < that.data.currentAdList.length) {
      /////////////获取广告数据////////////
      console.log(that.data.currentAdList.length)
      var item = that.data.currentAdList[that.data.smallIndex];
      console.log("广告--------------")
      console.log(item);
      console.log(JSON.parse(item['MainPic'])['main'])
      //[{"img":"20190909\/3aa18f5e2c64f6590d547f69e2446d69.jpg","seq":"0"}]
      var firmObg = {
        ProTitle: item['ProTitle'],
        Certificated: item['Certificated'],
        type: 0,    //0是广告
        firmName: item['FirmName'],
        FirmType: item['FirmType'],
        Staffs: item['Staffs'],
        dis: item['dis'],
        mainPic: JSON.parse(item['MainPic'])['main']
      }

      console.log(firmObg);
      var oldImgsList = that.data.imgs;
      // console.log('数据是-----'+oldImgsList);
      oldImgsList[that.data.bigIndex] = firmObg;
      //oldImgsList.push(firmObg);
      that.setData({
        imgs: oldImgsList
      })
      that.data.smallIndex++;
      that.data.bigIndex++;
      // console.log(smallIndex);

    }
    that.setData({
      smallIndex: 0
    })

    that.bullet()
  },

  bullet: function () {
    var currentObj = JSON.parse(wx.getStorageSync("bullet"))[this.data.swipeIndex];
    if (this.data.backIndex != -1) {
      currentObj = JSON.parse(wx.getStorageSync("bullet"))[this.data.backIndex];
    }
    // 显示弹幕 
    console.log("---发送弹幕-----------" + this.data.swipeIndex + "----doommList.length=" + doommList.length)

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

    console.log(arr)
    var that = this;
    clearInterval(cycle)
    cycle = setInterval(function () {
      // let arr = [22,3,4,4]
      var _currentTop = Math.ceil(10+Math.random() * 60);
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
  },
  //km数选择成功点击事件
  sureKm: function () {
    var that = this;
    that.setData({
      disShow: !this.data.disShow
    })
    console.log("111111");
    // console.log(that.data.sliderVal);
    console.log(wx.getStorageSync('userChooseKm'));
    wx.setStorageSync('userChooseKm', that.data.sliderVal);
    console.log('更改后的缓存' + wx.getStorageSync('userChooseKm'));
    // 把更改后的km  uid传给server
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    wx.request({
      url: app.globalData.webroot + '/index/user/updateUserKm', //仅为示例，并非真实的接口地址
      method: "get",
      data: {
        uid: uid,
        km: that.data.sliderVal

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("更新了km数")
        console.log(res.data)
      }
    })

  },
  //千米数点击事件
  kmChange: function (e) {
    console.log("-------------");
    console.log(e.detail.value)
    // console.log(console.log('slider' + '发生change事件，携带值为', e.detail.value));
    var that = this;
    that.setData({
      sliderVal: e.detail.value
    })

  },
  jumpfirm:function(e){
    var firmId = e.currentTarget.dataset.firmid;
    console.log(firmId)
    wx.navigateTo({
      url: "/pages/index/firm/firmCard/firmMessage/firmMessage"
    })
  },



  // 滑块事件结束
  // 第一次进入的提示  
  firstLeadInfo: function () {
    this.setData({
      ifShow: false
    })
  },
  //点击弹幕  按钮事件
  onChangeShowState: function () {
    console.log("点击了弹幕按钮");
    var that = this;
    that.setData({
      showView: true
    })
  },
  // 弹幕
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
  // 点击发送弹幕按钮
  bindbt: function () {

    // 把发送弹幕的内容放进arr数组中
    console.log("发送的弹幕是" + this.data.bind_value)
    let index = this.data.swipeIndex;
    if (this.data.backIndex != -1) {
      index = this.data.backIndex;
    }
    console.log("index=" + index)
    //////
    var _value = this.data.bind_value;
    if(_value==""){
        console.log("发送的弹幕是空的----------");
     
      wx.showToast({
        title: '弹幕不能为空',//提示文字
        duration: 2000,//显示时长
        mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
        icon: 'none', //图标，支持"success"、"loading"  
        success: function () { },//接口调用成功
        fail: function () { },  //接口调用失败的回调函数  
        complete: function () { } //接口调用结束的回调函数  
      })
      var that = this;
      that.setData({
        showView: false
      })
      return;
    }
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

    this.bullet();


    //发送数据到server端
    wx.request({
      url: app.globalData.webroot + '/index/bullet/BulletSend', //仅为示例，并非真实的接口地址
      method: "get",
      data: {

        uid: _uid,
        pokerId: _pokerId,
        nickname: _nickname,
        des: _value,
        origin: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
      }
    })



    this.setData({
      bind_value: "",

    })



  },
  //绑定发射输入框，将值传递给data里的bind_shootValue，发射的时候调用
  bind_shoot: function (e) {

    this.setData({
      bind_value: e.detail.value,
    })



    this.setData({
      showView: false     // 设置发送完弹幕隐藏按钮
    })


  },
  // 跳到详情页面
  jumpDetail: function () {
    var that = this;
    console.log('发送数据' + that.data.imgs[that.data.swipeIndex])
    console.log(JSON.stringify(that.data.imgs[that.data.swipeIndex]))
    wx.navigateTo({
      url: '/pages/index/poker/pokerDetail/pokerDetail?lists=' + JSON.stringify(that.data.imgs[that.data.swipeIndex]),
    })


  },
  // 筛选事件
  jumpfilter: function () {
    console.log("00000filter")
    // 跳到筛选页面
    wx.navigateTo({
      url: '/pages/index/poker/pokerFilter/pokerFilter',
    })
  },
  jumpstaff: function () {
    console.log("11111111111")
    console.log()
    console.log(this.data.imgs[this.data.swipeIndex]['firmId'])
    var staffId=this.data.imgs[this.data.swipeIndex]['staffId'];
    var firmId = this.data.imgs[this.data.swipeIndex]['firmId'];
    // 点击技师头像的时候切换到技师的名片页
    // staffId  技师id    firmId   机构id
    wx.navigateTo({
      // url: '/pages/index/user/staff/staffCard/staffCard?staffId=' + staffId + '&&firmId=' + firmId
      url: '/pages/index/user/staff/staffCard/staffCard?staffId=' + 115 + '&&firmId=' + 90
    })
  },
  // 进入服务项目列表
  jumpServiceList: function () {
    wx.navigateTo({
      url: '/pages/index/firm/service/serviceList/serviceList'
    })
  },
  // 点击秀
  showPokers: function () {


  },
  // 约单页面
  jumpres: function () {
    wx.navigateTo({
      // url: '/pages/index/reservation/customer/reservationIndex/reservationIndex',
	  url:'/pages/index/poker/pokerIndex/pokerIndex',
    })
  },
  // 秀约问我的 点击事件
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
      wx.redirectTo({
        url: '/pages/index/poker/pokerIndex/pokerIndex',
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
      }else{
        //用户
        wx.navigateTo({
          url: '/pages/index/user/customer/index/index',
        })
      }

      
    }

  },
  //点击收藏按钮 
  //----收藏变橙色,写入晒单收藏表 //提示:已收藏
  //取消收藏 变白色，删除这条记录 //提示:已取消
  favor: function (e) {
    var that = this;
    var iffavor = e.currentTarget.dataset.iffavor;
    if (iffavor == 0) {
      iffavor = 1;
    } else {
      iffavor = 0;
    }
    console.log("---" + e.currentTarget.dataset.iffavor);
   
    var list = that.data.imgs[that.data.swipeIndex]
    console.log(list)
    list['iffavor'] = iffavor;
    // console.log(list['iffavor']);
    // console.log(list)
    var list1 = that.data.imgs;
    console.log(list1)
    that.setData({
      imgs: list1
    })
    console.log("--收藏");
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"]; //用户id
    var staffid = e.currentTarget.dataset.staffid;//技师id
    var pokerid = e.currentTarget.dataset.pokerid;
    console.log("---用户id=" + uid + "----技师id=" + staffid + "----晒单id=" + pokerid + "----act=" + iffavor);
    //请求后端
    wx.request({
      url: app.globalData.webroot + '/index/poker/PokerFavorite',
      method: "post",
      data: {
        pokerId: pokerid,//晒单id
        uid: uid,//用户id
        staffId: staffid,//技师id
        act: iffavor //执行动作 0---取消收藏 1--收藏
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var favormsg = res.data.msg;
        that.setData({
          saveView: 0,
          favormsg: favormsg
        })

        setTimeout(function(){
          that.setData({
            saveView: 1
          })
        },500)
      
      }
    })
  },

})