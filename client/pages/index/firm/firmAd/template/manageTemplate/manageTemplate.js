// pages/index/firm/firmAd/template/manageTemplate/manageTemplate.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    imgs: "",
    coverpic:[], //封面图片
    group:[1,2,3],
    subPic1:[],//第一组的3张图片数据
    subPic2: [],//第二组的3张图片数据
    subPic3: [],//第三组的3张图片数据
    addnum:1,//添加的次数 
    groupnum:[1], //记录当前显示的组数
    valueArr:{},//存储各组的文字描述
    renum:"",//模板id
    firmId: 0, //记录当前页面属于的机构id 
    templateId:-1 //编辑时页面的模板id
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    var firmId = options["fid"];//机构id
    that.setData({
      firmId: firmId
    })
    if (!options["tid"]){
     return;
    }
    var tid = options["tid"];//模板id
    that.setData({
      templateId: tid
    })
    console.log("--模板id=" + tid + "---机构id=" + firmId)
    // 通过模板id 获取当前得广告模板数据详情
    wx.request({
      url: app.globalData.webroot + '/index/ad/getADTemplateById',
      method: "post",
      data: {
        templateId: tid //模板id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        //return;
        var data = res.data.msg;//
        var title = data["Title"];//活动标题
        var text1 = data["Text1"];//文本1
        var text2 = data["Text2"];//文本2
        var text3 = data["Text3"];//文本3
        var webRootimg = that.data.webRoot + "/static/images/uploads/";
        var coverpic = data["MainPic"];
        var subPic1 = data["SubPic1"];
        var subPic2 = data["SubPic2"];
        var subPic3 = data["SubPic3"];
        
        console.log(subPic1)
        console.log(subPic2)
        console.log(subPic3)
        // //return;
        for(var i=0;i<3;i++){
          if (subPic1[i]){
              //加上前缀的地址
            subPic1[i]["img"] = webRootimg + subPic1[i]["img"] ;
            }
          if (subPic2[i]) {
            //加上前缀的地址
            subPic2[i]["img"] = webRootimg + subPic2[i]["img"];
          }
          if (subPic3[i]) {
            //加上前缀的地址
            subPic3[i]["img"] = webRootimg + subPic3[i]["img"];
          }
        }
        var obj={
          title: title,
          firvalue: text1,
          secvalue: text2,
          thirdvalue: text3
        }
        //赋值
        var coverpicdata=that.data.coverpic;
        var objcover={
          img: webRootimg + coverpic[0]["img"],
          seq: coverpic[0]["seq"]
        }
        coverpicdata[0] = objcover;
        that.setData({
          coverpic: coverpicdata,
          valueArr: obj,
          subPic1: subPic1,
          subPic2: subPic2,
          subPic3: subPic3
        })
        console.log("编辑对应的图片地址")
        console.log(that.data.subPic1)
        console.log(that.data.subPic2)
        console.log(that.data.subPic3)
        if (subPic2.length>0){
          that.setData({
            addnum:2
          })
        }
        if (subPic3.length > 0) {
          that.setData({
            addnum: 3
          })
        }

      }
    })
  },
  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgtype = e.currentTarget.dataset.imgtype;
    //imgtype分为 coverpic--是封面图片  firgrouppic--第一组图片
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
         //console.log(tempFilePaths);
         if (imgtype =="coverpic"){
          //封面图片
           var coverpic = that.data.coverpic;
           var obj={
             img: tempFilePaths[0],
             seq:0
           }
           coverpic[0] = obj;
            that.setData({
              coverpic: coverpic
            });
           console.log(that.data.coverpic);
        }
        if (imgtype == "firgrouppic") {
          //第一组图片
          var index = e.currentTarget.dataset.index;//当前选择的图片索引值
          var subPic1 = that.data.subPic1;
          var obj = {
            img: tempFilePaths[0],
            seq: index
          }
          subPic1[index] = obj; 
          that.setData({
            subPic1: subPic1
          });
          console.log(that.data.subPic1);
        }
        if (imgtype == "secgrouppic") {
          //第二组图片
          var index = e.currentTarget.dataset.index;//当前选择的图片索引值
          var subPic2 = that.data.subPic2;
          var obj = {
            img: tempFilePaths[0],
            seq: index
          }
          subPic2[index] = obj; 
          that.setData({
            subPic2: subPic2
          });
          console.log(that.data.subPic2);
        }
        if (imgtype == "thirdgrouppic") {
          //第三组图片
          var index = e.currentTarget.dataset.index;//当前选择的图片索引值
          console.log(typeof index)
          console.log(index + "---" + tempFilePaths[0]);
          var subPic3 = that.data.subPic3;
          var obj = {
            img: tempFilePaths[0],
            seq: index
          }
          subPic3[index] = obj; 
          that.setData({
            subPic3: subPic3
          });
          console.log(that.data.subPic3);
        }
        
       
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
 //点击添加一组  最多三组
  addgroup:function(){
    var that=this;
    var groupnum=that.data.groupnum;
    var addnum=that.data.addnum;
    
    if (addnum<3){
      addnum++;
      that.setData({
        addnum: addnum
      })
      groupnum.push(1);
      that.setData({
        groupnum: groupnum
      })
    }else{
      //提示： //最多是三组
      wx.showToast({
        title: '提示:最多能添加三组',
        icon: 'none',
        duration: 1000
      })
    }

    
  },
  firTextareaInput: function (res) {
    var that=this;
    var firvalue = res.detail.value;
    console.log(res.detail.value);//打印输入的值
    var valueArr = that.data.valueArr;
    valueArr["firvalue"] = firvalue;
    that.setData({
      valueArr: valueArr, 
    })
    console.log(that.data.valueArr);
  },
  //第二组对应的文本框 输入的值
  secTextareaInput: function (res) {
    var that = this;
    var secvalue = res.detail.value;
    console.log(res.detail.value);//打印输入的值
    var valueArr = that.data.valueArr;
    valueArr["secvalue"] = secvalue;
    that.setData({
      valueArr: valueArr,
    })
    console.log(that.data.valueArr);
  },
  //第三组对应的文本框 输入的值
  thirdTextareaInput: function (res) {
    var that = this;
    var thirdvalue = res.detail.value;
    console.log(res.detail.value);//打印输入的值
    var valueArr = that.data.valueArr;
    valueArr["thirdvalue"] = thirdvalue;
    that.setData({
      valueArr: valueArr,
    })
    console.log(that.data.valueArr);
  },
  //得到标题的输入值
  titleInput: function (res){
    var that = this;
    var title = res.detail.value;
    console.log(res.detail.value);//打印输入的值
    var valueArr = that.data.valueArr;
    valueArr["title"] = title;
    that.setData({
      valueArr: valueArr,
    })
    console.log(that.data.valueArr);
  },
  //保存广告模板
  saveAdtemplate:function(){
    //url='/pages/index/firm/firmAd/template/nonetemplateList/nonetemplateList'
    console.log("--保存按钮")
    var that=this;
    var pictype=[0,1,2,3];//0-主图和三组图对应的描述 1-第一组图 2-第二组图片 3-第三组图片
    var coverpic = that.data.coverpic;
    var subPic1 = that.data.subPic1;
    var subPic2 = that.data.subPic2;
    var subPic3 = that.data.subPic3;
    var valueArr = that.data.valueArr;//
    console.log("---title=" + valueArr["title"]);
    console.log("---fir=" + valueArr["firvalue"]);
    console.log("---sec=" + valueArr["secvalue"]);
    console.log("---third=" + valueArr["thirdvalue"]);
    if (coverpic.length <= 0 || valueArr.length <= 0){
      wx.showToast({
        title: '提示:信息填写完整',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    //上传到服务器
    var filePath;
    var firmId=that.data.firmId;////////////////////////记住机构id 动态
    var templateId = that.data.templateId;//编辑时的模板id
    console.log(coverpic);
    console.log(subPic1);
    console.log(subPic2);
    console.log(subPic3);
    // return;
    //第一步上传 标题和各组的文字描述
    wx.request({
      url: app.globalData.webroot + '/index/ad/newADTemplateFir',
      method: "post",
      data: {
        "templateId": templateId,//用这个值来标记 当前是 >0是编辑  =-1是新建
        'firmId': firmId,
        "valueArr": JSON.stringify(valueArr)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        //return;
        var code = res.data.code;
        if (code==0){
            return;
        }
        var templateId = res.data.msg;
        var ifinsertedit;
        if (code == 1) {
          //新增
          ifinsertedit=1;//标记当前返回的是 1--新建的id还是 2--编辑的id
        }
        if (code == 2) {
          ifinsertedit = 2;
        }
        that.setData({
          renum: templateId
        })
        console.log(that.data.renum);
        var lastid = that.data.renum;
        console.log(lastid);
       // return;
       
          //////第二步上传多张图片
          //封面图片
          that.uploadFile(coverpic, 0, templateId)
          //第一组图片
          that.uploadFile(subPic1, 1, templateId)
          //第二组图片
          that.uploadFile(subPic2, 2, templateId)
          //第三组图片
          that.uploadFile(subPic3, 3, templateId)

          //上传成功
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
       setTimeout(function(){
         //跳转页面
         wx.navigateTo({
           url: '/pages/index/firm/firmAd/template/nonetemplateList/nonetemplateList',
         })
       },500)
         
        
        
      }
    })
  },
  //调用上传图片到服务器的接口 可多张图片
  uploadFile: function (picArr, type, lastid){
    for (var j = 0; j < picArr.length; j++) {
      if (picArr[j] != "") {
        wx.uploadFile({
          url: app.globalData.webroot + '/index/ad/newADTemplateSec', //仅为示例，非真实的接口地址
          filePath: picArr[j]["img"],// 上传的文件资源的路径
          name: 'img',
          // HTTP请求中其他额外的form data
          formData: {
            "type": type,
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