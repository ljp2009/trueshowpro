// pages/test1/test1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      timedata:{      //记录当前不能选的区域 以及可以选的区域
        workarea: {
          x1: "09:00",
          x2: "22:00",
          x1x: 0,
          x2x: 0
        }, 
        disabledarea:{
          x1:"09:30",
          x2:"11:00",
          x1x:0,
          x2x:0
        },
        enabledarea:{
          x1: "11:30",
          x2: "13:00",
          x1x:150,
          x2x:200
        },
        leftarea:20,
        rightarea:20,
        xdis:10,
        startX:0,
        movex:0,
        down:{
          x1:0,
          x2:0
        }
      },
   
    
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    this.changeworktime()

    this.drawarea()


    
  },
  changeworktime:function(){
    //已经预约出去的工作时间和结束工作时间转成时间戳
    // var date4 = this.data.startservered;
    var date4 = this.data.timedata.disabledarea["x1"];
    date4 = date4.split(":")
    date4 = date4[0] * 60 * 60 + date4[1] * 60
    console.log("--已经预约出去的时间：" + this.data.startservered + "----" + date4)

    // var date5 = this.data.endserverd;
    var date5 = this.data.timedata.disabledarea["x2"];
    date5 = date5.split(":")
    date5 = date5[0] * 60 * 60 + date5[1] * 60
    console.log(this.data.endserverd + "----" + date5)

    


    //开始工作时间和结束工作时间转成时间戳
    // var date = this.data.startwork;
    var date = this.data.timedata.workarea["x1"];
    date = date.split(":")
    date = date[0] * 60 * 60 + date[1] * 60
    console.log("开始工作的时间：" + this.data.startwork + "----" + date)

    // var date1 = this.data.endwork;
    var date1 = this.data.timedata.workarea["x2"];
    date1 = date1.split(":")
    date1 = date1[0] * 60 * 60 + date1[1] * 60
    console.log(this.data.endwork + "----" + date1)

    //开始服务时间和结束服务时间转成秒
    // var date2 = this.data.startserver;
    var date2 = this.data.timedata.enabledarea["x1"];
    date2 = date2.split(":")
    date2 = date2[0] * 60 * 60 + date2[1] * 60
    console.log("开始服务的时间：" + this.data.startserver + "----" + date2)

    // var date3 = this.data.endserver;
    var date3 = this.data.timedata.enabledarea["x2"];
    date3 = date3.split(":")
    date3 = date3[0] * 60 * 60 + date3[1] * 60
    console.log(this.data.endserver + "----" + date3) 

    //转成对应的x坐标开始工作的x和结束工作的x
     // //读取当前最左侧的x坐标
    var w = wx.getSystemInfoSync().windowWidth; 
    
    var startWorkX=w*0.05;
    var endWorkX=w*0.95;
    console.log("工作对应的x-----------w="+w+"----"+startWorkX + "-----" + endWorkX)

    var workarea = this.data.timedata.workarea
    workarea["x1x"] = startWorkX
    workarea["x2x"] = endWorkX

    //转成对应的x坐标开始服务的x和结束服务的x
    console.log(startWorkX + "---" + date2+"---"+date)
    var startServerX = ((endWorkX - startWorkX) / (date1 - date)) * (date2-date)
    var endServerX = ((endWorkX - startWorkX) / (date1 - date)) * (date3-date)

    var enabledarea = this.data.timedata.enabledarea
    enabledarea["x1x"] = startServerX
    enabledarea["x2x"] = endServerX

    console.log("服务对应的x---" + this.data.startserver + "---" + startServerX + "---" + endServerX)


    //已经预约出去的时间转成对应的x坐标开始服务的x和结束服务的x
    var startServeredX = ((endWorkX-startWorkX)/(date1-date))*(date4-date)
    var endServeredX = ((endWorkX - startWorkX) / (date1 - date)) * (date5-date)

    var disabledarea = this.data.timedata.disabledarea
    disabledarea["x1x"] = startServeredX
    disabledarea["x2x"] = endServeredX
   

    console.log("已经预约对应的x---" + + startServeredX + "---" + endServeredX)

    var timedata = this.data.timedata;
    timedata["workarea"] = workarea;
    timedata["enabledarea"] = enabledarea;
    timedata["disabledarea"] = disabledarea;
    this.setData({
      timedata: timedata

    })

  },
  getPos:function(){ 
    // 得到工作的时间点和坐标
    var workstartdate = this.data.timedata.workarea["x1"];
    workstartdate = workstartdate.split(":")
    workstartdate = workstartdate[0] * 60 * 60 + workstartdate[1] * 60
    // console.log("开始工作的时间：" + "----" + workstartdate)

    var workenddate = this.data.timedata.workarea["x2"];
    workenddate = workenddate.split(":")
    workenddate = workenddate[0] * 60 * 60 + workenddate[1] * 60
    // console.log("结束时间：" + workenddate) 

    var workstartx = this.data.timedata.workarea["x1x"];
    var workendx = this.data.timedata.workarea["x2x"];


      // 得到当前服务的时间点要求坐标所对应的时间点

    var enabledstartdate = this.data.timedata.enabledarea["x1x"];
    var enabledenddate = this.data.timedata.enabledarea["x2x"];
    console.log("workendx---" + workendx + "--workstartx---wordtime--" + workstartdate + "--" + workenddate+"---" + workstartx+"---" + enabledstartdate + "---" + enabledenddate)

    //求左边对应的时间戳
    var enabledstartx = enabledstartdate / ((workendx - workstartx)/(workenddate-workstartdate));
    var enabledendx = enabledenddate/ ((workendx - workstartx) / (workenddate - workstartdate));

    // var enabledstartx = enabledstartdate/ ((workendx - workstartx) / (workenddate - workstartdate)) * (date4 - workstartdate)
    // var enabledendx = ((workendx - workstartx) / (workenddate - workstartdate)) * (date5 - workstartdate)
    
    //时间戳再转成时：分
    var enabledstart = new Date(enabledstartx*1000);
    var enabledstartH = enabledstart.getHours();
    var enabledstartM = enabledstart.getMinutes();
    var enabledstartStr = enabledstartH + ":" + enabledstartM;

    var enabledend = new Date(enabledendx*1000);
    var enabledendH = enabledend.getHours();
    var enabledendM = enabledend.getMinutes();
    var enabledendStr = enabledendH + ":" + enabledendM;

    console.log("时间戳=" + enabledstartx + "---" + enabledendx+"开始服务的时间xxxxx：" + enabledstartStr + "----" + enabledendStr)

    var timedata = this.data.timedata;
    timedata.enabledarea["x1"] = enabledstartStr;
    timedata.enabledarea["x2"] = enabledendStr;

    this.setData({
      timedata: timedata

    })
   
  },
 
  drawarea:function(){
    // 读取当前容器的宽度
    var w = wx.getSystemInfoSync().windowWidth
    var context = wx.createCanvasContext('timeCanvas')

    context.clearRect(0,0,w,100)
    context.beginPath()
    context.setFillStyle("#00ff00")
    context.rect(0, 0, w, 100)
    context.fill()
    context.closePath()
    // 绘制灰色区域
    context.beginPath()
    context.setFillStyle("#cccccc")
    context.rect(this.data.timedata.disabledarea.x1x, 0, (this.data.timedata.disabledarea.x2x - this.data.timedata.disabledarea.x1x), 100)
    context.fill()
    context.closePath()

    // 绘制一个默认的可以拖拽的区域
    context.beginPath()
    context.setFillStyle("red")
    // context.rect(parseFloat(this.data.startserverX), 0, (parseFloat(this.data.endserverX) - parseFloat(this.data.startserverX)), 100)
    context.rect(this.data.timedata.enabledarea.x1x, 0, (this.data.timedata.enabledarea.x2x - this.data.timedata.enabledarea.x1x), 100)
    context.fill()
    context.closePath()
    context.draw()
  },

 

  start:function(e){
    var timedata = this.data.timedata
    timedata["startx"]=e.touches[0]["x"]
   
    
    var down = {};
    down["x1"] = timedata.enabledarea["x1x"];
    down["x2"] = timedata.enabledarea["x2x"];
    timedata["down"]=down;

    console.log("--" + timedata.enabledarea["x1x"])

    this.setData({
      timedata: timedata,
    })
  },
  move:function(e){
    
    var timedata = this.data.timedata
    console.log(e.touches[0]["x"] + "---" + timedata["leftarea"]+"---" + timedata.enabledarea["x1x"])
    if (e.touches[0]["y"] < timedata.leftarea && (e.touches[0]["x"] - timedata.enabledarea["x1x"]) < timedata.xdis){
      console.log("拖拽左边的边")
      

      timedata.enabledarea["x1x"] -= (timedata.enabledarea["x1x"] - e.touches[0]["x"]) 

    } else if ((100 - e.touches[0]["y"]) < timedata.rightarea && (e.touches[0]["x"] - timedata.enabledarea["x2x"]) < timedata.xdis){
      console.log("拖拽右边的边")
      timedata.enabledarea["x2x"] += (e.touches[0]["x"] - timedata.enabledarea["x2x"])


    }else{
      console.log("移动可选区域")
      var deltax = e.touches[0]["x"]-timedata["startx"]
      if (deltax<0){
        //左移动
        timedata.enabledarea["x1x"] -= Math.abs(deltax)
        timedata.enabledarea["x2x"] -= Math.abs(deltax)
      }else{
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
  end:function(e){ 
    console.log(e.touches)
    var timedata = this.data.timedata;
    var down = this.data.timedata.down;
    if (timedata.movex > timedata.disabledarea["x1x"] && timedata.movex < timedata.disabledarea["x2x"]){
      //不改变
      console.log("不可以移动到此处")
      timedata.enabledarea["x1x"]=down.x1;
      timedata.enabledarea["x2x"]=down.x2;
    }else{
      //不在这个区间内 就可以移动位置
      console.log("--可以移动到此处")
      

    }
    this.setData({
      timedata: timedata
    })

    this.drawarea();
    this.getPos(); //重新计算时间
  }
})