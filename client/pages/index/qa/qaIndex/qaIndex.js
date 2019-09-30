// pages/index/qa/qaIndex/qaIndex.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    searchText: "",   //搜索的内容
    //0--feed 1--favoritedArr 2--myAsksArr 3--myAnswersArr
    feed: [], //接收到的推荐的数据集合
    favoritedArr: [],//接收到的收藏的数据集合
    myAsksArr: [],//接收到的 我的问 的数据集合
    myAnswerArr: [],//接收到的 我的答 的数据集合
    searchDataArr:[],  //接收搜索   的数组集合
    //侦听数据是否到底的标识
    ifFootFeed: 0,
    ifFootfavorited: 0,
    ifFootmyAsks: 0,
    ifFootmyAnswer: 0,
    returnData: [],  //返回去的值
    clickId: 0,
    navArr: [
      { 'value': '推荐', 'id': 0 },
      { 'value': '收藏', 'id': 1 },
      { 'value': '我的问', 'id': 2 },
      { 'value': '我的答', 'id': 3 },
    ],
    tabCur: 0,   //默认选中推荐
    commonData:[],  //

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求后端渲染推荐
    // that.nextLoad();
    // return;
    var currenttabCurId = that.data.tabCur;
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    wx.request({
      //url: app.globalData.webroot + '/index/qa/getTitleInQnas',
      url: app.globalData.webroot1 +'/index/qa/getTitleInQnas',
      method: "post",
      data: {
        msg: JSON.stringify([]),
        currenttabCurId: currenttabCurId,
        uid: uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        //console.log("数据长度="+res.data.msg.length);
        // return
        var feed_data = res.data.msg;
        for (var i = 0; i < feed_data.length; i++) {
          //console.log(i + "----" + feed_data[i]['Pic']);
          if (feed_data[i]['Pic'] != null && feed_data[i]['Pic'] != "") {
            feed_data[i]['Pic'] = JSON.parse(feed_data[i]['Pic']);
          }

        }
        that.setData({
          feed: feed_data,
          commonData: feed_data
        });
        console.log("onload---------");
        console.log(that.data.feed);

      }
    })
  },
  //侦听滚动条到底了事件
  lower: function () {
    wx.showNavigationBarLoading();
    var that = this;

    setTimeout(function () {
      wx.hideNavigationBarLoading();
      that.nextLoad();
    }, 1000);


    console.log("lower")
    console.log("到底了---")
  },
  //加载 下面12条
  nextLoad: function () {
    var that = this;
    var tabCur = that.data.tabCur;//当前导航选中的值 0--recommended 1--favorited 2--myAsks 3--myAnswer

    var feed = that.data.feed;//上一次的返回的数据  推荐的数据
    var favoritedArr = that.data.favoritedArr;//接收到的收藏的数据集合
    var myAsksArr = that.data.myAsksArr;//接收到的 我的问 的数据集合
    var myAnswerArr = that.data.myAnswerArr;//接收到的 我的答 的数据集合
    var searchDataArr = that.data.searchDataArr;  //接收到的 搜索 的数据集合
    console.log(favoritedArr.length);
    console.log(feed);
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    console.log('要发送的' + feed);
    console.log(feed)
    //要发送的数据
    var senddata = [];

    if (tabCur == 0) {
      //推荐
      senddata = JSON.stringify(feed); //发送的是 数组
    } else if (tabCur == 1) {
      //收藏 发送的是当前数组的 length-1---最后一个值的索引值
      senddata = favoritedArr.length;
    } else if (tabCur == 2) {
      //我的问
      senddata = myAsksArr.length;
    } else if (tabCur == 3) {
      //我的问
      senddata = myAnswerArr.length;
    } else if (tabCur == 4) {
      //我的答
      senddata = searchDataArr.length;
    }

    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    var searchText = that.data.searchText;
    //请求后端 获取下12条数据
    wx.request({
      //url: app.globalData.webroot + '/index/qa/getTitleInQnas',
      url: app.globalData.webroot1 +'/index/qa/getTitleInQnas',
      method: "post",
      data: {
        msg: senddata,//当前需要发送的对应的数据
        currenttabCurId: tabCur, //当前的导航id
        uid: uid, //用户id
        searchText: searchText,  //发送的搜索词
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        var next_data = res.data.msg;//接收到底的数据

        //请求的数据没有的情况
        if (res.data.msg.length == 0) {
          wx.showToast({
            title: '没有数据了',
            icon: 'none',
            duration: 2000
          })
          if (tabCur == 0) {
            that.setData({
              ifFootFeed: 1
            })
          }
          if (tabCur == 1) {
            that.setData({
              ifFootfavorited: 1
            })
          }
          if (tabCur == 2) {
            that.setData({
              ifFootmyAsks: 1
            })
          }
          if (tabCur == 3) {
            that.setData({
              ifFootmyAnswer: 1
            })
          }
          return;
        }
        console.log("接下来的12条数据------")
        console.log(next_data);
        ////feed favoritedArr myAsksArr myAnswerArr
        if (tabCur == 0) {
          //推荐
          that.setData({
            feed: that.data.feed.concat(next_data),//合并每一次接收过来的数据
            commonData: that.data.feed.concat(next_data),
          });
          console.log(that.data.feed);

        } else if (tabCur == 1) {
          //收藏 发送的是当前数组的 length-1---最后一个值的索引值
          that.setData({
            favoritedArr: that.data.favoritedArr.concat(next_data),//合并每一次接收过来的数据
            commonData: that.data.favoritedArr.concat(next_data),
          });
          console.log(that.data.favoritedArr);

        } else if (tabCur == 2) {
          //我的问
          that.setData({
            myAsksArr: that.data.myAsksArr.concat(next_data),//合并每一次接收过来的数据
            commonData: that.data.myAsksArr.concat(next_data),

          });
          console.log(that.data.myAsksArr);
        } else if (tabCur == 3) {
          //我的答
          that.setData({
            myAnswerArr: that.data.myAnswerArr.concat(next_data),//合并每一次接收过来的数据
            commonData: that.data.myAnswerArr.concat(next_data),
          });
          console.log(that.data.myAnswerArr);
        } else if (tabCur == 4) {
          //我的答
          that.setData({
            searchDataArr: that.data.searchDataArr.concat(next_data),//合并每一次接收过来的数据
            commonData: that.data.searchDataArr.concat(next_data),
          });
          console.log(that.data.searchDataArr);
        }

        setTimeout(function () {
          wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 1000
          })
        }, 1000)
      }
    })



  },
  //导航点击事件
  tabSelect(e) {
    var that = this;
    this.setData({
      tabCur: e.currentTarget.dataset.id,
    })
    console.log(this.data.tabCur);
    var tabCur = that.data.tabCur;
    var ifFootFeed = that.data.ifFootFeed;
    var ifFootfavorited = that.data.ifFootfavorited;
    var ifFootmyAsks = that.data.ifFootmyAsks;
    var ifFootmyAnswer = that.data.ifFootmyAnswer;
    //id=0----推荐   1--收藏 2--我的问  3--我的答
    //通过id参数的不同去请求不一样的数据 按需加载 12--12
    if (tabCur == 0) {
      that.setData({
        commonData:that.data.feed
      })
      if (ifFootFeed == 1){
        return;
      }
     
    }
    if (tabCur == 1 ) {
      that.setData({
        commonData: that.data.favoritedArr
      })
      if (ifFootfavorited == 1) {
        return;
      }
     
    }
    if (tabCur == 2 ) {
      that.setData({
        commonData: that.data.myAsksArr
      })
      if (ifFootmyAsks == 1) {
        return;
      }
    }
    if (tabCur == 3 ) {
      that.setData({
        commonData: that.data.myAnswerArr
      })
      if (ifFootmyAnswer == 1) {
        return;
      }
    }
    if (tabCur == 4) {
      that.setData({
        commonData: that.data.searchDataArr
      })
      if (ifFootmyAnswer == 1) {
        return;
      }
    }
    that.nextLoad();

  },
  //点击右上角的加号 进入添加问页面
  toAddQa: function () {
    //跳转页面
    //pages/index/qa/addQ/addQ
    //qid=-1的意思是 添加一条新问的记录
    wx.navigateTo({
      url: '/pages/index/qa/addQ/addQ?qid=-1',//表示新建问数据
    })
  },
  /**
   * 搜索事件
   */
  getSearchText: function (e) {
    this.setData({
      searchText: e.detail.value,
    })
    console.log(this.data.searchText);
    
    //searchDataArr

  },
  // 搜索事件
  serchBtn:function(){
    console.log("点击了搜索------")
    this.setData({
      
      tabCur: 4,
      searchDataArr: []
    })
   
   
    this.nextLoad();
  },
  //跳转到问题详细信息页面
  jumpDetail: function (e) {
    var that = this;
    console.log("------------")
    console.log(e.currentTarget.dataset.index)
    // var charTime;
    // if (that.data.commonData[e.currentTarget.dataset.index]['charTime']['day']==undefined){
    //   charTime =  that.data.commonData[e.currentTarget.dataset.index]['charTime']['hour'] + that.data.commonData[e.currentTarget.dataset.index]['charTime']['min'];
    // } else if (that.data.commonData[e.currentTarget.dataset.index]['charTime']['hour']==undefined){
    //   charTime = that.data.commonData[e.currentTarget.dataset.index]['charTime']['min'];
    // } 

    // charTime = that.data.commonData[e.currentTarget.dataset.index]['charTime']['day']  + that.data.commonData[e.currentTarget.dataset.index]['charTime']['hour'] + that.data.commonData[e.currentTarget.dataset.index]['charTime']['min'];
    // console.log(charTime);
    // wx.redirectTo({
    //   url: '/pages/index/qa/qaDetail/qaDetail',
    // })
    console.log(that.data.commonData[e.currentTarget.dataset.index]['charTime']);
    var charTime = that.data.commonData[e.currentTarget.dataset.index]['charTime'];
  
    wx.navigateTo({
      url: "/pages/index/qa/qaDetail/qaDetail?qid=" + that.data.commonData[e.currentTarget.dataset.index]['Qid'] + "&&time=" + JSON.stringify(charTime),
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
  onUnload: function (e) {
      
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