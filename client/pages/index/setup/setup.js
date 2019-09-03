// pages/index/setup/setup.js
var QRCode = require('../../../utils/weapp-qrcode.js');
var qrcode;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: "",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    type:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options["type"]){
      this.setData({
        type: options["type"]
      })
    }
    
  },
  // 同意授权事件
  getUserInfo: function (e) {
    console.log(e)
   
    console.log("获得用户的基本信息是");
    console.log(e.detail);
    if (e.detail.rawData != undefined) {
      var infoLists = JSON.parse(e.detail.rawData);
      // 得到了用户 信息   
      console.log(infoLists);
      console.log(infoLists.nickName);
      console.log(infoLists.avatarUrl);

      app.globalData.userInfo = e.detail.userInfo
      
      //pc///////////////////// 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId


        /////////////////////////////////////////server///
        var obj={}
          if (wx.getStorageSync("user")) {
            if (JSON.parse(wx.getStorageSync("user"))["noLogin"]["region"].length > 0) {
              obj = JSON.parse(wx.getStorageSync("user"))["noLogin"];
            }
          }
          var objstr=JSON.stringify(obj);

          wx.request({
            url: app.globalData.webroot+'/index/userlogin/WechatLogin', //仅为示例，并非真实的接口地址
            method: "get", 
            data: {
              code: res.code,
              nickName: infoLists.nickName,
              avatarUrl: infoLists.avatarUrl,
              gender: infoLists.gender,
              region: objstr
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
             // console.log(res.data);
              
              var code = res.data.code;
              var dataArr = res.data.msg;
              //console.log(typeof dataArr);
              //console.log(code);
              if (code == 1) {
                //console.log("----")
                //JSON.stringify(jsonobj); 转为json字符串
                var uid = dataArr["UserId"];//用户id
                var entry = dataArr["Entry"];//界面 0-顾客界面 1-技师界面
                var staffLevel = dataArr["StaffLevel"];//隶属状态
                var km = dataArr["km"];//用户选择的km数
                var mySubCat = dataArr["MySubCat"];//选择的分类顺序
               console.log("---setup里面的数"+new Date());
               
                
                ///////////往缓存user中写入数据
                ////把数据存到缓存中
                
                  //读取
                var obj ={}
                if (wx.getStorageSync("user")){
                  obj = JSON.parse(wx.getStorageSync("user"));
                }
                  
                  obj["userinfo"] = {
                    uid: uid,
                    entry: entry,
                    staffLevel: staffLevel,
                    km: km,
                    mySubCat: mySubCat,
                    nickName: infoLists.nickName,
                    avatarUrl: infoLists.avatarUrl,
                    gender: infoLists.gender,
                  }
                  wx.setStorageSync("user", JSON.stringify(obj));


                  console.log(wx.getStorageSync("user"))


                //检测地理授权///////////////////////////
                /////////////////////////获取用户位置//////////////////
                wx.getSetting({//先获取用户当前的设置
                  success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                      ////////进入地理授权
                      wx.authorize({
                        scope: 'scope.userLocation',
                        success(res) {
                          // 用户同意授权之后得到经纬度

                          console.log("用户同意授权");
                          console.log(res.errMsg);//用户授权后执行方法



                          //读取经纬度 存储到缓存中
                          //读取经纬度
                          wx.getLocation({
                            type: 'wgs84',
                            success(res) {
                              const latitude = res.latitude
                              const longitude = res.longitude
                              ////////存储到缓存中
                              ////把数据存到缓存中
                              if (!wx.getStorageSync("user")) {
                                console.log("不存在")
                                var obj = {
                                  noLogin: {
                                    lat: latitude,
                                    lng: longitude,
                                    region: []
                                  },
                                  userinfo: {}
                                }

                                var objstr = JSON.stringify(obj);
                                console.log(objstr)
                                wx.setStorageSync("user", objstr)
                              } else {
                                console.log("缓存存在")
                                //读取
                                var obj = JSON.parse(wx.getStorageSync("user"));
                                obj["noLogin"] = {
                                  lat: latitude,
                                  lng: longitude,
                                  region: []
                                }    
                                wx.setStorageSync("user", JSON.stringify(obj));


                                console.log(wx.getStorageSync("user"))

                              }

                              ///////////地理授权成功之后跳转到晒单首页
                              wx.navigateTo({
                                url: '/pages/index/poker/pokerIndex/pokerIndex',
                              })


                            }
                          })


                        },
                        fail(res) {
                          console.log("用户拒绝了");
                          //用户拒绝授权后跳转到引导用户地理授权的界面
                          wx.navigateTo({
                            url: '/pages/index/index/mapauth/mapauth',
                          })
                        }
                      })
                    }
                  }
                })

                
                

              }

            }
          })
        }
      })
     
    } else if (e.detail.rawData == undefined) {
      console.log("用户拒绝了授权");
      wx.navigateTo({
        url: '/pages/index/setup/setup?type=1',
      })
    }

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