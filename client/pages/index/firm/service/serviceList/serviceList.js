var that
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    classifyList:["美发","美容","化妆","美睫","美甲","美体","保洁","健身","非主流"],
    items:[
      { 
        title1:"中医背部推拿60分钟",
        title2:"10年经验，舒经活络",
        price:120,
        time:60,
        state:0
      },
      { 
        title1: "中医背部推拿60分钟",
        title2: "10年经验，舒经活络",
        price: 120,
        time: 60,
        state:1
      },
      {
        title1: "中医背部推拿60分钟",
        title2: "10年经验，舒经活络",
        price: 120,
        time: 60,
        state: 0
      },
      {
        title1: "中医背部推拿60分钟",
        title2: "10年经验，舒经活络",
        price: 120,
        time: 60,
        state: 1
      }
    ]
  },
  // tabSelect(e) {
  //   this.setData({
  //     TabCur: e.currentTarget.dataset.id,
  //     scrollLeft: (e.currentTarget.dataset.id - 1) * 60
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   // 滑动操作
  //   that = this;
  //   /*模拟数据*/
  //   // that.setData({
  //   //   items: items.items
  //   // })
  // },
  // //手指触摸动作开始 记录起点X坐标  
  // touchstart: function(e) {    
  //   //开始触摸时 重置所有删除    
  //   let data = App.touch._touchstart(e, this.data.items)    
  //   this.setData({      
  //     items: data    
  //   })  
  // },
  // //滑动事件处理
  // touchmove: function (e) {
  //   let data = App.touch._touchmove(e, this.data.items)
  //   this.setData({
  //     items: data
  //   })
  // },
  // //商品信息状态处理  
  // del: function(e) { 
  //   if (that.data.items[e.currentTarget.dataset.index].state==0) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '确认要上架此条信息么？',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           // that.data.items[e.currentTarget.dataset.index].state=1
  //           var items = that.data.items;
  //           items[e.currentTarget.dataset.index]["state"]=1
  //           that.setData({
  //             items: items
  //           })
  //         }
  //         else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  //   else {
  //     wx.showModal({
  //       title: '提示',
  //       content: '确认要下架此条信息么？',
  //       success: function (res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           var items = that.data.items;
  //           items[e.currentTarget.dataset.index]["state"] = 0
  //           that.setData({
  //             items: items
  //           })
  //         }
  //         else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }    
  // },    


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

  changeAddServiceHidOne:function(){
    getApp().data.addServiceOne = "block";
    getApp().data.addServiceTwo = "none";
  },

  changeAddServiceHidTwo: function () {
    getApp().data.addServiceOne = "none";
    getApp().data.addServiceTwo = "block";
  },
})