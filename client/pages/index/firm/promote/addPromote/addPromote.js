// pages/index/firm/promote/addPromote/addPromote.js
const app = getApp();
Page({
  // 页面的初始数据
  data: {
    webRoot: app.globalData.webroot,
    choosePromote: 1,  //是否叠加优惠 0-不 1--叠加
    showModal: false,
    showDialog: false,
    showDialogRight: false,  
    saleOff: [],   //单笔满减list 
    activityName: "",  //活动名称
    activityLists: [],  //活动类型
    items: [
      { name: 0, value: '单笔折扣', checked: false, 'disabled': false},
      { name: 1, value: '首单折扣', checked: false, 'disabled': false},
      { name: 2, value: '熟客折扣', checked: false, 'disabled': false}
    ],
    items1: [{ name: 3, value: '单笔满减', checked: false, 'disabled': false, item: 0 }],
    selectList: "",  //模态框单选
    selectList1: '',  //模态框单选
    fullAndCut: [],  //满  减  

    arr1: [],         //存每一项的优惠满减
    full: "",     //满的input 表单
    fullList: [],  //满的 input list
    cut: "",     //满的input 表单
    cutList: [],  //满的 input list
    fullVal: [],      //满 
    cutVal: [],      //减
    fullAndCut: [],     //满减
    onSale: 95,    //非满减
    eachSale: 95, ///单笔折扣
    firstSale: 95,  //首单折扣
    oldSale: 95,  //熟客折扣
    salesArr1:'',
    value1:[]
    // fullAndCut:{
    //   'full' : 200,
    //   'cut' : 25
    // } , //填写的满减 对象 数据
  },
  //满 
  full: function (e) {
    var that = this;
    console.log("index=======" + e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    console.log("值是---------" + e.detail.value)
    var value = e.detail.value;
    var fullAndCut = that.data.fullAndCut;
    var obj = {
      full: value
    };
    fullAndCut[index] = obj;
    fullAndCut = that.data.fullAndCut;
    that.setData({
      fullAndCut: fullAndCut
    })
    console.log(fullAndCut)

    return;
  },
  //减
  cut: function (e) {
    var that = this;
    console.log("index=======" + e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    console.log("值是---------" + e.detail.value)
    var value = e.detail.value;
    var fullAndCut = that.data.fullAndCut;
    fullAndCut[index]["cut"] = value;
    fullAndCut = that.data.fullAndCut;
    that.setData({
      fullAndCut: fullAndCut
    })

    console.log(fullAndCut)


  },
  // 删除 单笔满减
  delSingleFull: function (e) {

    var that = this;
    var delIndex = e.currentTarget.dataset.index;
    console.log(delIndex);
    // console.log(that.data.saleOff);
    // console.log(that.data.saleOff.length);
    var fullAndCut = that.data.fullAndCut;
    console.log(e.currentTarget.dataset.index)
    console.log(that.data.fullAndCut);
    delete fullAndCut[delIndex];

    console.log('删后的------'+that.data.fullAndCut);
    // for (var i = 0; i < fullAndCut.length; i++) {  
    //   if (delIndex == i) {
    //     //把这一条删除
    //     fullAndCut.splice(delIndex, 1);

    //   }
    // }
    console.log("删除后的---" + fullAndCut);
    console.log("删除后的---" + JSON.stringify(fullAndCut))


    delete that.data.saleOff[delIndex];
    var list = [];
    for (var i = 0; i < that.data.saleOff.length; i++) {
      if (that.data.saleOff[i] != []) {
        list.push(that.data.saleOff[i])
      }
    }
    that.setData({
      saleOff: list
    })
    console.log(that.data.saleOff);
    // console.log(JSON.stringify(this.data.saleOff))
  },
  /**
   * 删除非 满减
   */
  delSingleFull1:function(e){
    var that = this;
    var delIndex = e.currentTarget.dataset.index;
    console.log(delIndex);
    console.log(that.data.activityLists);
    console.log(that.data.items);
    var eachSale = that.data.eachSale;
    var firstSale = that.data.firstSale;
    var oldSale = that.data.oldSale;
    // var saleArr = [{ 'sale': eachSale, 'PromoteType': 0 }, { 'sale': firstSale, 'PromoteType': 1 }, { 'sale': oldSale, 'PromoteType': 2 }];
    var salesArr=[];
    for (var i = 0; i < that.data.activityLists.length;i++){
      if (that.data.activityLists[i]['name']==delIndex){
        that.data.activityLists.splice(i--, 1)
      }else{
        if(i==0){
          salesArr.push({ 'sale': eachSale, 'PromoteType': 0 }) 
          that.setData({
            eachSale: eachSale
          })
        }else if(i==1){
          salesArr.push({ 'sale': firstSale, 'PromoteType': 1 }) 
          that.setData({
            firstSale: firstSale
          })
        }else if(i==2){
          salesArr.push({ 'sale': oldSale, 'PromoteType': 2 }) 
          that.setData({
            oldSale: oldSale
          })
        }
      }
      
    }
    /////////把当前name为delIndex的items数组里对应那条数据的 checked: false, disabled: false
    var inintitems=that.data.items;
    for (var i = 0; i < inintitems.length;i++){
      if (inintitems[i]["name"] == delIndex){
            //
        inintitems[i]["checked"] = false
        inintitems[i]["disabled"]=false
      }
    }

    console.log("可能是----" + salesArr)
    console.log("肯能是---" + JSON.stringify(salesArr))
    that.setData({
      salesArr1: JSON.stringify(salesArr),
      //////重新赋值
      items: inintitems
    })
   // that.data.activityLists.splice(delIndex,1)
    //delete that.data.activityLists[delIndex];
    that.setData({
      activityLists: that.data.activityLists
    })
    console.log(that.data.activityLists);//点击删除之后的数据
   
    
    // activityLists
  },
  /**
   * 非首单优惠
   */
  onSaleInput: function (e) {
    var that = this;
    // console.log("index=======" + e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;//输入的值
    console.log('点击了----' + index);
    //  eachSale:"", ///单笔折扣
    // firstSale: "",  //首单折扣
    //   oldSale: "",  //熟客折扣
    if (index == 0) {
      var eachSale = that.data.eachSale;
      that.setData({
        eachSale: value
      })
    } else if (index == 1) {
      var firstSale = that.data.firstSale;
      that.setData({
        firstSale: value
      })
    } else if (index == 2) {
      var oldSale = that.data.oldSale;
      that.setData({
        oldSale: value
      })
    }
    console.log(that.data.eachSale + "---" + that.data.firstSale + "----" + that.data.oldSale)
    // var index = e.currentTarget.dataset.index;
    // console.log(index)
    // console.log(e.detail.value);

  },
  // 得到活动名称
  activityName: function (e) {
    var that = this;
    // console.log(e.detail.value)
    that.setData({
      activityName: e.detail.value
    })
    console.log(that.data.activityName);
  },

  //弹窗
  showDialogBtn: function () {
    console.log("---添加按钮")
    this.setData({
      showModal: true
    })
    // 改 items
    var selectedList = this.data.activityLists;
    console.log(selectedList);   //选中的
    console.log(this.data.items);  //要显示的
    console.log(this.data.items1);
    if (selectedList.length > 0) {
      for (var i = 0; i < selectedList.length; i++) {
        var name = selectedList[i]['name'];
        this.data.items[name]['disabled'] = true
       
        // if (name == this.data.items.length-1){
        //   this.data.items[name]['disabled'] = false
        //   this.data.items.push({ name: this.data.items.length, value: "单笔满减", checked: true, disabled: true })

        // }
      }

    }
    console.log(this.data.items)
    this.setData({
      items: this.data.items
    })

  },
  checkChange1: function (e) {
    console.log("----模态框的单笔满减按钮--")
    console.log('radio发生change事件，携带value值为：', e)
    var that = this
    that.setData({
      value1: e.detail.value
    })
    console.log(e.detail.value)
    console.log(this.data.value1)
    that.setData({
      selectList1: this.data.value
    })


    var items1 = this.data.items1;
    console.log(this.data.items1)
    
    //items1: [{ name: 3, value: '单笔满减', checked: false, 'disabled': false, item: 0 }],
    var checkArr = e.detail.value;//
    if (items1[0]["checked"]==false){
      items1[0].checked = true;
      this.setData({
        items1: items1
      })
  }else{
      items1[0].checked = false;
      this.setData({
        items1: items1
      })
  }
 
   
   
    console.log(items1[0]["checked"])
    console.log(this.data.items1);
   
  },
  // 
  checkChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e)
    var that = this
    console.log(that.data.activityLists)
    for (var i = 0; i < this.data.items.length;i++){
      if (this.data.items[i]['checked']==true){
        this.data.items[i]['checked']=false;
         this.data.items[i]['checked']=false;
        }
    }
    that.setData({
      items:this.data.items
    })
    that.setData({
      activityLists:that.data.activityLists
    })
    that.setData({
      value: e.detail.value
    })
    console.log(this.data.value)   //[0,1]
    that.setData({
      selectList: this.data.value
    })


    var items = this.data.items;
    console.log(this.data.items)
    var checkArr = e.detail.value;
    // console.log(e.detail.value)
    for (var i = 0; i < items.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      items: items
    })

  },

  //对话框模态框 确认按钮点击事件
  onConfirm: function () {
    var that=this;
    console.log("---点击了确定按钮")
    this.hideModal();
    console.log(this.data.activityLists);
    console.log(this.data.items);   //非满减数组
    console.log("点击了确定按钮----")
    console.log(this.data.selectList);
    console.log('单笔优惠需要遍历的-----' + this.data.saleOff);
    console.log(JSON.stringify(this.data.saleOff))
    console.log(this.data.selectList)
    // 遍历不是单笔满减
    var selectItem = [];
    for (var i = 0; i < this.data.selectList.length; i++) {
      
      var item = this.data.selectList[i];    //0  1  2
    
      var itemList = this.data.items[item];
      selectItem.push(itemList);
    }
    this.setData({
      activityLists: selectItem
    })
    console.log(selectItem);
    console.log(selectItem[0])
    console.log('选择的是----' + this.data.activityLists)
    if (this.data.value1.length!=0){
      var saleOff = that.data.saleOff;
      console.log(saleOff);
      // saleOff.push(items1);
      console.log(saleOff.length)
      saleOff.push([{ "name": 3, "value": "单笔满减", "checked": false, "disabled": false, "item": saleOff.length }])
     // console.log(items1);
      this.setData({
        saleOff: saleOff
      })
      console.log(this.data.saleOff);
      var items1 = this.data.items1;
        items1[0].checked = false;
        this.setData({
          items1: items1,
          value1:[]
        })
      
    }
  },
  // 是否优惠叠加
  choosePromote: function (e) {
    var that = this;
    // console.log(e.detail.value);
    that.setData({
      choosePromote: e.detail.value
    })
    console.log("---是否叠加="+that.data.choosePromote);
  },
  // 下一步
  //"pages/index/firm/promote/addPromote/addPromote",
  nextStemp: function () {
    var that = this;
    console.log(that.data.eachSale + "---" + that.data.firstSale + "----" + that.data.oldSale)
    var activityName = that.data.activityName;       //活动名称
    var choosePromote = that.data.choosePromote;   //是否优惠叠加
    var activityLists = that.data.activityLists;    //不是单笔满减
    var saleOff = that.data.saleOff;                 //单笔满减
    var fullAndCut = that.data.fullAndCut;           //单笔满减整理的要传的数组
    var eachSale = that.data.eachSale;            //单笔折扣
    var firstSale = that.data.firstSale;          //首单折扣
    var oldSale = that.data.oldSale;              //熟客折扣
    if (activityName == "") {
      console.log("---")
      //活动名称未填写！
      wx.showToast({
        title: '提示:活动名称未填写！',
        icon: 'none',
        duration: 1000
      })
     return;
    }

    var saleOffactivityLists = saleOff.concat(activityLists);
    if (saleOffactivityLists.length==0){
      //信息未填写完整
      wx.showToast({
        title: '提示:优惠类型未添加！',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    console.log(that.data.saleOff); //单笔满减
    console.log(that.data.fullAndCut); ////单笔满减整理的要传的数组
    console.log(that.data.activityLists)//不是单笔满减
    console.log("单笔="+that.data.eachSale + "---首单=" + that.data.firstSale + "----熟客=" + that.data.oldSale)

    var singleIsfullArr = [];//存储单笔满减的数据 
    if (saleOff.length>0){
      if (fullAndCut.length != saleOff.length){
        //满减还没填写完整
        //信息未填写完整
        wx.showToast({
          title: '提示:满减还没填写完整！',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      for (var i = 0; i < saleOff.length; i++) {
        var obj = {
          type: 3,
          sale: fullAndCut[i]["full"] + "&" + fullAndCut[i]["cut"]
        }
        singleIsfullArr[i] = obj;
      }
    }
    var othersArr = [];//存储其他三种活动的数据
    if (activityLists.length > 0) {
      for (var i = 0; i < activityLists.length; i++) {
        var obj = {
          type: activityLists[i]["name"] //标记活动类型 0-单笔折扣 1-首单折扣 2-熟客折扣
        }
        if (activityLists[i]["name"] == 0) {
          //单笔折扣
          obj["sale"] = eachSale;
        }
        if (activityLists[i]["name"] == 1) {
          //单笔折扣
          obj["sale"] = firstSale;
        }
        if (activityLists[i]["name"] == 2) {
          //单笔折扣
          obj["sale"] = oldSale;
        }
        othersArr[i] = obj;

      }
    }
   

    var activityArr = singleIsfullArr.concat(othersArr);
    console.log(activityArr);
    //

    var allObj={
      firmId: 2,///////////////////////////////////到时候动态化 
      title: activityName,//标题
      ifOverlay: choosePromote,//是否叠加  0-否 1-叠加
      activityArr: activityArr
    }
    console.log(allObj);//存入缓存里
    // { firmId: 2, title: "1111111", ifOverlay: 0, activityArr: Array(4) }
    // activityArr: Array(4)
    // 0: { type: 3, sale: "2000,500" }
    // 1: { type: 3, sale: "600,50" }
    // 2: { type: 0, sale: "88" }
    // 3: { type: 2, sale: "85" }
    //存入缓存里
   
      wx.setStorageSync("activityinfo", JSON.stringify(allObj));
      console.log(JSON.parse(wx.getStorageSync("activityinfo")))
 
    //跳转页面 
    wx.redirectTo({
      url: '/pages/index/firm/promote/promoteDate/promoteDate'
    })
   
  },
  //弹出框蒙层截断touchmove事件
  preventTouchMove: function () {
  },
  // 隐藏模态对话框

  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  // 对话框取消按钮点击事件

  onCancel: function () {
    this.hideModal();
  },


  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {

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


