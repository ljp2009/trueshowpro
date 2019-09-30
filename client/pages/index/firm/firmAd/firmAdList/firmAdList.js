// pages/index/firm/firmAd/firmAdList/firmAdList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firmId:1,
    adlist:[],
    webroot: app.globalData.webroot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // this.data.firmId = options["firmId"];
    console.log(options["firmid"]);
    this.setData({
      firmId: options["firmid"]
    });
    wx.request({
      url: app.globalData.webroot + '/index/ad/getADinFirm',
      method: "post",
      data: {
        firmId: options["firmid"],
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(response) {
        
        console.log(response.data);
        var data = response.data["msg"];
        for(var i=0;i<data.length;i++){
          data[i]["MainPic"] = JSON.parse(data[i]["MainPic"]);   //图片
          //求剩余点击数
          data[i]["lastClick"] = data[i]["ClickBuy"] - data[i]["Clicked"];
        

          //投放中/等待中/结束
          var StartTime = data[i]["StartTime"];
          StartTime = StartTime.substring(0, 19);
          StartTime = StartTime.replace(/-/g, '/');
          var StartTimetimestamp = new Date(StartTime).getTime();

          var now=new Date();
          var nowtimestamp=now.getTime();

          var EndTime = data[i]["EndTime"];
          EndTime = EndTime.substring(0, 19);
          EndTime = EndTime.replace(/-/g, '/');
          var EndTimetimestamp = new Date(EndTime).getTime();
          //结束时间大于现在时间 结束了
          //开始时间小于现在时间  等待中
          //开始时间大于现在时间 结束时间小于现在时间
          var difftimetimestamp = EndTimetimestamp - nowtimestamp;
          var difftimedays = Math.ceil(difftimetimestamp / (24 * 3600 * 1000))
          data[i]["effectivetime"] = difftimedays   //有效时间
          console.log("EndTime=" + EndTime + "--EndTimetimestamp=" + EndTimetimestamp + "--nowtimestamp=" + nowtimestamp + "---difftimetimestamp=" + difftimetimestamp + "--difftimedays=" + difftimedays)


          if (EndTimetimestamp < nowtimestamp){
            data[i]["type"]="结束";
            data[i]["effectivetime"] = 0   //有效时间
          }  else if (StartTimetimestamp <= nowtimestamp && EndTimetimestamp >= nowtimestamp){
            data[i]["type"] = "投放中";
          }

          //等待中
          if (data[i]["PayStatus"]==0){
            data[i]["type"] = "等待中";

          }
          
          //求有效期剩余天数
          // data[i]["youxiao"]=

        }

        that.setData({
          adlist: response.data["msg"]
        })
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

  }
})