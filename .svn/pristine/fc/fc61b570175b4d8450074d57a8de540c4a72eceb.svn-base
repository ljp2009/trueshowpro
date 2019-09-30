// pages/index/qa/addQa/addQa.js
//////////////////新建答/编辑答的页面/////////////////////
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    array:[0,1,2],//表示3张图片
    picArr: [],//3张图片数据
    radioValue:1,//是否匿名 //0-否 1-匿名
    title:"",//标题
    content:"",//内文
    renum:0, //是新建答页面的aid / 存文字后返回的aid 见onload解释
    qid:0, //进入页面的问题id qid
    ifselected1:true,//是否选中单选框 是
    ifselected2: false,//是否选中单选框 否
    allimgurlArr: [],//所有图片的地址
    insertimgurlAll: [],//需要写入数据库的图片
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
   //第一种情况:点击回答按钮进入 aid=-1&qid=?&qtitle=xxxx""
   //第二种情况:点击修改当前这条回答 修改按钮进入 aid>0&qid=?&qtitle=xxxx""
   //思路 当点击这两个按钮时 uid/staffLevel需要读取缓存得到

   //通过aid参数的值来判断当前时新建答还是编辑答
    var that=this;
    //console.log(options);
    ///////////////答//////////////
    var aid = options.aid;//答id
    var qid = options.qid;//问id
    var qtitle = options.qtitle;//问的标题
   

    // var aid = -1;//答id
    // var qid = 14;//问id
    // var qtitle = "2222";//问的标题
   
    
    that.setData({
      title: qtitle,
      qid: qid
      
    })
    //答id情况
      //var aid =5;
      if (aid==-1){
          //表示当前是新建问页面
          that.setData({
            renum: "" //aid=""为新建
          })
      }else{
        //表示当前是编辑问页面
        that.setData({
          renum: aid //aid>0为编辑此条记录
        })
        //
        //通过答id 读取答的数据然后渲染数据到页面上
        //发给后端
        wx.request({
         
          //url: app.globalData.webroot + '/index/qa/getEditAnswerById',
          url: app.globalData.webroot1 +'/index/qa/getEditAnswerById',
          method: "post",
          data: {
            aid: that.data.renum
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' //post请求
          },
          success(res) {
            //console.log(res.data.msg);
            var data = res.data.msg;

            //修改成变量域名
            var webRootimg = that.data.webRoot1 + "/static/images/uploads/";
            var allimgurlArr = that.data.allimgurlArr;
            var picArr = that.data.picArr;
            for (var i = 0; i < 3; i++) {
              if (data["Pic"][i]["img"] != "") {
                //加上前缀的地址
                data["Pic"][i]["img"] = webRootimg + data["Pic"][i]["img"];
                allimgurlArr.push(data["Pic"][i]["img"]);
                picArr[i]["img"] = webRootimg + data["Pic"][i]["img"];
              }

            }


            if (data["Anonym"] == 0) {
              that.setData({
                radioValue: data["Anonym"],
                ifselected1: false,
                ifselected2: true
              })
            } else {
              that.setData({
                radioValue: data["Anonym"],
                ifselected2: false,
                ifselected1: true
              })
            }
            that.setData({
              title: data["Title"],
              content: data["Contents"],
              picArr: picArr,
              allimgurlArr: allimgurlArr
            })
            console.log(that.data.allimgurlArr);
          }
        })
      }
      

    
    /////////////////////////////////

    
  },
  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;//当前选择的图片索引值
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //console.log(tempFilePaths);

        var tempFilePathsItem = tempFilePaths[0];
        wx.uploadFile({
          //url: app.globalData.webroot + '/index/qa/newQPic',
          url: app.globalData.webroot1 + '/index/qa/newAPic',
          filePath: tempFilePathsItem,// 上传的文件资源的路径
          name: 'img',
          // HTTP请求中其他额外的form data
          formData: {
            "imgurl": tempFilePathsItem,
            "seq": index
          },
          success(res) {
            var data = JSON.parse(res.data).msg;
            var imgurl = data.img;
            var seq = data.seq;
            var imgurl1 = imgurl.replace(/\\/, "/");
            var picArr = that.data.picArr;//存储图片数据的数组
            console.log(seq);
            console.log(imgurl1);
            //allimgurlArr
            var allimgurlArr = that.data.allimgurlArr;
            allimgurlArr.push(imgurl1);
            var repath = that.data.webRoot1 + "/static/images/uploads/" + imgurl1;
            that.setData({
              allimgurlArr: allimgurlArr
            })
            picArr[seq]["img"] = repath;
            picArr[seq]["seq"] = index;
            that.setData({
              picArr: picArr
            });

            console.log(that.data.picArr);


          }
        })
        

      }

    });
  },
  // 删除图片
  deleteImg: function (e) {
    var that=this;
    var picArr = that.data.picArr;
    var index = e.currentTarget.dataset.index;//当前图片索引值 seq
    //赋值为空
    var obj={
      img: "",
      seq: index
    }
    picArr[index]=obj;
    that.setData({
      picArr: picArr
    });
    console.log("删除图片" + index);
    console.log(that.data.picArr);
  },
  
  //radio发生change事件
  radioChange:function(e){
    var that=this;
    var value = e.detail.value;
    // ifselected1:true,//是否选中单选框 是
    //ifselected2: false,//是否选中单选框 否
    if (value==0){
      that.setData({
        radioValue: value,
        ifselected1:false,
        ifselected2: true
      })
    }else{
      that.setData({
        radioValue: value,
        ifselected2: false,
        ifselected1: true
      })
    }
    
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  //内文change事件
  textareaAInput:function(e){
    var that = this;
    var value = e.detail.value;
    //字数不能超过500
    if (value.length > 500) {
      //
      wx.showToast({
        title: '字数不能超过500',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    that.setData({
      content: value
    })
    console.log('textarea发生change事件，携带value值为：', e.detail.value)
  },

  //确定按钮点击事件
  confirm:function(){
    //得到标题和内文 是否匿名
    var that=this;
    var content=that.data.content;//内文
    var title = that.data.title;//标题
    var qid = that.data.qid;//标题id
    
    var anonym = that.data.radioValue;//是否匿名 
    var picArr = that.data.picArr;//得到图片数据 可有可无
    var renum = that.data.renum;//当前aid的状态 ""--新建 >0编辑
    
    if (content == "") {
      wx.showToast({
        title: '提示:信息填写完整',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    console.log("----title=" + title + "---content=" + content + "---anonym=" + anonym);
    console.log(picArr);

    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    var staffLevel = JSON.parse(userArr)["userinfo"]["staffLevel"];//隶属状态
    if (staffLevel<2){
        //顾客
      staffLevel=0;
    }else{
        //技师
      staffLevel = 2;
    }

    var allimgurlArr = that.data.allimgurlArr;////所有图片的地址
    var insertimgurlAll = that.data.insertimgurlAll;////需要写入数据库的图片

    for (var i = 0; i < 3; i++) {
      if (picArr[i]["img"] != "") {
        var _item = picArr[i]["img"].split("uploads/")[1];
        picArr[i]["img"] = picArr[i]["img"].split("uploads/")[1];
        insertimgurlAll.push(_item)
      }

    }
    console.log(picArr)
    console.log(allimgurlArr)
    console.log(insertimgurlAll)

    
    wx.request({
      url: app.globalData.webroot1 + '/index/qa/newA',
      method: "post",
      data: {
        aid: renum,//""--表示新建 >0表示编辑
        title: title,//用这个值来标记 当前是 >0是编辑  =-1是新建
        content: content,
        anonym: anonym,
        uid: uid,
        qid: qid,
        staffLevel: staffLevel,
        picArr: JSON.stringify(picArr),
        allimgurlArr: JSON.stringify(allimgurlArr),
        insertimgurlArr: JSON.stringify(insertimgurlAll)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);

        var code = res.data.code;
        if (code == 0) {
          return;
        }
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          //跳转页面
          wx.navigateTo({
            url: '/pages/index/qa/qaIndex/qaIndex',
          })
        }, 500)
      }
    })
    //
    
   
  },
  //调用上传图片到服务器的接口 可多张图片
  uploadFile: function (picArr, lastid) {
    for (var j = 0; j < picArr.length; j++) {
      if (picArr[j] != "") {
        wx.uploadFile({
          url: app.globalData.webroot + '/index/qa/newASec', //仅为示例，非真实的接口地址
          filePath: picArr[j]["img"],// 上传的文件资源的路径
          name: 'img',
          // HTTP请求中其他额外的form data
          formData: {
            "lastid": lastid,
            "picArr": JSON.stringify(picArr),
            "seq": picArr[j]["seq"]
          },
          success(res) {
            const data = res.data
            console.log(data)
            //do something
          }
        })
      }
    }

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