// pages/index/reservation/staff/modules/jordanModalTwo/jordanModalTwo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    staffId: 0, //技师id
    date:"",//日期
    month:"",//月份
    day: "",//日
    workStartTime: "", //技师上班时间
    workEndTime: "", //技师下班那时间
    radioVal:"", //当前点击的哪个按钮  全天休息/全天接单
    staffSchedule:[], //技师时间安排数据 需要显示在全天接单对应的时间快上
    startRestTime:"",//全天接单里的开始休息输入框的值
    endRestTime: "",//全天接单里的结束休息输入框的值
    restTimeArr:[] //记录当前选出的休息时间段数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // {staffId: "115", date: "2019-09-22", month: "9", day: "22"}
    var staffId = options.staffId;//当前技师id
    var date = options.date;//当前点击过来的日期
    var month = options.month;//当前点击过来的日期的月份
    var day = options.day;//当前点击过来的日期的日
    //console.log(staffId + "---" + date);
  //   console.log(options);
  //  return;
    //需要修改成动态的
    // var staffId=115;
    // var date ="2019-09-22";
    // var month = "9";
    // var day = "22";
    that.setData({
      staffId: staffId,
      date: date,
      month: month,
      day: day
    })
    //首先获取技师的上下班时间
    //通过当前技师id 读取她之前设置的上下班时间 然后显示再页面上
    wx.request({
      //url: app.globalData.webroot + '/index/user/getStaffById',
      url: app.globalData.webroot1 + '/index/user/getStaffById',
      method: "post",
      data: {
        uid: that.data.staffId
        // uid: 115
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var data = res.data.msg;
        var workStartTime = data["WorkStartTime"];
        var workEndTime = data["WorkEndTime"];
        that.setData({
          workStartTime: workStartTime,
          workEndTime: workEndTime,
          startRestTime: workStartTime,
          endRestTime: workEndTime
        })
        console.log(that.data.workStartTime + "---" + that.data.workEndTime);

        //获取当天的技师安排
        that.getstafftimeByid();

      }
    })

    

    
  },
  getstafftimeByid:function(){
    var that = this;
    //getScheduleByStaffId
    //获取当天的技师安排
    wx.request({
      //url: app.globalData.webroot + '/index/user/getScheduleByStaffId',
      url: app.globalData.webroot1 + '/index/user/getScheduleByStaffId',
      method: "post",
      data: {
        staffId: that.data.staffId,
        pickDateStart: that.data.date
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        
        console.log(res.data.msg);
        var data = res.data.msg;
        if (data.length != 0) {
          var arr = data[0]["timein"];
          var ifNum;
          


          //需要把当前有的休息时间段渲染出来
          for (var i = 0; i < arr.length; i++) {
            if (arr[i]["ReservationId"] == 0) {
              var obj = {
                startTime: arr[i]["StartTime"],
                endTime: arr[i]["EndTime"]
              }
              var restTimeArr = that.data.restTimeArr;
              restTimeArr.push(obj);
              that.setData({
                restTimeArr: restTimeArr
              })
              //查看是否存在有全天休息的那条数据 为了渲染 全天休息/全天接单
              //radioVal
            
              if (arr[i]["StartTime"] == that.data.workStartTime && arr[i]["EndTime"] == that.data.workEndTime) {
                //存在全天休息
                ifNum = 0;
                console.log("-----存在全天休息")
                that.setData({
                  radioVal: 0
                })
              }

            }
          }


          that.setData({
            staffSchedule: arr,//需要显示到时间快上的时间段
          })
          console.log(that.data.staffSchedule)
          if (ifNum == 0) {
            that.setData({
              radioVal: 0
            })
          } else {
            that.setData({
              radioVal: 1
            })
          }
          console.log(that.data.radioVal)
        } else {
          //当前没有任何时间安排
          that.setData({
            radioVal: 1
          })
        }


        ////把时间段和开始工作时间和结束工作时间渲染到时间组件上
        that.timeareafun()
      }
    })
  },

  timeareafun: function () {
    var workstarttime = this.data.workStartTime;
    var workendtime = this.data.workEndTime;
    var _sleeptime = this.data.staffSchedule;
    //that.data.workStartTime, that.data.workEndTime, that.data.staffSchedule
    ///////改变时间段/////
    console.log(_sleeptime)
    //////时间组件
    var header = this.selectAllComponents(".timearea")[0]
    if (header==undefined){
      return;
    }
    console.log(header)

    var grayTime = [];
    var greenTime = [];
    for (var m = 0; m < _sleeptime.length; m++) {

      var _obj = {
        x1: _sleeptime[m]["StartTime"],
        x2: _sleeptime[m]["EndTime"],
        x1x: 0,
        x2x: 0
      }

      if (_sleeptime[m]["ReservationId"] == 0) {
        grayTime.push(_obj)
      } else {
        greenTime.push(_obj)
      }

    }

    var obj = {
      ifshowenable: false,   //控制选择时间
      ifShowworkTxt: false,   //控制上班时间是否显示
      workarea: {          //指定工作时间和结束时间
        x1: workstarttime,
        x2: workendtime,
        x1x: 0,
        x2x: 0
      },
      disabledarea: grayTime,

      currentorderarea: greenTime,
      enabledarea: {
        x1: "12:30",
        x2: "14:00",
        x1x: 0,
        x2x: 0
      },
      canvasHeight: 25,
      bgColor: "#f6f6f6"

    }
    header.canvasdraw(obj)
  },


  //点击取消按钮的事件
  cancelBtn:function(){
    wx.navigateBack({
      delta: 2
    })

  },
  //单选按钮 侦听当前是点击了全天休息还是全天接单
  radioChange: function (e) {
    var that=this;
    var value = e.detail.value;//0--全天休息  1-全天接单
    that.setData({
      radioVal: value
    })
    //通过radioVal来判断显示的不一样布局部分
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    that.timeareafun()
  },
  ///pages/index/reservation/staff/modules/jordan/jordan
  //点击确认按钮 事件
  confirmBtn:function(){
    var that = this;
    var restTimeArr = that.data.restTimeArr;//存储全天接单里的休息时间区间段数组
    var workStartTime = that.data.workStartTime;//上班开始时间
    var workEndTime = that.data.workEndTime;//上班结束时间
    var date = that.data.date;//当前的日期
    //新建技师安排
    //通过radioVal的值来判断是设置的全天休息类型还是全天接单里的类型
    var radioVal = that.data.radioVal;
    var reservationId = 0;
    if (radioVal==0){
        //全天休息 约单id=0
      var insertData=[
        {
          startTime: workStartTime + ":00",
          endTime: workEndTime + ":00"
        }
      ];
     
    }else{
       //全天接单里的休息时间段
      var insertData = restTimeArr;
    }
  
    wx.request({
      //url: app.globalData.webroot + '/index/user/updateUserMySubCat',
      url: app.globalData.webroot1 + '/index/user/newScheduleToStaff',
      method: "post",
      data: {
        pickDate: date,
        reservationId:0,
        startTimeAndendTime: JSON.stringify(insertData),
        workStartTime: workStartTime,//技师上班时间  设置接单里面server 需要用到
        workEndTime: workEndTime,////技师上班时间
        staffId: that.data.staffId,
        type: radioVal //标记设置的类型 0--全天休息 1--还是全天接单里面的
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
       // console.log(res.data.msg);
        if (res.data.code==1){
            //设置成功
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function(){
           //
            wx.navigateTo({
              url: '/pages/index/reservation/staff/modules/jordan/jordan',
            })
          },500)
       }else{
          wx.showToast({
            title: '设置失败',
            icon: 'none',
            duration: 1000
          })
       }
      }
    })



  },
  //全天接单里的开始休息输入框的值 改变事件
  startRestTimeChange:function(e){
    var that = this;
    var value = e.detail.value;//0--全天休息  1-全天接单
    that.setData({
      startRestTime: value
    })
    console.log(that.data.startRestTime)
  },
  //全天接单里的结束休息输入框的值 改变事件
  endRestTimeChange: function (e) {
    var that = this;
    var value = e.detail.value;//0--全天休息  1-全天接单
    that.setData({
      endRestTime: value
    })
    console.log(that.data.endRestTime)
  },
  //全天接单里的添加图片按钮的点击事件
  addImgBtn:function(){
   //获取当前填写的开始休息时间 下班时间
    var that=this;
    var workStartTime = that.data.workStartTime;//技师上班时间
    var workEndTime = that.data.workEndTime; //技师下班那时间
    //转换为数字
    var workStartTime1 = Number(workStartTime.split(':').join(''));
    var workEndTime1 = Number(workEndTime.split(':').join(''));
    var restTimeArr = that.data.restTimeArr;//存储添加的休息时间段
    var startRestTime = that.data.startRestTime;
    var endRestTime = that.data.endRestTime;
    var staffSchedule = that.data.staffSchedule;
    var startRestTime1 = Number(startRestTime.split(':').join(''));
    var endRestTime1 = Number(endRestTime.split(':').join(''));
    console.log(startRestTime1 + "-休息--" + endRestTime1);
    console.log(workStartTime1 + "-上下班--" + workEndTime1);
    console.log(staffSchedule);
   // return;
    //当点击的时候 查看当前的这两个值是否满足加入数据库的条件
    //第一 需要查看结束休息时间>开始休息时间 以及不能为空
    if (startRestTime == "" || endRestTime == "") {
      wx.showToast({
        title: '时间不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (endRestTime1 <= startRestTime1) {
      wx.showToast({
        title: '结束休息时间必须晚于开始休息时间',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (workStartTime1 > startRestTime1 || workEndTime1 < endRestTime1 || (workStartTime1 > startRestTime1 && workEndTime1 < endRestTime1)) {
      console.log(startRestTime1 + "-休息--" + endRestTime1);
      console.log(workStartTime1 + "-上下班--" + workEndTime1);
      wx.showToast({
        title: '休息时间必须在上下班时间区间内',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    console.log("----------------------------------第二")
   //第二比较用户添加的时间段数组是否在此区间内
   var iflen=0;
    if (restTimeArr.length!=0){
      for (var i = 0; i < restTimeArr.length; i++) {
        var itemstartTime = Number(restTimeArr[i]["startTime"].split(':').join(''));
        var itemendTime = Number(restTimeArr[i]["endTime"].split(':').join(''));
        console.log("-----------------" + itemstartTime + itemendTime)
        if ((startRestTime1 <= itemstartTime && endRestTime1 <= itemstartTime) || (startRestTime1 >= itemendTime && endRestTime1 >= itemendTime)) {
          iflen++;
          }
        //Number(restTimeArr[i]["startTime"].split(':').join(''))
      }
      console.log(iflen + "----" + restTimeArr.length)
      if (iflen != restTimeArr.length) {
        console.log("---")
        wx.showToast({
          title: '当前添加的休息区间和已添加的区间不得冲突',
          icon: 'none',
          duration: 1000
        })
        return;
      }
   }
    console.log("-------------------restTimeArr为空-")
    console.log(staffSchedule.length)
    console.log(iflen)
    if (staffSchedule.length == 0 && iflen==0){
      console.log("---------------------")
    var obj = {
      startTime: startRestTime,
      endTime: endRestTime
    }
    restTimeArr.push(obj);
    that.setData({
      restTimeArr: restTimeArr
    })
      console.log(that.data.restTimeArr)
    return;
  }
   
    
 //第三 比较ReservationId！=0的那些时间 

      var ifneed = 0;
      var ifneed1 = 0;
      for (var i = 0; i < staffSchedule.length; i++) {
        if (staffSchedule[i]["ReservationId"]!=0){
          ifneed++;
          var itemstartTime = Number(staffSchedule[i]["StartTime"].split(':').join(''));
          var itemendTime = Number(staffSchedule[i]["EndTime"].split(':').join(''));
          if ((startRestTime1 <= itemstartTime && endRestTime1 <= itemstartTime) || (startRestTime1 >= itemendTime && endRestTime1 >= itemendTime)){
              //满足数据库的 
            ifneed1 ++;
              
          }
        }
      }
      console.log(ifneed +"---"+ ifneed1)
     // return;
      if (ifneed == ifneed1){
        console.log(ifneed + "---" + ifneed1)
           //满足条件了
           var obj={
             startTime: startRestTime,
             endTime: endRestTime
           }
        restTimeArr.push(obj);
        that.setData({
          restTimeArr: restTimeArr
        })
      }else{
        console.log(ifneed + "---" + ifneed1)
        wx.showToast({
          title: '当前添加的休息区间和已有的服务时间区间不得冲突',
          icon: 'none',
          duration: 1000
        })
        return;
      }

  
   console.log(that.data.restTimeArr);

  },
  /////removeRestTimesBtn
  //点击删除休息时间区间 
  removeRestTimesBtn:function(e){
    var that=this;
    var restTimeArr = that.data.restTimeArr;
    var index = e.currentTarget.dataset.index;
    restTimeArr.splice(index, 1);
    console.log("---" + index)
    that.setData({
      restTimeArr:restTimeArr
    })
    console.log(that.data.restTimeArr)
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