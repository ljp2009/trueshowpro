// pages/index/firm/finance/journal/journal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    moneyFlow:[],
    moneyFlow1: [],//发给后端
    toemail:"",
    itemsArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
     // url: app.globalData.webroot + '/index/firm/moneyFlow',   //ljp.jujiaoweb5.com
      url:   'http://ljp.jujiaoweb5.com/index/firm/moneyFlow', 
      method: "post",
      data: {
        firmId: 1,
        days:0,  //0-代表40天

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
   
        if (res.data.code==0){
          //没数据
          that.setData({
            moneyFlow: []
          })
          return;
        }
        that.setData({
          itemsArr:res.data.msg
        })
        var data = res.data.msg
        var arr=[];
        var arr1=[];
        for (var i = 0; i < data.length;i++){
          var _obj={
            time: data[i]["FpayTime"],//price
            allprice: data[i]["price"],
            rakeoff: data[i]["Rakeoffcast"] + "(" + data[i]["Rakeoff"]+"%)",
            inc: data[i]["Famount"]
          }
          arr.push(_obj);
          var _itemarr = [data[i]["FpayTime"], "+" + data[i]["price"], "-" + data[i]["Rakeoffcast"] + "(" + data[i]["Rakeoff"] + "%)", "￥" +data[i]["Famount"]];
          arr1.push(_itemarr);
        }
        that.setData({
          moneyFlow: arr,
          moneyFlow1: arr1,
        })
        console.log(that.data.moneyFlow);
        console.log(that.data.moneyFlow1);

      }
    })
  },
  //发送按钮事件
  incomeHomeLink:function(){
    var that=this;
    console.log(that.data.moneyFlow);
   
    //先判 moneyFlow 是否为空数组
    if (that.data.moneyFlow.length==0){
      wx.showToast({
        title: "没有数据,不能发送邮件!!",
        icon: 'none',
        duration: 2000
      })
      return;
    }
//
    var toemail = that.data.toemail;
    if (toemail=="" ){
      wx.showToast({
        title: "请填写正确的邮箱地址!!!!",
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showToast({
      title: "正在发送,请稍等",
      icon: 'none',
      duration: 2000
    })
    //发送给后端 index/promote/sendEmail
    wx.request({
     // url: app.globalData.webroot + '/index/promote/sendEmail',
      url: 'http://ljp.jujiaoweb5.com/index/promote/sendEmail',
      method: "post",
      data: {
        toemail: toemail,
        incdata: JSON.stringify(that.data.moneyFlow1),  //0-代表40天
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
       // console.log(res.data.msg);
        if (res.data.code==0){
          wx.showToast({
            title: "发送邮件失败,请重新发送!",
            icon: 'none',
            duration: 2000
          })
          return;
        }

        //
        wx.showToast({
          title: "恭喜,发送邮件成功",
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  //电子邮件地址的改变事件
  changetoEmail:function(e){
    //
    var value = e.detail.value;
    console.log(value)
    this.setData({
      toemail: value
    })
    ///////////判断是否是邮箱地址//////////////
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