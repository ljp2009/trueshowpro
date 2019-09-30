// pages/test/test2/test2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("--------------")
    var header = this.selectComponent("#timearea")


    var obj={
      ifshowenable:true,   //控制选择时间
      ifShowworkTxt:true,   //控制上班时间是否显示
      workarea: {          //指定工作时间和结束时间
        x1: "08:00",
        x2: "22:00",
        x1x: 0,
        x2x: 0
      },
      disabledarea: [    //已经预约出去的时间
 
        {
          x1: "08:30",
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

      currentorderarea: [   //绿色时间 ---技师约单界面会用到当前约单的时间
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
      enabledarea: {
        x1: "12:30",
        x2: "14:00",
        x1x: 0,
        x2x: 0
      },
      
    }
    header.canvasdraw(obj)
   
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