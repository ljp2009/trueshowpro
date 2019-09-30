//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    addr: '请选择位置',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,   
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },   
  onLoad: function () {  
    var that = this;   
    //先从缓存读取用户的信息是否存在
      // wx.removeStorageSync("user");
    if(wx.getStorageSync("user")){
      if (JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"]){
        
          //用户存在的情况 需要验证是否地理授权过
        // 地理位置
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
                          region: obj["noLogin"]["region"]
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
            }else{
              ////////用户已经存在缓存中并且地理授权成功了 也需要读取地址来更新region
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  const latitude = res.latitude
                  const longitude = res.longitude
                  
                  //读取
                  var obj = JSON.parse(wx.getStorageSync("user"));
                  obj["noLogin"] = {
                    lat: latitude,
                    lng: longitude,
                    region: obj["noLogin"]["region"]
                  }
                  wx.setStorageSync("user", JSON.stringify(obj));

                  //更新了经纬度之后跳转到pokerindex
                  wx.navigateTo({
                    url: '/pages/index/poker/pokerIndex/pokerIndex',
                  })

                }
              })
            }
          }
        })


      }else{
        //跳转setup用户不存在 在缓存中
        wx.navigateTo({
          url: '/pages/index/setup/setup',
        })
      }
     return
    }
    wx.navigateTo({
      url: '/pages/index/setup/setup',
    })

    // /////////////////////缓存不存在用户授权///////////////////
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
    





  },
  
  onShow: function () {

  } 
})
