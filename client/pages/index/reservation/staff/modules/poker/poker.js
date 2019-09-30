// pages/index/reservation/staff/modules/poker/poker.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    showModal: false,
    imgsArr:[
      { img: "", type: "main" },//主图
      { img: "", type: "vicefir" },//副图1
      { img: "", type: "vicesec" },//副图2
      { img: "", type: "cplast" },//对比图1
      { img: "", type: "cpnext" },//对比图2
      { img: "", type: "advicefir" },//建议图1
      { img: "", type: "advicesec" }//建议图2
    ],//
    imgs: { ////存储各个位置的图片
      "main": "", 
      "vicefir": "",
      "vicesec": "",
      "cplast": "",
      "cpnext": "", 
      "advicefir": "", 
      "advicesec": ""
      },//当前显示的
   
    reservationId:0, //当前约单id
    resnId:0, //对应的约单服务id
 
    staffPokerData:{}, //编辑时图片数据
    allimgurlArr:[],//存储所有图片的地址 包括数据库读出来的 和当前选的
    insertimgurlArr:[] //需要存进数据库的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
   console.log(options);//{reservationId: "20", resnId: "13"}
    var reservationId = options.reservationId;//当前的约单id
    var resnId = options.resnId;//当前的约单对应的约单服务id
    var rakeoff = options.rakeoff;//当前约单的平台佣金比
    var ifNewEdit = options.ifNewEdit; //0--新建 1-编辑
    ///////////////////需要修改
    // var reservationId = 20;//当前的约单id
    // var resnId = 13;//当前的约单对应的约单服务id
    // var rakeoff=8;//当前约单的平台佣金比
    that.setData({
      reservationId: reservationId,
      resnId: resnId,
      rakeoff: rakeoff
    })

    //
    if (ifNewEdit==1){
      console.log("-------------编辑页面")
        //通过约单id 约单服务id
        //获取到当前技师晒单的数据
     wx.request({
       url: app.globalData.webroot1 + '/index/poker/getstaffPokerData',
       method: "post",
       data: {
         reservationId: that.data.reservationId,
         resnId: that.data.resnId,
       },
       header: {
         'content-type': 'application/x-www-form-urlencoded' //post请求
       },
       success(res) {
         console.log(res.data.msg);
         var resdata = res.data.msg["StaffPic"];
         var imgs=that.data.imgs;
         var allimgurlArr = that.data.allimgurlArr;
         for (var i in resdata) {
           if (resdata[i]!=""){
              //加上前缀 that.data.webRoot1 + "/static/images/poker/" +
             var path = that.data.webRoot1 + "/static/images/poker/" + resdata[i];
             allimgurlArr.push(resdata[i]);
             imgs[i] = path
            }
          // console.log(i, ":", resdata[i]);

         }
         that.setData({
           staffPokerData: res.data.msg["StaffPic"],
           imgs: imgs,
           allimgurlArr: allimgurlArr
         })
         console.log(that.data.allimgurlArr);
         console.log(that.data.imgs)
       }
     })
    }



  },
 
  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = that.data.imgs;
 
    var imgs = that.data.imgs;
    var type = e.currentTarget.dataset.type;
    console.log(type)
  
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
       //{"main":"test.jpg","vicefir":"test.jpg","vicesec":"test2.jpg","cplast":"test2.jpg","cpnext":"hand.png","advicefir":"test.jpg","advicesec":"test2.jpg"}
        console.log(tempFilePaths);
        var tempFilePathsItem = tempFilePaths[0];//选择得图片得本地地址
        
          var uid = JSON.parse(wx.getStorageSync("user"))["userinfo"]["uid"]; //当前的uid
       wx.uploadFile({
          url: app.globalData.webroot1 + '/index/poker/newStaffPokerPic', //仅为示例，非真实的接口地址
         filePath: tempFilePathsItem,// 上传的文件资源的路径
          name: 'img',
          // HTTP请求中其他额外的form data
          formData: {
            imgurl: tempFilePathsItem,
            type: type
          },
          success:function(res) {
            //返回的当前type对应的线上地址
           // var res=res.data.mag;
           console.log(res);
         
            var data = JSON.parse(res.data).msg;
            var imgurl = data.img;
            var imgurl1 = imgurl.replace(/\\/, "/");
            var allimgurlArr = that.data.allimgurlArr;
            allimgurlArr.push(imgurl1);
            imgs[type] = that.data.webRoot1 + "/static/images/poker/" +imgurl1;
            that.setData({
              imgs: imgs,
              allimgurlArr: allimgurlArr
            })

            console.log(that.data.imgs);
            console.log(that.data.allimgurlArr);
          }
        })


      }
    });
  },
  
  
  //点击保存的点击事件
  saveStaffPokerBtn:function(){
    console.log("---保存按钮点击")
    //得到图片数组
    var that=this;
   //得先判断主图片 cplast cpnext 是否存在
 
    var imgs = that.data.imgs;
    var insertimgurlArr = that.data.insertimgurlArr;
    var allimgurlArr = that.data.allimgurlArr;//所有的图片地址
    console.log(imgs)
   // return;
    if (imgs["main"] == "" || imgs["cpnext"] == "" || imgs["cplast"] == ""){
      wx.showToast({
        title: '主图/对比图必须上传',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //需要后面的图片地址 截取
    //var array = text.split(",");
    for (var i in imgs) {
      if (imgs[i] != "") {
        var _item = imgs[i].split("poker/")[1];
        imgs[i] = imgs[i].split("poker/")[1];
        insertimgurlArr.push(_item)
      }
    }
   
    console.log(imgs);
    console.log(insertimgurlArr);//要存入数据库的图片数组



  // return;
    var reservationId = that.data.reservationId;//约单id
    var resnId = that.data.resnId;//约单服务id
    //调用存入数据库
    
    wx.request({
      url: app.globalData.webroot1 + '/index/poker/newStaffPoker',
      method: "post",
      data: {
       serverImg: JSON.stringify(imgs),//图片数组 这是整理好的数据
       reservationId: reservationId,//当前约单id
       resnId: resnId,//约单服务id
       rakeoff: that.data.rakeoff, //平台佣金比
        allimgurlArr: JSON.stringify(allimgurlArr),//存储图片数组
        insertimgurlArr: JSON.stringify(insertimgurlArr) //所有图片地址
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        //console.log(res.data.msg);
        if (res.data.code==1){
            //写入晒单成功
          wx.showToast({
            title: '写入晒单成功',
            icon: 'success',
            duration: 500
          })
          setTimeout(function(){
            //跳转到技师约单首页
            wx.navigateTo({
              url: '/pages/index/reservation/staff/modules/jordan/jordan',
            })
          },1000)
            
        }
      }
    })

    
  },
  
  /**
   * 点击每一个删除的点击事件
   */
  deleteImg:function(e){
    var that=this;
    var type = e.currentTarget.dataset.type;//得到当前要删除的type值 
    var imgs = that.data.imgs;
    
    imgs[type] ="";//给对应的图片的地址赋值为空
    that.setData({
      imgs: imgs,
      
    })
   
    console.log(that.data.imgs);
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