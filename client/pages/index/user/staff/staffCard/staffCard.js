// pages/changeCar/detailsCar/index.js
const app = getApp();
var util = require('../../../../../utils/utils.js');
var common = require('../../../../../utils/common.js');
var interval = null //倒计时函数 x
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carDetail: [],
    fujin: [],
    back_address: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    zixun: [],
    content: "",
    color: "",
    arr: [],
    colorname: "",
    num: 0,
    modelid: '',
    selected: 0,
    selected1: 1,
    selected2: 2,
    selectedbody: true,
    selectedbody1: false,
    selectedbody2: false,
    curindex: 0,
    first_show: true,//第一次进来获取位置信息
    backDian: false,//从店铺列表页进来
    dianPrice: '',//店铺价格
    dianName: '',//店铺名称
    dianAddress: '',//店铺地址
    dianlatitude: '',//店铺经度
    dianlongitude: '',//店铺纬度
    shopid: '',
    buyType: 0,
    userInfo: {},
    carfirstpayment: '',
    months: '',
    carmonthpayment: '',
    firstpaymentratio: '',
    fangan: true,
    fanganxiugai: false,
    schemeid: '',
    daikuan: true,
    daikuanList: [],
    pay_all: true,//主页面显示
    daikuan_change: false,//贷款选择
    detailsCar: [],
    isallpay: false,
    weiguanzhu: true,
    yiguanzhu: false,
    zudailist: [],
    zudaipay: false,
    zudaigai: false,
    zudai: false,
    zucarfirstpayment: '',
    zumonths: '',
    zucarmonthpayment: '',
    zufirstpaymentratio: '',
    zudaikuan_change: false,
    zuschemeid: '',
    iszudai: true,
    feed_style: {
      x: "",
      y: "",
    },
    screen: {
      width: "",
      height: ""
    },
    // 用于保存屏幕页面信息
    preX: '',
    preY: '',
    car_store: true,
    pay_plan: true,
    allpiclist: ["http://image.autohuajiao.com/group1/M00/00/25/rBHLsV0inK6AXHHiAACtmSGvT_Q506.jpg", "http://image.autohuajiao.com/group1/M00/00/25/rBHLsV0inOOANjxzAAC_wBg9w7Y054.jpg", "http://image.autohuajiao.com/group1/M00/00/25/rBHLsV0inOOAUL8TAAC8tN33I_M238.jpg", "http://image.autohuajiao.com/group1/M00/00/25/rBHLsV0inOSAHec6AADVrmse7gE356.jpg"],
    iszixun: true,
    allbuy: true,
    likebuy: '立刻购买',
    fuceng: false,
    buycar: false,
    telphone: '',
    name: '',
    time: '',//验证码内容
    currentTime: 60,
    code: '',
    mycode: '',
    yourname: false,
    isname: false,
    yourtel: false,
    istel: false,
    havename: '',
    havetel: '',
    userid: '',
    buyliucheng: true,
    biaoshi: '',
    colorindex: "0",
    indexschemeid: '',
    issaoyisao: false,
    indexshopid: '',
    indexaddress: '',
    indexlatitude: '',
    indexlongitude: '',
    indexname: ''
  },
  selected: function (e) {
    this.setData({
      selectedbody1: false,
      selectedbody2: false,
      selectedbody: true,
      curindex: 0,
      buyType: 0,
      zudai: false,
      zudaipay: false,
      zudaigai: false,
      likebuy: '立刻购买',
      biaoshi: 1
    })
  },
  selected1: function (e) {
    this.setData({
      selectedbody: false,
      selectedbody1: true,
      selectedbody2: false,
      curindex: 1,
      buyType: 1,
      isallpay: true,
      zudai: false,
      zudaipay: false,
      zudaigai: false,
      likebuy: '预购申请',
      biaoshi: 2
    })
  },
  selected2: function (e) {
    this.setData({
      selectedbody: false,
      selectedbody1: false,
      selectedbody2: true,
      curindex: 2,
      buyType: 1,
      zudai: true,
      zudaipay: true,
      likebuy: '预购申请',
      biaoshi: 3
    })
  },
  topic: function () {
    wx.navigateTo({
      url: '../detailpic/index?modelid=' + this.data.modelid,
    })
  },
  guanzhu: function (e) {
    this.proccess(1);
  },
  guanzhu_proccess: function () {
    var that = this;
    var gData = app.globalData;
    wx.request({
      url: app.globalData.webroot + 'usermember/setfocusinfo',
      data: {
        modelid: that.data.modelid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Cookie": wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.status == "10000") {
          that.setData({
            weiguanzhu: false,
            yiguanzhu: true
          })
        }
      }
    })
  },
  smscode_proccess: function () {
    var that = this;
    wx.request({
      url: app.globalData.webroot + 'usermember/getsmscode',
      data: {
        phone: that.data.telphone
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Cookie": wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.status == 10000) {
          wx.showToast({
            title: '获取验证码成功',
            icon: 'none',
            duration: 2000
          })
          var currentTime = that.data.currentTime;
          interval = setInterval(function () {
            currentTime--;
            that.setData({
              time: currentTime + '秒'
            })
            if (currentTime <= 0) {
              clearInterval(interval)
              that.setData({
                time: '重新发送',
                currentTime: 60,
                disabled: false
              })
            }
          }, 1000);
          that.setData({
            code: res.data.data.smscode
          })
        }
      }
    })
  },
  tuanche_proccess: function () {
    var that = this;
    var newphone = ""
    var newname = ""
    var newcode = ""
    if (this.data.yourname == true) {
      newname = this.data.name
    } else {
      newname = wx.getStorageSync("name")
    }
    if (this.data.yourtel == true) {
      newphone = this.data.telphone
    } else {
      newphone = ""
    }
    if (this.data.iscode == true) {
      newcode = this.data.mycode
    } else {
      newcode = ""
    }
    wx.request({
      url: app.globalData.webroot + 'usermember/addmissioncar',
      data: {
        modelid: that.data.modelid,
        phone: newphone,
        username: newname,
        color: that.data.colorname,
        smscode: newcode
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Cookie": wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.status == 10000) {
          wx.setStorageSync("phone", that.data.newphone);
          wx.setStorageSync("name", that.data.newname);
          wx.showToast({
            title: '团车成功，稍后会有花椒工作人员与您联系，请耐心等待',
            icon: 'none',
            duration: 4000
          })
          that.setData({
            fuceng: false,
            buycar: false,
            name: '',
            telphone: '',
            mycode: ''
          })
        }
      }
    })

  },
  getnearbyshopinfo_proccess: function (options) {
    var that = this;

    wx.request({
      url: app.globalData.webroot + 'usermember/getnearbyshopinfo',
      data: {
        modelid: options.modelid,
        latitude: wx.getStorageSync("latitude"),
        longitude: wx.getStorageSync("longitude")
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Cookie": wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.data.length != 0) {
          that.setData({
            fujin: res.data.data,
            dianPrice: res.data.data[0].price,
            dianName: res.data.data[0].shopinfo.name,//店铺名称
            dianAddress: res.data.data[0].shopinfo.address,//店铺地址
            dianlatitude: res.data.data[0].shopinfo.latitude,//店铺经度
            dianlongitude: res.data.data[0].shopinfo.longitude,//店铺纬度
            shopid: res.data.data[0].shopid
          })
          if (that.data.pay_plan == false && that.data.daikuan == false && that.data.iszudai == false) {
            that.setData({
              allbuy: false
            })
          }
          if (that.data.allbuy == false) {
            that.setData({
              likebuy: '参与团车'
            })
          }
        }
      }
    })
  },

  placeorder_proccess: function () {
    var that = this;
    if (that.data.allbuy == true) {
      if (that.data.buyType == 0) {
        if (that.data.colorname == "") {
          that.setData({
            colorname: that.data.arr[0]
          })
        }
        wx.navigateTo({
          url: '../../myCenter/allPay/index?modelid=' + that.data.modelid + "&shopid=" + that.data.shopid + "&buyType=" + that.data.buyType + "&carname=" + that.data.carDetail.name + "&carpic=" + that.data.carDetail.pic + "&dianName=" + that.data.dianName + "&dianAddress=" + that.data.dianAddress + "&dianlatitude=" + that.data.dianlatitude + "&dianlongitude=" + that.data.dianlongitude + "&colorname=" + that.data.colorname,
        })
      } else if (that.data.buyType == 1) {
        if (that.data.colorname == "") {
          that.setData({
            colorname: that.data.arr[0]
          })
        }
        if (that.data.selectedbody2 == true) {
          if (that.data.issaoyisao == true) {
            that.setData({
              detailsCar: [{
                "modelid": that.data.modelid,
                'shopid': that.data.shopid,
                'buyType': that.data.buyType,
                'carfirstpayment': that.data.zucarfirstpayment,
                'months': that.data.zumonths,
                'carmonthpayment': that.data.zucarmonthpayment,
                'firstpaymentratio': that.data.zufirstpaymentratio,
                'schemeid': that.data.zuschemeid,
                'colorname': that.data.colorname,
                "carname": that.data.carDetail.name,
                "carpic": that.data.carDetail.pic,
                "dianName": that.data.indexname,
                "dianAddress": that.data.indexaddress,
                "dianlatitude": that.data.indexlatitude,
                "dianlongitude": that.data.indexlongitude
              }]
            })
          } else {
            that.setData({
              detailsCar: [{
                "modelid": that.data.modelid,
                'shopid': that.data.shopid,
                'buyType': that.data.buyType,
                'carfirstpayment': that.data.zucarfirstpayment,
                'months': that.data.zumonths,
                'carmonthpayment': that.data.zucarmonthpayment,
                'firstpaymentratio': that.data.zufirstpaymentratio,
                'schemeid': that.data.zuschemeid,
                'colorname': that.data.colorname,
                "carname": that.data.carDetail.name,
                "carpic": that.data.carDetail.pic,
                "dianName": that.data.dianName,
                "dianAddress": that.data.dianAddress,
                "dianlatitude": that.data.dianlatitude,
                "dianlongitude": that.data.dianlongitude
              }]
            })
          }

          wx.setStorageSync("detailsCar", that.data.detailsCar);
        } else {
          if (that.data.issaoyisao == true) {
            that.setData({
              detailsCar: [{
                "modelid": that.data.modelid,
                'shopid': that.data.shopid,
                'buyType': that.data.buyType,
                'carfirstpayment': that.data.carfirstpayment,
                'months': that.data.months,
                'carmonthpayment': that.data.carmonthpayment,
                'firstpaymentratio': that.data.firstpaymentratio,
                'schemeid': that.data.schemeid,
                'colorname': that.data.colorname,
                "carname": that.data.carDetail.name,
                "carpic": that.data.carDetail.pic,
                "dianName": that.data.indexname,
                "dianAddress": that.data.indexaddress,
                "dianlatitude": that.data.indexlatitude,
                "dianlongitude": that.data.indexlongitude
              }]
            })
          } else {
            that.setData({
              detailsCar: [{
                "modelid": that.data.modelid,
                'shopid': that.data.shopid,
                'buyType': that.data.buyType,
                'carfirstpayment': that.data.carfirstpayment,
                'months': that.data.months,
                'carmonthpayment': that.data.carmonthpayment,
                'firstpaymentratio': that.data.firstpaymentratio,
                'schemeid': that.data.schemeid,
                'colorname': that.data.colorname,
                "carname": that.data.carDetail.name,
                "carpic": that.data.carDetail.pic,
                "dianName": that.data.dianName,
                "dianAddress": that.data.dianAddress,
                "dianlatitude": that.data.dianlatitude,
                "dianlongitude": that.data.dianlongitude
              }]
            })
          }

          wx.setStorageSync("detailsCar", that.data.detailsCar);
        }
        wx.navigateTo({
          url: '../../myCenter/myCheck/index',
        })
      }
    } else {
      if (wx.getStorageSync("phone") != null || wx.getStorageSync("phone") != "") {
        that.setData({
          havetel: wx.getStorageSync("phone"),
          istel: true,
          yourtel: false,
          iscode: false
        })
      }
      if (wx.getStorageSync("phone") == "" || wx.getStorageSync("phone") == null) {
        that.setData({
          istel: false,
          yourtel: true,
          iscode: true
        })
      }
      if (wx.getStorageSync("name") != null || wx.getStorageSync("name") != "") {
        that.setData({
          havename: wx.getStorageSync("name"),
          isname: true,
          yourname: false
        })
      }
      if (wx.getStorageSync("name") == null || wx.getStorageSync("name") == "") {
        that.setData({
          isname: false,
          yourname: true
        })
      }
      that.setData({
        fuceng: true,
        buycar: true
      })
      if (that.data.colorname == "") {
        that.setData({
          colorname: that.data.arr[0]
        })
      }
    }
  },

  all_dian: function () {
    wx.navigateTo({
      url: '../detailsCar/moreStore/index?modelid=' + this.data.modelid + "&dianPrice=" + this.data.dianPrice + "&dianName=" + this.data.dianName + "&dianAddress=" + this.data.dianAddress + "&dianlatitude=" + this.data.dianlatitude + "&dianlongitude=" + this.data.dianlongitude,
    })
  },
  zixunPage: function (e) {
    wx.navigateTo({
      url: '../detailsCar/moreZixun/index?id=' + e.currentTarget.dataset.id,
    })
  },
  more_plan: function (e) {
    this.setData({
      pay_all: true,//主页面显示
      daikuan_change: true//贷款选择
    })
    for (var i = 0; i < this.data.daikuanList.length; i++) {
      if (e.currentTarget.dataset.firstpayment == this.data.daikuanList[i].firstpayment / 10000 && e.currentTarget.dataset.monthpayment == this.data.daikuanList[i].monthpayment && e.currentTarget.dataset.months == this.data.daikuanList[i].months) {
        this.setData({
          checked: i,
          cousedis: i,
        })
      }
    }
  },
  zumore_plan: function (e) {
    this.setData({
      pay_all: true,//主页面显示
      zudaikuan_change: true//贷款选择
    })
    for (var i = 0; i < this.data.zudailist.length; i++) {
      if (e.currentTarget.dataset.firstpayment == this.data.zudailist[i].firstpayment / 10000 && e.currentTarget.dataset.monthpayment == this.data.zudailist[i].monthpayment && e.currentTarget.dataset.months == this.data.zudailist[i].months) {
        this.setData({
          checked: i,
          cousedis: i,
        })
      }
    }
  },
  split_plan: function (e) {
    this.setData({
      carfirstpayment: e.currentTarget.dataset.firstpayment,
      firstpaymentratio: e.currentTarget.dataset.firstpaymentratio,
      carmonthpayment: e.currentTarget.dataset.monthpayment,
      months: e.currentTarget.dataset.months,
      schemeid: e.currentTarget.dataset.schemeid,
      pay_all: true,//主页面显示
      daikuan_change: false,//贷款选择
      fangan: false,
      fanganxiugai: true,
      checked: e.currentTarget.dataset.id,
      cousedis: e.currentTarget.dataset.id,
    })
  },
  zusplit_plan: function (e) {
    this.setData({
      zucarfirstpayment: e.currentTarget.dataset.firstpayment,
      zufirstpaymentratio: e.currentTarget.dataset.firstpaymentratio,
      zucarmonthpayment: e.currentTarget.dataset.monthpayment,
      zumonths: e.currentTarget.dataset.months,
      zuschemeid: e.currentTarget.dataset.schemeid,
      pay_all: true,//主页面显示
      zudaikuan_change: false,//贷款选择
      zudai: false,
      zudaigai: true,
      checked: e.currentTarget.dataset.id,
      cousedis: e.currentTarget.dataset.id,
    })
  },
  closebutton: function () {
    this.setData({
      daikuan_change: false//贷款选择
    })
  },
  zuclosebutton: function () {
    this.setData({
      zudaikuan_change: false//贷款选择
    })
  },
  more_peizhi: function () {
    wx.navigateTo({
      url: '../moreDetails/index',
    })
  },
  touchMoveChange(e) {
    var tmpx = parseInt(e.touches[0].clientX);
    var tmpy = parseInt(e.touches[0].clientY);
    if (tmpx <= 0 || tmpy <= 0 || tmpx >= this.data.screen.width || tmpy >= this.data.screen.height) {

    } else {
      if (tmpx != this.data.preX || tmpy != this.data.preY) {
        this.data.preX = tmpx
        this.data.preY = tmpy
        this.setData({
          feed_style: {
            x: (this.data.screen.width - tmpx - 40) + "px",
            y: tmpy - 40 + "px",
          }
        })
      }
    }
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  initdata: function (res, that) {
    var zudailist = []
    var daikuanlist = []
    if (res.length != 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].properties == 1) {
          zudailist.push(res[i])
        } else {
          daikuanlist.push(res[i])
        }
      }
      if (zudailist.length != 0) {
        for (var i = 0; i < zudailist.length; i++) {
          if (that.data.indexschemeid != "" && that.data.indexschemeid == zudailist[i].schemeid) {
            that.setData({
              zudailist: zudailist,
              zucarfirstpayment: zudailist[i].firstpayment,
              zufirstpaymentratio: zudailist[i].firstpaymentratio,
              zucarmonthpayment: zudailist[i].monthpayment,
              zumonths: zudailist[i].months,
              zuschemeid: zudailist[i].schemeid,
            })
          } else {
            that.setData({
              zudailist: zudailist,
              zucarfirstpayment: zudailist[0].firstpayment,
              zufirstpaymentratio: zudailist[0].firstpaymentratio,
              zucarmonthpayment: zudailist[0].monthpayment,
              zumonths: zudailist[0].months,
              zuschemeid: zudailist[0].schemeid,
            })
          }
        }
      } else {
        that.setData({
          iszudai: false
        })
      }
      if (daikuanlist.length != 0) {
        for (var i = 0; i < daikuanlist.length; i++) {
          if (that.data.indexschemeid != "" && that.data.indexschemeid == daikuanlist[i].schemeid) {
            that.setData({
              daikuanList: daikuanlist,
              carfirstpayment: daikuanlist[i].firstpayment,
              firstpaymentratio: daikuanlist[i].firstpaymentratio,
              carmonthpayment: daikuanlist[i].monthpayment,
              months: daikuanlist[i].months,
              schemeid: daikuanlist[i].schemeid,
            })
          } else {
            that.setData({
              daikuanList: daikuanlist,
              carfirstpayment: daikuanlist[0].firstpayment,
              firstpaymentratio: daikuanlist[0].firstpaymentratio,
              carmonthpayment: daikuanlist[0].monthpayment,
              months: daikuanlist[0].months,
              schemeid: daikuanlist[0].schemeid,
            })
          }
        }

      } else {
        that.setData({
          daikuan: false
        })
      }
    }
    else {
      that.setData({
        iszudai: false,
        daikuan: false
      })
    }
  },

  proccess: function (proccesstype) {
    var that = this;
    wx.request({
      url: app.globalData.webroot + 'usermember/userstatus',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.status == 99998)  //没登陆
        {
          wx.getUserInfo({
            success: function (resuserinfo) {
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  wx.request({
                    url: app.globalData.webroot + 'usermember/usermemberlogin',
                    data: {
                      wxcode: res.code,
                      wxuserinfo: JSON.stringify(resuserinfo.userInfo),
                      username: "",
                      password: "",
                      phone: "",
                      smscode: "",
                      //scene: wx.getStorageSync("scene")
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      if (res.data.status == "10000") {
                        wx.setStorageSync("token", res.header["Set-Cookie"]);
                        wx.setStorageSync("openid", res.data.data.openid);
                        wx.setStorageSync("userid", res.data.data.userid);
                        wx.setStorageSync("name", res.data.data.name);
                        wx.setStorageSync("phone", res.data.data.phone);

                        if (proccesstype == 1) {
                          that.guanzhu_proccess();
                        }
                        if (proccesstype == 2) {
                          that.smscode_proccess();
                        }
                        if (proccesstype == 3) {
                          that.tuanche_proccess();
                        }
                        if (proccesstype == 4) {
                          that.placeorder_proccess();
                        }
                      }
                    }
                  })
                }
              })
            }
          })
        }
        else {
          wx.setStorageSync("openid", res.data.data.openid);
          wx.setStorageSync("userid", res.data.data.userid);
          wx.setStorageSync("name", res.data.data.name);
          wx.setStorageSync("phone", res.data.data.phone);
          if (proccesstype == 1) {
            that.guanzhu_proccess();
          }
          if (proccesstype == 2) {
            that.smscode_proccess();
          }
          if (proccesstype == 3) {
            that.tuanche_proccess();
          }
          if (proccesstype == 4) {
            that.placeorder_proccess();
          }
        }
      }
    })

  },
  getnearbyshopinfo: function (options, e) {
    var that = this;
    var latitude = wx.getStorageSync("latitude");
    var longitude = wx.getStorageSync("longitude");

    if (latitude == undefined || longitude == undefined) {
      that.getlocation(options);
    }
    else if (options.latitude != undefined && options.longitude != undefined) {
      wx.setStorageSync("latitude", options.latitude);
      wx.setStorageSync("longitude", options.longitude);

      this.setData({
        first_show: false,
        backDian: true,
        back_address: [
          { "latitude": options.latitude },
          { "longitude": options.longitude },
          { "name": options.name },
          { "address": options.address }
        ],
        dianPrice: options.dianPrice,
        dianName: options.name,//店铺名称
        dianAddress: options.address,//店铺地址
        dianlatitude: options.latitude,//店铺经度
        dianlongitude: options.longitude,//店铺纬度
        shopid: options.shopid,
      })
    }
    else {
      that.getnearbyshopinfo_proccess(options);
    }
  },
  getwxlocation: function (that, options) {
    //调用wx.getLocation的API,获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //记录经纬度
        wx.setStorageSync("latitude", res.latitude);
        wx.setStorageSync("longitude", res.longitude);

        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude

        that.getnearbyshopinfo_proccess(options);
      },
      fail: function (res) {
      }
    })
  },
  getlocation: function (options) {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '你的位置信息将用于小程序位置接口的效果展示',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      that.getwxlocation(that, options);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          that.getwxlocation(that, options);
        }
        else {
          that.getwxlocation(that, options);
        }
      }
    })
  },
  getinformation: function (options) {
    var that = this;
    //资讯接口
    wx.request({
      url: app.globalData.webroot + 'usermember/getcarinformation',
      data: {
        modelid: options.modelid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Cookie": wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.data.length == 0) {
          that.setData({
            iszixun: false
          })
        } else {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].content.length > 42) {
              res.data.data[i].content = res.data.data[i].content.substring(0, 42) + "......"
            }
          }
          that.setData({
            zixun: res.data.data,
          })
        }

      }
    })
  },
  getcardetailinfo: function (options) {
    var that = this;
    //汽车详情接口
    wx.request({
      url: app.globalData.webroot + 'usermember/getcardetailinfo',
      data: {
        modelid: options.modelid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Cookie": wx.getStorageSync('token')
      },
      success: function (res) {
        //金融数据
        that.initdata(res.data.data.carLoanSchemeInfo, that);
        //汽车数据
        that.setData({
          carDetail: res.data.data,
          color: res.data.data.color,
        })
        //汽车幅图
        var allpic = [];
        for (var i = 0; i < res.data.data.carpictlist.length; i++) {
          allpic.push(res.data.data.carpictlist[i].smallpic)
        }
        allpic.unshift(res.data.data.smallpic)
        that.setData({
          allpiclist: allpic
        })
        //汽车销售店
        if (that.data.carDetail.sellershopinfo.length == 0) {
          that.setData({
            car_store: false,
            pay_plan: false
          })
        }
        //汽车颜色
        var arr = that.data.color.split(',');
        that.setData({
          arr: arr
        })
        for (var i = 0; i < arr.length; i++) {
          if (i == that.data.colorindex) {
            that.setData({
              num: i
            })
          }
        }
        if (that.data.pay_plan == false && that.data.daikuan == false && that.data.iszudai == false) {
          that.setData({
            allbuy: false
          })
        }
        if (that.data.allbuy == false) {
          that.setData({
            likebuy: '参与团车'
          })
        }

      }
    })

  },
  setbuttoninfo: function (options) {
    var that = this;
    if (this.data.dianPrice == "" && options.biaoshi == 2) {
      this.setData({
        selectedbody: false,
        selectedbody1: true,
        selectedbody2: false,
        curindex: 1,
        buyType: 1,
        isallpay: true,
        zudai: false,
        zudaigai: false,
      })
    }
    if (this.data.dianPrice == "" && options.biaoshi == 3) {
      this.setData({
        selectedbody: false,
        selectedbody1: false,
        selectedbody2: true,
        curindex: 2,
        buyType: 1,
        isallpay: false,
        zudai: true,
      })
    }
    if (options.biaoshi == 1) {
      this.setData({
        likebuy: '立刻购买'
      })
    }
    if (options.biaoshi == 2) {
      this.setData({
        selectedbody: false,
        selectedbody1: true,
        selectedbody2: false,
        curindex: 1,
        buyType: 1,
        isallpay: true,
        likebuy: '预购申请'
      })
    }
    if (options.biaoshi == 3) {
      this.setData({
        selectedbody: false,
        selectedbody1: false,
        selectedbody2: true,
        curindex: 2,
        buyType: 1,
        zudai: true,
        zudaipay: true,
        likebuy: '预购申请'
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("userid") != "") {
      wx.setStorageSync("scene", "originid=" + wx.getStorageSync("userid") + "&origin=0")
    }
    var that = this;
    if (options.schemeid != undefined) {
      this.setData({
        colorindex: options.colorindex,
        indexschemeid: options.schemeid,
        indexshopid: options.shopid,
        issaoyisao: true,
        car_store: false
      })
      wx.request({
        url: app.globalData.webroot + 'usermember/getshopinfobyshopid',
        data: {
          shopid: options.shopid
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "Cookie": wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res)
          that.setData({
            shopid: res.data.data.shopid,
            indexaddress: res.data.data.address,
            indexlatitude: res.data.data.latitude,
            indexlongitude: res.data.data.longitude,
            indexname: res.data.data.name
          })
        }
      })
    }
    if (options.biaoshi != undefined) {
      this.setData({
        time: "获取验证码",
        biaoshi: options.biaoshi,
      })
    }

    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "android") {
          res.windowHeight = res.screenHeight;
        }
        that.setData({
          screen: {
            width: res.windowWidth,
            height: res.windowHeight,
            pixelRatio: res.pixelRatio,
            ratio: res.windowWidth * res.pixelRatio / 750
          }
        })
      }
    })
    this.setData({
      modelid: options.modelid,
      first_show: true,//第一次进来获取位置信息
      backDian: false,
    })

    that.getcardetailinfo(options);
    that.getinformation(options);
    //that.getlocation(options);
    that.setbuttoninfo(options);
    that.getnearbyshopinfo(options);
  },
  intoMap: function (e) {
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.latitude),
      longitude: parseFloat(e.currentTarget.dataset.longitude),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address,
      scale: 12
    })
  },
  intoMap1: function (e) {
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.latitude),
      longitude: parseFloat(e.currentTarget.dataset.longitude),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address,
      scale: 12
    })
  },
  car_color: function (e) {
    this.setData({
      num: e.currentTarget.dataset.index,
      colorname: e.currentTarget.dataset.carcolor
    })
  },
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  telphone: function (e) {
    this.setData({
      telphone: e.detail.value
    })
  },
  setCode: function (e) {
    var setCode = e.detail.value;
    this.setData({
      mycode: setCode
    })
  },
  huoqu: function (e) {
    var that = this;
    if (this.data.telphone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (this.data.telphone.length < 11 || !(/^1[34578]\d{9}$/.test(this.data.telphone))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      that.proccess(2);

    }
  },
  buysure: function (e) {
    if (this.data.name == "" && this.data.yourname == true) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.yourtel == true) {
      if (this.data.telphone == "") {
        wx.showToast({
          title: '请输入您的手机号',
          icon: 'none',
          duration: 2000
        })
        return false;
      } else if (this.data.telphone.length < 11 || !(/^1[34578]\d{9}$/.test(this.data.telphone))) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    var that = this;
    var newphone = ""
    var newname = ""
    var newcode = ""
    if (this.data.yourname == true) {
      newname = this.data.name
    } else {
      newname = wx.getStorageSync("name")
    }
    if (this.data.yourtel == true) {
      newphone = this.data.telphone
    } else {
      newphone = ""
    }
    if (this.data.iscode == true) {
      newcode = this.data.mycode
    } else {
      newcode = ""
    }

    that.proccess(3);
  },
  buyesc: function () {
    this.setData({
      fuceng: false,
      buycar: false,
      name: '',
      telphone: '',
      mycode: ''
    })
  },
  tuandetail: function () {
    wx.navigateTo({
      url: '../../myCenter/tuandetail/index',
    })
  },
  allpay: function (e) {
    this.proccess(4);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    var time = util.formatTime(new Date());
    time = time.replace(/\//g, "");
    common.queryExp(function (result) {
      if (time < result) {
        that.setData({
          buyliucheng: false
        })
      } else {
        that.setData({
          buyliucheng: true
        })
      }
    })

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
    if (this.data.car_store == false) {
      this.setData({
        biaoshi: 3
      })
    }
    var title = ''
    if (this.data.biaoshi == 1) {
      title = " 店铺价格：" + this.data.dianPrice * 1000 / 10000000 + "万元"
    }
    if (this.data.biaoshi == 2) {
      title = ' 首付：' + this.data.carfirstpayment * 1000 / 10000000 + "万元"
    }
    if (this.data.biaoshi == 3) {
      title = " 市场指导价：" + this.data.carDetail.price + "万元"
    }
    var that = this
    var path = ''
    if (wx.getStorageSync("userid") != "") {
      path = '/pages/changeCar/changeCar/index?modelid=' + that.data.modelid + "&biaoshi=" + that.data.biaoshi + "&iscar=" + 1 + "&originid=" + wx.getStorageSync("userid") + "&origin=0"
    } else {
      path = '/pages/changeCar/changeCar/index?modelid=' + that.data.modelid + "&biaoshi=" + that.data.biaoshi + "&iscar=" + 1
    }
    return {
      title: that.data.carDetail.name + title,
      path: path,
      imageUrl: that.data.carDetail.smallpic
    }
  }
})