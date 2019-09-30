// pages/index/qa/qaDetail/qaDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webRoot: app.globalData.webroot,
    webRoot1: app.globalData.webroot1,
    isExpanding: false, //收起 展开样式
    qusDetail:[],    //问题详情
    imgs: [],
    swipeIndex:0,
    answerCount:0,
    uid:0,    //自己的uid
    qid:0 ,     //问题id
    aidArr:[], //存储当前问题的所有回答id
    aidArrLen:0,
    answerData:[],  //回答数据
    iffollower:0,//是否关注技师标识
    ifLiked:0, //是否点赞标识
    ifFavor:0, //是否收藏
    time:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var time = JSON.parse(options.time);
    that.setData({
      time: time
    })
    console.log(time);
    console.log(that.data.time['min'])
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];//用户id
    var qid=options.qid;//问题id
    that.setData({
      qid: qid,
      uid: uid
    })
    console.log("uid=====" + uid + "---" + qid);
    //getQuestionById
    wx.request({
      //url: app.globalData.webroot + '/index/qa/getQuestionById',
      url: app.globalData.webroot1+'/index/qa/getQuestionById',
      method: "post",
      data: {
        qid:qid,
        uid: uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        
        console.log(res.data.msg);
        var qusDetail = res.data.msg;
        if (qusDetail["Pic"]) {
          var piclen = qusDetail["Pic"].length;
          if (piclen > 0) {
            qusDetail["ifpic"] = 1;//有收起
            qusDetail["ifcon"] = 1;//有收起
          }
        } else {
          //图片为空
          if (qusDetail["Contents"]) {
            if (qusDetail["Contents"].length > 25) {
              qusDetail["ifpic"] = 0;
              qusDetail["ifcon"] = 1
            } else {
              qusDetail["ifpic"] = 0;
              qusDetail["ifcon"] = 0
            }
          }

        }

        that.setData({
          qusDetail: qusDetail
        })
      
        console.log(that.data.qusDetail);


        ////////获取回答////////////////////
        //获取当前问题的所有回答id
        wx.request({
          //url: app.globalData.webroot + '/index/qa/getAnswerIdListById',
          url: app.globalData.webroot1 +'/index/qa/getAnswerIdListById',
          method: "post",
          data: {
            qid: that.data.qid,
            uid: that.data.uid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' //post请求
          },
          success(res) {
            console.log(res.data.msg);
            var answerCount = res.data.msg.length;
            var aidArr = res.data.msg;
            that.setData({
              aidArr: aidArr,
              answerCount: answerCount
            })
            if (aidArr.length == 0) {
              //没有回答
              return;
            }
            //发送第一个aid给后端
            wx.request({
              //url: app.globalData.webroot + '/index/qa/getAnswerById',
              url: app.globalData.webroot1 +'/index/qa/getAnswerById',
              method: "post",
              data: {
                aid: aidArr[0],
                uid: uid,
                qid: that.data.qid,
                answerCount: that.data.answerCount,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' //post请求
              },
              success(res) {
                console.log(res.data.msg);
                that.data.imgs[that.data.swipeIndex] = res.data.msg;

                that.setData({
                  answerData: res.data.msg,
                  imgs: that.data.imgs

                })
                console.log("!!!!!!!!!!")  //answerCount
                
                that.setData({
                  imgs: that.data.imgs
                })
                console.log(that.data.imgs)


                /////////////////////////////////////
                that.nextData();
              }

            })


          }
        })

////////////////////////////////////////////////


      }
    })

  



  },
  //获取接下来的数据
  nextData:function(){
    var that=this;

    var aidArr = that.data.aidArr;
    // console.log(aidArr[that.data.swipeIndex])
    var swipeIndex = that.data.swipeIndex;
    console.log(swipeIndex)
    swipeIndex++;
    if (aidArr.length == swipeIndex) {
      console.log("---已经没有数据了--")
      return;
    }
    that.setData({
      swipeIndex: swipeIndex
    })
    console.log(that.data.swipeIndex)
    wx.request({
      //url: app.globalData.webroot + '/index/qa/getAnswerById',
      url: app.globalData.webroot1 +'/index/qa/getAnswerById',
      method: "post",
      data: {
        aid: that.data.aidArr[that.data.swipeIndex],
        uid: that.data.uid,
        qid: that.data.qid,
        answerCount: that.data.answerCount
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
       
        var oldImgsList = that.data.imgs;
        oldImgsList[that.data.swipeIndex] = res.data.msg;
        that.setData({
          answerData: res.data.msg,
          imgs: oldImgsList

        })
        console.log("!!!!!!!!!!")  //answerCount
      
        that.setData({
          imgs: that.data.imgs
        })
        console.log(that.data.imgs)

      

      }
    })
   
  },
 
  // 滑块事件
  swiperChange:function(e){
    console.log(e.detail.current)
      console.log("------")
      var that=this;
    var aidArr = that.data.aidArr;
   // console.log(aidArr[that.data.swipeIndex])
    var swipeIndex = that.data.swipeIndex;
    console.log(swipeIndex)
    swipeIndex++;
    if (aidArr.length  == swipeIndex) {
      console.log("---已经没有数据了--")
      return;
    }
   
   
    that.setData({
      swipeIndex: swipeIndex
    })
    //this.data.swipeIndex++;
    //发送第一个aid给后端
    wx.request({
      //url: app.globalData.webroot + '/index/qa/getAnswerById',
      url: app.globalData.webroot1 +'/index/qa/getAnswerById',
      method: "post",
      data: {
        aid: aidArr[that.data.swipeIndex],
        uid: that.data.uid,
        qid: that.data.qid,
        answerCount: that.data.answerCount
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
        that.data.imgs[that.data.swipeIndex] = res.data.msg;

        that.setData({
          answerData: res.data.msg,
          imgs: that.data.imgs

        })
        console.log("!!!!!!!!!!")  //answerCount
     
        that.setData({
          imgs: that.data.imgs
        })
        console.log(that.data.imgs)


        /////////////////////////////////////
        //return;
        
      }
    })
  },
  
  //收起展开 点击事件
  handleExpandingChange: function () {
    this.setData({
      isExpanding: !this.data.isExpanding
    })
  },
  //回答问题按钮 点击事件
  answerBtn:function(){
    //aid=-1&qid=?&qtitle=xxxx""&favorited=?
    //qid=-1的意思是 添加一条新问的记录
    var that=this;
    var qid = that.data.qid;//问题id
    var qusDetail=that.data.qusDetail;
    var qtitle = qusDetail["Title"];//问题标题
    
    wx.navigateTo({
      url: '/pages/index/qa/addA/addA?aid=-1&qid=' + qid + '&qtitle=' + qtitle //表示新建答的记录
    });
  },
  //modifyAskBtn
  //当问题是登录本人的时,可以修改该问题
  modifyAskBtn:function(){
    //
    var that=this;
    console.log("---modifyAskBtn")
    var qid = that.data.qid;//问题id
    console.log(qid)
    wx.navigateTo({
      url: '/pages/index/qa/addQ/addQ?qid=' + qid,//表示编辑问数据
    })
  },
  //点击问题的收藏按钮 心号
  favorBtn:function(e){
    //qid uid   -----------favoriteQuestion
    //ifFavor
    var that = this;
    console.log(e.currentTarget.dataset.iffavor);
    var ifFavor = e.currentTarget.dataset.iffavor;//是否收藏的标识 0-未收藏  1--收藏
    var uid = that.data.uid;//当前登录用户id
    var qid = that.data.qid;//问题id

    if (ifFavor == 1) {
      that.setData({
        ifFavor: 0
      })
    } else {
      that.setData({
        ifFavor: 1
      })
    }

    //return;
    wx.request({
      //url: app.globalData.webroot + '/index/qa/favoriteQuestion',
      //http://ljp.jujiaoweb.com6
      url: app.globalData.webroot1+'/index/qa/favoriteQuestion',
      method: "post",
      data: {
        act: that.data.ifFavor,
        uid: uid,
        qid: qid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
       
        var qusDetail = that.data.qusDetail;
      
        qusDetail['ifFavor'] = that.data.ifFavor;
        
      
        that.setData({
          ifFavor: that.data.ifFavor,
          qusDetail: qusDetail
        })


      }
    })
  },
  //当回答是登录本人的时,可以修改该回答
  modifyAnswerBtn:function(e){
    var that=this;
    // aid>0&qid=?&qtitle=xxxx""
    var qid = that.data.qid;//问题id
    var aid = e.currentTarget.dataset.aid;//回答id
    var qtitle = e.currentTarget.dataset.qtitle;//问题id
   // console.log()
    wx.navigateTo({
      url: '/pages/index/qa/addA/addA?aid=' + aid+'&qid=' + qid + '&qtitle=' + qtitle //表示编辑答的记录
    });
  },
  //当前登录用户是否关注技师得点击事件
  //点击关注按钮事件
  follower: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.staffid);
    var staffId = e.currentTarget.dataset.staffid;//技师id
    var uid = that.data.uid;//当前登录用户id
    // console.log(e.currentTarget.dataset.iffollower)

    var iffollower = e.currentTarget.dataset.iffollower;
    
    if (iffollower == 1) {
      that.setData({
        iffollower:0
      })
     
    } else {
     
      that.setData({
        iffollower: 1
      })
    }
 
   //return;
    wx.request({
      url: app.globalData.webroot + '/index/user/FollowStaff',
      method: "post",
      data: {
        act: that.data.iffollower,
        staffId: staffId,
        uid: uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        var imgs=that.data.imgs;
        console.log(that.data.imgs[that.data.swipeIndex]);
        if (that.data.swipeIndex==0){
          imgs[that.data.swipeIndex]['iffollower'] = that.data.iffollower;
       }else{
          imgs[that.data.swipeIndex-1]['iffollower'] = that.data.iffollower;
       }
        
        console.log(res.data.msg);
        that.setData({
          iffollower: that.data.iffollower,
          imgs: imgs
        })
        // console.log("更改的关注状态----" + that.data.ifFollower);
       
      }
    })

  },
  //回答的点赞的点击事件
  likeBtn:function(e){
    //ifLiked
    var that = this;
    console.log(e.currentTarget.dataset.ifliked);
    var ifLiked = e.currentTarget.dataset.ifliked;//是否点赞的标识 0-未点赞
    var uid = that.data.uid;//当前登录用户id
    var aid = e.currentTarget.dataset.aid; //回答id aid
    var qid = that.data.qid;//问题id
    

    if (ifLiked == 1) {
      that.setData({
        ifLiked: 0
      })
    } else {
      that.setData({
        ifLiked: 1
      })
    }

    //return;
    wx.request({
      //url: app.globalData.webroot + '/index/qa/likeAnswer',
      //http://ljp.jujiaoweb.com6
      url: app.globalData.webroot1 +'/index/qa/likeAnswer',
      method: "post",
      data: {
        //aid qid uid act
        act: that.data.ifLiked,
        aid: aid,
        uid: uid,
        qid: qid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
      
        var imgs = that.data.imgs;
        console.log(that.data.imgs[that.data.swipeIndex]);
        if (that.data.swipeIndex == 0) {
          imgs[that.data.swipeIndex]['ifLiked'] = that.data.ifLiked;
          //Liked
          if (imgs[that.data.swipeIndex]['Liked']<1000){
            if (that.data.ifLiked==1){
              imgs[that.data.swipeIndex]['nowLiked']++;
            }else{
              imgs[that.data.swipeIndex]['nowLiked']--;
            }
            
          }
          console.log(imgs[that.data.swipeIndex]['nowLiked'])
        } else {
          imgs[that.data.swipeIndex - 1]['ifLiked'] = that.data.ifLiked;
          if (imgs[that.data.swipeIndex-1]['Liked'] < 1000) {
            if (that.data.ifLiked == 1) {
              imgs[that.data.swipeIndex-1]['nowLiked']++;
            } else {
              imgs[that.data.swipeIndex-1]['nowLiked']--;
            }

          }
          console.log(imgs[that.data.swipeIndex-1]['nowLiked'])
        }
        
        
        that.setData({
          ifLiked: that.data.ifLiked,
          imgs: imgs
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