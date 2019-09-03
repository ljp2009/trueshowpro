const app = getApp();
Page({
  data: {
    bodytype: 1,
    gdata: app.globalData,
    firstIndex: -1,
    //准备数据
    allchecked: {
      text: "全选",
      icon: "check_r.png",
    },
    mySubCatData: [],
    attrValueList:[],
    subcatLength: 0,//记录总的子分类的个数
    // attrValueList: [
    //   {
    //     attrKey: "美发",
    //     icon: "check_r.png",
    //     attrValues: ["洗剪", "烫染", "护理", "造型", "植发", "风格"],
    //     attrValueStatus: [true, true, true, true, true, true]
       
    //   },
    //   {
    //     attrKey: "美睫/眉",
    //     icon: "check_r.png",
    //     attrValues: ["修眉", "画眉", "纹眉", "假睫", "烫睫"],
    //     attrValueStatus: [true, true, true, true, true]
    //   },
    //   {
    //     attrKey: "化妆",
    //     icon: "check_r.png",
    //     attrValues: ["职业", "新娘", "舞台", "裸妆", "约会", "流行"],
    //     attrValueStatus: [true, true, true, true, true, true]
    //   },
    //   {
    //     attrKey: "护肤",
    //     attrValues: ["清洁", "保湿", "美白", "祛斑", "修复", "抗衰"],
    //     icon: "check_r.png",
    //     attrValueStatus: [true, true, true, true, true, true]
    //   },

    //   {
    //     attrKey: "美甲",
    //     attrValues: ["甲油胶", "光疗", "彩绘", "水晶", "浮雕", "贴片"],
    //     icon: "check_r.png",
    //     attrValueStatus: [true, true, true, true, true, true]
    //   },
    //   {
    //     attrKey: "美体",
    //     attrValues: ["SPA", "放松", "保养", "排毒", "纤体", "脱毛"],
    //     icon: "check_r.png",
    //     attrValueStatus: [true, true, true, true, true, true]
    //   },
    //   {
    //     attrKey: "保健",
    //     attrValues: ["按摩", "理疗", "女性", "疏通", "调理", "排毒"],
    //     icon: "check_r.png",
    //     attrValueStatus: [true, true, true, true, true, true]
    //   },
    //   {
    //     attrKey: "健身",
    //     attrValues: ["塑性", "瑜伽", "舞蹈", "瘦身", "力量", "耐力"],
    //     icon: "check_r.png",
    //     attrValueStatus: [true, true, true, true, true, true]
    //   },
    //   {
    //     attrKey: "非主流",
    //     attrValues: ["纹身", "穿钉", "耳洞"],
    //     icon: "check_r.png",
    //     attrValueStatus: [true, true, true]
    //   }
    // ],
    imgwidth: 1030,
    imgheight: 1327,
    widthHeightArr: [
      { head: { width: 138, height: 290, icon: "check_r.png"}},
      { eye: { width: 350, height: 390, icon: "check_r.png" } },
      { face: { width: 360, height: 570, icon: "check_r.png" } },
      { nose: { width: 430, height: 470, icon: "check_r.png" } }, 
      { neck: { width: 230, height: 580, icon: "check_r.png" } },
      { chest: { width: 730, height: 350, icon: "check_r.png" } },
      { arms: { width: 890, height: 500, icon: "check_r.png" } }, 
      { hand: { width: 920, height: 810, icon: "check_r.png" } }, 
      { waist: { width: 720, height: 630, icon: "check_r.png"} },
      { abdomen: { width: 700, height: 760, icon: "check_r.png" } },
      { haunch: { width: 810, height: 850, icon: "check_r.png" } }, 
      { legs: { width: 570, height: 1000, icon: "check_r.png"} },
      { foots: { width: 850, height: 1560,icon: "check_r.png" } },
      
    ],
    body: [{
      id: 0,
      bodyname: "head",
      width: 110,
      height: 340,
      // icon: "check_r.png"
    },
    {
      id: 1,
      bodyname: "eye",
      width: 335,
      height: 398,
      // icon: "check_r.png"
    },
    {
      id: 2,
      bodyname: "face",
      width: 360,
      height: 580,
      // icon: "check_r.png"

    },
    {
      id: 3,
      bodyname: "nose",
      width: 430,
      height: 490,
      // icon: "check_r.png"
    },
    {
      id: 4,
      bodyname: "neck",
      width: 230,
      height: 495,
      // icon: "check_r.png"

    },
    {
      id: 5,
      bodyname: "chest",
      width: 725,
      height: 347,
      // icon: "check_r.png"

    },
    {
      id: 6,
      bodyname: "arms",
      width: 888,
      height: 482,
      // icon: "check_r.png"
    },
    {
      id: 7,
      bodyname: "hand",
      width: 917,
      height: 815,
      // icon: "check_r.png"
    },


    {
      id: 8,
      bodyname: "waist",
      width: 720,
      height: 590,
      // icon: "check_r.png"
    },
    {
      id: 9,
      bodyname: "abdomen",
      width: 705,
      height: 765,
      // icon: "check_r.png"
    },
    {
      id: 10,
      bodyname: "haunch",
      width: 802,
      height: 857,
      // icon: "check_r.png"
    },
    {
      id: 11,
      bodyname: "legs",
      width: 585,
      height: 985,
      // icon: "check_r.png"
    },
    {
      id: 12,
      bodyname: "foots",
      width: 850,
      height: 1560,
      // icon: "check_r.png"
    }
    ],
    bodyClassify:[],//存储肢体与分类对应的数组
    head: ["0,0", "0,1", "0,2", "0,3", "0,4", "0,5","6,4", "6,5"],
    eye: ["1,0", "1,1", "1,2", "1,3", "1,4"],
    face: ["2,0", "2,1", "2,2", "2,3", "2,4", "2,5", "3,0", "3,1", "3,2", "3,3", "3,4", "3,5", "6,0", "6,4", "6,5"],
    nose: ["3,0", "3,3", "3,5", "5,2", "8,1"],
    neck: ["6,4", "6,5", "5,0", "5,1", "8,0"],
    chest: ["6,3", "6,4", "6,5", "5,2"],
    arms: ["6,4", "6,5", "5,0", "5,1", "5,5", "7,0", "7,4"],
    hand: ["4,0", "4,1", "4,2", "4,3", "4,4", "4,5", "5,2", "7,4"],
    waist: ["5,0", "5,1", "5,2", "5,3", "5,4", "5,5", "7,0", "7,1", "7,2", "7,3", "7,4", "7,5", "6,4", "6,5"],
    abdomen: ["5,0", "5,1", "5,2", "5,3", "5,4", "5,5", "6,0", "6,1", "6,2", "6,3", "6,4", "6,5", "7,0", "7,3"],
    haunch: ["6,3", "6,4", "6,5", "7,0", "7,3"],
    legs: ["7,0", "7,1", "7,2", "7,3", "7,4", "7,5", "6,4", "6,5", "5,4", "5,5"],
    foots: ["4,0", "4,1", "4,2", "4,3", "4,4", "4,5", "6,4", "6,5"],
  },
  onLoad: function (options) {
    var that=this;
    //得到后端数据
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
    //得到全部分类
    wx.request({
      url: app.globalData.webroot + '/index/service/getServiceCat', //仅为示例，并非真实的接口地址
      method: "get",
      data: {
       uid:uid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //  attrKey: "保健",
       // attrValues: ["按摩", "理疗", "女性", "疏通", "调理", "排毒"],
        //  icon: "check_r.png",
         //   attrValueStatus: [true, true, true, true, true, true]
       console.log(res.data.msg);
        var attrValueList=[];
        var subcatLength=0;//记录总的子分类的个数
        var currentSelectlength=0;//当前选中的个数
       for(var i=0;i<res.data.msg.length;i++){
         console.log(res.data.msg[i]['MainSeq'])
         var subCat = res.data.msg[i]['SubCat'];
         subcatLength += subCat.length;
         //console.log(subCat);
         var attrValues=[];
         var ifSelctList=[];
         var mainName = res.data.msg[i]['MainName'];
         var attrSubcats = res.data.msg[i]['Seq'];
         var choost;
         
         for (var j = 0; j < subCat.length;j++){
           //console.log(subCat[j])
           var name = subCat[j]['Name'];  //洗剪
           var ifselect = subCat[j]['ifselect']  //0-未选中  1-选中
           //console.log(ifselect)
           
           if(ifselect==1){
             //判断需要选中
              choost=true;
             
             currentSelectlength+=1;
            // console.log(icon)
           } else if (ifselect == 0){
             choost = false;
             
           }
           //console.log(icon)
           attrValues.push(name);
           ifSelctList.push(choost)
         }
         console.log(ifSelctList.length+"-------------")
         var icon;
         if (ifSelctList.indexOf(false) == -1) {
           //则不包含该元素
           icon = "check_r.png";
         }else{
           icon = "check_n.png";
         }
         var obj={
           attrKey:mainName,
           attrValues: attrValues,
           attrSubcats: attrSubcats,
           icon: icon,
           attrValueStatus: ifSelctList
         }
         attrValueList.push(obj);
         console.log('-----' + obj)
         console.log(JSON.stringify(obj))
       }
        console.log("---总分类数="+subcatLength);
        var allchecked = that.data.allchecked;
        var bodyArr = that.data.body;
        if (currentSelectlength == subcatLength){
          //需要选中的和总的子分类个数相等了，全选选中
          allchecked["icon"] = "check_r.png";
          //需要把身体的各部位选中
          for (var i = 0; i < bodyArr.length; i++) {
            bodyArr[i]["icon"] ="check_r.png";
          }
        }else{
          console.log("---不选中")
          allchecked["icon"] = "check_n.png";
          for (var i = 0; i < bodyArr.length; i++) {
            bodyArr[i]["icon"] = "check_n.png";
          }
        }
        that.setData({
          subcatLength: subcatLength
        })
        
        that.setData({
          body: bodyArr
        })
        that.setData({
          allchecked: allchecked
        })
      that.setData({
        attrValueList: attrValueList
      })
        console.log(attrValueList);
      //


      }
    })

    //得到图片的宽度
    this.getwidth()

  },

  //获得当前图片的宽度
  getwidth: function () {
    var query = wx.createSelectorQuery()
    query.select('#filterImg').boundingClientRect()
    var that = this
    query.exec(function (res) {
      that.setData({
        nowimgwidth: res[0].width,
      });
      that.setData({
        nowimgheight: (that.data.imgheight * (that.data.nowimgwidth / that.data.imgwidth)),
      })
      that.setaddress()
    })

  },
  // 设置点的位置
  setaddress: function () {
    var that = this
    var body = []
    for (var item = 0; item < that.data.body.length; item++) {
      var msg = {
        icon: that.data.body[item].icon,
        bodyname: that.data.body[item].bodyname,
        width: (that.data.body[item].width / that.data.imgwidth) * that.data.nowimgwidth,
        height: (that.data.body[item].height / that.data.imgheight) * that.data.nowimgwidth
      }
      body.push(msg)
    }
    that.setData({
      body: body
    })
  },

  // 全选点击事件
  allclick: function (e) {

    var allchecked = this.data.allchecked
    var attrValueList = this.data.attrValueList;
    var body = this.data.body;
    // 改变选中的图片
    if (allchecked["icon"] == "check_n.png") {

      for (var i = 0; i < body.length; i++) {
        body[i]["icon"] = "check_r.png"
      }
      for (var i = 0; i < attrValueList.length; i++) {
        attrValueList[i]["icon"] = "check_r.png"
        var attr = attrValueList[i]["attrValueStatus"]
        for (var j = 0; j < attr.length; j++) {
          attr[j] = true
        }
      }
      allchecked["icon"] = "check_r.png"

    } else {
      for (var i = 0; i < body.length; i++) {
        body[i]["icon"] = "check_n.png"
      }
      for (var i = 0; i < attrValueList.length; i++) {
        attrValueList[i]["icon"] = "check_n.png"
        var attr = attrValueList[i]["attrValueStatus"]
        for (var j = 0; j < attr.length; j++) {
          attr[j] = false
        }
      }
      allchecked["icon"] = "check_n.png"
    }

    this.setData({
      attrValueList: attrValueList,
      body: body,
      allchecked: allchecked
    });
  },
 

  /* 选择属性值事件   小的点击事件*/
  selectAttrValue: function (e) {
    var that=this;
    console.log("***********" + e.currentTarget.dataset.index1 + '----' + e.currentTarget.dataset.index + "---seq=" + e.currentTarget.dataset.seq);
    var allchecked = this.data.allchecked;
    var attrValueList = this.data.attrValueList;
    var body = this.data.body;
    var head = this.data.head
    var eye = this.data.eye
    var face = this.data.face
    var nose = this.data.nose
    var neck = this.data.neck
    var chest = this.data.chest
    var arms = this.data.arms
    var hand = this.data.hand
    var waist = this.data.waist
    var abdomen = this.data.abdomen
    var haunch = this.data.haunch
    var legs = this.data.legs
    var foots = this.data.foots
    //点击其中一个子分类的点击事件 让其选中状态发生改变
    attrValueList[e.currentTarget.dataset.index1]["attrValueStatus"][e.currentTarget.dataset.index] = !attrValueList[e.currentTarget.dataset.index1]["attrValueStatus"][e.currentTarget.dataset.index];


    //改变大分类的选中状态
    var list = [];
  
    for (var i = 0; i < attrValueList[e.currentTarget.dataset.index1]["attrValueStatus"].length; i++) {
      if (attrValueList[e.currentTarget.dataset.index1]["attrValueStatus"][i] == true) {
        console.log('大分类' + e.currentTarget.dataset.index1 + '小的' + attrValueList[e.currentTarget.dataset.index1]["attrValues"][i] + 'xiaode' + e.currentTarget.dataset.index);
        list.push(1)
      }
    }
    //改变大分类的选中状态-取消选中
    console.log(list.length)
    console.log(attrValueList[e.currentTarget.dataset.index1]["attrValueStatus"]) //[false, true, true, true, true, true]
    console.log(e.currentTarget.dataset.index)  //dafenlei
    var trueLists=[];
    for (var i = 0; i < attrValueList[e.currentTarget.dataset.index1]["attrValueStatus"].length;i++){
      if (attrValueList[e.currentTarget.dataset.index1]["attrValueStatus"][i]==true){
        trueLists.push(e.currentTarget.dataset.index1+','+i);
      }

    }
    console.log("truelists==============")
    console.log(trueLists);
    //合并
    var _data = that.data.mySubCatData;
    //console.log(_data);
    var _data1=_data.concat(trueLists);
    that.setData({
      mySubCatData: _data1
    })
    console.log(that.data.mySubCatData)
    console.log("hebing de -----")
   
  
   
    
    if (list.length == attrValueList[e.currentTarget.dataset.index1]["attrValueStatus"].length) {
      attrValueList[e.currentTarget.dataset.index1]["icon"] = "check_r.png"
    } else {
      attrValueList[e.currentTarget.dataset.index1]["icon"] = "check_n.png"
    }

    // 判断身体的各个部位
    this.bodydetails(head, 0)
    this.bodydetails(eye, 1)
    this.bodydetails(face, 2)
    this.bodydetails(nose, 3)
    this.bodydetails(neck, 4)
    this.bodydetails(chest, 5)
    this.bodydetails(arms, 6)
    this.bodydetails(hand, 7)
    this.bodydetails(waist, 8)
    this.bodydetails(abdomen, 9)
    this.bodydetails(haunch, 10)
    this.bodydetails(legs, 11)
    this.bodydetails(foots, 12)

    this.setData({
      attrValueList: attrValueList,
      body: body,
    });



    // 判断全选按钮
    var attrlist = []
    for (var i = 0; i < attrValueList.length; i++) {
      var attr = attrValueList[i]["attrValueStatus"]
      for (var j = 0; j < attr.length; j++) {
        if (attr[j] == false) {
          attrlist.push(1)
        }
      }
    }
    if (attrlist.length > 0) {
      allchecked["icon"] = "check_n.png"
    } else {
      allchecked["icon"] = "check_r.png"
    }


    this.setData({
      allchecked: allchecked,
      attrValueList: attrValueList,
      body: body
    });

  },
  // 身体部位和明细分类联系
  bodydetails: function (m, n) {
    // console.log(m)
    // console.log(n)
    var attrValueList = this.data.attrValueList;
    var body = this.data.body;
    var list = []
    var blist = []
    for (var i = 0; i < m.length; i++) {
      var hlist = m[i]

      blist.push(attrValueList[hlist.split(',')[0]]["attrValueStatus"][hlist.split(',')[1]])
      if (blist[i] == true) {
        list.push(1)
      }

    }

    if (list.length == blist.length) {
      body[n]["icon"] = "check_r.png"
    } else {
      body[n]["icon"] = "check_n.png"
    }
  },
  //大分类的点击事件
  cateClick: function (e) {
    console.log(e.currentTarget.dataset.index)  //大的分类index
    var body = this.data.body;

    var head = this.data.head
    var eye = this.data.eye
    var face = this.data.face
    var nose = this.data.nose
    var neck = this.data.neck
    var chest = this.data.chest
    var arms = this.data.arms
    var hand = this.data.hand
    var waist = this.data.waist
    var abdomen = this.data.abdomen
    var haunch = this.data.haunch
    var legs = this.data.legs
    var foots = this.data.foots
    var allchecked = this.data.allchecked
    var attrValueList = this.data.attrValueList;




    if (attrValueList[e.currentTarget.dataset.index]["icon"] == "check_r.png") {
      // 取消选择
      attrValueList[e.currentTarget.dataset.index]["icon"] = "check_n.png"
      //让所有的分类都取消选择
      for (var i = 0; i < attrValueList[e.currentTarget.dataset.index]["attrValueStatus"].length; i++) {
        attrValueList[e.currentTarget.dataset.index]["attrValueStatus"][i] = false;
      }

    } else {
      //选中
      attrValueList[e.currentTarget.dataset.index]["icon"] = "check_r.png";

      //让所有的分类都选中
      for (var i = 0; i < attrValueList[e.currentTarget.dataset.index]["attrValueStatus"].length; i++) {
        attrValueList[e.currentTarget.dataset.index]["attrValueStatus"][i] = true;
      }
    }

    // 判断全选
    this.juageallchecked(attrValueList)


    //判断身体的部位
    this.bodydetails(head, 0)
    this.bodydetails(eye, 1)
    this.bodydetails(face, 2)
    this.bodydetails(nose, 3)
    this.bodydetails(neck, 4)
    this.bodydetails(chest, 5)
    this.bodydetails(arms, 6)
    this.bodydetails(hand, 7)
    this.bodydetails(waist, 8)
    this.bodydetails(abdomen, 9)
    this.bodydetails(haunch, 10)
    this.bodydetails(legs, 11)
    this.bodydetails(foots, 12)
    this.setData({
      allchecked: allchecked,
      attrValueList: attrValueList,
      body: body
    });


  },
  // 身体点击事件
  bodytap: function (e) {
    var face = [];
    var head = [];
    var eye = [];
    var nose = [];
    var neck = [];
    var chest = [];
    var arms = [];
    var hand = [];
    var waist = [];
    var abdomen = [];  //腹部
    var haunch = [];
    var legs = [];
    var foots = [];

    console.log(e.currentTarget.dataset.index);
    console.log(this.data.bodytype);
    var attrValueList = this.data.attrValueList;
    var body = this.data.body;
    console.log("选中的点是--" + e.currentTarget.dataset.index)
   console.log("选中的点是--" + e.currentTarget.dataset.item)
    console.log(body[e.currentTarget.dataset.index]["icon"])
    if (body[e.currentTarget.dataset.index]["icon"] == "check_n.png") {

      body[e.currentTarget.dataset.index]["icon"] = "check_r.png"

      if (e.currentTarget.dataset.index == 0) {
        // 选中头部
        attrValueList[0]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[0]["attrValueStatus"].length; i++) {
          console.log("111111111111111111111")
          console.log('i==========' + attrValueList[0]["attrValues"][i]);
          attrValueList[0]["attrValueStatus"][i] = true;
          head.push('0,' + i + '')
        }
        attrValueList[6]["attrValueStatus"][4] = true;
        attrValueList[6]["attrValueStatus"][5] = true
        head.push('6,4', '6,5')
      }
      console.log(head)
      // 选中眼部
      if (e.currentTarget.dataset.index == 1) {

        attrValueList[1]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[1]["attrValueStatus"].length; i++) {
          console.log("眼部111111111111111111111")
          console.log(i);
          console.log('i==========' + attrValueList[1]["attrValues"][i]);
          attrValueList[1]["attrValueStatus"][i] = true;
          eye.push('1,' + i + '')
        }
      }
      console.log(eye)
      // 选中脸部
      if (e.currentTarget.dataset.index == 2) {

        attrValueList[2]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[2]["attrValueStatus"].length; i++) {
          console.log("脸部--" + i)
          attrValueList[2]["attrValueStatus"][i] = true;
          face.push('2,' + i + '')
        }
        attrValueList[3]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[3]["attrValueStatus"].length; i++) {
          attrValueList[3]["attrValueStatus"][i] = true;
          face.push('3,' + i + '')
        }
        attrValueList[6]["attrValueStatus"][0] = true;
        attrValueList[6]["attrValueStatus"][4] = true
        attrValueList[6]["attrValueStatus"][5] = true;
        face.push('6,0', '6,4', '6,5')

      }
      console.log("face====")
      console.log(face)
      // 选中鼻口
      if (e.currentTarget.dataset.index == 3) {

        attrValueList[3]["attrValueStatus"][0] = true;
        attrValueList[3]["attrValueStatus"][3] = true;
        attrValueList[3]["attrValueStatus"][5] = true;
        attrValueList[5]["attrValueStatus"][2] = true;
        attrValueList[8]["attrValueStatus"][1] = true;
        nose.push('3,0', '3,3', '3,5', '5,2', ' 8,1')
      }
      console.log(nose)
      // 选中颈部
      if (e.currentTarget.dataset.index == 4) {

        attrValueList[6]["attrValueStatus"][4] = true;
        attrValueList[6]["attrValueStatus"][5] = true;
        attrValueList[5]["attrValueStatus"][0] = true;
        attrValueList[5]["attrValueStatus"][1] = true;
        attrValueList[8]["attrValueStatus"][0] = true;
        neck.push('6,4', '6,5', '5,0', '5,1', '8,0')
      }
      // 选中胸部
      console.log(neck)
      if (e.currentTarget.dataset.index == 5) {

        attrValueList[6]["attrValueStatus"][3] = true
        attrValueList[6]["attrValueStatus"][4] = true;
        attrValueList[6]["attrValueStatus"][5] = true;
        attrValueList[5]["attrValueStatus"][2] = true;
        chest.push('5,2', '6,3', '6,4', '6,5')
      }
      console.log(chest)
      // 选中手臂
      if (e.currentTarget.dataset.index == 6) {
        attrValueList[6]["attrValueStatus"][4] = true
        attrValueList[6]["attrValueStatus"][5] = true;
        attrValueList[5]["attrValueStatus"][0] = true;
        attrValueList[5]["attrValueStatus"][1] = true;
        attrValueList[5]["attrValueStatus"][5] = true;
        attrValueList[7]["attrValueStatus"][0] = true;
        attrValueList[7]["attrValueStatus"][4] = true;
        arms.push('6,4', '6,5', '5,0', '5,1', '5,5', '7,0', '7,4')
      }
      console.log(arms)
      // 选中了手部
      if (e.currentTarget.dataset.index == 7) {
        attrValueList[4]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[4]["attrValueStatus"].length; i++) {
          attrValueList[4]["attrValueStatus"][i] = true;
          hand.push('4,' + i + '')
        }
        attrValueList[5]["attrValueStatus"][2] = true;
        attrValueList[7]["attrValueStatus"][4] = true;
        hand.push('5,2', '7,4')
      }
      console.log(hand)
      // 选中了腰部
      if (e.currentTarget.dataset.index == 8) {
        attrValueList[5]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[5]["attrValueStatus"].length; i++) {
          attrValueList[5]["attrValueStatus"][i] = true;
          waist.push('5,' + i + '')
        }
        attrValueList[7]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[7]["attrValueStatus"].length; i++) {
          attrValueList[7]["attrValueStatus"][i] = true;
          waist.push('7,' + i + '')
        }
        attrValueList[6]["attrValueStatus"][4] = true;
        attrValueList[6]["attrValueStatus"][5] = true;
        waist.push('6,4', '6,5')
      }
      console.log(waist)
      // 选中了腹部
      if (e.currentTarget.dataset.index == 9) {
        attrValueList[5]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[5]["attrValueStatus"].length; i++) {
          attrValueList[5]["attrValueStatus"][i] = true;
          abdomen.push('5,' + i + '')
        }
        attrValueList[6]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[6]["attrValueStatus"].length; i++) {
          attrValueList[6]["attrValueStatus"][i] = true;
          abdomen.push('6,' + i + '')
        }
        attrValueList[7]["attrValueStatus"][0] = true;
        attrValueList[7]["attrValueStatus"][3] = true;
        abdomen.push('7,0', '7,3')
      }
      console.log(abdomen)
      // 选中了臀部
      if (e.currentTarget.dataset.index == 10) {
        attrValueList[6]["attrValueStatus"][3] = true;
        attrValueList[6]["attrValueStatus"][4] = true;
        attrValueList[6]["attrValueStatus"][5] = true;

        attrValueList[7]["attrValueStatus"][0] = true;
        attrValueList[7]["attrValueStatus"][3] = true;
        haunch.push('6,3', '6,4', '6,5', '7,0', '7,3')
      }
      console.log(haunch)
      // 选中了腿部
      if (e.currentTarget.dataset.index == 11) {
        attrValueList[7]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[7]["attrValueStatus"].length; i++) {
          attrValueList[7]["attrValueStatus"][i] = true;
          legs.push('7,' + i + '')
        }
        attrValueList[6]["attrValueStatus"][4] = true;
        attrValueList[6]["attrValueStatus"][5] = true;
        attrValueList[5]["attrValueStatus"][4] = true;
        attrValueList[5]["attrValueStatus"][5] = true;
        legs.push('6,4', '6,5', '5,4', '5,5')
      }
      console.log(legs)
      // 选中了脚部
      if (e.currentTarget.dataset.index == 12) {
        attrValueList[4]["icon"] = "check_r.png"
        for (var i = 0; i < attrValueList[4]["attrValueStatus"].length; i++) {
          attrValueList[4]["attrValueStatus"][i] = true;
          foots.push('4,' + i + '')
        }
        attrValueList[6]["attrValueStatus"][4] = true;
        attrValueList[6]["attrValueStatus"][5] = true;
        foots.push('6,4', '6,5')
      }
      console.log(foots)
    } else {
      body[e.currentTarget.dataset.index]["icon"] = "check_n.png"
      if (e.currentTarget.dataset.index == 0) {
        // 选中头部
        attrValueList[0]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[0]["attrValueStatus"].length; i++) {
          attrValueList[e.currentTarget.dataset.index]["attrValueStatus"][i] = false;
        }
        attrValueList[6]["attrValueStatus"][4] = false;
        attrValueList[6]["attrValueStatus"][5] = false
      }
      // 选中眼部
      if (e.currentTarget.dataset.index == 1) {
        attrValueList[1]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[1]["attrValueStatus"].length; i++) {
          attrValueList[1]["attrValueStatus"][i] = false;
        }
      }
      // 选中脸部
      if (e.currentTarget.dataset.index == 2) {
        attrValueList[2]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[2]["attrValueStatus"].length; i++) {
          attrValueList[2]["attrValueStatus"][i] = false;
        }
        attrValueList[3]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[3]["attrValueStatus"].length; i++) {
          attrValueList[3]["attrValueStatus"][i] = false;
        }
        attrValueList[6]["attrValueStatus"][0] = false;
        attrValueList[6]["attrValueStatus"][4] = false
        attrValueList[6]["attrValueStatus"][5] = false;

      }
      // 选中鼻口
      if (e.currentTarget.dataset.index == 3) {

        attrValueList[3]["attrValueStatus"][0] = false;
        attrValueList[3]["attrValueStatus"][3] = false
        attrValueList[3]["attrValueStatus"][5] = false;
        attrValueList[5]["attrValueStatus"][2] = false;
        attrValueList[8]["attrValueStatus"][1] = false;

      }
      // 选中肩部
      if (e.currentTarget.dataset.index == 4) {

        attrValueList[6]["attrValueStatus"][4] = false;
        attrValueList[6]["attrValueStatus"][5] = false;
        attrValueList[5]["attrValueStatus"][0] = false;
        attrValueList[5]["attrValueStatus"][1] = false;
        attrValueList[8]["attrValueStatus"][0] = false;
      }
      // 选中胸部
      if (e.currentTarget.dataset.index == 5) {
        attrValueList[6]["attrValueStatus"][3] = false
        attrValueList[6]["attrValueStatus"][4] = false;
        attrValueList[6]["attrValueStatus"][5] = false;
        attrValueList[5]["attrValueStatus"][2] = false;
      }
      // 选中手臂
      if (e.currentTarget.dataset.index == 6) {
        attrValueList[6]["attrValueStatus"][4] = false
        attrValueList[6]["attrValueStatus"][5] = false;
        attrValueList[5]["attrValueStatus"][0] = false;
        attrValueList[5]["attrValueStatus"][1] = false;
        attrValueList[5]["attrValueStatus"][5] = false;
        attrValueList[7]["attrValueStatus"][0] = false;
        attrValueList[7]["attrValueStatus"][4] = false;
      }
      // 选中了手部
      if (e.currentTarget.dataset.index == 7) {
        attrValueList[4]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[4]["attrValueStatus"].length; i++) {
          attrValueList[4]["attrValueStatus"][i] = false;
        }
        attrValueList[5]["attrValueStatus"][2] = false;
        attrValueList[7]["attrValueStatus"][4] = false;
      }
      // 选中了腰部
      if (e.currentTarget.dataset.index == 8) {
        attrValueList[5]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[5]["attrValueStatus"].length; i++) {
          attrValueList[5]["attrValueStatus"][i] = false;
        }
        attrValueList[7]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[7]["attrValueStatus"].length; i++) {
          attrValueList[7]["attrValueStatus"][i] = false;
        }
        attrValueList[6]["attrValueStatus"][4] = false;
        attrValueList[6]["attrValueStatus"][5] = false;
      }
      // 选中了腹部
      if (e.currentTarget.dataset.index == 9) {
        attrValueList[5]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[5]["attrValueStatus"].length; i++) {
          attrValueList[5]["attrValueStatus"][i] = false;
        }
        attrValueList[6]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[6]["attrValueStatus"].length; i++) {
          attrValueList[6]["attrValueStatus"][i] = false;
        }
        attrValueList[7]["attrValueStatus"][0] = false;
        attrValueList[7]["attrValueStatus"][3] = false;
      }
      // 选中了臀部
      if (e.currentTarget.dataset.index == 10) {
        attrValueList[6]["attrValueStatus"][3] = false;
        attrValueList[6]["attrValueStatus"][4] = false;
        attrValueList[6]["attrValueStatus"][5] = false;

        attrValueList[7]["attrValueStatus"][0] = false;
        attrValueList[7]["attrValueStatus"][3] = false;
      }
      // 选中了腿部
      if (e.currentTarget.dataset.index == 11) {
        attrValueList[7]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[7]["attrValueStatus"].length; i++) {
          attrValueList[7]["attrValueStatus"][i] = false;
        }
        attrValueList[6]["attrValueStatus"][4] = false;
        attrValueList[6]["attrValueStatus"][5] = false;
        attrValueList[5]["attrValueStatus"][4] = false;
        attrValueList[5]["attrValueStatus"][5] = false;
      }
      // 选中了脚部
      if (e.currentTarget.dataset.index == 12) {
        attrValueList[4]["icon"] = "check_n.png"
        for (var i = 0; i < attrValueList[4]["attrValueStatus"].length; i++) {
          attrValueList[4]["attrValueStatus"][i] = false;
        }
        attrValueList[6]["attrValueStatus"][4] = false;
        attrValueList[6]["attrValueStatus"][5] = false;
      }

    }


    // 判断全选

    var allchecked = this.data.allchecked
    this.juageallchecked(body)



    this.setData({
      attrValueList: attrValueList,
      body: body,
      allchecked: allchecked,
      // head:head,
      // eye:eye,
      // face:face,
      // nose:nose,
      // neck:neck,
      // chest: chest,
      // arms: arms,
      // hand: hand,
      // waist: waist,
      // abdomen: abdomen,
      // haunch: haunch,
      // legs: legs,
      // foots: foots
    });

  },
  // 判断全选
  juageallchecked: function (name) {
    var allchecked = this.data.allchecked
    var attrlist = []
    for (var i = 0; i < name.length; i++) {
      if (name[i]["icon"] == 'check_n.png') {
        attrlist.push(name[i]["icon"])
      }
    }
    if (attrlist.length > 0) {
      allchecked["icon"] = "check_n.png"
    } else {
      allchecked["icon"] = "check_r.png"
    }
  },
  /* 点击确定 */
  submit: function () {
    var value = [];
    for (var i = 0; i < this.data.attrValueList.length; i++) {
      if (!this.data.attrValueList[i].selectedValue) {
        break;
      }
      value.push(this.data.attrValueList[i].selectedValue);
    }
    if (i < this.data.attrValueList.length) {
      wx.showToast({
        title: '请完善属性',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.showToast({
        title: '选择的属性：' + value.join('-'),
        icon: 'sucess',
        duration: 1000
      })
    }
  },
  screenBtn: function () {
    var that=this;
    console.log("8888");
    console.log("点击了筛选----")
    var subcatArr = [];//存储选中的子分类名 //整理发给服务器端的子分类数组数据
   
    var attrValueList = this.data.attrValueList;
    console.log(this.data.attrValueList);
    for (var i = 0; i < attrValueList.length; i++) {
      var attrValueStatus = attrValueList[i]["attrValueStatus"];
      for (var j = 0; j < attrValueList[i]["attrValueStatus"].length; j++) {
       //得到 为true的
        var _item = attrValueList[i]["attrValueStatus"][j];
        if (_item==true){
         //得到当前索引值的子分类名
          var attrSubcats = attrValueList[i]["attrSubcats"][j];
          subcatArr.push(attrSubcats);
       }
      }
    }
   // console.log(subcatArr);
    console.log("子分类总条数="+that.data.subcatLength);
    var subcatLength = that.data.subcatLength;
    
    if (subcatArr.length == subcatLength){
        //表示用户选中了全部的子分类
      subcatArr="";//表示全部子分类  给后端的标识
    }
    console.log(subcatArr);
    var userArr = wx.getStorageSync("user");
    var uid = JSON.parse(userArr)["userinfo"]["uid"];
     //得到当前选中的分类 把当前选中的子分类名集合发给服务器端 post传输数据
     
    wx.request({
      url: app.globalData.webroot + '/index/user/updateUserMySubCat', 
      method: "post",
      data: {
        mySubCat: subcatArr,
        uid: uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //post请求
      },
      success(res) {
        console.log(res.data.msg);
       //后端更新user表的Mysubcat字段
      }
    })
    // return;
    wx.redirectTo({
      url: '/pages/index/poker/pokerIndex/pokerIndex'
    })
  },
  cancelBtn:function(){
    console.log("点击了取消筛选----")
    wx.redirectTo({
      url: '/pages/index/poker/pokerIndex/pokerIndex'
    })
  },
  draw: function () {
    console.log("draw")
    const ctx = wx.createCanvasContext('myCanvas');

    ctx.arc(139 * (192 / 1030), 61, 5, 0, 3 * Math.PI)
    ctx.setFillStyle('black')
    ctx.fill()

    ctx.draw();

  },



})