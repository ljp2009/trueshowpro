Page({
  data:{
    radius:30,

  },
  onReady: function () {
    // 页面渲染完成
    //使用wx.createContext获取绘图上下文context
    // var context = wx.createContext();
    var context = wx.createCanvasContext('mypie', this)
    // 画饼图
    //    数据源
    var array = [360, 10];
    var colors = ["#ffffff", "#FF6600"];
    var total = 0;
    //    计算总量
    for (var index = 0; index < array.length; index++) {
      total += array[index];
    }
    //    定义圆心坐标
    var point = { x: 100, y: 100 };
    //    定义半径大小
    var radius = this.data.radius;
    /*    循环遍历所有的pie */
    for (var i = 0; i < array.length; i++) {
      context.beginPath();
      //    	起点弧度
      var start = 0;
      if (i > 0) {
        // 计算开始弧度是前几项的总和，即从之前的基础的上继续作画
        for (var j = 0; j < i; j++) {
          start += array[j] / total * 2 * Math.PI;
        }
      }
      console.log("i:" + i);
      console.log("start:" + start);
      //      1.先做第一个pie
      //   	2.画一条弧，并填充成三角饼pie，前2个参数确定圆心，第3参数为半径，第4参数起始旋转弧度数，第5参数本次扫过的弧度数，第6个参数为时针方向-false为顺时针
      context.arc(point.x, point.y, radius, start, array[i] / total * 2 * Math.PI, false);
      //      3.连线回圆心
      context.lineTo(point.x, point.y);
      //      4.填充样式
      context.setFillStyle(colors[i]);
      //      5.填充动作
      context.fill();

      context.setStrokeStyle("#FF6600")
      context.stroke()

      context.closePath();
    }
    //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
    wx.drawCanvas({
      //指定canvasId,canvas 组件的唯一标识符
      canvasId: 'mypie',
      actions: context.getActions()
    });
  },
  jump:function(){
    console.log("---")
  }
})
