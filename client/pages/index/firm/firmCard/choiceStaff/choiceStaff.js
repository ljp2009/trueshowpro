// pages/index/firm/firmCard/choiceStaff/choiceStaff.js

// var myfunc=require( "../../../../common/timearea/timearea.js",);
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    
    dateArr:[],  //时间
    staffDetail:[],  //技师详细信息
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
    //时间滑块 变量
    timearr:[1,2,3,4,5,6,7],


    serviceId:0, //当前这个服务项目的id
    sleepIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var serviceId = options.serviceId;
    that.setData({
      serviceId: serviceId
    })
   
   
    // 请求后端 得到数据
    wx.request({
      //url: app.globalData.webroot + '/index/user/getStaffByService',
      url: app.globalData.webroot1 + '/index/user/getStaffByService',
      method: "post",
      data: {
        serviceId: that.data.serviceId,    //服务项目id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
       console.log(res.data);
        var data = res.data.msg;
        that.setData({
          staffDetail: data
        })
        console.log(that.data.staffDetail);
        //

      //先得到空闲的数组
      
        for (var i = 0; i < data.length; i++) {
          
          console.log(i);
          var satisfection = data[i]['Satisfection'] / 10;//评分
          var num = Math.round(satisfection);//四舍五入分
          


          data[i]['stars'] = num;

          var WorkStartTime = data[i]['WorkStartTime']  //开始工作时间
          var WorkEndTime = data[i]['WorkEndTime']  //结束工作时间
          console.log(WorkStartTime + "--" + WorkEndTime)
          console.log(data[i]['sleeptime'])

          //往空闲中增加一个字段技师
          console.log("技师的id=" + data[i]['StaffId'])
          

          // 关于日期的js
          
          var date1 = new Date();
          var arr = [];
          var showDate = date1.getFullYear() + '/' + (date1.getMonth() + 1) + '/' + date1.getDate();
          console.log("今天日期是" + showDate)   //今天日期
          
          arr.push(date1.getDate());
          for (var k = 1; k <= 6; k++) {//后7天
            date1.setDate(date1.getDate() + 1);
            showDate = date1.getFullYear() + '/' + (date1.getMonth() + 1) + '/' + date1.getDate();
            // console.log(showDate)

            
            arr.push(date1.getDate());

          }
          console.log(data[i])
          data[i]["date1"] = arr
          that.timeareafun(WorkStartTime,WorkEndTime,data[i]['sleeptime'],i);
          //设置每个按钮的选中状态
          data[i]["sleepIndex"]=0
        }
     
       
        console.log("整理得---");
        console.log(data);
        that.setData({
          staffDetail: data
        })
        console.log(that.data.staffDetail);
        
      }
    })
  },
  timeareafun: function (WorkStartTime, WorkEndTime, _sleeptime,index){
    //////时间组件
    var header = this.selectAllComponents(".timearea")[index]
    
    var sleeptime = [];
    for (var m = 0; m < _sleeptime.length;m++){
        var _obj={
          x1: _sleeptime[m]["StartTime"],
          x2: _sleeptime[m]["EndTime"],
          x1x: "0",
          x2x: "0"
        }
      sleeptime.push(_obj)
    }
    
    console.log(sleeptime)
    var obj = {
      ifshowenable: false,   //控制选择时间
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
      enabledarea: {
        x1: "12:30",
        x2: "14:00",
        x1x: 0,
        x2x: 0
      },
      canvasHeight:60

    }
    header.canvasdraw(obj)
  },
  changesleeptime:function(e){
    var that=this;
    var staffId = e.currentTarget.dataset['index1'];
    var selectedDate = e.currentTarget.dataset['index'];
    console.log("---" + e.currentTarget.dataset['index'] + "---" + e.currentTarget.dataset['index1'])
   
    // 请求后端 得到数据
    wx.request({
      //url: app.globalData.webroot + '/index/user/getSleepTime',
      url: app.globalData.webroot1 + '/index/user/getSleepTime',
      method: "post",
      data: {
        staffId: e.currentTarget.dataset['index1'],    //技师id
        num: e.currentTarget.dataset['index']
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data);
        var sleeptime=res.data["msg"];
        console.log(that.data.staffDetail);
        var staffDetail = that.data.staffDetail;
        
        // var =that.data.staffDetail[]["WorkStartTime"]
        for (var m = 0; m < that.data.staffDetail.length;m++){
          if (staffId == that.data.staffDetail[m]["StaffId"]){
            staffDetail[m]["sleepIndex"] = selectedDate;

            
            
            console.log("iii=" + m + "----" + that.data.staffDetail[m]["WorkStartTime"])
            //WorkEndTime
            that.timeareafun(that.data.staffDetail[m]["WorkStartTime"], that.data.staffDetail[m]["WorkEndTime"], sleeptime,m);

            break;
          }
        }
        that.setData({
          staffDetail: staffDetail
        })

       
      }
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