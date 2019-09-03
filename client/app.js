//app.js
App({
  onLaunch: function () {  

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that=this;
    
    // 获取用户信息   
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("---用户同意授权---")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {  
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              console.log(this.globalData.userInfo)

              
            }
          })
        }  else{
          console.log("---用户不同意授权----")
        }
      }
    }),
      wx.getSystemInfo({ 
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let custom = wx.getMenuButtonBoundingClientRect();
          this.globalData.Custom = custom;
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      })
    
   
     
  },
  //
  

  // 地理位置结束
  onShow:function() {
   // console.log(this.globalData.userInfo)
    
  },
  onHide:function(){
    var that=this;
    console.log("推出了小程序11111");

    //更新用户在数据库表中的最后在线时间

    //更新当前用户的最后在线时间
    //传用户id
    if (JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"]) {
      //读取缓存中的userinfo是否存在如果存在就把当前的选择的城市信息写入数据库再跳到pokeIndex
      wx.request({
        url: that.globalData.webroot+'/index/userlogin/UpdateUserLastLoginTime', //仅为示例，并非真实的接口地址
        method: "get",
        data: {
          uid: JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"],
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data);
        }
      })

      var staffLevel = JSON.parse(wx.getStorageSync("user"))["userinfo"]["staffLevel"];
      var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
      ///判断用户是否是技师 技师需要写入技师在线表
      if (staffLevel >= 2) {
        //该用户是技师
        wx.request({
          url: that.globalData.webroot + '/index/userlogin/ifInsertStaffOnline',
          data: {
            StaffId: uid,//技师id
            type: 0  // 1-上线 0-下线
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
    }


  },
  onUnload:function(){
    console.log("推出了小程序");
    wx.request({
      url: 'http://trueshow/index/userlogin/testunLoad',
      method:"get",
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data)
        // console.log(res.data.msg)
      }
    })
  },
  globalData: {
    webroot: "http://ljp.jujiaoweb.com",
    userInfo: null,
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  },
  data: {
    addServiceOne: "block",
    addServiceTwo: "none"
  }
})