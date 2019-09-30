// // 引入SDK核心类
// import QQMapWX from '../../../../../utils/qqmap-wx-jssdk.min.js';
var QQMapWX = require('../../../../../utils/qqmap-wx-jssdk.js');


// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'YHSBZ-GCNCQ-4L25N-GVXEC-N4U5S-VRBWT' // 必填
});
//二维码 引入
import QR from "../../../../../utils/wxqrcode.js" // 二维码生成器
const app = getApp();
Page({
  data: {
    header:"",    //记录当前时间滑块对象
    reservation:[],   //获取服务器段获取到的当前约单列表
    reservationservList:[],   //记录当前技师的约单服务清单
    reserIndex:0,   //记录用户选择的到店时间的日前索引值
    // 二维码
    text: 'http://weixin.qq.com/r/JD-_5qPEov7dreeF92o2',
    qrcode: '',
    code: Math.random(0, 999999),
   
    //code:1,
    //  扫码
    show: "",
    reservationStatus:0,    //开始状态为0
    firmId:"",
    TabCur: 0,
    showModel:true,   //模态框是否显示
    currentSelectCat: "", //记录当前选中的服务项目分类顺序 ""--全部选中
    firmService: [],//机构的服务项目
    //流程 布局
    basicsList: [{
      icon: 'radioboxfill',
      name: '开始'
    }, {
      icon: 'radioboxfill',
      name: '经营者信息'
    }, {
      icon: 'roundclosefill',
      name: '审核'
    }, {
      icon: 'roundcheckfill',
      name: '支付'
    }, {
      icon: 'roundcheckfill',
      name: '完成'
    },],
    basics: 3,
    numList: [{
      name: '信息'
    }, {
      name: '经营者信息'
    }, {
      name: '审核'
    }, {
      name: '支付'
    }, {
      name: '完成'
    },
    ],
    num: 1,
    region: ['广东省', '广州市', '海珠区', '11'],
    scroll: 0,
    imgList: [],
    // 流程布局111
    timedata: {      //记录当前不能选的区域 以及可以选的区域
      workarea: {
        x1: "06:00",
        x2: "22:00",
        x1x: 0,
        x2x: 0
      },
      disabledarea: {
        x1: "06:30",
        x2: "12:00",
        x1x: 0,
        x2x: 0
      },
      //开始服务
      enabledarea: {
        x1: "12:30",
        x2: "13:00",
        x1x: 0,
        x2x: 0
      },
      leftarea: 10,
      rightarea: 10,
      xdis: 10,
      startX: 0,
      movex: 0,
      down: {
        x1: 0,
        x2: 0
      },
      sideswidth: 0.95,
    },
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20, // 时间间隔
   
    resIndex:0,
  //  地图

    // 地图
    test1:11111,
    ifselected1:true,
    items: [{
      name: '360',
      value: '360X',
      show: true,
    },
    {
      name: '400',
      value: '400Y',
      checked: 'true',
      show: true,
    },
    {
      name: '260',
      value: '260Z',
      show: false,
    }
    ],


    //优惠 变量
    allList:[],
    test1:111,
   
    // 文件上传
    imgList: [],
    // 星星 
    one_2: 0,
    two_2: 5,
    // 星星
    imgUrls:[],
    imgUrls1:[],
   
    //滑块的
    imgs: [
      '测试11'
    ],
    swiperIndex:0,   //大滑块用来记录第几个滑块
    smallSwiperIndex:0,  //小滑块第几个滑块
    //滑块结束
    _num: 0,
    radioIndex:-1,
    pageBackgroundColor: 'red',  //点击添加背景
    webRoot: app.globalData.webroot,  //得到根
    // 下拉菜单变量  
    index: null,
    //下拉菜单变量结束
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    num: 1,  //对勾的 0是第一步  1是第二步
    webRoot: app.globalData.webroot,
    basics: 0,
    // 预约进度条
    m:0,
 

    // scroll: 0,
    dateArr: [],   //放时间的
    staffInfos:[],  //放技师信息
    radioArr:[
      '加油1','加油2','加油3','加油4'
    ],
    //控制添加按钮的模态框
    modalName: '',
    firmBasicInfo:[], //模态框变量
    scrollLeft: 0,
  }, 
  // 地图
  formSubmit(e) {
    var that=this;
    //请求后端得到经纬度
    console.log("地图-------------")
   
    console.log('当前滑块是---'+that.data.swiperIndex)
    that.setData({
      swiperIndex: that.data.swiperIndex
    })
    console.log(that.data.imgs[that.data.swiperIndex])
    var swiperData = that.data.imgs[that.data.swiperIndex];
  
    var latitude = swiperData['firmInfo']['Lat'];
    var longitude = swiperData['firmInfo']['Lng'];
    console.log(that.data.firmId)
    //
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      /**
       * 
       //Object格式
        location: {
          latitude: 39.984060,
          longitude: 116.307520
        },
      */
      /**
       *
       //String格式
        location: '39.984060,116.307520',
      */
     // location: '39.95542,116.80464',
      location: '' + latitude + ',' + longitude,
// 变化的
      // location: e.detail.value.reverseGeo || '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var mks = [];
        /**
         *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
         *
            for (var i = 0; i < result.pois.length; i++) {
            mks.push({ // 获取返回结果，放到mks数组中
                title: result.pois[i].title,
                id: result.pois[i].id,
                latitude: result.pois[i].location.lat,
                longitude: result.pois[i].location.lng,
                iconPath: './resources/placeholder.png', //图标路径
                width: 20,
                height: 20
            })
            }
        *
        **/
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          // iconPath: './resources/placeholder.png',//图标路径
          width: 20,
          height: 20,
          callout: { //在markers上展示地址名称，根据需求是否需要
            content: res.address,
            color: '#000',
            display: 'ALWAYS'
          }
        });
        that.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  
  // 地图
  /**
   * 大的滑块滑动 事件
   */
  moveSwiper:function(e){ 
    var that=this;
    console.log(e)
    that.onLoad();
    console.log(e.detail.current)
    that.setData({
      swiperIndex: e.detail.current,
      smallSwiperIndex: 0,   
      imgUrls: that.data.imgUrls[e.detail.current],

      reservationservList: that.data.reservation[e.detail.current]
    })
    console.log(that.data.imgUrls);
    //移动滑块地图跟着变化
    that.formSubmit();
  },
  // 小滑块  服务项目滑动事件
  moveSmallSwiper:function(e){
    var that=this;
    that.setData({
      smallSwiperIndex: e.detail.current
    })
    console.log(that.data.smallSwiperIndex)
  },
  // 服务项目的滑块
  changeMainCat(e) {
    var that = this;
    var seq = e.currentTarget.dataset.seq;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      currentSelectCat: seq,
      swiperIndex: 0
    })

    console.log(this.data.TabCur);
    console.log(seq);


    //通过当前的大分类顺序获取对应的服务项目
    that.getFirmService();

  },
  // 点击更多
  moreServers:function(){
    var that = this;
    var currentService = that.data.currentService;
    that.setData({
      showMore: false,
      firmService: currentService
    })
  
  },
  //点击添加  服务清单点击加号
  moreServer:function(){
    console.log("----")
    var that=this;
    var firmId = that.data.reservationservList["firmInfo"]['firmId'];
    var userArr = wx.getStorageSync("user");
    var lat = JSON.parse(userArr)["noLogin"]["lat"];//纬度
    var lng = JSON.parse(userArr)["noLogin"]["lng"];//经度
    console.log(firmId);
    wx.request({
      //url: app.globalData.webroot + '/index/firm/getFirmById',
      url: app.globalData.webroot+ '/index/firm/getFirmById',
      method: "post",
      data: {
        lat: lat,
        lng: lng,
        firmId: firmId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log("获取当前机构下的所有服务")
        console.log(res.data.msg);
        var data = res.data.msg;
        that.setData({
          firmBasicInfo: data,
          currentSelectCat: data["MainCatAndName"][0]["Seq"]
        })
        console.log(that.data.currentSelectCat);
        console.log(that.data.firmBasicInfo);
        var currentSelectCat = that.data.currentSelectCat;
        // return;
        //获取机构所有的服务项目
        that.getFirmService();
      }
    })


  },
  /////封装一个获取服务项目的方法 ---
  getFirmService: function () {
    this.setData({
      firmService: []
    })


    var that = this;
    ////获取当前机构的所有服务项目
    wx.request({
      //url: app.globalData.webroot + '/index/firm/getFirmById',
      url: app.globalData.webroot + '/index/service/getFirmServiceByCat',
      method: "post",
      data: {
        cid: that.data.currentSelectCat,
        firmId: 1,
        pullOff: -1 //全部  0--上架 1--下架
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        if (res.data.code == 0) {
          return;
        }
        var data = res.data.msg;
        that.setData({
          currentService: data
        })
        //如果当前的服务项目小于3条的话就显示前三条
        //显示 更多按钮 
        //点击更多按钮的时候直接显示出来全部项目
        if (data.length <= 3) {
          console.log("---小于")
          that.setData({
            showMore: false,
            firmService: data
          })
        } else {
          console.log("---大于")
          var arr = [];
          for (var i = 0; i < data.length; i++) {
            if (i < 3 && data[i]) {
              arr.push(data[i]);
            }
          }
          //数据大于三条 显示三条 
          that.setData({
            showMore: true,
            firmService: arr
          })
        }
        //  that.setData({
        //    firmService: data,
        //    imgs: data,
        //    firmServiceCount: data.length,
        //  })
        //

        var firmService = that.data.firmService;
        console.log(that.data.firmService);
      }
    })
  },
  // 删除服务
  delOrder:function(){
    console.log("-----")
    var that=this;
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];   // 用户id
    var staffId=that.data.imgs[that.data.swiperIndex]['firmInfo']['staffId']
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          console.log("用户点击了确定---")
          wx.request({
            url: app.globalData.webroot + '/index/reservation/delRESN',
            method: "post",
            data: {
              //userId   staffId
              userId: uid,
              staffId: staffId

            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' //post请求
            },
            success(res) {
              console.log(res.data.msg)
              //删除约单成功
              that.data.imgUrls = [];
              that.setData({
                imgUrls: that.data.imgUrls
              })
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  //添加服务 
  addServer:function(e){
      console.log(e);
      console.log(e.currentTarget.dataset.serviceid)
    var that=this;
    console.log(e.currentTarget.dataset.allinfos)
    var service = e.currentTarget.dataset.allinfos;   //整条服务项目的信息
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];   // 用户id
    var staffId = that.data.reservationservList["firmInfo"]['staffId'];
    var firmId = that.data.reservationservList["firmInfo"]['firmId']
    console.log(staffId);
 
      wx.request({
        url: app.globalData.webroot + '/index/reservation/addServiceRESN',
        method: "POST",
        data: {
          userId: uid,
          service: JSON.stringify(service),
          staffId: staffId,
          firmId: firmId,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //post请求
        },
        success(res) {
          console.log(service)
          console.log(service["Pic"])
          res.data.msg["Pic"] = service["Pic"];

          var _temp = that.data.reservationservList
          _temp["reservation"].push(res.data.msg)
          

          //更新总价格
          _temp["allMoney"] += Number(service["Price_Min"]);
          _temp["allTime"] += Number(service["Duration"]);
          console.log(_temp)
          that.setData({
            reservationservList: _temp
          })
        
         
          
      
        }
      })
  },
  // 点击删除服务项目
  delService:function(e){
    
    var that=this;
    console.log("------------")
    
   
    console.log('resnid======='+e.currentTarget.dataset.resnid)
    var _clickResnid = e.currentTarget.dataset.resnid;
    var _money = e.currentTarget.dataset.money;
    var _time = e.currentTarget.dataset.durate;
    // console.log('mongey====='+e.currentTarget.dataset.money)
    // console.log(that.data.imgs[that.data.swiperIndex]);
    // console.log(that.data.imgUrls);
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
       
        if (sm.confirm) {
          console.log("用户点击了确定---")

          wx.request({
            url: app.globalData.webroot + '/index/reservation/delRESNById',
            method: "post",
            data: {
              //FirmId  Min   Max
              RESNId: _clickResnid,              //////////////写死的用户uid

            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' //post请求
            },
            success(res) {
              console.log(res.data.msg);
              //后端删除成功了
                console.log(that.data.reservationservList)
                var _reservationservList = that.data.reservationservList;
                for (var i = 0; i < _reservationservList["reservation"].length; i++) {
                  if (_reservationservList["reservation"][i]["RESNId"] == _clickResnid) {
                    _reservationservList["reservation"].splice(i, 1);

                    break;
                  }
                }
                console.log(_reservationservList["allMoney"] + "-----" + _money + "---" + _time)
                _reservationservList["allMoney"] -= _money;
                _reservationservList["allTime"] -= _time
                console.log(_reservationservList);



                // console.log(msg[that.data.swiperIndex])
                // /////把约单列表存到data层数据reservation中
                that.setData({
                  reservationservList: _reservationservList
                })

                return;



            }
          })


          
         

        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   


  },
  //优惠点击事件
  allList:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index; // 选中优惠活动的索引
    var allList = this.data.imgs[this.data.swiperIndex]['nowActivity'];
    for(var i=0;i<allList.length;i++){
      allList[i]['index'] = i;
    }
    this.setData({
      allList:allList
    })
    
    let string = "allList[" + e.currentTarget.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.imgs[this.data.swiperIndex]['nowActivity'][e.currentTarget.dataset.index].selected
    })

    let detailValue = this.data.allList.filter(it => it.selected).map(it => it.index)
    this.setData({
      imgs: this.data.imgs
    })
    var item=that.data.imgs[that.data.swiperIndex];
    var nowActivity = item['nowActivity'];
    //整理减过之后的 总价格
    console.log(nowActivity)
    // var orginalPrice = that.data.imgUrls[0][0]['allMoney'];
    console.log(orginalPrice)

  },


  // 文件上传
  ChooseImage() {
    console.log("上传");
    wx.chooseImage({
      count: 3, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        console.log(this.data.imgList);
        console.log(this.data.imgList.length);
        if (this.data.imgList.length==3){
          wx.showModal({
            title: '提示',
            content: '确认提交',
            success:(res)=> {
              if (res.confirm) {
                console.log('用户点击确定');
                // 把X号隐藏
                console.log('res是'+res);
                var that=this;
                that.setData({
                  hideX: true  
                })

              } else if (res.cancel) {
              
                console.log('用户点击取消')
              }
            }    
          })
         
             
        }
      }
    });
    
  },
  ViewImage(e) {
    console.log("上传11111");
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
   
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  // 文件上传
  // 星星
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2') {
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
    console.log(in_xin);
    console.log("满意的星星是"+this.data.one_2);
    console.log("不满意的星星是"+this.data.two_2);
  },
  // 星星结束
  //textarea 的值
  textareaAInput:function(e){
    console.log(e.detail.value) 
  },
  
  onLoad: function () {
    console.log("onload------------")
// 地图
   var that=this;
   
    // 时间滑块的两个函数
    // 关于日期的js
    var date = new Date();
    var arr = [];
    var showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    console.log("今天日期是" + showDate)   //今天日期
    arr.push(date.getDate());
    for (var i = 1; i <= 6; i++) {//后7天
      date.setDate(date.getDate() + 1);
      showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      // console.log(showDate)
      arr.push(date.getDate());
      console.log(date.getDate())
    }
    this.setData({
      dateArr: arr
    })
    console.log(this.data.dateArr);
    //请求后端得到技师基本信息
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    var lat = JSON.parse(userArr)["noLogin"]["lat"];//纬度
    var lng = JSON.parse(userArr)["noLogin"]["lng"];//经度
    var details=[];
    wx.request({
      url: app.globalData.webroot + '/index/reservation/getAllInfo',
      method: "post",
      data: {   
        //FirmId  Min   Max
        uid: uid,              //////////////写死的用户uid
        userLat:lat,
        userLng:lng
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        if (res.data.code==0){
          return;
        }
        var msg = res.data.msg;
      //得到每个服务的第一张图片
        for (var k = 0; k < msg.length;k++){
          msg[k]["allTime"]=0;
          msg[k]["allMoney"] = 0;
          for (var m = 0; m < msg[k]["reservation"].length;m++){
            msg[k]["reservation"][m]["Pic"] = msg[k]["reservation"][m]["Pic"].split(",")[0];
            msg[k]["allTime"] += Number(msg[k]["reservation"][m]["Duration"])
            msg[k]["allMoney"] += Number(msg[k]["reservation"][m]["Price_Min"])
          }
        }

        // console.log(msg[that.data.swiperIndex])
       /////把约单列表存到data层数据reservation中
        that.setData({
          reservation: msg,
          reservationservList: msg[that.data.swiperIndex]
        })

        console.log(that.data.reservation)

        var map = {},
          dest = [];
        var arr = [];
        for (var i = 0; i < msg.length; i++) {
          var ai = msg[i];
          console.log(ai);
          if (!map[ai.StaffId]) {

            dest.push({
              StaffId: ai.StaffId,
              avatar: ai.avatar,
              firmInfo: ai.firmInfo,
              promote: ai.promote,
              item: [ai]
            });
            map[ai.StaffId] = ai;
            console.log("技师id---" + map[ai.StaffId] + dest[0]['StaffId']);

            //请求信息  
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.StaffId == ai.StaffId) {
                dj.item.push(ai);
                console.log("技师id2222---" + dj.StaffId);
                break;
              }

            }
          }
        }
        console.log(dest);   //得到整理的
        that.setData({
          imgs:dest
        })
        console.log(that.data.imgs);
      // 小滑块
        var smallSwiperArr = [];
        var arr1 = [];
        for (var m = 0; m < that.data.imgs.length; m++) {
          console.log(m)
          var item = that.data.imgs[m]['item'];
          console.log(item)
          var arr = [];
          for (var i = 0; i < item.length; i++) {
            if (i % 2 == 0) {
              var itemarr = [];
              itemarr.push(item[i])
              if (item[i + 1]) {
                itemarr.push(item[i + 1])
              }
              arr.push(itemarr)

            }
          }
          console.log('--------' + arr);
          that.setData({
            imgUrls1: arr

          })
          smallSwiperArr.push(that.data.imgUrls1)
        }
        console.log(smallSwiperArr)
        that.setData({
          imgUrls: smallSwiperArr[that.data.swiperIndex]
        })
        //
        console.log(that.data.imgUrls);
        console.log(that.data.imgUrls[0].length)


        //整理得到总时长
        var duration=0;
        var money=0;
        for (var i = 0; i < that.data.imgUrls.length; i++) {
          var bigItem = that.data.imgUrls[i];
          console.log(bigItem);
          for(var j=0;j<bigItem.length;j++){
            duration+=bigItem[j]['Duration'];
           
            var money2 = parseFloat(bigItem[j]['Price_Min']);
            console.log("money----"+money2)
            money += money2
          }
        }
        console.log(duration)
        console.log(that.data.imgUrls);
        
        that.setData({
          imgUrls: that.data.imgUrls
        })
        
        for(var m=0;m<that.data.imgs.length;m++){
          console.log(m)
          var item=that.data.imgs[m]['item'];
          console.log(item)  
          
          //评分----
        //   var allResn = that.data.imgUrls1;
        //   for (var sn = 0; sn < allResn.length; sn++) {
        //     var resnItem = allResn[sn];
        //     var sum = 0;
        //     console.log(resnItem[0]['Duration'])

        //     for (var sc = 0; sc < resnItem.length; sc++) {
        //       sum += resnItem[sc]['Duration'];
        //     }
        //     console.log(sum)
        //     console.log(that.data.imgUrls1[sn])
        //     that.data.imgUrls1[sn][0]['allTime'] = sum;

        //   }
        //   console.log(that.data.imgUrls1)
        //   that.setData({
        //     imgUrls: that.data.imgUrls1
        //   })  
        // console.log(that.data.imgUrls);
         
          //整理得到评分
          for (var i = 0; i < that.data.imgs.length;i++ ){
            var satisfection = that.data.imgs[i]['item'][0]['satisfection'] / 10;//评分
            var num = Math.round(satisfection);//四舍五入分
            that.data.imgs[i]['stars'] = num;
            var stars = [{
              lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
              blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
            //  flag: 0,
              message: '非常不满意，各方面都很差'
            }, {
              lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
              blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
            //  flag: 0,
              message: '不满意，比较差'
            }, {
              lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
              blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
           //   flag: 0,
              message: '一般，还要改善'
            }, {
              lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
              blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
            //  flag: 0,
              message: '一般，还要改善'
            }, {
              lightImg: 'http://ljp.jujiaoweb.com/static/images/index/star_light.png',
              blackImg: 'http://ljp.jujiaoweb.com/static/images/index/star_black.png',
             // flag: 0,
              message: '一般，还要改善'
            }];
            
            for (var j = 0; j < stars.length; j++) {
              if (j < num) {
                stars[j]["flag"] = 1;
              } else {
                stars[j]["flag"] = 0;
              }

            }
         
           
          //   that.data.imgs[i]['allStar'] = stars;
          //   //整理优惠活动
          //   var itemActivityArr = [];
          //   var promote = that.data.imgs[i]['promote'];
          //   for (var j = 0; j < promote.length;j++){
          //     var status = promote[j]['status']['type'];
          //     var alternative = promote[j]['alternative'];     //是否可以叠加    
          //     if(status==1){
          //       that.data.imgs[i]['alternative'] = alternative;
          //       that.data.imgs[i]['status'] = status;
          //       var itemActivity = promote[j]['itemActivity'];
             
          //       for(var m=0;m<itemActivity.length;m++){
          //         itemActivityArr.push(itemActivity[m])
          //       }
          //     } 
          //   }
            
          //  that.data.imgs[i]['nowActivity'] = itemActivityArr;
           
          }
          that.setData({
            imgs: that.data.imgs
          })
       
          
          
        }
   
    
          
        //调用计算当前今日用户的无效时间段
        //////时间组件
        var header = that.selectAllComponents(".timearea")[0];
        that.setData({
          header:header
        })
        that.getArrangeTimeList();

        //////计算当前机构下和当前价格下的优惠价格
        that.getAlternative();
        
      }
    })
    //再次请求-----

 
    //*statusOne状态************************************** */
    console.log(that.data.swiperIndex)
    if(that.data.reservationStatus==1){
      that.formSubmit();
    }
    // *****************************二维码*********/
    if(that.data.reservationStatus==2){
      let qrcodeSize = that.getQRCodeSize()
      that.createQRCode(that.data.text, qrcodeSize)
      // qrcode = new QRCode('canvas', {
      //   text: "",
      //   width: 150,
      //   height: 150,
      //   colorDark: "#000000",
      //   colorLight: "#ffffff",
      //   correctLevel: QRCode.CorrectLevel.H,
      // });
      // that.tapHandler();
    }

  },
  getAlternative:function(){
    console.log(this.data.reservationservList)
    // 通过firmId 和总价格计算出使用哪个优惠以及最后优惠的价格
    var firmId = this.data.reservationservList["firmInfo"]["firmId"];
    var allMoney = this.data.reservationservList["allMoney"];
    console.log(firmId + "---" + allMoney);

    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];   // 用户id
    
    wx.request({
      url: app.globalData.webroot + '/index/reservation/getAlternative',
      method: "post",
      data: {
        firmId: firmId,
        allMoney: allMoney,
        uid: uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg)
      }
    })

  },
  /**
   * 添加按钮模态框事件
   */
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })

  },

  // 模态框消失
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 地图
  // 地图
  // 选择日期点击事件
  chooseDate: function (e) {
    console.log("选择的日期是" + e.currentTarget.dataset.item);
    console.log("点击选择的index是" + e.currentTarget.dataset.index);
    this.setData({
      reserIndex: e.currentTarget.dataset.index
    })
    this.getArrangeTimeList();
  },
  getArrangeTimeList:function(){
   
    
    var arrangeTimeList = this.data.reservationservList["arrangeTime"];
    console.log(arrangeTimeList);
    var WorkStartTime = this.data.reservationservList["staffinfo"]['WorkStartTime']  //开始工作时间
    var WorkEndTime = this.data.reservationservList["staffinfo"]['WorkEndTime']  //结束工作时间
    ///////////////可以读取到组件中的选择的时间点
    // console.log(this.data.header.data.timedata.enabledarea)
    this.timeareafun(WorkStartTime, WorkEndTime, arrangeTimeList, 0);
  },
  
  timeareafun: function (WorkStartTime, WorkEndTime, _sleeptime, index) {
    var reserIndex = this.data.reserIndex;
    var date = new Date();
    date.setDate(date.getDate() + reserIndex);
    var data13 = new Date(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())
    // //////时间组件
    // var header = this.selectAllComponents(".timearea")[index]

    //定义一个默认的可以选择的时间段
    var enabledefault={
      x1: (Number(WorkEndTime.split(":")[0])-1)+":"+"00",
      x2: (Number(WorkEndTime.split(":")[0]) - 2)+ ":" + "00",
      x1x: 0,
      x2x: 0
    };   
    console.log(WorkEndTime.split(":"))
    console.log(enabledefault)
    var sleeptime = [];
    for (var m = 0; m < _sleeptime.length; m++) {
      var date1 = _sleeptime[m]["PickDate"].split("-");
      var date12=new Date(date1);
      console.log( date12 + "----" + data13)
      if (data13.getTime() == date12.getTime()){
        var _obj = {
          x1: _sleeptime[m]["StartTime"],
          x2: _sleeptime[m]["EndTime"],
          x1x: "0",
          x2x: "0"
        }
        sleeptime.push(_obj);



        //得到可以选择的时间
        // if (enabledefault==null){
           
        //   enabledefault = {
        //     x1: _sleeptime[m]["StartTime"],
        //     x2: _sleeptime[m]["EndTime"],
        //     x1x: 0,
        //     x2x: 0
        //   }
        // }else{

        // }
        
      }
      
    }

    console.log(sleeptime)
    var obj = {
      ifshowenable: true,   //控制选择时间
      ifShowworkTxt: true,   //控制上班时间是否显示
      workarea: {          //指定工作时间和结束时间
        x1: WorkStartTime,
        x2: WorkEndTime,
        x1x: 0,
        x2x: 0
      },
      disabledarea: sleeptime,

      currentorderarea: [   //绿色时间 ---技师约单界面会用到当前约单的时间
        // {
        //   x1: "15:30",
        //   x2: "16:00",
        //   x1x: 0,
        //   x2x: 0
        // },
        // {
        //   x1: "16:30",
        //   x2: "18:00",
        //   x1x: 0,
        //   x2x: 0
        // }
      ],
      enabledarea: enabledefault,
      canvasHeight: 60,
      bgColor:"#f6f6f6"

    }
    this.data.header.canvasdraw(obj)
  },

  // 点击预约事件
  makeOrder:function(){
    var that=this;
    console.log("点击了预约");
    console.log(that.data.swiperIndex);
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];   // 用户id
    var staffId=that.data.imgs[that.data.swiperIndex]['firmInfo']['staffId'];
    var promote = that.data.imgs[that.data.swiperIndex]['promote'];
    var itemArr = that.data.imgs[that.data.swiperIndex]['item'];
    var promoteIdarray = []; //优惠活动id
    var resnIds = []; //服务id
    for (var i = 0; i < promote.length;i++){
      if (promote[i]['status']['type']==1){
          //正在优惠的   得到PromoteId
        promoteIdarray.push(promote[i]['PromoteId'])
      }
    }
    for (var j = 0; j < itemArr.length; j++) {
      var resnId = itemArr[j]['RESNId'];
      //console.log(resnId)
      resnIds.push(resnId)
    }
    console.log(resnIds);
    console.log(promoteIdarray);
    console.log(staffId);
    console.log(that.data.imgs);
    console.log(that.data.imgUrls);
    // console.log(that.data.imgUrls[0][0]['allMoney']);
  
    //增加一个预约
    wx.request({
      url: app.globalData.webroot + '/index/reservation/comfirmServiceRESN',
      method: "post",
      data: {
        //start_time 预约开始时间 end_time结束时间  day 预约哪天 userId staffId promoteIdarray    [1,2,3]      优惠活动id   finalPrice  最终价格  123样式  resnIds [4,5,6]   服务id
        start_time:'10:00',
        end_time:'12:22',
        day:'2019-09-25',
        userId: uid,
        staffId: staffId,
        promoteId:promoteIdarray,
        
        resnIds:resnIds
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg)
      }
    })
    
    that.setData({
      reservationStatus:1,
      
    })
    that.formSubmit();
    
    
  },
  /**
   * 点击取消 改期 我已到店
   */
  updReservation:function(e){
    console.log("-----")
    console.log(e.currentTarget.dataset.type);  //点击的类型
    var type = e.currentTarget.dataset.type;
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];   // 用户id
    wx.request({
      url: app.globalData.webroot + '/index/reservation/updReservationById',
      method: "post",
      data: {
        type:type,   //type-1 取消  type-2 改期  type-3我已到店
        //status:,
        resnId: uid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        //后端更新user表的Mysubcat字段
      }
    })
  },
  /**
   * 点击单选按钮添加样式
   */
  radioColor:function(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    console.log(index);
    this.setData({
      radioIndex:index
    })
  },
  asd: function () {
    console.log(123123)
    console.log(this.data.imgs[0].firmInfo.FirmName)
  },
  // 地图的js
  //触发关键词输入提示事件
  getsuggest: function (e) {
    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: '上海', //设置城市名，限制关键词所示的地域范围，非必填参数
      page_size: 8,
      success: function (res) {//搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({
          showview: false
        })
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug

        });
      },
      fail: function (error) {
        console.error(error + "失败");
        _this.setData({
          showview: true
        })
      },
      complete: function (res) {
        console.log(res);

      }
    });
  },
  //方法回填
  backfill: function (e) {
    console.log("点击");
    this.setData({
      showview: true
    })
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        this.setData({
          backfill: this.data.suggestion[i].title,
          latitude: this.data.suggestion[i].latitude,
          longitude: this.data.suggestion[i].longitude
        });
        this.nearby_search();
        return;
      }
    }
  },
  // 根据关键词搜索附近位置
  nearby_search: function () {
    var self = this;

    // 调用接口
    qqmapsdk.search({
      keyword: self.data.detail,  //搜索关键词
      //boundary: 'nearby(' + self.data.latitude + ', ' + self.data.longitude + ', 1000, 16)',
      location: self.data.latitude + ',' + self.data.longitude,
      page_size: 20,
      page_index: 1,
      success: function (res) { //搜索成功后的回调
        //console.log(res.data)
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].ad_info.province,
            city: res.data[i].ad_info.city,
            district: res.data[i].ad_info.district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        self.setData({
          selectedId: 0,
          nearList: sug,
          suggestion: sug
        })
        self.addMarker(sug[0]);
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  changeworktime: function () {
    //已经预约出去的工作时间和结束工作时间转成时间戳

    var date4 = this.data.timedata.disabledarea["x1"];//不可选择的时间段开始时间
    date4 = date4.split(":")    //分割时间09    30
    date4 = date4[0] * 60 * 60 + date4[1] * 60   //09*60*60+30*60(化成秒数)



    var date5 = this.data.timedata.disabledarea["x2"];//不可选择的时间段结束时间
    date5 = date5.split(":")
    date5 = date5[0] * 60 * 60 + date5[1] * 60





    //开始工作时间和结束工作时间转成时间戳
    // var date = this.data.startwork;
    var date = this.data.timedata.workarea["x1"];
    date = date.split(":")
    date = date[0] * 60 * 60 + date[1] * 60//开始工作时间的秒数



    var date1 = this.data.timedata.workarea["x2"];
    date1 = date1.split(":")
    date1 = date1[0] * 60 * 60 + date1[1] * 60
    // console.log("结束工作的时间：" + "----" + date1)

    //开始服务时间和结束服务时间转成秒

    var date2 = this.data.timedata.enabledarea["x1"];
    date2 = date2.split(":")
    date2 = date2[0] * 60 * 60 + date2[1] * 60
    // console.log("开始服务的时间：" + this.data.startserver + "----" + date2)


    var date3 = this.data.timedata.enabledarea["x2"];
    date3 = date3.split(":")
    date3 = date3[0] * 60 * 60 + date3[1] * 60
    // console.log("结束服务的时间："+this.data.endserver + "----" + date3) 

    //转成对应的x坐标开始工作的x和结束工作的x
    // //读取当前最左侧的x坐标
    var w = wx.getSystemInfoSync().windowWidth;

    var startWorkX = 0;
    // var endWorkX =0.8*w;
    var endWorkX = this.data.timedata.sideswidth * w
    // this.data.timedata.tadwidth = endWorkX+"px"

    // console.log("工作对应的x-----------w="+w+"----"+startWorkX + "-----" + endWorkX)

    var workarea = this.data.timedata.workarea
    workarea["x1x"] = startWorkX    //工作开始的坐标//18.75
    workarea["x2x"] = endWorkX      //工作结束的坐标//356.25
    // console.log("工作对应的x-----------w=" + w + "----" + workarea["x1x"] + "-----" + workarea["x2x"])



    //转成对应的x坐标开始服务的x和结束服务的x
    // console.log((date1-date) + "---" + (date2-date)+"---"+date)
    var startServerX = ((endWorkX - startWorkX) / (date1 - date)) * (date2 - date) + startWorkX
    var endServerX = ((endWorkX - startWorkX) / (date1 - date)) * (date3 - date) + startWorkX

    var enabledarea = this.data.timedata.enabledarea
    enabledarea["x1x"] = startServerX
    enabledarea["x2x"] = endServerX

    // console.log("服务对应的x---" + startServerX + "---" + endServerX) 


    //已经预约出去的时间转成对应的x坐标开始服务的x和结束服务的x
    var startServeredX = ((endWorkX - startWorkX) / (date1 - date)) * (date4 - date) + startWorkX
    var endServeredX = ((endWorkX - startWorkX) / (date1 - date)) * (date5 - date) + startWorkX

    var disabledarea = this.data.timedata.disabledarea
    disabledarea["x1x"] = startServeredX
    disabledarea["x2x"] = endServeredX


    // console.log("已经预约对应的x---" +  startServeredX + "---" + endServeredX)

    var timedata = this.data.timedata;
    timedata["workarea"] = workarea;  //工作区域
    timedata["enabledarea"] = enabledarea;//可选择区域
    timedata["disabledarea"] = disabledarea;//补课选择区域
    this.setData({
      timedata: timedata

    })

  },
  getPos: function () {
    // 得到工作的时间点和坐标
    var workstartdate = this.data.timedata.workarea["x1"];
    workstartdate = workstartdate.split(":")
    workstartdate = workstartdate[0] * 60 * 60 + workstartdate[1] * 60
    // console.log("开始工作的时间：" + "----" + workstartdate)

    var workenddate = this.data.timedata.workarea["x2"];
    workenddate = workenddate.split(":")
    workenddate = workenddate[0] * 60 * 60 + workenddate[1] * 60
    // console.log("结束时间：" + workenddate) 

    var workstartx = this.data.timedata.workarea["x1x"];//工作时间的开始坐标
    var workendx = this.data.timedata.workarea["x2x"];//工作时间的结束坐标


    // 得到当前服务的时间点要求坐标所对应的时间点

    var enabledstartdate = this.data.timedata.enabledarea["x1x"];//可选择的时间的开始坐标
    var enabledenddate = this.data.timedata.enabledarea["x2x"];//可选择的时间的结束坐标

    var enabledstartx = ((workenddate - workstartdate) / (workendx - workstartx)) * (enabledstartdate - workstartx) + workstartdate
    var enabledendx = ((workenddate - workstartdate) / (workendx - workstartx)) * (enabledenddate - workstartx) + workstartdate

    var enabledstartH = Math.floor(enabledstartx / (60 * 60));
    var enabledstartM = Math.floor((enabledstartx / (60 * 60) - enabledstartH) * 60);
    var enabledstartStr = enabledstartH + ":" + enabledstartM;

    var enabledendH = Math.floor(enabledendx / (60 * 60));
    var enabledendM = Math.floor((enabledendx / (60 * 60) - enabledendH) * 60);
    var enabledendStr = enabledendH + ":" + enabledendM;

    var timedata = this.data.timedata;
    timedata.enabledarea["x1"] = enabledstartStr;
    timedata.enabledarea["x2"] = enabledendStr;

    this.setData({
      timedata: timedata

    })

  },
  drawarea: function () {
    // 读取当前容器的宽度
    var w = wx.getSystemInfoSync().windowWidth
    var context = wx.createCanvasContext('timeCanvas')
    //绘制绿色区域
    context.clearRect(0, 0, w, 100)
    context.beginPath()
    context.setFillStyle("#FFF")
    context.rect(0, 0, w, 100)
    context.strokeStyle = "red";//填充边框颜色
    context.strokeRect(50.5, 50.5, 100, 100);//对边框的设置
    context.fill()
    context.closePath()
    // 绘制灰色区域
    context.beginPath()
    context.setFillStyle("#cccccc")
    context.rect(this.data.timedata.disabledarea.x1x, 0, (this.data.timedata.disabledarea.x2x - this.data.timedata.disabledarea.x1x), 95)
    context.fill()
    context.closePath()
    // 绘制边框
    // context.lineWidth = 1;//设置边框大写
    // context.fillStyle = "yellow";//填充实体颜色
    // context.strokeStyle = "red";//填充边框颜色
    // context.strokeRect(50.5, 50.5, 100, 100);//对边框的设置
    // context.fillRect(50.5, 50.5, 100, 100);//对内容的设置
    // 绘制一个默认的可以拖拽的区域（红色区域）
    context.beginPath()
    context.setFillStyle("#FF6600")
    context.rect(this.data.timedata.enabledarea.x1x, 0, (this.data.timedata.enabledarea.x2x - this.data.timedata.enabledarea.x1x), 95)
    context.fill()
    context.closePath()
    context.draw()
  },
  start: function (e) {
    console.log("start函数")
    var timedata = this.data.timedata
    timedata["startx"] = e.touches[0]["x"]


    var down = {};
    down["x1"] = timedata.enabledarea["x1x"];
    down["x2"] = timedata.enabledarea["x2x"];
    timedata["down"] = down;

    // console.log("--" + timedata.enabledarea["x1x"])

    this.setData({
      timedata: timedata,
    })
  },
  move: function (e) {
    var timedata = this.data.timedata

    if ((e.touches[0]["x"] - timedata.enabledarea["x1x"]) < timedata.xdis) {
      console.log("拖拽左边的边")

      timedata.enabledarea["x1x"] -= (timedata.enabledarea["x1x"] - e.touches[0]["x"])

    } else if (Math.abs(e.touches[0]["x"] - timedata.enabledarea["x2x"]) < timedata.xdis) {
      console.log("拖拽右边的边")
      timedata.enabledarea["x2x"] += (e.touches[0]["x"] - timedata.enabledarea["x2x"])

    } else {
      // console.log("移动可选区域")
      var deltax = e.touches[0]["x"] - timedata["startx"]
      if (deltax < 0) {
        //左移动
        timedata.enabledarea["x1x"] -= Math.abs(deltax)
        timedata.enabledarea["x2x"] -= Math.abs(deltax)
      } else {
        // 右移动
        timedata.enabledarea["x1x"] += Math.abs(deltax)
        timedata.enabledarea["x2x"] += Math.abs(deltax)
      }
      timedata["startx"] = e.touches[0]["x"]
    }


    timedata.movex = e.touches[0]["x"]

    this.setData({
      timedata: timedata
    })

    this.drawarea();

    this.getPos(); //重新计算时间


  },
  end: function (e) {
    // console.log(e.touches)

    var timedata = this.data.timedata;
    //判断服务结束时间是否大于服务开始时间
    if (timedata.enabledarea["x2x"] <= timedata.enabledarea["x1x"]) {
      timedata.enabledarea["x2x"] = this.data.timedata.down.x2
    }
    var down = this.data.timedata.down;
    //判断服务时间是否与非服务时间重合
    var if1 = timedata.enabledarea.x1x > timedata.disabledarea["x1x"] && timedata.enabledarea.x1x < timedata.disabledarea["x2x"]
    var if2 = timedata.enabledarea.x2x > timedata.disabledarea["x1x"] && timedata.enabledarea.x2x < timedata.disabledarea["x2x"]
    var if3 = timedata.disabledarea["x1x"] > timedata.enabledarea.x1x && timedata.disabledarea["x2x"] < timedata.enabledarea.x2x
    if (if1 || if2 || if3) {
      //不改变
      console.log("不可以移动到此处")
      timedata.enabledarea["x1x"] = down.x1;
      timedata.enabledarea["x2x"] = down.x2;


    } else {
      //不在这个区间内 就可以移动位置
      console.log("--可以移动到此处")


    }
    this.setData({
      timedata: timedata
    })

    this.drawarea();
    this.getPos(); //重新计算时间
  },
  onShow: function () {
    // var that = this;
    // var length = that.data.text.length * that.data.size;//文字长度
    // var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    // //console.log(length,windowWidth);
    // that.setData({
    //   length: length,
    //   windowWidth: windowWidth
    // });
    // that.scrolltxt();// 第一个字消失后立即从右边出现

    var imgs=this.data.imgs;
    console.log(this.data.imgs[0]["firmInfo"]);
  },

  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  //点击生成二维码
  //适配不同屏幕大小的canvas
  getQRCodeSize: function () {
    var size = 0;
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 278; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      size = width;

    } catch (e) {
      // Do something when catch error
      // console.log("获取设备信息失败"+e);
    }
    return size;
  },
  createQRCode: function (text, size) {
    //调用插件中的draw方法，绘制二维码图片

    let that = this

    // console.log('QRcode: ', text, size)
    let _img = QR.createQrCodeImg(text, {
      size: parseInt(size)
    })
    that.setData({
      'qrcode': _img
    })
  },
  // 二维码代码结束
  // tapHandler: function (e) {
  //   console.log(e);
  //   console.log(e.currentTarget.dataset.code);
  //   qrcode.makeCode(e.currentTarget.dataset.code); //用元素对应的code更新二维码
   
  //   wx.setStorageSync("customCode", e.currentTarget.dataset.code);
  //   // qrcode.makeCode(e.target.dataset.code); //用元素对应的code更新二维码
  //   // console.log(e.target.dataset.code);
  //   // wx.setStorageSync("customCode", e.target.dataset.code);
  // }, 





})