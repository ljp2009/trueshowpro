
const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    basicsList: [{
      icon: 'usefullfill',
      name: '预约'
    }, {
      icon: 'radioboxfill',
        name: '到店'
    }, {
      icon: 'roundclosefill',
        name: '服务中'
    }, {
      icon: 'roundcheckfill',
        name: '支付'
      }, {
        icon: 'roundcheckfill',
        name: '晒单'
      },
    ],
    basics: 0,
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
    num: 0,
    scroll: 0,
    dateArr: []
  },
  onLoad:function(){
   var date = new Date();
   var arr=[];
    var showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    // console.log(showDate)
    console.log(date.getDate())
    arr.push(date.getDate());
    for (var i = 1; i <= 7; i++) {//后7天
      date.setDate(date.getDate() + 1);
      showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      // console.log(showDate)
      arr.push(date.getDate());
      console.log(date.getDate())
    }
    this.setData({
      dateArr: arr
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})