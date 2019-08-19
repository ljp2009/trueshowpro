// pages/test1/test1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      timedata:{      //记录当前不能选的区域 以及可以选的区域
        disabledarea:{
          x1:50,
          x2:100
        },
        enabledarea:{
          x1:150,
          x2:160
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
      startwork:"9:00",
      endwork:"22:00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.drawarea()
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
    context.rect(this.data.timedata.disabledarea.x1, 0, (this.data.timedata.disabledarea.x2 - this.data.timedata.disabledarea.x1), 100)
    context.fill()
    context.closePath()

    // 绘制一个默认的可以拖拽的区域
    context.beginPath()
    context.setFillStyle("red")
    context.rect(this.data.timedata.enabledarea.x1, 0, (this.data.timedata.enabledarea.x2 - this.data.timedata.enabledarea.x1), 100)
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