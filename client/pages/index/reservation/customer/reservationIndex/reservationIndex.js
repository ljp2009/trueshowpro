
const app = getApp();
Page({
  data: {
    test1:['1美甲店','2健身房'],
    //radio-group数据源
    classes_array: [{ name: '全部', checked: false }, { name: '阅读', checked: false }, { name: '外语', checked: false }, { name: '亲子', checked: false }, { name: '技能', checked: false }, { name: '习惯', checked: false }, { name: '运动', checked: false }, { name: '艺术', checked: false }],
    //滑块的
    imgs: [
      '测试数据1111111', '测试数据2222222','测试数据33333'
    ],
    //滑块结束
    _num: 0, 
    pageBackgroundColor:'red',  //点击添加背景
    webRoot: app.globalData.webroot,  //得到根
    // 下拉菜单变量  
    index: null,
    picker: [{ 'id': 0, 'item': '单笔满减，满200减20', 'checked': true }, { 'id': 1, 'item': '熟客折扣，20%OFF', 'checked': false }, { 'id': 2, 'item': '首单折扣', 'checked': false }],
    //下拉菜单变量结束
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,  
    num: 1,  //对勾的 0是第一步  1是第二步
    // basicsList: [{
    //   icon: 'usefullfill',
    //   name: '预约'   
    // }, {
    //   icon: 'radioboxfill',
    //   name: '到店'
    // }, {
    //   icon: 'roundclosefill',
    //   name: '服务中'
    // }, {
    //   icon: 'roundcheckfill',
    //   name: '支付'
    // }, {
    //   icon: 'roundcheckfill',
    //   name: '晒单'
    // },
    // ],
    webRoot: app.globalData.webroot,
    basics: 0,
    // 预约进度条
    numList: [{
      name: '预约'
    }, {
      name: '到店'
    }, {
      name: '服务中'
    }, {
      name: '支付'
    }, {
      name: '晒单'
    },],
   
    // scroll: 0,
    dateArr: []   //放时间的
  },
  //点击radio-group中的列表项事件
  radiochange: function (res) {
    console.log("选中的标签：" + res.detail.value);
    var arrs = this.data.classes_array;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].name == res.detail.value) {
        arrs[x].checked = true;
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      classes_array: arrs
    })
  },

  radiochange1: function (e) {
    var that = this;
    for (var i = 0; i < that.data.picker.length; i++) {
      if (that.data.picker[i].id == e.target.dataset.num) {
        console.log(that.data.picker[i].id);

        console.log(that.data.picker[i].checked);
        that.data.picker[i].checked = true;
      } else {
        console.log(that.data.picker[i].checked);
        that.data.picker[i].checked = false;
      }
    }
 

    console.log(e.target.dataset.num)
    this.setData({
      _num: e.target.dataset.num
    })
  }
    // var bgColor = this.data.pageBackgroundColor == 'blue' ? 'red' : 'blue';
    // // 设置背景颜色数据
    // this.setData({
    //   pageBackgroundColor: bgColor
    // });
    // console.log('radio发生change事件，携带的value值为：', e.detail.value)
  ,
  onLoad: function () {
    // 关于日期的js
    var date = new Date();
    var arr = [];
    var showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    console.log("今天日期是" + showDate)   //今天日期
    arr.push(date.getDate());
    for (var i = 1; i <= 6; i++) {//后7天
      date.setDate(date.getDate() + 1);
      showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      // console.log(showDate)
      arr.push(date.getDate());
      console.log(date.getDate())
    }
    this.setData({
      dateArr: arr
    })
    console.log(this.data.dateArr);
  },
  // 下拉菜单选择事件
  PickerChange(e) {
  
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  // tabSelect(e) {
  //   console.log("导入的模块");
  //   console.log(e);
  //   this.setData({
  //     TabCur: e.currentTarget.dataset.id,
  //     scrollLeft: (e.currentTarget.dataset.id - 1) * 60
  //   })
  // },
  // 选择日期点击事件
  chooseDate: function (e) {
    console.log("选择的日期是" + e.currentTarget.dataset.item);
    console.log("点击选择的index是" + e.currentTarget.dataset.index);
  },
  // 点击预约事件
  makeOrder:function(){
    console.log("点击了预约");
  }
})