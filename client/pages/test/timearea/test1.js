// pages/test1/test1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      timedata:{      //记录当前不能选的区域 以及可以选的区域
        disabledarea:{
          x1:"9:30",
          x2:"11:00"
        },
        enabledarea:{
          x1:150,
          x2:200
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
    startwork:"09:00",    //开始工作的时间
    endwork:"22:00",      //结束工作的时间
    startX: 0,   //开始工作的时间所对应的x值
    endX: 0,     //结束工作的时间所对应的x值
    startserver:"11:30",   //开始服务的时间
    endserver:"13:30",     //结束服务的时间
    startserverX: 0,   //开始服务的时间所对应的x值
    endserverX: 0,     //结束服务的时间所对应的x值
    startservered:"9:30",
    endserverd:"11:00",
    startserveredx:0,    //已经预约出去的开始x
    endserverdx:0       //已经预约出去的结束x
    
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
    var date4 = this.data.startservered;
    date4 = date4.split(":")
    date4 = date4[0] * 60 + date4[1]
    console.log("--已经预约出去的时间："+this.data.startservered + "----" + date4)

    var date5 = this.data.endserverd;
    date5 = date5.split(":")
    date5 = date5[0] * 60 + date5[1]
    console.log(this.data.endserverd + "----" + date5)


    //开始工作时间和结束工作时间转成时间戳
    var date = this.data.startwork;
    date=date.split(":")
    date=date[0]*60+date[1]
    console.log("开始工作的时间："+this.data.startwork+"----"+date)

    var date1 = this.data.endwork;
    date1 = date1.split(":")
    date1 = date1[0] * 60 + date1[1]
    console.log(this.data.endwork + "----" + date1)

    //开始服务时间和结束服务时间转成秒
    var date2 = this.data.startserver;
    date2 = date2.split(":")
    date2 = date2[0] * 60 + date2[1]
    console.log("开始服务的时间："+this.data.startserver + "----" + date2)

    var date3 = this.data.endserver;
    date3 = date3.split(":")
    date3 = date3[0] * 60 + date3[1]
    console.log(this.data.endserver + "----" + date3)

    //转成对应的x坐标开始工作的x和结束工作的x
     // //读取当前最左侧的x坐标
    var w = wx.getSystemInfoSync().windowWidth; 
    
    var startWorkX=w*0.05;
    var endWorkX=w*0.95;
    console.log("工作对应的x-----------w="+w+"----"+startWorkX + "-----" + endWorkX)

    //转成对应的x坐标开始服务的x和结束服务的x
    console.log(startWorkX + "---" + date2+"---"+date)
    var startServerX = (endWorkX * date2) / date1
    var endServerX = (endWorkX * date3) / date1

    console.log("服务对应的x---" + this.data.startserver + "---" + startServerX + "---" + endServerX)


    //已经预约出去的时间转成对应的x坐标开始服务的x和结束服务的x
    var startServeredX = startWorkX * date4 / date
    var endServeredX = endWorkX * date5 / date1

    console.log("已经预约对应的x---" + + startServeredX + "---" + endServeredX)


    this.setData({
      startX: startWorkX,
      endX: endWorkX,
      startserverX: startServerX,
      endserverX: endServerX,
      startserveredx: startServeredX,
      endserverdx: endServeredX

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
    context.rect(this.data.startserveredx, 0, (this.data.endserverdx - this.data.startserveredx), 100)
    context.fill()
    context.closePath()

    // 绘制一个默认的可以拖拽的区域
    context.beginPath()
    context.setFillStyle("red")
    context.rect(parseFloat(this.data.startserverX), 0, (parseFloat(this.data.endserverX) - parseFloat(this.data.startserverX)), 100)
    context.fill()
    context.closePath()
    context.draw()
  },

 

  start:function(e){
    var timedata = this.data.timedata
    timedata["startx"]=e.touches[0]["x"]
   

    var down=this.data.timedata.down;
    down.x1 = timedata.enabledarea["x1"];
    down.x2 = timedata.enabledarea["x2"];

    this.setData({
      timedata: timedata,
      down: down
    })
  },
  move:function(e){
    var timedata = this.data.timedata
    console.log(e.touches[0]["x"] + "---" + timedata.enabledarea["x1"])
    if (e.touches[0]["y"] < timedata.leftarea && (e.touches[0]["x"] - timedata.enabledarea["x1"]) < timedata.xdis){
      console.log("拖拽左边的边")
      

      timedata.enabledarea["x1"] -= (timedata.enabledarea["x1"] - e.touches[0]["x"]) 

    } else if ((100 - e.touches[0]["y"]) < timedata.rightarea && (e.touches[0]["x"] - timedata.enabledarea["x2"]) < timedata.xdis){
      console.log("拖拽右边的边")
      timedata.enabledarea["x2"] += (e.touches[0]["x"] - timedata.enabledarea["x2"])


    }else{
      console.log("移动可选区域")
      var deltax = e.touches[0]["x"]-timedata["startx"]
      if (deltax<0){
        //左移动
        timedata.enabledarea["x1"] -= Math.abs(deltax)
        timedata.enabledarea["x2"] -= Math.abs(deltax)
      }else{
        // 右移动
        timedata.enabledarea["x1"] += Math.abs(deltax)
        timedata.enabledarea["x2"] += Math.abs(deltax)
      }
      timedata["startx"] = e.touches[0]["x"]
    }
    timedata.movex = e.touches[0]["x"]

    this.setData({
      timedata: timedata
    })

    this.drawarea()


  },
  end:function(e){ 
    console.log(e.touches)
    var timedata = this.data.timedata;
    var down = this.data.timedata.down;
    if (timedata.movex > timedata.disabledarea["x1"] && timedata.movex < timedata.disabledarea["x2"]){
      //不改变
      console.log("不可以移动到此处")
      timedata.enabledarea["x1"]=down.x1;
      timedata.enabledarea["x2"]=down.x2;
    }else{
      //不在这个区间内 就可以移动位置
      console.log("--可以移动到此处")
      // var deltax = timedata.movex - timedata["startx"]
      // if (deltax < 0) {
      //   //左移动
      //   timedata.enabledarea["x1"] -= Math.abs(deltax)
      //   timedata.enabledarea["x2"] -= Math.abs(deltax)
      // } else {
      //   // 右移动
      //   timedata.enabledarea["x1"] += Math.abs(deltax)
      //   timedata.enabledarea["x2"] += Math.abs(deltax)
      // }
      

    }
    this.setData({
      timedata: timedata
    })

    this.drawarea()
  }
})