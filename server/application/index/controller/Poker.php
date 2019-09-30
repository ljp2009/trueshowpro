<?php
namespace app\index\controller;
use think\Controller;
use think\Cookie;
use think\Db;
use think\Request;
use think\Config;
//晒单类
class Poker  extends Controller
{

    //技师上传晒单图片 只是用来返回图片地址的
    public function newStaffPokerPic()
    {
        $request = Request::instance();
        $data = $request->param();
        $type=$data["type"];
        //获取表单上传文件
        $file = $request->file('img');
//        print_r($data);
        $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "poker" .DS);
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();

            $arr=["type"=>$type,"img"=>$image];
            echo returnData(1,$arr);
            exit;
        }

    }

    //保存技师晒单图片 写入数据库 newStaffPoker
    public function newStaffPoker()
    {
        $config=Config::get('webroot');//获取域名的配置
        $webroot=$config["webroot"];//本站的域名
        $request = Request::instance();
        $data = $request->param();
        // allimgurlArr: allimgurlArr,//存储图片数组
        //  insertimgurlArr: insertimgurlArr //所有图片地址
        //需要比对 差集把文件删除
        $allimgurlArr=json_decode($data["allimgurlArr"],true);
        $insertimgurlArr=json_decode($data["insertimgurlArr"],true);
        $poorimgurlArr=array_diff($allimgurlArr,$insertimgurlArr);//差集
        foreach($poorimgurlArr as $key=>$val){
            if($val!="") {
                $_item = ROOT_PATH . "public/static/images/poker/" . $val;
                if(is_file($_item)){
                    unlink($_item);
                }

            }
        }
        $reservationId=$data["reservationId"];//约单id
        $resnId=$data["resnId"];//约单服务id
        $serverImg=$data["serverImg"];//图片数组
        //rakeoff
        $rakeoff=$data["rakeoff"];//平台佣金比当前
        $serverImg1=json_decode($serverImg,true);
        //print_r($serverImg1);
        $StaffPicBlock=[];//被截留的图片
        $StaffPic=[];//技师可晒的图片
        //筛选掉带人脸的图片
        foreach($serverImg1 as $key=>$item){
            //echo $key;//得到键名
            if($item){
                $_item=$webroot."/static/images/poker/".$item;
                $data1=face($_item);
               // echo $data1["error_msg"]."</br>";
                ////注意人脸识别必须是线上的图片地址才能识别
                if($data1["error_code"]==0){
                    //含有人脸
                    $StaffPicBlock[$key]=$item;
                    $StaffPic[$key]="";//被截留的图片在技师图片字段里显示空
                }else{
                   // echo $data1["error_code"];
                    //不含有人脸
                    $StaffPic[$key]=$item;
                }

            }else{
                $StaffPic[$key]=$item;
            }

        };

       if(count($StaffPicBlock)==0){
           $StaffPicBlock="";
       }else{
           $StaffPicBlock=json_encode($StaffPicBlock);
       }
        $StaffPic=json_encode($StaffPic);
        $res1=Db::table("poker")->where(["ReservationId"=>$reservationId,"RESNId"=>$resnId])->count();
//        echo $res1;
//        exit;
        if($res1==1){
//            echo 2222;
//            exit;
            //这条记录存在
            //就直接更新 数据库
            //////////同时更新 约单服务表  是否晒单完成 为1////////////////
            /// //加入事务
            // 启动事务
            Db::startTrans();
            try {
                $insert=Db::table("poker")
                    ->where(["ReservationId"=>$reservationId,"RESNId"=>$resnId])
                    ->update(["StaffPic"=>$StaffPic,"StaffPicBlock"=>$StaffPicBlock]);
                $update=Db::table("service_resn")
                    ->where(["RESNId"=>$resnId])
                    ->update(["StaffPoker"=>1]);

                // 提交事务
                Db::commit();
                echo returnData(1, "写入晒单成功");
                exit;
            } catch (\Exception $e) {
                echo returnData(0, "写入晒单失败");
                exit;

            }

        }else{
//            echo 1111;
//            exit;
            //此条记录不存在
            //需要的数据
            //  $resnId 可以得到：StaffId  CustomerId ServiceId ServiceName SubCat///
            //$reservationId 可以得到 ： PriceFinal FirmId///
            // PokerCat 服务子分类 StaffId CustomerId  ServiceId  ServiceName//
            //   FirmId    ReservationId RESNId Rakeoff Amount
            //  StaffCert  FirmCert  Province
            //StaffPic  StaffPicBlock CreatTime
            $res3=Db::table("reservation")->where("ReservationId",$reservationId)->field(["PriceFinal","FirmId"])->find();
            $Amount=$res3["PriceFinal"];//约单最终成交价
            $FirmId=$res3["FirmId"];//隶属机构id
            $res4=Db::table("service_resn")
                ->where("RESNId",$resnId)
                ->field(["StaffId","CustomerId","ServiceId","ServiceName","SubCat"])
                ->find();
            $StaffId=$res4["StaffId"];//技师id
            $CustomerId=$res4["CustomerId"];//顾客id
            $ServiceId=$res4["ServiceId"];//原始服务项目id
            $ServiceName=$res4["ServiceName"];//服务项目名
            $PokerCat=$res4["SubCat"];//服务子分类
            //查看当前技师  机构是否认证
            $StaffCert=Db::table("user")->where("UserId",$StaffId)->field(["Certificated"])->find()["Certificated"];//技师认证
            $Firminfo=Db::table("firm")->where("ID",$FirmId)->field(["Certificated","Province"])->find();
            $FirmCert=$Firminfo["Certificated"];//机构认证
            $Province=$Firminfo["Province"];//商户省份
            // 启动事务
            Db::startTrans();
            try {
                // PokerCat 服务子分类 StaffId CustomerId  ServiceId  ServiceName//
                //   FirmId    ReservationId RESNId Rakeoff Amount
                //  StaffCert  FirmCert  Province
                //StaffPic  StaffPicBlock CreatTime
                $insdata=[
                    "PokerCat"=>$PokerCat,
                    "StaffId"=>$StaffId,
                    "CustomerId"=>$CustomerId,
                    "ServiceId"=>$ServiceId,
                    "ServiceName"=>$ServiceName,
                    "FirmId"=>$FirmId,
                    "ReservationId"=>$reservationId,
                    "RESNId"=>$resnId,
                    "Rakeoff"=>$rakeoff,
                    "Amount"=>$Amount,
                    "StaffPic"=>$StaffPic,
                    "StaffPicBlock"=>$StaffPicBlock,
                    "CreatTime"=>date("Y-m-d H:i:s"),
                ];
                $insert=Db::table("poker")
                    ->insert($insdata);
                $update=Db::table("service_resn")
                    ->where(["RESNId"=>$resnId])
                    ->update(["StaffPoker"=>1]);

                // 提交事务
                Db::commit();
                echo returnData(1, "写入晒单成功");
                exit;
            } catch (\Exception $e) {
                echo returnData(0, "写入晒单失败");
                exit;

            }
        }
        //通过查看数据库 是否已经存在这条晒单了
        //如果存在就直接更新 StaffPic StaffPicBlock
        //如果不存在  就要获取到需要的那些数据 写入数据库
        //还需要

    }

      //getstaffPokerData 技师编辑晒单时 首先需要获取晒单图片
        public function getstaffPokerData(){
            $request=Request::instance();
            $data=$request->param();
            $reservationId=$data["reservationId"];//约单id
            $resnId=$data["resnId"];//约单服务id
            $res1=Db::table("poker")->where(["ReservationId"=>$reservationId,"RESNId"=>$resnId])->field(["StaffPic"])->find();
            $res1["StaffPic"]=json_decode($res1["StaffPic"],true);
            echo returnData(1, $res1);
            exit;
        }

    /**
     *晒单读取
     * 请求参数:km:公里数，读取距离用户在此范围内的机构的晒单默认5km;MySubCat:晒单子分类,格式“A1,A2,A3,B2,B4”。默认值空表示全部分类
     *
     */
    public function getSeriesPoker()
    {
        $request=Request::instance();
        $data=$request->param();
        $lat=$data["lat"];//用户的纬度
        $lng=$data["lng"];//用户的经度
        $uid=$data["uid"];//用户id
        //$km=$data["km"];//公里数 单位 km
        $km=50000000000000;
        $mySubCat=explode(",",$data["mySubCat"]);//用户选择的分类
//        //更新用户表晒单过滤公里数km和分类pokerCat；
//        $insert=[
//            "km"=>5,//需要修改成 $km
//            "MySubCat"=>$data["mySubCat"] //$data["mySubCat"]
//        ];
//        echo $uid;
//        print_r($insert);
//        $resUpuser=Db::table("user")->where("UserId",$uid)->update($insert);

//        if (!$resUpuser){
//
//            echo returnData(0,"更新user表失败");
//            exit;
//        }

        //echo $lat."---".$lng."---".$km."---".$mySubCat;
        //第一步首先获取附近的机构
        $firm=new Firm();
        $firmList=$firm->FirmNearby($lat,$lng,$km);

        if (count($firmList)==0){
            //没有机构
            $pokeridDataArr=[];
            echo returnData(1,$pokeridDataArr);
            exit;

        }
        $staffOnlineList=Db::table("staff_online")->field(["StaffId"])->select();//技师在线表
        $pokerAccessList=Db::table("poker_access")->where("UserId",$uid)->field(["PokerId","accessTime"])->select();//晒单已读表 我自己的
        $pokerAccessList1=Db::table("poker_access")->where("UserId","<>",$uid)->field(["PokerId","accessTime"])->select();//晒单已读表 别人读的
        //print_r($firmList);
        $firmIdList=[];//存储附近机构
        $staffOnlineIdList=[];//存储在线技师
        $pokerAccessDataList=[];//存储不是三天已读的晒单id
        for ($i=0;$i<count($firmList);$i++){
            $firmID=$firmList[$i]["ID"];
            $firmIdList[]=$firmID;//附近机构的id 数组
        }
        for ($i=0;$i<count($staffOnlineList);$i++){
            $StaffId=$staffOnlineList[$i]["StaffId"];
            $staffOnlineIdList[]=$StaffId;//在线的技师数组
        }

        for ($i=0;$i<count($pokerAccessList);$i++){
            $accessTime=$pokerAccessList[$i]["accessTime"];
            $nowtime=time();//现在的时间戳
            $accessTime1=strtotime($accessTime);//转换时间戳
            $poorTime=$nowtime-$accessTime1;
            if ($poorTime<3*24*3600){
                //不是三天已读的
                $pokerAccessDataList[]=$pokerAccessList[$i]["PokerId"];//
              //  echo $pokerAccessList[$i]["PokerId"]."<br>";
            }
        }


        //当前用户+别人的晒单已读数据  满足条件的
//        $PokerIdIdList1=[];
//        for ($i=0;$i<count($pokerAccessList1);$i++){
//            $PokerIditem=$pokerAccessList1[$i]["PokerId"];
//            $PokerIdIdList1[]=$PokerIditem;//
//        }
        //
//        $pokerAccessDataList =array_merge($pokerAccessDataList);//$pokerAccessDataList--当前用户已读的晒单id数组  $PokerIdIdList1---别人已读的晒单id数组

        //print_r($pokerAccessDataList);

       // 第二步查找机构下所有在线技师
        $resStaffList=Db::table("user")
            ->where("UserId","in",$staffOnlineIdList)
            ->where("FirmId","in",$firmIdList)
            ->where("StaffLevel",">=",2)
            ->field(["UserId","FirmId"])
            ->select();
        $resStaffArr=[];//存储技师在线的技师id数组
        for ($i=0;$i<count($resStaffList);$i++){
            $UserIditem=$resStaffList[$i]["UserId"];
            $resStaffArr[]=$UserIditem;//
        }

        ///第三步 按机构和分类参数查找晒单(交易金额>20,星级star>2,真实图RealPic=1),过滤3天内已读，选出最新100；
        $pokerlist1=Db::table("poker")
            ->alias("p")
            ->join("firm f","f.ID=p.FirmId")
            ->join("user u","p.FirmId=u.FirmId")
            ->where("f.ID","in",$firmIdList)
            ->where("p.ID","not in",$pokerAccessDataList)
//            ->where("p.PokerCat","in",$mySubCat)
//            ->where("p.Amount",">",20)
//            ->where("p.Star",">",2)
//            ->where("p.RealPic",1)
            ->group("p.ID")
            ->order('p.CreatTime desc')
            ->limit(0,100)
            ->field([
                "p.ID PokerId","p.StaffId pStaffId","p.FirmId pFirmId","p.Favor FavorCount",
                "p.Rakeoff","p.StaffCert","p.FirmCert","p.CreatTime pCreatTime","u.Followers",
                "p.ServiceName","u.NickName"
            ])
            ->select();





        //总共条数》5 就需要筛选
        ///第四步 晒单排序高收藏选5，高佣金排序选5，认证技师选5，最新选5，认证机构选5，技师在线选5，高关注技师选5，共35，不足则按高收藏排序补齐后乱序；
        $keyArr=['FavorCount','Rakeoff','StaffCert','pCreatTime','FirmCert',"Followers"];
        $resArr=$this->filterPokerlist($pokerlist1,$keyArr,5);
        $pokerlistFin=$resArr["fiterArr"];//除满足各条件还剩下的数据
        $filterPokerArr=$resArr["CountArr"];//个条件取出来的数据数组


        if (count($pokerlistFin)>0){
            //选出五条 技师在线的晒单
            $staffOnLine=[];
//        $lencount=count($staffOnLine);
            for ($k=0;$k<count($pokerlistFin);$k++){

                $count=count($staffOnLine);
                if ($count<5){
                    $pStaffIditem=$pokerlistFin[$k]["pStaffId"];
                    $item=$pokerlistFin[$k];
                    if (in_array($pStaffIditem,$resStaffArr)){
                        $staffOnLine[]=$item;
                        array_splice($pokerlistFin,$k,1);
                        $k--;
                    }
                }


            }

            //合并
            $filterPokerArr=array_merge($filterPokerArr,$staffOnLine);
//        print_r($staffOnLine);
//        print_r($filterPokerArr);
            $currentCount=count($filterPokerArr);//现在符合条件的条数
            while ($currentCount<35){
                if($pokerlistFin<=0){
                    break;
                }
                $poorcount=35-$currentCount;
                //echo "现在的条数：".$currentCount."--相差条数".$poorcount;
                $keyArr1=['FavorCount'];
                $resArr=$this->filterPokerlist($pokerlistFin,$keyArr1,$poorcount);
                $pokerlistFin1=$resArr["fiterArr"];//除满足各条件还剩下的数据
                $filterPokerArr=array_merge($filterPokerArr,$resArr["CountArr"]);//个条件取出来的数据数组

                //print_r($resArr["CountArr"]);
                $currentCount=count($filterPokerArr);//现在符合条件的条数
            }
        }

        $pokeridDataArr=[];//符合条件的晒单id
        for ($i=0;$i<count($filterPokerArr);$i++){
            $itempokerid=$filterPokerArr[$i]["PokerId"];
            $pokeridDataArr[$i]["Id"]=$itempokerid;
            $pokeridDataArr[$i]["type"]=1;//表示晒单的id
        }

        //$firmIdList存储附近机构的id数组
        //查询广告表 TemplateId模板id
        $randnum=rand(0,3);
        $adCount=Db::table("ad_template")->where("FirmId","in",$firmIdList)->count();
        if ($adCount>=$randnum){
            $randIndex=rand(0,$adCount-1);
            $resAd=Db::table("ad_template")->where("FirmId","in",$firmIdList)->field(["TemplateId"])->limit($randIndex,$randnum)->select();
            $TemplateIdData=[];
            for ($i=0;$i<count($resAd);$i++){
                $itemTemplateId=$resAd[$i]["TemplateId"];
                $TemplateIdData[$i]["Id"]=$itemTemplateId;
                $TemplateIdData[$i]["type"]=0;//表示广告模板id
            }

            if (count($TemplateIdData)!=0){
                $pokeridDataArr=array_merge($pokeridDataArr,$TemplateIdData);
            }
        }


        shuffle($pokeridDataArr);
        if(count($pokeridDataArr)==0){
            $pokeridDataArr=[];
        }
//echo 111;

//        exit;
        echo returnData(1,$pokeridDataArr);
        exit;
    }



    /**
     *为了筛选按各分类选出五个的方法
     */
    public function filterPokerlist($pokerlist, $key, $len){
        $CountArrData=[];
        for ($i=0;$i<count($key);$i++){
            $keyitem=$key[$i];
            $len1=count($pokerlist);
            //echo $len1."<br>";
            if ($len1>0){
                array_multisort(array_column($pokerlist,$keyitem),SORT_DESC,$pokerlist);//按高收藏排序
                //取5个
                $CountArr=array_slice($pokerlist,0,$len);
               // $CountArrData[]=$CountArr;
                $CountArrData=array_merge($CountArrData,$CountArr);
                //把高收藏的5个移除出晒单数组中
                for ($k=0;$k<count($pokerlist);$k++){
                    $PokerIditem=$pokerlist[$k]["PokerId"];

                    for ($j=0;$j<count( $CountArr);$j++){
                        $PokerIditem1= $CountArr[$j]["PokerId"];
                        if ($PokerIditem==$PokerIditem1){
                            array_splice($pokerlist,$k,1);
                            $k--;
//                              echo $PokerIditem."---".$PokerIditem1."<br>";
                        }

                    }
                }
            }
        }

        $arr=[
            "CountArr"=>$CountArrData, //满足条件的五个
            "fiterArr"=>$pokerlist,//移除之后的数据
        ];

        return $arr;
    }


    /**
     *按需加载 一次获取两个数据
     */
    public function getPokerData(){
//        echo 44444;
//        exit;
        //exit;
        $request=Request::instance();
        $data=$request->param()["loadingPokerId"];
        $uid=$request->param()["uid"];
        $userlat=$request->param()["lat"];//纬度
        $userlng=$request->param()["lng"];//经度
        $data=json_decode($data,true);
//        print_r($data);
//        exit;
        $dataArr1=[];//存储晒单数据的
        $dataArr2=[];//存储广告卡的数据的

        //当前用户收藏的晒单
        $favorData=Db::table("poker_favor")
            ->where("UserId",$uid)
            ->field(["PokerId"])->select();
        $favorData1=[];
        for ($i=0;$i<count($favorData);$i++){
            $PokerIditem=$favorData[$i]["PokerId"];
            $favorData1[]=$PokerIditem;//
        }

        for ($i=0;$i<count($data);$i++){
            $Id=$data[$i]["Id"];
            $type=$data[$i]["type"];
            if ($type==1){
               //当前是晒单id
                //通过晒单id 获取机构信息 技师信息 当前用户是否收藏 弹幕 优惠活动
                $res=Db::table("poker")
                    ->alias("p")
                    ->join("firm f","p.FirmId=f.ID")
                    ->join("user u","u.UserId=p.StaffId")
                    ->join("bullet b","b.OriginId=p.ID")
                    ->where("p.ID",$Id)
                    ->field([
                        "p.ID PokerId","p.StaffId pStaffId","p.CustomerId","p.FirmId pFirmId","p.ServiceId","p.Favor FavorCount",
                       "p.StaffCert","p.FirmCert","f.FirmName","f.FirmType","f.Staffs",
                        "u.Followers","p.ServiceName","p.StaffPic","u.Avatar","u.NickName",
                        "u.Experience","u.Satisfection","group_concat(b.NickName) bulletNickName",
                        "group_concat(b.Discription) bulletDiscription"
                    ])
                    ->find();
                /////////////优惠活动/////////
                $respro=Db::table("promote")->alias("p1")->join("promote_item p2","p1.PromoteId=p2.PromoteId")->where("p1.FirmId",$res["pFirmId"])->field(["p1.PromoteId","p2.PromoteType Title","p1.StartTime","p1.EndTime","p2.Discount"])->group("p1.PromoteId")->select();
                //$respro=Db::table("promote")->where("FirmId",$resad["ID"])->field(["PromoteId","Title","StartTime","EndTime"])->select();
                for ($j=0;$j<count($respro);$j++){
                    $nowtime=time();
                    $StartTime=strtotime($respro[$j]["StartTime"]);
                    $EndTime=strtotime($respro[$j]["EndTime"]);
                    if ($nowtime<$StartTime || $nowtime>$EndTime){
                        //活动已经不存在了
                        array_splice($respro,$j,1);
                        $j--;
                    }
                }
                $res["ProTitle"]=$respro;



                $res["bulletNickName"]=explode(",",$res["bulletNickName"]);
                $res["bulletDiscription"]=explode(",",$res["bulletDiscription"]);
                //得到当前机构 距离用户经纬度的距离 单位km
                $sql="select ID,ROUND(
        6378.138 * 2 * ASIN(SQRT(POW(SIN( ($userlat * PI() / 180 - Lat * PI() / 180) / 2),2) + COS($userlat * PI() / 180) * COS(Lat * PI() / 180) * POW( SIN(( $userlng * PI() / 180 - Lng * PI() / 180 ) / 2),  2) )) * 1000) AS distance from firm where ID=".$res["pFirmId"];

                $firmdata=Db::query($sql);
                $dis=number_format($firmdata[0]["distance"]/1000,1);
                $res["dis"]=$dis;
                //print_r($firmdata);

                //判断用户是否收藏晒单了
                if (in_array($res["PokerId"], $favorData1))
                {
                    $res["iffavor"]=1;
                }else{
                    $res["iffavor"]=0;
                }

                $dataArr1[]=$res;
            }elseif ($type==0){
                //当前是广告id  模板id
                $resad=Db::table("ad_template")
                    ->alias("a")
                    ->join("firm f","a.FirmId=f.ID")
                    ->where("a.TemplateId",$Id)
                    ->field(["f.ID","f.Certificated","f.FirmName","f.FirmType","f.Staffs","a.MainPic","a.TemplateId"])
                    ->find();
//                print_r($resad);
//                exit;
                /////
                /////////////优惠活动/////////
                $respro=Db::table("promote")->alias("p1")->join("promote_item p2","p1.PromoteId=p2.PromoteId")->where("p1.FirmId",$resad["ID"])->field(["p1.PromoteId","p2.PromoteType Title","p1.StartTime","p1.EndTime","p2.Discount"])->group("p1.PromoteId")->select();
                //$respro=Db::table("promote")->where("FirmId",$resad["ID"])->field(["PromoteId","Title","StartTime","EndTime"])->select();
                for ($j=0;$j<count($respro);$j++){
                    $nowtime=time();
                    $StartTime=strtotime($respro[$j]["StartTime"]);
                    $EndTime=strtotime($respro[$j]["EndTime"]);
                    if ($nowtime<$StartTime || $nowtime>$EndTime){
                        //活动已经不存在了
                        array_splice($respro,$j,1);
                        $j--;
                    }
                }
//                print_r($respro);
//                exit;
                $resad["ProTitle"]=$respro;
                //得到当前机构 距离用户经纬度的距离 单位km
                $sql="select Staffs,ROUND(
        6378.138 * 2 * ASIN(SQRT(POW(SIN( ($userlat * PI() / 180 - Lat * PI() / 180) / 2),2) + COS($userlat * PI() / 180) * COS(Lat * PI() / 180) * POW( SIN(( $userlng * PI() / 180 - Lng * PI() / 180 ) / 2),  2) )) * 1000) AS distance from firm where ID=".$resad["ID"];


                $firmdata=Db::query($sql);
                $dis=number_format($firmdata[0]["distance"]/1000,1);
                $resad["dis"]=$dis;
                $resad["Staffs"]=$firmdata[0]["Staffs"];

                $dataArr2[]=$resad;
            }
        }

        //得到当前用户的最新晒单 评价
        $currentUserPoker=Db::table("poker")->where("CustomerId",$uid)->order('CreatTime desc')->limit(0,1)->field(["Comment","CustomerPic"])->find();

        $arr=[
            "pokerarr"=>$dataArr1,
            "adarr"=>$dataArr2,
            "currentUserPoker"=>$currentUserPoker
        ];
//        print_r($dataArr1);
//        print_r($dataArr2);
//        exit;
       // exit;
        echo returnData(1,$arr);
        exit;

    }


    /**
     * 点击首页 秀的晒单背景进入晒单先详情页
     *获取每一个晒单详情页
     * 请求参数：firmId机构id  serviceId服务项目id  staffId技师id  customerId顾客id pokerId晒单id uid用户id
     *
     */
        public function getPokerDetail(){
//            echo "getPokerDetail====";
//            exit;
           // echo "getPokerDetail----";
            $request=Request::instance();
            $data=$request->param();
            $firmId=$data["firmId"];//机构id
            $staffId=$data["staffId"];//技师id
            $customerId=$data["customerId"];//顾客id
            $serviceId=$data["serviceId"];//服务id
            $pokerId=$data["pokerId"];//晒单id
            $uid=$data["uid"];//用户id
            //已经有的信息
            //机构名、机构类型、机构是否认证、机构距离、机构成员人数、优惠活动、技师头像、技师名字、技师认证、技师星级、技师经验数、弹幕、服务项目名称、
            //现在还需要的数据
            //机构地址、晒单技师图和顾客图 评语、服务项目描述和时长、当前用户是否关注了技师、作品被收藏数-赞的数、爽约数、技师擅长的分类、当前晒单顾客、头像。昵称
            $res1=Db::table("poker")
                ->alias("p")
                ->join("firm f","f.ID=p.FirmId")
                ->where(["p.ID"=>$pokerId,"f.ID"=>$firmId])
                ->field(["f.Province","f.City","f.District","f.FirmAddr","p.StaffPic","p.CustomerPic","p.StaffId","p.Comment"])
                ->find();

            //通过服务项目id得到 服务项目描述和时长
            $res2=Db::table("service")->where("ServiceId",$serviceId)->field(["Discription","Duration"])->find();
            if(!$res1){
                $res1=[];
            }
            if(!$res2){
                $res2=[];
            }
            $res1=array_merge($res1,$res2);
            //通过当前用户id 和技师id 查询follower 关注技师表 看是否关注过 0-未关注  1-已关注
            $count=Db::table("follower")->where(["StaffId"=>$staffId,"CustomerId"=>$uid])->count();
            if ($count==0){
              //未关注
                $res1["iffollower"]=0;
            }else{
                //已关注
                $res1["iffollower"]=1;
            }

            //通过技师id 查询user表
            $res3=Db::table("user")->where("UserId",$staffId)->field(["WorkLike","PigeonStaff","Skill"])->find();

            //通过技师擅长的一级分类名 查询 servicecat表
            $skillArr=explode(",",$res3["Skill"]);
            $res4=Db::table("servicecat")->where("Seq","in",$skillArr)->field(["Name"])->select();
            $skillNameArr=[];
            for ($i=0;$i<count($res4);$i++){
                $skillNameArr[]=$res4[$i]["Name"];
            }
            $res3["SkillName"]=$skillNameArr;
            $res1=array_merge($res1,$res3);
            //通过顾客id 查询user表 头像和昵称
            $res5=Db::table("user")->where("UserId",$customerId)->field(["Avatar customerAvatar","NickName customerNickName"])->find();
            $res1=array_merge($res1,$res5);

            $StaffPicArr=json_decode($res1["StaffPic"],true);
            $CustomerPicArr=json_decode($res1["CustomerPic"],true);
            $PicArr=array_merge($StaffPicArr,$CustomerPicArr);
            //print_r($PicArr);
//            $res1["StaffPic"]=$StaffPicArr;
//            $res1["CustomerPic"]=$CustomerPicArr;
            $StaffPicArrkeys=array_keys($StaffPicArr);
            $CustomerPicArrkeys=array_keys($CustomerPicArr);
            $AllkeysArr=array_merge($StaffPicArrkeys,$CustomerPicArrkeys);
            //print_r($AllkeysArr);

            $preArr=[];
            $arrlater=[];
            for ($j=0;$j<count($AllkeysArr);$j++){
                if ($AllkeysArr[$j]=="cplast"){
                    $preArr[$j]["type"]=0;//效果对比图 前
                    $preArr[$j]["imgname"]=$PicArr["cplast"];
                }elseif ($AllkeysArr[$j]=="cpnext"){
                    $preArr[$j]["type"]=2;//效果对比图 后
                    $preArr[$j]["imgname"]=$PicArr["cpnext"];
                    $arrlater[]=$PicArr["cpnext"];
                }else{
                    $preArr[$j]["type"]=1;//普通图
                    $preArr[$j]["imgname"]=$PicArr[$AllkeysArr[$j]];
                }

            }
            $res1["pokerPic"]=$preArr;
            $res1["laterimg"]=$arrlater;
            //思路：
            //print_r($res1);
            echo returnData(1,$res1);
            exit;
        }


        /**
         *写入晒单已读表
         * 请求数据：pokerId 晒单id   uid 用户id
         */
        public function insertPoker_access(){
                $request=Request::instance();
                $data=$request->param();
                $pokerId=$data["pokerId"];//晒单id
                $uid=$data["uid"];//用户id
                //
               $insertData=[
                   "PokerId"=>$pokerId,
                   "UserId"=>$uid
               ];
//               print_r($data);
//               exit;
                $count=Db::table("poker_access")->where($insertData)->count();
                if ($count>0){
                    //该条记录已经存在
                    echo returnData(0,"已存在");
                    exit;
                }
               //写入 poker_access 表
                $insertData["accessTime"]=date("Y-m-d H:i:s");

            // 启动事务
            Db::startTrans();
            try {
                $res=Db::table("poker_access")->insert($insertData);
                $res1=Db::table('poker')->where('ID', $pokerId)->setInc('Read');//已读晒单数加1

                // 提交事务
                Db::commit();
                echo returnData(1, "写入晒单已读成功");
                exit;
            } catch (\Exception $e) {
                echo returnData(0, "写入晒单已读失败");
                exit;
                // 回滚事务
                Db::rollback();
            }

        }




    /**
     *晒单浏览记录
     * 请求参数PokerId 晒单id
     * 晒单浏览人次计数
     * 思路:判断当前传入的晒单id在Poker_access表中总共有多少条记录
     * 返回参数 code为1是成功 msg为总计数  code为0是查询失败
     * 请求地址：http://trueshow/index/poker/PokerRead
     */
    public function PokerRead()
    {
        $request=Request::instance();
        $data=$request->param();
        //validate验证
        $validate = validate('Poker');
        if(!$validate->scene("PokerRead")->check($data)){
            // echo returnData("-1",$validate->getError());
            echo returnData("-1",$validate->getError());
            exit;
        }
        $PokerId=$data["PokerId"];//晒单id
        //通过晒单id查询 Poker_access 表
        $allcount=Db::table("Poker_access")->where("PokerId","=",$PokerId)->count();
        if ($allcount>=0){
            //查询成功
            echo returnData(1,$allcount);
            exit;
        }else{
            echo returnData(0,"查询数据库失败");
            exit;
        }

    }

    /**
     *
     *晒单收藏
     * 请求参数:PokerId 晒单id  Act：收藏传1/取消收藏传0
     * 思路：通过act参数来决定是添加数据还是删除数据 poker_favor 表
     * 请求地址：http://trueshow/index/poker/PokerFavorite
     */
    public function PokerFavorite()
    {

        $request=Request::instance();
        $data=$request->param();
        $StaffId=$data["staffId"];//技师id
        $UserId=$data["uid"];//用户id
        $PokerId=$data["pokerId"];//晒单id
        $Act=$data["act"];//是否收藏 收藏为1/取消收藏为0
        $time=date("Y-m-d H:i:s");
        //收藏 取消 时间是不同的，所以不可以不删除直接用
        $data=[
            "PokerId"=>$PokerId,
            "UserId"=>$UserId,
        ];

        // 启动事务
        Db::startTrans();
        try{
            if ($Act==0){
                //如果有这条数据 删除 取消收藏
                $res=Db::table('poker_favor')->where($data)->delete();
                $res1=Db::table("user")->where("UserId",$StaffId)->setDec('WorkLike');

                // 提交事务
                Db::commit();
                echo returnData(1,"已取消");
                exit;
            }else{
                //添加数据 收藏
                $data["accessTime"]=$time;
                $res=Db::table('poker_favor')->insert($data);
                $res1=Db::table("user")->where("UserId",$StaffId)->setInc('WorkLike');
                // 提交事务
                Db::commit();
                echo returnData(1,"已收藏");
                exit;
            }
        } catch (\Exception $e) {
            echo returnData(0,"出错了");
            // 回滚事务
            Db::rollback();
            exit;

        }


    }


    /**
     *获取技师/顾客晒单
     */
    public function getPokerByUser()
    {
        //前端传技师StaffId或者顾客CustomerId
        $request=Request::instance();
        $data=$request->param();
//        $Min=isset($data["Min"]) ? $data["Min"] : 0;//请求的开始序号  索引值
//        $Max=isset($data["Max"]) ? $data["Max"] : 2;//请求的结束序号
            $id=$data["customerId"];
           // $key="CustomerId";
        $Min="";
        $Max="";
        if(isset($data['min']) && isset($data['max'])){
            $Min=$data["min"];
            $Max=$data["max"];
        }
        //通过参数获取晒单数据
        //先只把晒单的弹幕晒单id获取到
        $subsql = Db::table('bullet')->where(['Origin'=>0])->field('OriginId')->buildSql();
        if($Min!="" && $Max!=""){
            $res=Db::table('poker')
                ->alias('p')
                ->join([$subsql=> 'b'], "p.ID=b.OriginId","left")
                ->field(["p.ID PokerId",'p.StaffId',"p.StaffPic","p.CustomerPic","count(b.OriginId) Bullets","p.Favor","p.ServiceName","p.CreatTime"])
                ->where(["p.CustomerId"=>$id])
                ->group("p.ID")
                ->order(['p.CreatTime'=>'desc'])
                ->limit($Min,$Max-$Min+1)
                ->select();
        }else{
            $res=Db::table('poker')
                ->alias('p')
                ->join([$subsql=> 'b'], "p.ID=b.OriginId","left")
                ->field(["p.ID PokerId",'p.StaffId',"p.StaffPic","p.CustomerPic","count(b.OriginId) Bullets","p.Favor","p.ServiceName","p.CreatTime"])
                ->where(["p.CustomerId"=>$id])
                ->group("p.ID")
                ->order(['p.CreatTime'=>'desc'])
                ->select();
        }


        $len=count($res);
        $tempArr=[];
        for ($i=0;$i<$len;$i++){

            $res[$i]["makeTime"]=date("Y-m",strtotime($res[$i]["CreatTime"] ));
            $res[$i]["StaffPic"]=json_decode($res[$i]["StaffPic"],true);
            $res[$i]["CustomerPic"]=json_decode($res[$i]["CustomerPic"],true);

            $PicArr=array_merge($res[$i]["StaffPic"],$res[$i]["CustomerPic"]);  //合并成一个数组
        //    print_r($PicArr);
            foreach ($PicArr as $k=>$v){
                if($v!=""){
                    $tempArr[]=$v;
                }

            }
            $res[$i]['allPic']=$tempArr;

        }
       // print_r($res);

        $arr=array();

        foreach($res as $k=>$v){
            $arr[$v['makeTime']][]=$v;

        }
        $arr1=[];
        foreach ($arr as $k=>$v){
            $arr1[]=$v;
        }
//        print_r($arr1);
//        exit;
        echo returnData(1,$arr1);
        exit;

    }


    /**
     *统计晒单数
     * 指定用户的晒单总数
     */
    public function countPokerByUser()
    {
        //前端传技师StaffId或者顾客CustomerId
        $request=Request::instance();
        $data=$request->param();
        //通过参数获取晒单数据
        if (isset($data["staffId"])){
           $StaffId= $data["staffId"];
            $res=Db::table('poker')->where('StaffId',$StaffId)->count();
        }
        if (isset($data["customerId"])){
            $CustomerId=$data["customerId"];
            $res=Db::table('poker')->where('CustomerId',$CustomerId)->count();
        }

//        if (!$res){
//            echo returnData(0,"出错了");
//            exit;
//        }
        echo returnData(1,$res);
        exit;
    }


    /**
     *读取技师所有晒单评价
     * 请求参数：StaffIdj技师ID
     * 通过技师ID，读取技师所有晒单的评语
     * 返回参数：CustomerId:顾客id  CustomerPic len个数
     */
    public function getPokerCommentByStaff()
    {
        $request=Request::instance();
        $data=$request->param();
        //通过参数获取晒单数据
        if (!isset($data["StaffId"])){
            echo returnData(0,"StaffId参数不能为空");
            exit;
        }
        $StaffId= $data["StaffId"];
        $res=Db::table("poker")
            ->where("StaffId",$StaffId)
            ->field(["CustomerId","CustomerPic","Comment"])
            ->find();

        //$res["CustomerPic"]=json_decode($res["CustomerPic"],true);
        $res["len"]=count($res);
//        print_r($res);
//        exit;
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res);
        exit;

    }

    /**
     *新建和保存晒单
     * 流程：
    1、	新建时，获取当前机构佣金比例、技师和机构认证状态，省份,顾客ID
    2、	技师图片上传时需进行人像验证，如有大面积正面人像，则暂时不显示，等待顾客审核通过FaceAllow =1。
    3、	更新service_RESN (顾客或技师已晒单)
    4、	新建时更新技师表，Star不为空时，需要统计技师评价五星平均分并更新Star字段。同时接单数经验值+1
     * 请求参数：
     *          PokerId  晒单ID。为空表示新增
                RESNId    约单-服务表ID。必传
                StaffId    技师ID 必传
                CustomerId  顾客ID 。新增时必填
                Comment     评价内文
                Star       0-5星。默认5；
                ViewAllow    晒单是否允许展示。0：不展示，1：允许，2：禁用。顾客端不要此项。RealPic为0时，此项自动为0
                Anonym     是否匿名晒单：0：不匿名，1：匿名。默认1
                RealPic     顾客评价晒单图片是否真实。0：否，1：真。默认1
                FaceAllow   是否截留人像图片。0：否， 1是(就会进行人像验证把具有人像的图片存入StaffPicBlock 字段中)
                PIC         图片上传和保存方案待定
     *
     */
    ///////////////////////////////////////后期补人像验证功能/图片上传问题////////////////////////////////////////////////////////
    public function savePoker()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["customerId"]) || !isset($data["pokerId"]) || !isset($data["resnId"]) || !isset($data["ifPicTrue"]) || !isset($data["ifAnonymous"]) || !isset($data["ifHasFace"]) ){
            echo returnData(0,"参数不能为空");
            exit;
        }
        if($data['ifPicTrue']==1){
            //照片不属实  删除poker表对应 RESNId和 ID 这一条  删除service_resn表 RESNId和StaffPoker=1 CUSTPoker=0的这一条
            //echo '点击了不属实，要全部删除';
            // 启动事务
            Db::startTrans();
            Db::table('poker')->where(["CustomerId"=>$data["customerId"],"ID"=>$data["pokerId"],"RESNId"=>$data["resnId"]])->delete();
            Db::table('service_resn')->where(["CustomerId"=>$data["customerId"],"RESNId"=>$data["resnId"],"StaffPoker"=>1,"CUSTPoker"=>0])->delete();
            Db::commit();
            echo returnData(-1,'删除成功');
            exit;

        }
        if($data['ifAnonymous']==1){
            //不匿名  改变poker表 Anonym=0
          //  echo 'Anonym=0';
            Db::table('poker')->where(["CustomerId"=>$data["customerId"],"ID"=>$data["pokerId"],"RESNId"=>$data["resnId"]])->update(['Anonym'=>0]);
            //echo returnData(1,'实名成功');
        }else{
            //匿名   改变poker表 Anonym=1
           // echo 'Anonym=1';
            Db::table('poker')->where(["CustomerId"=>$data["customerId"],"ID"=>$data["pokerId"],"RESNId"=>$data["resnId"]])->update(['Anonym'=>1]);
           // echo returnData(1,'匿名成功');
        }
        if($data['ifHasFace']==0){
            //带人脸 要删除
            echo '人脸要删除';
        }
        echo returnData(1,'修改成功');
        exit;
        print_r($data);
        exit;
        //validate验证
//        $validate = validate('Poker');
//        if(!$validate->scene("savePoker")->check($data)){
//            // echo returnData("-1",$validate->getError());
//            echo returnData("-1",$validate->getError());
//            exit;
//        }
//        $RESNId=$data["RESNId"];//约单-服务表ID
//        $StaffId=$data["StaffId"];//技师ID
//        $Comment=isset($data["Comment"]) ? $data["Comment"] : "";//评价内文
//        $Star=isset($data["Star"]) ? $data["Comment"] : 5;//0-5星。默认5
//        $RealPic=isset($data["RealPic"]) ? $data["RealPic"] : 1;
//        $FaceAllow=isset($data["FaceAllow"]) ? $data["FaceAllow"] : 1;//是否截留人像图片。0：否， 1是
//        if (isset($data["ViewAllow"])){//晒单是否允许展示。0：不展示，1：允许，2：禁用。
//            //RealPic为0时，此项为0
//            if ($RealPic==0){
//                $ViewAllow=0;
//            }else{
//                $ViewAllow=$data["ViewAllow"];
//            }
//        }
//        //通过技师id 查询用户表 user 获取 技师的认证状态 Certificated, 隶属机构id FirmId
//        // 通过机构FirmId  查询机构表 firm 获取当前机构的信息 佣金比例 Rakeoff、机构认证状态 Certificated，省份Province
//        $resPreData=Db::table("firm")
//            ->alias("f")
//            ->join("user u","f.ID=u.FirmId")
//            ->field(["u.Certificated staffCertificated","u.FirmId","f.Rakeoff","f.Certificated firmCertificated","f.Province"])
//            ->where(["u.UserId"=>$StaffId])
//            ->find();
//        //$resPreData结果：
//        //Array
//        //(
//        //    [staffCertificated] => 0
//        //    [FirmId] => 1
//        //    [Rakeoff] => 2
//        //    [firmCertificated] => 0
//        //    [Province] => 河北省
//        //)
//        $res1=Db::table("user")->where("UserId",$StaffId)->field(["FirmId","Certificated"])->find();
//        $staffCertificated=$res1["Certificated"];//技师认证状态
//        $staffCertificated=$res1["Certificated"];//机构id
//        //通过技师id 查询用户表 user 获取 技师的认证状态
//
//
/////////////////////////图片的问题等前端布局好弄好方案再写////////////////////////////////////////////
//        //如果没有这条数据则是新建 有则是修改
//        if (isset($data["PokerId"])){
//            //修改这条数据 update
//
//        }else{
//            $CustomerId=$data["CustomerId"];//顾客ID
//            //新增一条数据 insert
//
//            //添加成功后更新 更新service_RESN表 (顾客或技师已晒单)
//        }



    }


    /**
     *通过约单获取晒单   1表查询：Poker
     * 请求参数：RESNId 约单-服务表ID service_resn 表
     * 返回参数：PokerId 晒单ID   StaffPic 技师上传的图片   CustomerPic 顾客上传的图片
     *  ServiceName 服务项目名称 CreatTime 建立的时间
     *
     */
    public function getPokerByRESNId()
    {
        $request=Request::instance();
        $data=$request->param();
        //通过参数获取晒单数据
        if (!isset($data["RESNId"])){
            echo returnData(0,"RESNId参数不能为空");
            exit;
        }
        $RESNId=$data["RESNId"];
        $res=Db::table('poker')->where('RESNId',$RESNId)->field(["ID PokerId","StaffPic","CustomerPic","ServiceName","CreatTime"])->find();

//        $res["StaffPic"]=json_decode($res["StaffPic"],true);
//        $res["CustomerPic"]=json_decode($res["CustomerPic"],true);

        //print_r($res);
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res);
        exit;

    }

    /**
     *获取我的晒单收藏  3表查询：poker_favor, poker，bullet
     * 请求参数：CustomerId 顾客id  Min:请求的开始序号。默认0  Max:请求的结束序号。默认2
     *返回参数：PokerId
        StaffPic
        CustomerPic
        Bullets
        Favor
        ServiceName
        CreatTime
     */
    public function getPokerByFavor()
    {
        $request=Request::instance();
        $data=$request->param();
        $Min=isset($data["Min"]) ? $data["Min"] : 0;//请求的开始序号  索引值
        $Max=isset($data["Max"]) ? $data["Max"] : 2;//请求的结束序号
        if (!isset($data["CustomerId"])){
            echo returnData(0,"CustomerId参数不能为空");
            exit;
        }
        $CustomerId=$data["CustomerId"];//顾客id

        $subsql = Db::table('bullet')->where(['Origin'=>0])->field('OriginId')->buildSql();
        $res=Db::table('poker')
            ->alias('p')
            ->join([$subsql=> 'b'], "p.ID=b.OriginId","left")
            ->join("poker_favor f","p.ID=f.PokerId","right")
            ->where(["f.UserId"=>$CustomerId])
            ->group("p.ID")
            ->field(["f.PokerId","p.StaffPic","p.CustomerPic","count(b.OriginId) Bullets","p.Favor","p.ServiceName","f.accessTime"])
            ->order(['f.accessTime'=>'desc'])
            ->limit($Min,$Max-$Min+1)
            ->select();
        //print_r($res);
        //exit;
//        $len=count($res);
//        for ($i=0;$i<$len;$i++){
//            $res[$i]["StaffPic"]=json_decode($res[$i]["StaffPic"],true);
//            $res[$i]["CustomerPic"]=json_decode($res[$i]["CustomerPic"],true);
//        }
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }

        echo returnData(1,$res);
        exit;


    }

    /**
     *统计晒单收藏总数 poker_favor表
     * 请求参数：CustomerId 顾客id
     * 返回参数：code为1成功  PokerCount 指定用户的晒单总数
     */
    public function countPokerByFavor()
    {
        //前端传技师StaffId或者顾客CustomerId
        $request=Request::instance();
        $data=$request->param();
        //通过参数获取晒单数据
        if (!isset($data["CustomerId"])){
            echo returnData(0,"CustomerId参数不能为空");
            exit;

        }

        $CustomerId=$data["CustomerId"];
        $res=Db::table('poker_favor')->where('UserId',$CustomerId)->count();
        if (!$res){
            echo returnData(0,"读取数据出错了");
            exit;
        }
         echo returnData(1,$res);
         exit;
    }

    /**
     * 技师首页------晒单作品
     */
    public function getPoker(){
        $request = Request::instance();
        $param = $request->param();
        if(isset($param['staffId']) && isset($param['page'])){
            $staffId = $param['staffId'];
            $page = $param['page']; // 加载次数
            $moreCount  = 5;
            $startPoker = $page * 2;
            // 收藏数  浏览数   顾客评价
            $res = Db::table("poker")
                ->where('StaffId','=',$staffId)
                ->field(['ID','Favor','CustomerId','Comment','Star','Anonym','StaffPic','CustomerPic','Read','CreatTime'])
                ->order('CreatTime desc')
                ->limit($page * $moreCount,$moreCount)
                ->select();

            // 按需加载的次数
                for($i=0;$i<count($res);$i++){
                    $res[$i]['CreatTime'] = date("Y,m,d",strtotime( $res[$i]['CreatTime']));
                    $staffPicArr = json_decode($res[$i]['StaffPic'],true);

                    if($res[$i]['CustomerPic'] != NULL){
                        $cusPicArr = json_decode($res[$i]['CustomerPic'],true);
                    }else{
                        $cusPicArr = [];
                    }
                    $picNum = 0;
                    foreach($staffPicArr as $key=>$value){
                        if($value != ""){
                            $picNum++;
                        }
                    }
                    foreach($cusPicArr as $key=>$value){
                        if($value != "") $picNum++;
                    }
                    $res[$i]['picCount'] = $picNum;
                    $res[$i]['thumbnail'] = ROOT_PATH  . 'static' . DS . 'images' . DS . 'poker' . DS .$staffPicArr['main']; // 得到晒单缩略图
                    // 判断顾客是否是匿名晒单
                    if($res[$i]['Anonym'] == 1){
                        //匿名晒单
                        $res[$i]['customerName'] = "匿名用户";
                    }else{
                        // 获取顾客姓名
                        $name = Db::table('user')->where('UserId','=',$res[$i]['CustomerId'])->field('NickName')->find();
                        $res[$i]['customerName'] = $name['NickName'];
                    }
                }

            $temp = array();
            foreach($res as $key=>$val) {
//                $temp[$val['CreatTime']]['time'] = $val['CreatTime'];
                $temp[$val['CreatTime']][] = $val;
            }
            $r['list'] = array_values($temp);
            echo returnData(1,$r);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

}
















