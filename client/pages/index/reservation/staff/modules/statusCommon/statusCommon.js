// pages/index/reservation/staff/modules/statuscommon/statuscommon.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    currentReservationInfo: {},//存储当前约单的数据
    costCountAllcost: {},//当前顾客消费的笔数/ 总消费
    shortMsgVal: "", //简短留言输入值
    currentStatus:0, //记录当前的约单状态的
    ////////////////状态为2的变量 开始///////////////////
    reservationDataFromStatusTwo:{}, //状态2需要的数据
    payMessage:"",//价格说明
    settlevalue:"",//技师填写的结账金额
    radioTypevalue:1, //默认选中兑现优惠 记录选中那种单选类型  0---已另协商 1--兑现优惠
    customPay:0, //顾客支付的钱
    factIncome:0, //技师实际收的钱
    descPay:0, //选中兑现优惠的话  总共减去的钱//
    ////////////////状态为2的变量 结束///////////////////////////

    ifShowBtn:0, //标记状态3时 顾客未到,取消本约单按钮的

    ////////////约单状态为5或者6时需要的数据////////////////
    reservationDataFromStatusFive:[], //当前的约单服务项目和晒单数据
    starCountArr:[1,2,3,4,5],//代表五个星星
    rakeoff:0,//平台佣金
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
   
    // console.log(options.data)
    var that = this;
    //读取一下技师的uid 和技师昵称
    var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"];
    var nickName = JSON.parse(wx.getStorageSync("user"))["userinfo"]["nickName"];//昵称
    // var data = JSON.parse(options.data)
    //////////需要修改  先测试中
    var data = {
      Avatar: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJobUb46dQXYHxHyic3CBmpuIP1nkNHahQT6Tx5n8zoEc88BVC9nzJcOEzgbTCGyV0Ec3m7aLFgfKw/132",
      CustomerId: 115,
      PriceTotal:300,
      EndTime: "14:00",
      NickName: "你若安好那还得了",
      Poortime: 60,
      ReservationId: 20,
      StaffId: 115,
      StartTime: "13:00",
      Status: 5,
      FirmId:1,
      Shortmsg: "11111",
      logActTime: "2019-09-20 19:16",
      logActions: "顾客修改约单",
      service_resn: [
        {
          CUSTPoker: 1, Duration: 20, Name: "美睫/眉",
          Price_Max: "100.00", Price_Min: "30.00",
          ServiceName: "项目名称65", StaffPoker: 1
        },
        {
          CUSTPoker: 0, Duration: 50, Name: "保健",
          Price_Max: "100.00", Price_Min: "50.00",
          ServiceName: "项目名称", StaffPoker: 1
        }
      ],
    }
    var reservationId = data.ReservationId;//当前约单id
    var staffId = data.StaffId;//技师id
    var status = data.Status;//当前约单的状态
    var firmId = data.FirmId;//当前约单的隶属机构id
    console.log(reservationId)
    that.setData({
      currentStatus: status
    })
    console.log(that.data.currentStatus)
    ///////////////需要打开////////////////////////////
    //计时器检查约单状态 修改当前的约单状态 以此来更换当前的流程布局部分
    ////////////////////////////////////////////////////////////
    // setInterval(function(){
    //   that.checkStatus()
    // }, 1000);
      
    that.setData({
      currentReservationInfo: data,
      shortMsgVal: data.Shortmsg
    })

    //需要把当前约单写入技师约单已读表中
    wx.request({
      //url: app.globalData.webroot + '/index/reservation/newReadReservation',
      url: app.globalData.webroot1 + '/index/reservation/newReadReservation',
      method: "post",
      data: {
        staffId: staffId,
        reservationId: reservationId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        if (res.data.code > 0) {
          console.log("已读成功")
        } else {
          console.log("已读失败")
        }
      }
    })

    //服务器端获取当前顾客是否为老顾客
    var customerId = that.data.currentReservationInfo["CustomerId"];//顾客id
    wx.request({
      //url: app.globalData.webroot + '/index/reservation/getCurrentCustomerTypeAndAllcost',
      url: app.globalData.webroot1 + '/index/reservation/getCurrentCustomerTypeAndAllcost',
      method: "post",
      data: {
        customerId: customerId,
        firmId: firmId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var redata = res.data.msg;
        if (redata["count"]) {
          //当前是新顾客
          var costCount = redata["count"];//当前顾客消费的笔数
          var allcost = redata["allcost"];//当前顾客的总消费
          var obj = {
            costCount: costCount,
            allcost: allcost
          }
          that.setData({
            costCountAllcost: obj,
          })
          console.log(that.data.costCountAllcost)
        }
      }
    })

     ///////////////////////////////约单状态为2时需要渲染的数据///////////////
     if(that.data.currentStatus==2){
       console.log("----")
       //约单价格 约单的优惠 机构设置的佣金
       wx.request({
         //url: app.globalData.webroot + '/index/reservation/getCurrentCustomerTypeAndAllcost',
         url: app.globalData.webroot1 + '/index/reservation/getReservationDataFromStatusTwo',
         method: "post",
         data: {
           reservationId: reservationId,
           firmId: firmId
         },
         header: {
           'content-type': 'application/x-www-form-urlencoded' //post请求
         },
         success(res) {
           console.log(res.data.msg);
           var rakeoff = res.data.msg.Rakeoff;
          //  var redata = res.data.msg;
          that.setData({
            reservationDataFromStatusTwo: res.data.msg,
            rakeoff: rakeoff
          })
           var reservationDataFromStatusTwo = that.data.reservationDataFromStatusTwo;
           if (reservationDataFromStatusTwo.Promotedesc.length==0){
               //表示当前没有优惠 //
               that.setData({
                 radioTypevalue:0
               })
          }
         }
       })
     }

      ///////////////////////////////约单状态为3时需要渲染的数据///////////////
    if (that.data.currentStatus == 3) {
      //当前时间大于预约时间30分钟，显示 顾客未到,取消本约单 按钮
      //请求后端 查看
      wx.request({
        //url: app.globalData.webroot + '/index/reservation/getCurrentCustomerTypeAndAllcost',
        url: app.globalData.webroot1 + '/index/reservation/checkTimeFromStatusThree',
        method: "post",
        data: {
          reservationId: reservationId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //post请求
        },
        success(res) {
          console.log(res.data.msg);
          if (res.data.code == 1) {
            //已经超过了30分钟
            that.setData({
              ifShowBtn: 1
            })
          } else {
            //还没超过
            that.setData({
              ifShowBtn: 0
            })
          }

          console.log(that.data.ifShowBtn)
        }
      })

    }



    ///////////////////////////////约单状态为5时需要渲染的数据///////////////
    if (that.data.currentStatus == 5 || that.data.currentStatus == 6) {
      //请求后端 
      wx.request({
        //url: app.globalData.webroot + '/index/reservation/getServiceresnAndPokerByReservation',
        url: app.globalData.webroot1 + '/index/reservation/getServiceresnAndPokerByReservation',
        method: "post",
        data: {
          reservationId: reservationId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //post请求
        },
        success(res) {
          //console.log(res.data.msg);
          var data = res.data.msg;
            //还没超过
            that.setData({
              reservationDataFromStatusFive: data
            })
         //reservationDataFromStatusTwo.Rakeoff 平台佣金
          console.log(that.data.reservationDataFromStatusFive)
        
        }
      })

    }



  },
  ////////////////计时器调用的一个方法
 //封装一个方法 检查当前的约单状态 通过约单状态来渲染不同的布局和数据层
  checkStatus: function (){
    var that=this;
    var reservationId = that.data.currentReservationInfo.ReservationId;//当前约单id 
    console.log(reservationId)
    wx.request({
      //url: app.globalData.webroot + '/index/reservation/checkReservationStatus',
      url: app.globalData.webroot1 + '/index/reservation/checkReservationStatus',
      method: "post",
      data: {
        reservationId: reservationId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        //
        var status = res.data.msg;
        that.setData({
          currentStatus: status
        })
        console.log(that.data.currentStatus)
       
      }
    })
  },
 ////////////////约单状态为2开始///////////////////////////
  //技师填写 价格说明 更新约单表的字段 PayMessage
  upPayMessage:function(e){
    var that=this;
    
    console.log(e.detail.value)
    this.setData({
      payMessage: e.detail.value
    })

    //得到当前的约单id 更新约单表的

  },
  // 技师填写的结账金额
  settleAccountsChange: function (e) {
    var that=this;
    console.log(e.detail.value)
    var value = e.detail.value;
    if (parseFloat(value).toString() == "NaN"){
      wx.showToast({
        title: '结账金额必须数字类型',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    that.setData({
      settlevalue: e.detail.value
    })
    var settlevalue = that.fomatFloat(that.data.settlevalue, 2);
    //通过填写的结账金额计算 优惠对应减去 的钱
    var reservationDataFromStatusTwo = that.data.reservationDataFromStatusTwo;
    var promotedesc = reservationDataFromStatusTwo.Promotedesc;
    var rakeoff = reservationDataFromStatusTwo.Rakeoff;//佣金
    //判断当前选中了哪个 优惠类型
    var radioTypevalue = that.data.radioTypevalue;
    var descPay = 0;
    if (promotedesc.length>0){
      //当前有优惠
      for (var i = 0; i < promotedesc.length;i++) {
        
        if (promotedesc[i]["PromoteType"]==3){
          promotedesc[i]["DescVal"] = that.fomatFloat(promotedesc[i]["Discounts"][1],2);//四舍五入 并保留两位小数
          descPay += Number(promotedesc[i]["DescVal"]);
        } else { 
          promotedesc[i]["DescVal"] = that.fomatFloat(((1 - Number(promotedesc[i]["Discount"]) / 100) * settlevalue),2) ;
          descPay += Number(promotedesc[i]["DescVal"]);
        }
      }
      that.setData({
        reservationDataFromStatusTwo: reservationDataFromStatusTwo
      })
      console.log(that.data.reservationDataFromStatusTwo)
      console.log("总共减去的钱=" + descPay);
      that.setData({
        descPay: descPay
      })
      if (radioTypevalue == 0) {
        //已另协商
        // customPay: 0, //顾客支付的钱
        // factIncome: 0, //技师实际收的钱
        //算出实际收的钱
        var factIncome = that.fomatFloat(settlevalue * (1 - Number(rakeoff) / 100),2);
        that.setData({
          customPay: settlevalue,
          factIncome: factIncome
        })
      } else {
        //兑现优惠
        var customPay = that.fomatFloat(settlevalue - descPay,2);
        console.log(settlevalue)
        console.log("顾客支付="+customPay)
        //算出实际收的钱
        var factIncome1 = that.fomatFloat(customPay * (1 - Number(rakeoff) / 100), 2);
        that.setData({
          customPay: customPay,
          factIncome: factIncome1
        })
      }
     
    }else{
      //当前无优惠
      //算出实际收的钱
      var factIncome = that.fomatFloat(settlevalue * (1 - Number(rakeoff) / 100), 2);
      that.setData({
        customPay: settlevalue,
        factIncome: factIncome
      })
    }
   
  },
  //单选按钮 协商/优惠按钮改变事件
  radioTypeChange:function(e){
    var that=this;
    console.log(e.detail.value)
    this.setData({
      radioTypevalue: e.detail.value
    })
    var radioTypevalue = that.data.radioTypevalue;
    var settlevalue = that.fomatFloat(that.data.settlevalue,2); //填写的
    var reservationDataFromStatusTwo = that.data.reservationDataFromStatusTwo;
    var rakeoff = reservationDataFromStatusTwo.Rakeoff;//佣金
    var promotedesc = reservationDataFromStatusTwo.Promotedesc;
    var descPay = that.data.descPay;
    if (promotedesc.length>0){
      //有优惠
      if (radioTypevalue == 0) {
        //已另协商
        // customPay: 0, //顾客支付的钱
        // factIncome: 0, //技师实际收的钱
        //算出实际收的钱
        var factIncome = that.fomatFloat(settlevalue * (1 - Number(rakeoff) / 100), 2);
        that.setData({
          customPay: settlevalue,
          factIncome: factIncome
        })
      } else {
        //兑现优惠
        var customPay = that.fomatFloat(settlevalue - descPay, 2);
        console.log(settlevalue)
        console.log("顾客支付=" + customPay)
        //算出实际收的钱
        var factIncome1 = that.fomatFloat(customPay * (1 - Number(rakeoff) / 100), 2);
        that.setData({
          customPay: customPay,
          factIncome: factIncome1
        })
      }
    }else{
      //没有优惠
      //算出实际收的钱
      //算出实际收的钱
      var factIncome = that.fomatFloat(settlevalue * (1 - Number(rakeoff) / 100), 2);
      that.setData({
        customPay: settlevalue,
        factIncome: factIncome
      })
    }
    
  },
  //请顾客买单按钮的点击事件
  askCustomerPay:function(){
    console.log("--------请顾客买单按钮点击事件")
    //先判断输入结账金额框的值是否为空 并必须为数字类型
    var that=this;
    var reservationId = that.data.currentReservationInfo.ReservationId;//当前约单id 
    var payMessage = that.data.payMessage;//价格说明
    var settlevalue = that.data.settlevalue; //技师填写的结账金额
    var customPay = that.data.customPay;//顾客支付的金额
    var radioTypevalue = that.data.radioTypevalue;//选择的优惠类型
    console.log("--顾客支付="+customPay)
    if (customPay == "" || customPay<0){
      
      wx.showToast({
        title: '顾客支付不能为空且必须大于0',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    //更新约单表的 PromoteItemId  PayMessage 
    //根据当前是否选择了已另协商 更新PromoteItemId 字段为空
    //或者当前就没有优惠活动 PromoteItemId 字段已经为空
    var reservationDataFromStatusTwo = that.data.reservationDataFromStatusTwo;
    var promotedesc = reservationDataFromStatusTwo.Promotedesc;
    var type=0;
    console.log(radioTypevalue + "----" + promotedesc.length)
    if ((promotedesc.length == 0 && radioTypevalue == 1) || radioTypevalue==0){
      //没有优惠 但是选择了,也得按 已另协商走 或者选择的是已另协商
     //需要更新数据库的 PromoteItemId 字段为空 更新状态为4
      type = 1;
    }

    //请求后端更新数据
    wx.request({
      //url: app.globalData.webroot + '/index/reservation/upReservationStatusFromStatusTwo',
      url: app.globalData.webroot1 + '/index/reservation/upReservationStatusFromStatusTwo',
      method: "post",
      data: {
        type: type, //为1需要更新 PromoteItemId
        payMessage: payMessage,
        reservationId: reservationId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        if (res.data.code==1){
          //修改状态为4
          that.setData({
            currentStatus: 4
          })
          wx.showToast({
            title: '发送请求成功',
            icon: 'success',
            duration: 2000
          })

        }
      }
    })
    

  },
   ////////////////约单状态为2 结束//////////////////////////////////

/////////////////约单状态为3 开始//////////////////////////////////////////////////
//顾客未到。取消本约单的按钮点击事件
//修改用户信息 updUser() 顾客爽约数+1 PigeonCUST=1
  updUserIncPigeonCUST:function(){
    console.log("updUserIncPigeonCUST----------------")
    //请求服务器端 更新 顾客的爽约数+1 更新约单状态为超时取消
    //传顾客的id
    var that=this;
    var customerId = that.data.currentReservationInfo["CustomerId"];//顾客id
    wx.request({
      //url: app.globalData.webroot + '/index/reservation/updUserIncPigeonCUSTandStatus',
      url: app.globalData.webroot1 + '/index/reservation/updUserIncPigeonCUSTandStatus',
      method: "post",
      data: {
        customerId: customerId,
        reservationId: that.data.currentReservationInfo.ReservationId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        if (res.data.code == 1) {
       
          console.log("取消约单成功")
          that.setData({
            ifShowBtn: 0 //为了隐藏此按钮 不让技师重复点击
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }
        //console.log(res.data.msg);
        //更新当前的约单状态为10
        that.setData({
          currentStatus: 10
        })
      }
    })
  },
//////////////////////约单状态为3 结束/////////////////////////////
//////////////////////约单状态为5 / 6 开始////////////////////////////////
//staffPokerBtn
//技师点击晒单按钮的点击事件
  staffPokerBtn:function(e){
    var that=this;
    console.log("----staffPokerBtn")
    console.log(e.currentTarget.dataset.resnid);//得到的约单服务表的约单服务id
    var resnid = e.currentTarget.dataset.resnid;
    var reservationId=that.data.currentReservationInfo.ReservationId;//当前的约单id
    //var rakeoff = that.data.rakeoff;//平台佣金
    var rakeoff = 8;//平台佣金////需要修改
    var ifNewEdit=0;//0-为新建约单  1-编辑
    //跳转页面到 上传晒大图片的页面
    wx.navigateTo({
      url: '/pages/index/reservation/staff/modules/poker/poker?reservationId=' + reservationId + '&resnId=' + resnid + '&rakeoff=' + rakeoff + '&ifNewEdit=' + ifNewEdit
    })
  },
  /**
   * editStaffPokerBtn 可以修改服务项目的技师晒单
   * 编辑 秀点击事件
   */
  editStaffPokerBtn:function(e){
    var that = this;
    console.log("----editStaffPokerBtn")
    console.log(e.currentTarget.dataset.resnid);//得到的约单服务表的约单服务id
    var resnid = e.currentTarget.dataset.resnid;
    var reservationId = that.data.currentReservationInfo.ReservationId;//当前的约单id
    //var rakeoff = that.data.rakeoff;//平台佣金
    var rakeoff = 8;//平台佣金////需要修改
    var ifNewEdit = 1;//0-为新建约单  1-编辑
    wx.navigateTo({
      url: '/pages/index/reservation/staff/modules/poker/poker?reservationId=' + reservationId + '&resnId=' + resnid + '&rakeoff=' + rakeoff + '&ifNewEdit=' + ifNewEdit
    })
  },
//////////////////////约单状态为5 / 6 结束//////////////////////////////////////

  // num为传入的值，n为保留的小数位
  fomatFloat:function (num, n){
        var f = parseFloat(num);
        if(isNaN(f)){
      return false;
    }
    f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); 
    var s = f.toString();
    var rs = s.indexOf('.');
    //判定如果是整数，增加小数点再补0
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + n) {
      s += '0';
    }
    return s;
    },  
 
  //简短留言输入框失去焦点时触发，
  upShortMsg: function (e) {
    var that = this;
    //获取输入的值
    var value = e.detail.value;
    that.setData({
      shortMsgVal: value
    })
    console.log(e.detail.value);
    //服务器端更新约单表的shortmsg 字段
    wx.request({
      //url: app.globalData.webroot + '/index/reservation/upReservationShortmsg',
      url: app.globalData.webroot1 + '/index/reservation/upReservationShortmsg',
      method: "post",
      data: {
        reservationId: that.data.currentReservationInfo.ReservationId,
        shortmsg: value
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        if (res.data.code == 1) {
          console.log("更新成功")
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }
        //console.log(res.data.msg);

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

  },
  //弹窗
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  //弹出框蒙层截断touchmove事件
  preventTouchMove: function () {
  },
  // 隐藏模态对话框
  hideModal: function () {
    this.setData({
      showModal: false
    })
  },
  // 对话框取消按钮点击事件
  onCancel: function () {
    this.hideModal()
  },
  //对话框确认按钮点击事件
  onConfirm: function () {
    this.hideModal();
  }
})


