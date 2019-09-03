// pages/index/index/mapauth/mapauth.js
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'YHSBZ-GCNCQ-4L25N-GVXEC-N4U5S-VRBWT' // 必填
});
// 地图
const app = getApp()  

const markersize = 30

function range(start, edge, step) {
  for (var ret = [];
    (edge - start) * step > 0; start += step) {
    ret.push(start);
  }
  return ret;
}

function markers(northeast, southwest, scale, width, height) {

  const markerslng = (northeast.longitude - southwest.longitude) * markersize / width
  const markerslat = (northeast.latitude - southwest.latitude) * markersize / height

  const maxlon = northeast.longitude
  const minlon = southwest.longitude
  const maxlat = northeast.latitude
  const minlat = southwest.latitude

  const lons = range(minlon, maxlon, markerslng)
  const lats = range(minlat, maxlat, markerslat)

  let _markers = []
  lons.forEach((lon, i) => {
    lats.forEach((lat, j) => {
      _markers.push({
        id: lon + ',' + lat,
        latitude: lat,
        longitude: lon,
        iconPath: app.globalData.webroot+'/static/images/index/star_black.png',
        alpha: 0, //将图片设置为透明,通过开发者工具看不出效果,但真机是有效果的
        width: markersize,
        height: markersize
      })
    })
  })
  return _markers
}

Page({
 

  /**
   * 页面的初始数据
   */
  data: {
    showmap:false,
    allShow:true,
    // 地图
    polygons: [],
    controls: [{
      id: 1,
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    markers: [],
    // 地图
    region: ['广东省', '广州市', '海珠区'],
    poi: "",
    markers:[]
  },
  // 地图
  createMarkers() {

    this.mapCtx = wx.createMapContext('map')
    const query = wx.createSelectorQuery()
    const map = query.select('#map').boundingClientRect()

    let that = this

    that.mapCtx.getRegion({
      success(res1) {
        that.mapCtx.getScale({
          success(res2) {
            query.exec((res) => {
              let width = res[0].width;
              let height = res[0].height;
              let _markers = markers(res1.northeast, res1.southwest, res2.scale, width, height)
              that.data.markers = _markers
              that.setData(that.data)
            })
          }
        })
      }
    })
  },
  regionchange(e) {
    this.createMarkers()
  },
  // 得到经纬度
  markertap(e) {
    console.log(e.markerId);
    var latAndLng = e.markerId.split(",");
    console.log("-----"+latAndLng[0]);
    var longitude = latAndLng[0];    //经度
    var latitude = latAndLng[1];   //纬度 39.
   
    //得到地址
   
    // 测试
    var that = this;   
    var locationString = latitude + "," + longitude;  
    wx.request({  
      url: 'http://apis.map.qq.com/ws/geocoder/v1/?l&get_poi=1',  //根据经纬度转换成具体地址
      data: {
        "key": "YHSBZ-GCNCQ-4L25N-GVXEC-N4U5S-VRBWT",
        "location": locationString
      },
      method: 'GET',
      // header: {},
      success: function (res) {
        // success
        console.log("请求成功");
        console.log("请求数据省:" + res.data.result.address_component.province);
        console.log("市--" + res.data.result.address_component.city)
        console.log("区--" + res.data.result.address_component.district + res.data.result.address_component.street)
        console.log(res.data.result);
        console.log(res.data);
      
        var addresslist = [res.data.result.address_component.province, res.data.result.address_component.city, res.data.result.address_component.district + res.data.result.address_component.street]
        var obj = JSON.parse(wx.getStorageSync("user"));
        obj["noLogin"] = {
          lat: latitude,
          lng: longitude,   
          region: addresslist
        }
        wx.setStorageSync("user", JSON.stringify(obj));
        console.log("!!!!!!!!!!!!")
        console.log(wx.getStorageSync("user"))
        if (wx.getStorageSync("user")) {
          if (JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"]) {
            //读取缓存中的userinfo是否存在如果存在就把当前的选择的城市信息写入数据库再跳到pokeIndex
            wx.request({
              url: app.globalData.webroot +'/index/userlogin/UpdateUserCity', //仅为示例，并非真实的接口地址
              method: "get",
              data: {
                uid: JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"],
                region: JSON.stringify(obj["noLogin"])
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                console.log(res.data);
              }
            })
   
            wx.navigateTo({
              url: '/pages/index/poker/pokerIndex/pokerIndex',
            })
            // return;
          }
        }
        // wx.redirectTo({
        //   url: '/pages/index/poker/pokerIndex/pokerIndex',
        // })
      },
      fail: function () {
        // fail
        console.log("请求失败");
      },
      complete: function () {
        // complete
        console.log("请求完成");
      }
    })
    // 测试结束
   
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onReady(e) {
    this.createMarkers()
  },
  // 地图
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
// 自己的
intomap:function(){
  var that = this;
  that.setData({
    showmap: true,
    allShow:false
  })



 
},
// 
  getgo:function(){
      // 点击授权定位
      
    wx.openSetting({

      success: function (res) {

        if (res.authSetting["scope.userLocation"] == true) {
            console.log("true----")
          wx.showToast({

            title: '授权成功',

            icon: 'success',

            duration: 1000,
            

          })

          //再次授权，调用wx.getLocation的API
        setTimeout(function(){
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
                        region:[]
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


                  //跳转setup
                  wx.navigateTo({
                    url: '/pages/index/poker/pokerIndex/pokerIndex',
                  })




                }
              })



        },1000)
         

        } else {
          console.log("false----")
          wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 1000
          })

        }

      }

    })


  },
  goto:function(){
       //选择的地址暂时记录到缓存中
       //
    //this.data.region
    //得通过省市区得到经纬度
   this.getLnglat()

    
  },
  getLnglat:function(){
    var addr = this.data.region[0] + this.data.region[1] + this.data.region[2];
    var _this=this;
    
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: addr, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;   //纬度
        var longitude = res.location.lng;

        console.log(latitude + "---" + longitude)
        
        ////把数据存到缓存中
        if(!wx.getStorageSync("user")){
          console.log("不存在")
          var obj={
            noLogin: {
              lat: latitude,
              lng: longitude,
              region: _this.data.region
            },
            userinfo:{}
          }

          var objstr = JSON.stringify(obj);
          console.log(objstr)
          wx.setStorageSync("user", objstr)
        }else{
          console.log("存在")
            //读取
          var obj = JSON.parse(wx.getStorageSync("user"));
          obj["noLogin"] = {
            lat: latitude,
            lng: longitude,
            region: _this.data.region
          }
          wx.setStorageSync("user", JSON.stringify(obj));


          console.log(wx.getStorageSync("user"))

        }

      
        if (wx.getStorageSync("user")) {
          if (JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"]) {
            //读取缓存中的userinfo是否存在如果存在就把当前的选择的城市信息写入数据库再跳到pokeIndex
            wx.request({
              url: app.globalData.webroot +'/index/userlogin/UpdateUserCity', //仅为示例，并非真实的接口地址
              method: "get",
              data: {
                uid: JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"],
                region: JSON.stringify(obj["noLogin"])
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
              console.log(res.data);
              }
            })

            wx.navigateTo({
              url: '/pages/index/poker/pokerIndex/pokerIndex',
            })
            return;
          }
        }

        // //跳转setup
        // wx.navigateTo({
        //   url: '/pages/index/setup/setup',
        // })
       
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  


    wx.chooseLocation({
      success: function (res) {
        console.log("-111111111111------------")
       console.log(res);
      }
    });
    // console.log("((((((((((((("+wx.getStorageSync("user"))
      //判断缓存中region---把之前选择的自主城市信息关联到界面上
    if (wx.getStorageSync("user") && JSON.parse(wx.getStorageSync("user"))["noLogin"]){
      if (JSON.parse(wx.getStorageSync("user"))["noLogin"]["region"]==undefined||JSON.parse(wx.getStorageSync("user"))["noLogin"]["region"].length>0){
        
        this.setData({
          region: JSON.parse(wx.getStorageSync("user"))["noLogin"]["region"]
        })
        
      }
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