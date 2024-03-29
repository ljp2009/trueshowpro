// // // pages/test1/test1.js
Component({
  properties: {
    modalHidden: {
      type: Boolean,
      value: true
    }, //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden  
    modalMsg: {
      type: String,
      value: '',
    }
   
  },
  /**
   * 页面的初始数据
   */
  data: {
    timedata: {      //记录当前不能选的区域 以及可以选的区域
      workarea: {
        x1: "09:00",
        x2: "22:00",
        x1x: 0,
        x2x: 0
      },
      disabledarea: [
        {
          x1: "09:30",
          x2: "11:00",
          x1x: 0,
          x2x: 0
        },
        {
          x1: "11:30",
          x2: "12:00",
          x1x: 0,
          x2x: 0
        }
      ],

      currentorderarea: [
        {
          x1: "15:30",
          x2: "16:00",
          x1x: 0,
          x2x: 0
        },
        {
          x1: "16:30",
          x2: "18:00",
          x1x: 0,
          x2x: 0
        }
      ],
      //开始服务
      enabledarea: {
        x1: "12:30",
        x2: "14:00",
        x1x: 0,
        x2x: 0
      },
      leftarea: 0,
      rightarea: 0,
      xdis: 10,
      startX: 0,
      movex: 0,
      down: {
        x1: 0,
        x2: 0
      },
      sideswidth: 0.95,
    },
    ifshowenable: false,    //控制显示拖拽时间
    ifShowworkTxt:true,    //控制点击拖动选择时段文字是否显示
    canvasHeight:50,
    bgColor:"#f6f6f6"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("时间组件---------")

    this.changeworktime()

    this.drawarea()



  },
  methods:{
    canvasdraw: function (options) {
      console.log("时间组件---------")
      console.log(options)
      var obj = this.data.timedata;
      
        obj["workarea"]= options["workarea"]
        obj["disabledarea"]= options["disabledarea"]
        obj["currentorderarea"]= options["currentorderarea"]
        obj["enabledarea"]= options["enabledarea"]
      if (options["bgColor"]){
        obj["bgColor"] = options["bgColor"]
      }else{
        obj["bgColor"] = "#f6f6f6"
      }
      
      this.setData({
        ifshowenable: options["ifshowenable"],
        ifShowworkTxt: options["ifShowworkTxt"],
        canvasHeight: options["canvasHeight"],
        bgColor: obj["bgColor"],
        timedata: obj
      })

      this.changeworktime()

      this.drawarea()



    },
  changeworktime: function () {
    //已经预约出去的工作时间和结束工作时间转成时间戳
    var disabledAreaArr = [];
    var currentOrderAreaArr = [];

    //灰色的
    for (var i = 0; i < this.data.timedata.disabledarea.length; i++) {
      var date4 = this.data.timedata.disabledarea[i]["x1"];//不可选择的时间段开始时间
      date4 = date4.split(":")    //分割时间09    30
      date4 = date4[0] * 60 * 60 + date4[1] * 60   //09*60*60+30*60(化成秒数)



      var date5 = this.data.timedata.disabledarea[i]["x2"];//不可选择的时间段结束时间
      date5 = date5.split(":")
      date5 = date5[0] * 60 * 60 + date5[1] * 60


      var obj = {
        starttime: date4,
        endtime: date5
      }
      disabledAreaArr.push(obj)
    }


    //绿色的
    for (var i = 0; i < this.data.timedata.currentorderarea.length; i++) {
      var date4 = this.data.timedata.currentorderarea[i]["x1"];//不可选择的时间段开始时间
      date4 = date4.split(":")    //分割时间09    30
      date4 = date4[0] * 60 * 60 + date4[1] * 60   //09*60*60+30*60(化成秒数)



      var date5 = this.data.timedata.currentorderarea[i]["x2"];//不可选择的时间段结束时间
      date5 = date5.split(":")
      date5 = date5[0] * 60 * 60 + date5[1] * 60


      var obj = {
        starttime: date4,
        endtime: date5
      }
      currentOrderAreaArr.push(obj)
    }




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
    // disabledAreaArr
    console.log(disabledAreaArr)
    var disabledarea = this.data.timedata.disabledarea
    for (var i = 0; i < disabledAreaArr.length; i++) {
      var startServeredX = ((endWorkX - startWorkX) / (date1 - date)) * (disabledAreaArr[i]["starttime"] - date) + startWorkX;
      var endServeredX = ((endWorkX - startWorkX) / (date1 - date)) * (disabledAreaArr[i]["endtime"] - date) + startWorkX;
      console.log(startServeredX + "---" + endServeredX)
      disabledarea[i]["x1x"] = startServeredX;
      disabledarea[i]["x2x"] = endServeredX;
    }

    //////////////绿色的
    console.log(currentOrderAreaArr)
    var currentOrderArea = this.data.timedata.currentorderarea
    for (var i = 0; i < currentOrderAreaArr.length; i++) {
      var startServeredX = ((endWorkX - startWorkX) / (date1 - date)) * (currentOrderAreaArr[i]["starttime"] - date) + startWorkX;
      var endServeredX = ((endWorkX - startWorkX) / (date1 - date)) * (currentOrderAreaArr[i]["endtime"] - date) + startWorkX;
      console.log(startServeredX + "---" + endServeredX)
      currentOrderArea[i]["x1x"] = startServeredX;
      currentOrderArea[i]["x2x"] = endServeredX;
    }




    // console.log("已经预约对应的x---" +  startServeredX + "---" + endServeredX)

    var timedata = this.data.timedata;
    timedata["workarea"] = workarea;  //工作区域
    timedata["enabledarea"] = enabledarea;//可选择区域
    timedata["disabledarea"] = disabledarea;//补课选择区域
    timedata["currentorderarea"] = currentOrderArea;//补课选择区域
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
    var context = wx.createCanvasContext('timeCanvas',this)
    //绘制底部区域
    context.clearRect(0, 0, w, this.data.canvasHeight)
    context.beginPath()
    context.setFillStyle(this.data.bgColor)
    context.rect(0, 0, w, this.data.canvasHeight)
    
    context.fill()

   
    context.closePath()
    // 绘制灰色区域
    context.beginPath()
    context.setFillStyle("#ddd")

    //把灰色的矩形绘制出来
    console.log("灰色框的个数=" + this.data.timedata.disabledarea.length)
    console.log(this.data.timedata.disabledarea)
    for (var i = 0; i < this.data.timedata.disabledarea.length; i++) {
      context.rect(this.data.timedata.disabledarea[i].x1x, 0, (this.data.timedata.disabledarea[i].x2x - this.data.timedata.disabledarea[i].x1x), this.data.canvasHeight)
    }

    context.fill()
    context.closePath()
    context.beginPath()
    context.setFillStyle("#99ff00")
    ////////////////绿色框绘制
    for (var i = 0; i < this.data.timedata.currentorderarea.length; i++) {
      context.rect(this.data.timedata.currentorderarea[i].x1x, 0, (this.data.timedata.currentorderarea[i].x2x - this.data.timedata.currentorderarea[i].x1x), this.data.canvasHeight)
    }

    context.fill()
    context.closePath()

    if (this.data.ifshowenable) {
      context.beginPath()
      context.setFillStyle("#ff6600")
      context.rect(this.data.timedata.enabledarea.x1x, 0, (this.data.timedata.enabledarea.x2x - this.data.timedata.enabledarea.x1x), this.data.canvasHeight)
      context.fill()
      context.closePath()
    }
    // 绘制一个默认的可以拖拽的区域（红色区域）

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
    // var ifreturn=
    for (var i = 0; i < timedata.disabledarea.length; i++) {
      var if1 = timedata.enabledarea.x1x > timedata.disabledarea[i]["x1x"] && timedata.enabledarea.x1x < timedata.disabledarea[i]["x2x"]
      var if2 = timedata.enabledarea.x2x > timedata.disabledarea[i]["x1x"] && timedata.enabledarea.x2x < timedata.disabledarea[i]["x2x"]
      var if3 = timedata.disabledarea[i]["x1x"] > timedata.enabledarea.x1x && timedata.disabledarea[i]["x2x"] < timedata.enabledarea.x2x
      if (if1 || if2 || if3) {
        //不改变
        console.log("不可以移动到此处")
        timedata.enabledarea["x1x"] = down.x1;
        timedata.enabledarea["x2x"] = down.x2;
        break;

      }
    }

    this.setData({
      timedata: timedata
    })

    this.drawarea();
    this.getPos(); //重新计算时间
  },
  childRun() {
    console.log('我是子组件的方法---')
    this.changeworktime()

    this.drawarea()
  }
  }
})


