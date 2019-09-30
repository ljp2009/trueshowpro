// pages/index/firm/service/addService/addService.js
import WxValidate from '../../../../../utils/WxValidata.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    staffId: -1,
    serviceId: -1,
    hidOne: getApp().data.addServiceOne,
    hidTwo: getApp().data.addServiceTwo,
    showModal: false,
    classifyList: [],
    form: {
      serviceName: '',
      serviceTitle: '',
      lowPrice: '',
      highPrice: '',
      needTime: '',
      introduce: ''
    },
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    imgs: [],// 记录渲染的图片
    addImg: true,
    catList: [],
    catListBig: '',
    catListSmall: '',
    descLength: 0,
    addPicArr:[],// 记录用户上传过的图片
    savePicArr:[],// 记录用户最终选择的图片


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var hidO = getApp().data.addServiceOne;
    var hidT = getApp().data.addServiceTwo;
    var serviceId = options.serviceId;  // 服务项目id
    var staffId = options.staffId; // 技师id
    var that = this;
    if(serviceId != undefined){
      // 添加服务项目
      // 请求分类的数据
      wx.request({
        url: app.globalData.webroot + '/index/service/getServiceById',
        method: 'POST',
        data: {
          serviceId:serviceId,
          firmId:staffId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res);
          var _form = {};
          var msg = res.data.msg;
          _form.serviceName = msg.ServiceName;
          _form.serviceTitle = msg.ServiceSub;
          _form.lowPrice = msg.Price_Min;
          _form.highPrice = msg.Price_Max;
          _form.needTime = msg.Duration;
          _form.introduce = msg.Discription;
          var mainCat = msg.MainCat;
          var smallCat = msg.SubCat;
          that.setData({
            form:_form,
            catListBig:mainCat,
            catListSmall:smallCat
          })
        }
      })
      this.setData({
        serviceId: serviceId
      })
    }else{
      // 修改服务项目,获取这条服务的详细信息
      this.setData({
        staffId: staffId
      })
    }
    console.log(serviceId)
    console.log(options.staffId)
    
    
    // 请求分类的数据
    wx.request({
      url: app.globalData.webroot +  '/index/firm/getService',
      method: 'POST',
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var data = res.data.msg;
        that.setData({
          classifyList:data
        })
      }
    })
// 执行检验函数
    this.initValidata()
  },


  

  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        imgs.push(tempFilePaths[0])
        that.setData({
          imgs: imgs
        })
        wx.uploadFile({
          url: app.globalData.webroot + '/index/firm/handImg',
          filePath: tempFilePaths[0],// 上传的文件资源的路径
          name: 'descImg',
          // HTTP请求中其他额外的form data
          formData: {
            
          },
          success: function (res2) {
              console.log(res2)
            var resObj = JSON.parse(res2.data);
              var code = resObj.code;
              var name = resObj.msg;
            var addPicArr = that.data.addPicArr;  // 所有上传的图片
            var savePicArr = that.data.savePicArr; // 最终保存的图片
            savePicArr.push(name);
            addPicArr.push(name);
          }
        })
      }
    })
        
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    var savePicArr = this.data.savePicArr;
    
    imgs.splice(index, 1);
    savePicArr.splice(index,1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },




  //弹窗
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 表单提交
   */
  formSubmit: function(e) {
    var that = this;
    var savePicArr = this.data.savePicArr;
    var addPicArr = this.data.addPicArr;
    var staffId = this.data.staffId;
    //校验表单
    const params = e.detail.value
    console.log(params)
    // 验证字段
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false;
    }
    
    // 判断分类是否选择
    if (!this.data.catListBig  || !this.data.catListSmall){
      wx.showModal({
        content: '请选择分类',
        showCancel: false
      })
      return false;
    }
    if(this.data.imgs.length == 0) {
      wx.showModal({
        content: '请添加图片',
        showCancel: false
      })
      return false;
    }
    
    // 上传数据
    wx.request({
      url: app.globalData.webroot + '/index/firm/addFirm',
      method: 'POST',
      data: {
        info: params,
        bigCat: this.data.catListBig,
        smallCat: this.data.catListSmall,
        staffId: staffId,
        serviceId:this.data.serviceId,
        savePicArr:savePicArr,
        addPicArr:addPicArr
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        if(res.data.code != 1){
          return false;
        }
        var serviceId = res.data.msg;
        that.setData({
          serviceId: serviceId
        })
        var staffId = that.data.staffId;
        wx.redirectTo({
          url: '/pages/index/firm/service/serviceList/serviceList?staffId='+staffId,
          
        })
		
      },
      fail(res) {

      }
    })

  },

  //弹出框蒙层截断touchmove事件
  preventTouchMove: function() {},
  // 隐藏模态对话框
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  //对话框确认按钮点击事件
  onConfirm: function() {
    this.hideModal();
  },
  /**
    * 报错
    */
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false
    })
  },
  /**
    * textareaAInput 将用户输入数据绑定到this.data中
    */
  textareaAInput: function (e) {
    var val = e.detail.value;
    var length = val.length;
    this.setData({
      descLength: length
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 改变分类选中样式  大分类点击事件
  ChangeCss: function (e) {
    var mainCat = e.currentTarget.dataset.cat; // 点击的大分类
    var check = e.currentTarget.dataset.checked;  // 当前点击的分类状态
    var classify = this.data.classifyList;
    // 修改样式
    check = check == 'false' ? 'true' : 'false';
    // 重置所有按钮
    for (var i = 0; i < classify.length; i++) {
      var item = classify[i];
      classify[i].checked = 'false';
      for (var j = 0; j < item.Pid.length; j++) {
        classify[i].Pid[j].checked = 'false'
      }
      if (item.Seq == mainCat) {
        classify[i].checked = check;
      }
    }
    this.setData({
      classifyList: classify,
      catListBig: mainCat
    })
    console.log(this.data.catListBig)
  },
  // 小分类点击事件
  ChangeContentCss: function (e) {
    var cat = e.currentTarget.dataset.cat;  // 当前点击的小分类
    var catP = cat.substr(0, 1); //当前点击的小分类属于的大分类
    var catPos = this.data.catList.indexOf(catP); // 小分类的索引
    var curMainCat = this.data.catListBig; //  已经选中的大分类
    var classify = this.data.classifyList; //所有分类
    var check = e.currentTarget.dataset.checked;  // 当前点击的分类状态
    var item1 = this.data.catList;


    if (catP == curMainCat) {
      // 点击了选中大分类下面的小分类
      check = check == "false" ? "true" : false;
      console.log(cat + "---" + catP + '----' + catPos)
      for (var i = 0; i < classify.length; i++) {
        var item = classify[i];
        if (item.Seq == catP) {
          for (var j = 0; j < item.Pid.length; j++) {
            if (item.Pid[j].Seq == cat) {
              console.log(item.Pid[j].Seq + '----' + cat)
              classify[i].Pid[j].checked = check;
            }
          }
        }
      }
    } else {
      //  选择了其他大分类
      for (var i = 0; i < classify.length; i++) {
        var item = classify[i];
        if (catP == item.Seq) {
          classify[i].checked = 'true';
        } else {
          classify[i].checked = 'false';
        }
        for (var j = 0; j < item.Pid.length; j++) {
          if (classify[i].Pid[j].Seq == cat) {
            classify[i].Pid[j].checked = 'true';
          } else {
            classify[i].Pid[j].checked = 'false';
          }

        }
      }

    }
    this.setData({
      classifyList: classify
    })
  },
  /**
 * 分类的点击事件
 */
  changeCat: function (e) {
    var checked = e.currentTarget.dataset.checked;
    var classify = this.data.classifyList;
    var cat = e.currentTarget.dataset.cat;
    var catListBig = this.data.catListBig;
    var catListSmall = this.data.catListSmall;
    var mainCat;
    var smallCat;
    if (cat.length == 1) {
      // 取消大分类
      mainCat = cat;
    } else {
      // 取消小分类
      mainCat = cat.substring(0, 1);
      smallCat = cat;
    }
    for (var i = 0; i < classify.length; i++) {
      if (classify[i].Seq == mainCat) {
        classify[i].checked = 'true';
      } else {
        classify[i].checked = 'false';
      }

      for (var j = 0; j < classify[i].Pid.length; j++) {
        if (classify[i].Pid[j].Seq == smallCat) {
          classify[i].Pid[j].checked = 'true'
        } else {
          classify[i].Pid[j].checked = 'false'
        }

      }
    }
    this.setData({
      classifyList: classify,
      catListBig: mainCat,
      catListSmall: smallCat
    })

    console.log(this.data.catListSmall + '------' + this.data.catListBig)
  },
  /**
* 验证函数
*/
  initValidata: function () {
    // 
    const rules = {
      serviceName: {
        required: true,
        maxlength: 30
      },
      serviceTitle: {
        required: true,
        maxlength: 30
      },
      lowPrice: {
        required: true,
        number: true,
        maxlength: 7
      },
      highPrice: {
        number: true,
        maxlength: 7
      },
      needTime: {
        required: true,
        number: true,
        maxlength: 4
      },
      introduce: {
        required: true,
        maxlength: 500
      }



    }
    const message = {
      serviceName: {
        required: '服务项目名称不能为空',
        maxlength: '服务项目名称最长30字符'
      },
      serviceTitle: {
        required: '服务项目副标题不能为空',
        maxlength: '服务项目副标题最长30字符'
      },
      lowPrice: {
        required: '最低价不能为空',
        number: '请输入正确的最低价',
        maxlength: '最低价长度不能超过7位'
      },
      highPrice: {
        number: '请输入正确的最高价',
        maxlength: '最高价长度不能超过7位'
      },
      needTime: {
        required: '耗时不能为空',
        number: '请填写正确的耗时',
        maxlength: '耗时最长4位字符'
      },
      introduce: {
        required: '服务介绍不能为空',
        maxlength: '服务介绍长度不能超过500'
      }
    }
    this.WxValidate = new WxValidate(rules, message);
  },
})