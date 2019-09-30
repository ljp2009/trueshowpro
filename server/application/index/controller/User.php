<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
use think\Request;
//顾客/技师类
class User extends Controller
{

    /**
     *更新用户选择的公里数
     * 请求参数：uid 用户id  选择的km数
     */
    public function updateUserKm(){
        $request=Request::instance();
        $data=$request->param();
        $uid= $data["uid"];//用户id
        $km= $data["km"];//公里数
        //echo $uid."---".$km;
//        exit;
        $updata=[
            "km"=>$km
        ];
        $res=Db::table("user")->where("UserId",$uid)->update($updata);
        if (!$res){
            echo returnData(0,"更新失败");
            exit;
        }
        echo returnData(1,"更新成功");
        exit;
    }


    /**
     * 更新技师的上下班时间
     */
    public function updateUserWorkTime(){
        $request=Request::instance();
        $data=$request->param();
        $uid= $data["uid"];//用户id
        $workStartTime= $data["workStartTime"];//上班时间
        $workEndTime= $data["workEndTime"];//下班时间
//        print_r($data);
//        exit;
        //echo $uid."---".$km;
//        exit;
        $updata=[
            "WorkStartTime"=>$workStartTime,
            "WorkEndTime"=>$workEndTime
        ];
        $res=Db::table("user")->where("UserId",$uid)->update($updata);
        if (!$res){
            echo returnData(0,"设置失败");
            exit;
        }
        echo returnData(1,"设置成功");
        exit;
    }


    /**
     *更新用户的MySubCat 晒单浏览分类筛选设置，为空表示全选分类
     * 请求参数：uid 用户id mySubCat 子分类名 数组格式["A1","B2"]/""
     * mySubCat 为空的话表示全部分类
     */
    public function updateUserMySubCat(){
        $request=Request::instance();
        $data=$request->param();
        $uid=$data["uid"];//用户id
        $mySubCat=$data["mySubCat"];//子分类集合 数组格式A1,B1,C1,D2/""
//        echo $mySubCat."<br>";
//        echo $uid;
//        exit;
        if ($mySubCat==""){
            //表示全部分类
            $mySubCat="";
        }

        //更新user表 这条记录的 MySubCat 字段
        $res=Db::table("user")->where("UserId",$uid)->update(["MySubCat"=>$mySubCat]);
        if (!$res){
            echo returnData(0,"更新失败");
            exit;
        }
        echo returnData(1,"更新成功");//前端需要重新渲染晒单首页数据
        exit;
    }





    /**
     *获取技师基本信息 servicecat 、user表
     * 请求参数：userId 技师ID（用户ID）
     */
    public function getStaffById()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["uid"])){
            echo returnData(0,"uid参数不能为空");
            exit;
        }
        $UserId= $data["uid"];//技师ID（用户ID）
        //通过userid获取user表中技师的信息
        $res=Db::table("user")
            ->where("UserId",$UserId)
            ->field(["NickName","RealName","FirmId","Certificated","staffDesc","Experience","Satisfection","Followers Fans","Diary","WorkLike","Skill","WorkStartTime","WorkEndTime","IdPic","Avatar","PersonPic","EducationPic"])
            ->find();
        ///////////////////获取擅长分类名
        $skillArr=explode(',',$res["Skill"]);
        $skillData=Db::table('servicecat')
            ->where('Seq','in',$skillArr)
            ->field(["Name"])
            ->select();
        $len=count($skillData);
        $skillData1=[];
        for ($i=0;$i<$len;$i++){
            array_push($skillData1,$skillData[$i]["Name"]);
        }
        $res["Skill"]=$skillData1;
        $res["IdPic"]=json_decode($res["IdPic"],true);
        $res["PersonPic"]=json_decode($res["PersonPic"],true);
        $res["EducationPic"]=json_decode($res["EducationPic"],true);

        $res["WorkStartTime"]=substr($res["WorkStartTime"],0,5);
        $res["WorkEndTime"]=substr($res["WorkEndTime"],0,5);
        // 获取技师的服务项目数量
        $serviceCount = Db::table('servicestaff')->where('StaffId','=',$UserId)->field('count(Id) serviceCount')->find();
        $res['serviceCount'] = $serviceCount['serviceCount'];
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
     *个人名片二维码
     * 请求参数 UserId 技师ID（用户ID）当前
     * 返回参数：UserIdCode url/path/*.jpg路径和文件名
     */
    ///////////////////////////////注意//////没写完////////////////////////////////////////////////////////////////////////////////
    public function getUser2Dcode()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["UserId"])){
            echo returnData(0,"UserId参数不能为空");
            exit;
        }
        $UserId= $data["UserId"];//技师ID（用户ID）


    }

    /**
     *获取机构下所有技师 （user servicecat表）
     * 请求参数：FirmId 机构ID  Min 要读取的最小序号（按服务端排序） Max 要读取的最大序号，默认3
     *
     */
    public function getStaffByFirmId()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["FirmId"])){
            echo returnData(0,"FirmId参数不能为空");
            exit;
        }
//        $Min=isset($data["Min"]) ? $data["Min"] : 0;//请求的开始序号  索引值
//        $Max=isset($data["Max"]) ? $data["Max"] : 3;//请求的结束序号
        $Min="";
        $Max="";
        $res=[];
        if(isset($data['Min']) && isset($data['Max'])){
            $Min=$data["Min"];
            $Max=$data["Max"];
        }
        $FirmId= $data["FirmId"];//机构ID
        //第一次是4个技师    点击进 是机构下的所有技师
        if($Min!="" && $Max!=""){

            //通过机构id获取当前机构下所有技师信息
            $res=Db::table("user")
                ->where("FirmId",$FirmId)
                ->field(["FirmId","UserId StaffId","NickName","Certificated","Experience","Satisfection","Followers Fans","Diary","WorkLike","Skill","WorkStartTime","WorkEndTime","Avatar"])
                ->order(['LastLoginTime'=>'desc'])
                ->limit($Min,$Max-$Min+1)
                ->select();
        }else{

            //读取机构下的所有技师
            $res=Db::table("user")
                ->where("FirmId",$FirmId)
                ->field(["FirmId","UserId StaffId","NickName","Certificated","Experience","Satisfection","Followers Fans","Diary","WorkLike","Skill","WorkStartTime","WorkEndTime","Avatar"])
                ->order(['LastLoginTime'=>'desc'])
                ->select();
        }
        //得到总数
        $countArr=Db::table("user")
            ->where("FirmId",$FirmId)
            ->field(["FirmId","UserId StaffId","NickName","Certificated","Experience","Satisfection","Followers Fans","Diary","WorkLike","Skill","WorkStartTime","WorkEndTime","Avatar"])

            ->select();
        $count=count($countArr);

        //////////////获取擅长分类名
        $len=count($res);
        for ($i=0;$i<$len;$i++){
            $res[$i]["Skill"]= explode(',',$res[$i]["Skill"]);
            $skillData=Db::table('servicecat')->where('Seq','in',$res[$i]["Skill"])->field(["Name"])->select();
            $arr=[];
            $len1=count($skillData);
            for ($j=0;$j<$len1;$j++){
                $arr[]=$skillData[$j]["Name"];
                $skillData[$j]=$arr[$j];
            }
            $res[$i]["Skill"]=$skillData;
            $res[$i]['count']=$count;
        }
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }

//        print_r($res);
//        exit;
        echo returnData(1,$res);
        exit;

    }

    /**
     *获取提供指定服务的所有技师 2表查询：user，servicestaff
     * 请求参数：ServiceId 服务项目ID
     */
    public function getStaffByService()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["serviceId"])){
            echo returnData(0,"serviceId参数不能为空");
            exit;
        }
        $ServiceId= $data["serviceId"];//服务项目ID
        //通过服务项目ID获取提供有该项服务的所有技师信息
        //在 servicestaff 表中 ServiceId可能是多个需要转为数组，查询到含有该项服务的技师id 在从user表中获取技师的信息
        $res1=Db::table("servicestaff")->field(["ServiceId","StaffId"])->select();
        $len1=count($res1);
        $arr1=[];//存储具有该项服务的技师id
        for ($i=0;$i<$len1;$i++){
            $res1[$i]["ServiceId"]=explode(",",$res1[$i]["ServiceId"]);
            if(in_array($ServiceId, $res1[$i]["ServiceId"])){
                    $arr1[]= $res1[$i]["StaffId"];
            }
        }

        //查询user表中有这些userid的人的信息
        $res=Db::table("user")
            ->where('UserId','in',$arr1)
            ->field(["UserId StaffId","NickName","Certificated","Experience","Satisfection","Followers Fans","Diary","WorkLike","Skill","WorkStartTime","WorkEndTime","Avatar","PigeonStaff"])
            ->select();
//        print_r($res);
        $len=count($res);

        for ($i=0;$i<$len;$i++){
            //每日上下班时间。时分格式：00:00, 00:00,默认值：09:00,20:00
            $res[$i]["AvailableTime"]=$res[$i]["WorkStartTime"].",".$res[$i]["WorkEndTime"];
            //擅长分类名
            $res[$i]["Skill"]= explode(',',$res[$i]["Skill"]);
            $skillData=Db::table('servicecat')->where('Seq','in',$res[$i]["Skill"])->field(["Name"])->select();
            $arr=[];//存储每一个技师的擅长分类名
            $len2=count($skillData);
            for ($j=0;$j<$len2;$j++){
                $arr[]=$skillData[$j]["Name"];
                $skillData[$j]=$arr[$j];
            }
            $res[$i]["Skill1"]=$skillData;



            //////读取技师所有休息的时间和预约出去的时间
            $now=date("Y-m-d");
            $sleeptimearr=Db::table('schedule')
                ->where('StaffId','=',$res[$i]["StaffId"])
                ->where("PickDate","=",$now)
                ->field(["StartTime","EndTime"])->select();
//            print_r("其中一个用户---StaffId=".$res[$i]["StaffId"]."------");

            for ($k=0;$k<count($sleeptimearr);$k++){
                $sleeptimearr[$k]["date1"]=0;

            }
            $res[$i]["sleeptime"]=$sleeptimearr;
        }


        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
//       print_r($res);


        echo returnData(1,$res);
        exit;
    }

    /**
     * 通过传递过来的时间和技师id来获取不能选择的时间
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getSleepTime(){
        $request=Request::instance();
        $data=$request->param();
        $staffid=$data["staffId"];
        $num=$data["num"];
        $time= date("Y-m-d",strtotime("+$num day",time()));;

//        echo $num."----".$staffid."---".$time;


        $sleeptimearr=Db::table('schedule')
            ->where('StaffId','=',$staffid)
            ->where("PickDate","=",$time)
            ->field(["StartTime","EndTime"])->select();
//            print_r("其中一个用户---StaffId=".$res[$i]["StaffId"]."------");
//        print_r($sleeptimearr);
        echo returnData(1,$sleeptimearr);
        exit;
    }

    /**
     *获取顾客基本信息
     * 请求参数：UserId 顾客ID（用户ID）
     * 返回参数：NickName 昵称  Gender 性别 avatar 头像
     */
    public function getUserById()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["uid"])){
            echo returnData(0,"uid参数不能为空");
            exit;
        }
        $UserId= $data["uid"];//顾客ID（用户ID）
        //通过用户id查询user表 用户x信息
        $res=Db::table("user")->where("UserId",$UserId)->field(["NickName","Gender","Avatar"])->find();
        $res["Gender"]= $res["Gender"]==0 ? "女" : "男";
//      print_r($res);
//      exit;
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }

        echo returnData(1,$res);
        exit;

    }

    /**
     *修改用户信息
     * 思路：前端整理好要写入的数据格式 分两种情况：update和setInc 所以就需要再传一个值来判断到底进行哪个情况，运用Act参数为0表示update,为1表示setInc
     * 注意：update的话 传数据数组直接 字段--值；setInc的话 传的数组 key-字段名,value--字段值
     */
    public function updUser()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["data"]) || !isset($data["UserId"]) || !isset($data["Act"])){
            echo returnData(0,"参数不能为空");
            exit;
        }
        $UserId= $data["UserId"];//顾客ID（用户ID）
        $dataArr=json_decode($data["data"],true);//转为数组
        $Act= $data["Act"];//0表示update,为1表示setInc
        //通过Act参数值来判断写sql
        if ($Act==0){
            //表示用update
            $res=Db::table('user')->where('UserId', $UserId)->update($dataArr);
        }elseif($Act==1){
            //表示用setInc
            //需要得到字段 和字段值
            $key=$dataArr["key"];//字段
            $value=$dataArr["value"];//字段值
            $res=Db::table('user')->where('UserId', $UserId)->setInc($key, $value);//字段值在原有基础上加1(一般加1)
        }
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }

        echo returnData(1,"操作成功");
        exit;
    }

    /**
     *获取技师时间安排  2表查询：schedule,user
     * 请求参数：StaffId 技师ID（用户ID）PickDateStart 需要查询的开始日期。格式：2019-08-01   PickDateEnd 需要查询的结束日期。为空表示仅使用PickDateStart日期
     * 返回参数：
     *   ReservationId 约单号。为0表示技师设置为“非空闲”（不上班）
         StartTime		开始时间 00:00
         EndTime		结束时间 00:00
         PickDate		需要查询的日期。格式：2019-08-01
     * 注：数据以日期分组；
     */
    public function getScheduleByStaffId()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["staffId"])){
            echo returnData(0,"staffId参数不能为空");
            exit;
        }
        if (!isset($data["pickDateStart"])){
            echo returnData(0,"pickDateStart参数不能为空");
            exit;
        }
        $StaffId=$data["staffId"];//技师ID（用户ID）
        $PickDateStart=$data["pickDateStart"];//需要查询的开始日期 格式：2019-08-01
        if (!isset($data["pickDateEnd"])){
           $PickDateEnd="";//不存在就赋值为空  为空表示仅使用PickDateStart日期
            $res=Db::table("schedule")
                ->where(["PickDate"=>$PickDateStart,"StaffId"=>$StaffId])
                ->field(["group_concat(ReservationId) ReservationId","group_concat(StartTime) StartTime","group_concat(EndTime) EndTime","PickDate"])
                ->group("PickDate")
                ->select();
        }else{
            //存在
            $PickDateEnd=$data["pickDateEnd"];
            //where('id','between',[1,8]);
            $res=Db::table("schedule")
                ->where("StaffId",$StaffId)
                ->whereTime('PickDate', 'between', [$PickDateStart,$PickDateEnd])
                ->field(["group_concat(ReservationId) ReservationId","group_concat(StartTime) StartTime","group_concat(EndTime) EndTime","PickDate"])
                ->group("PickDate")
                ->select();

        }
        $arr=[];
        $len=count($res);
        for ($i=0;$i<$len;$i++){
            $res[$i]["ReservationId"]=explode(",",$res[$i]["ReservationId"]);
            $res[$i]["StartTime"]=explode(",",$res[$i]["StartTime"]);
            $res[$i]["EndTime"]=explode(",",$res[$i]["EndTime"]);

            $len1=count($res[$i]["ReservationId"]);
            for ($j=0;$j<$len1;$j++){
                $ReservationId=$res[$i]["ReservationId"][$j];
                $StartTime=substr($res[$i]["StartTime"][$j],0,5);
                $EndTime=substr($res[$i]["EndTime"][$j],0,5);
                $arr[$j]["ReservationId"]=$ReservationId;
                $arr[$j]["StartTime"]=$StartTime;
                $arr[$j]["EndTime"]=$EndTime;
                $res[$i]["timein"]=$arr;

            }
        }
//        print_r($res);
//        exit;
//        if (!$res){
//            echo returnData(0,"出错了");
//            exit;
//        }

        echo returnData(1,$res);
        exit;

    }

    /**
     *新建技师时间安排 2表查询：schedule,user
     * 请求参数：StaffId  ReservationId(N) StartTime EndTime PickDate
      需先检查技师上下班时间，新建的时间区间不能与当日已有时间区间重叠
     * 返回参数：ScheId 安排表ID
     *  pickDate: date,
    reservationId:0,
    startTimeAndendTime 整理需要修改的数组
     * workStartTime workEndTime 技师当前的上下班时间
    staffId: that.data.uid
    type: radioVal //标记设置的类型 0--全天休息 1--还是全天接单里面的
     */
    public function newScheduleToStaff()
    {
        $request=Request::instance();
        $data=$request->param();
//        print_r($data);
        $startTimeAndendTime=json_decode($data["startTimeAndendTime"],true);
//        print_r($startTimeAndendTime);
//        exit;
        //[{"startTime":"09:00","endTime":"11:00"},{"startTime":"11:00","endTime":"12:00"}]
        $StaffId=$data["staffId"];//技师id
        $PickDate=$data["pickDate"];//日期
        $ReservationId=$data["reservationId"];//约单id   0--休息
        $type=$data["type"];//类型 标记设置的类型 0--全天休息 1--还是全天接单里面的
        //
        if($type==0){
            $StartTime=$startTimeAndendTime[0]["startTime"];//开始时间
            $EndTime=$startTimeAndendTime[0]["endTime"];//结束时间
                //查看是否已经设置了全天休息
                $count1=Db::table("schedule")
                    ->where(["ReservationId"=>0,"PickDate"=>$PickDate,"StartTime"=>$StartTime,"EndTime"=>$EndTime,"StaffId"=>$StaffId])
                    ->count();
                if($count1>0){
                    //已经设置了 不可再设置了
                    echo returnData(1,"当天已设置为全天休息,不可重复设置");
                    exit;
                }else{
                    $insertData=[
                        "ReservationId"=>$ReservationId,
                        "PickDate"=>$PickDate,
                        "StartTime"=>$StartTime,
                        "EndTime"=>$EndTime,
                        "StaffId"=>$StaffId
                    ];
                    //写入数据库 全天休息
                    $res1=Db::table("schedule")->insert($insertData);
                    if(!$res1){
                        echo returnData(0,"设置失败");
                        exit;
                    }
                    echo returnData(1,"设置成功");
                    exit;

                }

        }else{
            //全天接单里面的
            //workStartTime workEndTime
            $workStartTime=$data["workStartTime"];//技师的上班时间
            $workEndTime=$data["workEndTime"];//技师的上班时间
            //把休息的所有记录都删掉
            $count=Db::table('schedule')->where([ "ReservationId"=>0,
                "PickDate"=>$PickDate,
                "StaffId"=>$StaffId])->count();
            if($count>0){
                //删除
                $count1=Db::table('schedule')
                    ->where([ "ReservationId"=>0,
                    "PickDate"=>$PickDate,
                    "StaffId"=>$StaffId])
                    ->delete();
                if(count($startTimeAndendTime)==0 && $count1){
                    echo returnData(1,"设置成功");
                    exit;
                }
            }else{
                if(count($startTimeAndendTime)==0){
                    echo returnData(1,"设置成功");
                    exit;
                }
            }
                //删除成功
            $insertData=[];
                if(count($startTimeAndendTime)!=0){
                    for ($i=0;$i<count($startTimeAndendTime);$i++){
                        $insertData[]=[
                            "ReservationId"=>$ReservationId,
                            "PickDate"=>$PickDate,
                            "StartTime"=>$startTimeAndendTime[$i]["startTime"],
                            "EndTime"=>$startTimeAndendTime[$i]["endTime"],
                            "StaffId"=>$StaffId
                        ];
                    }
                    //写入数据库
                    $res=Db::table("schedule")->insertAll($insertData);
                    if(!$res){
                        echo returnData(0,"设置失败");
                        exit;
                    }
                    echo returnData(1,"设置成功");
                    exit;
                }



        }



    }

    /**
     *删除技师时间安排
     * 请求参数：ScheId 安排表ID
     * 思路：根据ScheId值来指定删除某条记录
     */
    public function delScheduleToStaff()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["ScheId"])){
            //echo "参数不能为空";
            echo returnData(0,"ScheId参数不能为空");
            exit;
        }
        $ScheId=$data["ScheId"];
        $res=Db::table("schedule")->where("ScheId",$ScheId)->delete();
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,"删除成功");
        exit;
    }
    /**
     *关注/取关技师 2表查询：user，Follower
     * 请求参数：StaffId 技师ID（用户ID）  CustomerId 顾客ID   Act 0：取消关注，1关注
     *1、新增Follower记录，user表Followers+1(-1);
      2、取消关注为删除记录
     */
    public function FollowStaff()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["staffId"])  ||   !isset($data["uid"]) || !isset($data["act"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }
        $StaffId=$data["staffId"];//技师ID（用户ID）
        $CustomerId=$data["uid"];//顾客ID
        $Act=$data["act"];//0：取消关注，1关注
        $time=date("Y-m-d H:i:s");
        $data=[
            "StaffId"=>$StaffId,
            "CustomerId"=>$CustomerId,
            "CreatedTime"=>$time
        ];

        // 启动事务
        Db::startTrans();
        try{
            if ($Act==0){
                //取消关注  删除这条记录
                $res=Db::table("follower")->where(["StaffId"=>$StaffId,"CustomerId"=>$CustomerId])->delete();
                $res1=Db::table("user")->where("UserId",$StaffId)->setDec('Followers');
                // 提交事务
                Db::commit();
                echo returnData(1,"取消关注成功");
                exit;
            }else{
                //关注 添加数据
                $res=Db::table("follower")->insert($data);
                $res1=Db::table("user")->where("UserId",$StaffId)->setInc('Followers');
                // 提交事务
                Db::commit();
                echo returnData(1,"关注成功");
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
     *检查当前用户是否关注技师 follower 表
     * 请求参数：StaffId 技师id CustomerId 顾客id
     */
    public function checkFollow()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["StaffId"])  ||   !isset($data["CustomerId"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }
        $StaffId=$data["StaffId"];//技师ID（用户ID）
        $CustomerId=$data["CustomerId"];//顾客ID
        $count=Db::table("follower")->where(["StaffId"=>$StaffId,"CustomerId"=>$CustomerId])->count();
        if ($count==0){
            //没有关注
            echo returnData(0,"未关注");
            exit;
        }
        //关注
        echo returnData(1,"关注");
        exit;

    }


    /**
     *获取关注的技师 2表查询：user,Follower
     * 请求参数：CustomerId 顾客id Min 请求的开始序号。默认0     Max 请求的结束序号。默认3
     */
    public function getStaffsByFollow()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["customerId"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }
        $CustomerId=$data["customerId"];//顾客ID
//        $Min=isset($data["min"]) ? $data["min"] : 0;//请求的开始序号  索引值
//        $Max=isset($data["max"]) ? $data["max"] : 3;//请求的结束序号
        $Min="";
        $Max="";
        if(isset($data['min']) && isset($data['max'])){
            $Min=$data["min"];
            $Max=$data["max"];
        }

        //第一次是4个技师    点击进 是机构下的所有技师
        if($Min!="" && $Max!=""){
//通过CustomerId参数查找关注技师表的StaffId字段 在通过StaffId字段 查询user表
            $res=Db::table("follower")
                ->alias("f")
                ->join("user u","f.StaffId=u.UserId")
                ->where(["f.CustomerId"=>$CustomerId])
                ->field(["u.UserId StaffId","u.NickName NickName","u.Certificated Certificated","u.Experience Experience","u.Satisfection Satisfection","u.Followers Fans","u.Diary Diary","u.WorkLike WorkLike","u.Skill Skill","u.WorkStartTime WorkStartTime","u.WorkEndTime WorkEndTime","u.Avatar Avatar"])
                ->limit($Min,$Max-$Min+1)
                ->select();
        }else{
            $res=Db::table("follower")
                ->alias("f")
                ->join("user u","f.StaffId=u.UserId")
                ->where(["f.CustomerId"=>$CustomerId])
                ->field(["u.UserId StaffId","u.NickName NickName","u.Certificated Certificated","u.Experience Experience","u.Satisfection Satisfection","u.Followers Fans","u.Diary Diary","u.WorkLike WorkLike","u.Skill Skill","u.WorkStartTime WorkStartTime","u.WorkEndTime WorkEndTime","u.Avatar Avatar"])
                ->select();
        }


        //////////////获取擅长分类名
        $len=count($res);
        for ($i=0;$i<$len;$i++){
            $res[$i]["Skill"]= explode(',',$res[$i]["Skill"]);
            $skillData=Db::table('servicecat')->where('Seq','in',$res[$i]["Skill"])->field(["Name"])->select();
            $arr=[];
            $len1=count($skillData);
            for ($j=0;$j<$len1;$j++){
                $arr[]=$skillData[$j]["Name"];
                $skillData[$j]=$arr[$j];
            }
            $res[$i]["Skill"]=$skillData;
        }
//print_r($res);

//        //通过所有的StaffId  获取今日的日记动态数
//        $today=date("Y-m-d");
//       // echo $today;
//        $allDiaryCount=0;
//        for($j=0;$j<count($res);$j++){
//            print_r($res[$j]);
//            $staffId=$res[$j]['StaffId'];
//            $res1=Db::table('staff_diary')->where('StaffId',$staffId)->field(['StaffId','CreateTime'])->select();
//            if(count($res1)!=0){
//                //发表过日记的
//               // print_r($res1);
//                for($i=0;$i<count($res1);$i++){
//                    $teachItem=$res1[$i];
//                    print_r($teachItem);
//                    $diaryTime=$teachItem['CreateTime'];
//                    $updTime=date("Y-m-d",strtotime($diaryTime));
//                    echo '============'.$updTime;
//                    $arr=[];
//                    if($updTime==$today){
//                        echo '----------'.$diaryTime;
//                        array_push($arr,1);
//                    }else{
//                        echo "=========";
//                    }
//                    $allDiaryCount+=count($arr);
//                    echo 'arr数量-----'.count($arr);
//                }
//            }
//
//
//        }
//        echo '总数量'.$allDiaryCount;
//        $today=date("Y-m-d");
//        echo $today;

        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }

        echo returnData(1,$res);
        exit;

    }
    /**
     *
     */

    /**
     *获取技师业务数据周统计
     * 请求参数：StaffId 技师id
     */
    public function getStatisticsStaff()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["StaffId"]) && !isset($data['page'])){
            //echo "参数不能为空";
            echo returnData(0,"StaffId参数不能为空");
            exit;
        }
        $StaffId=$data["StaffId"];//技师ID
        $page = $data['page']; // 查询页数
        $moreCount  = 3; //每次读取的数据数量
        //通过技师id获取 statistics_staff 表的信息
        $res=Db::table("statistics_staff")
            ->where("StaffId",$StaffId)
            ->order("Id desc")
            ->limit($moreCount * $page,$moreCount)
            ->select();
        if(count($res) == 0){
            // 空数据
        }else if(count($res) == 1){
            // 第一次读取排名数据   周排名为空，需要计算出排名
            //获取上周起始时间戳和结束时间戳
            $curr = date("Y-m-d");
            $w=date('w');//获取当前周的第几天 周日是 0 周一到周六是1-6  
            $beginLastweek=strtotime("$curr -".($w ? $w-1 : $w-6).' days');//获取本周开始日期，如果$w是0是周日:-6天;其它:-1天    
            $cur_monday=date('Y-m-d 00:00:00',$beginLastweek);
            $s=date('Y-m-d 01:59:59',strtotime("$cur_monday -7 days"));
            $e=date('Y-m-d 01:59:59',strtotime("$s +6 days"));
            // 总分大于
            $curTotal = Db::table('statistics_staff')
                ->where('StaffId','=',115)
                ->field('Total')
                ->find();
            $curTotal = $curTotal['Total'];
            $count = Db::table('statistics_staff')
                ->where('Starttime' ,'>',$s)
                ->where('Total','>',$curTotal)
                ->field('count(Id) count')
                ->find();
            $rank = $count['count']+1;
            Db::table('statistics_staff')
                ->where('Id','=',$res[0]['Id'])
                ->update(['Rank' => $rank]);
            $res[0]['Rank'] = $rank;
            $res[0]['Starttime'] = date('Y-m-d',strtotime($res[0]['Starttime']));
            $res[0]['EndTime'] = date('Y-m-d',strtotime($res[0]['EndTime']));
        }
        // 之后的读取数据，只要修改开始时间和结束时间就可以
        for($i=0;$i<count($res);$i++){
            $res[$i]['Starttime'] = date('Y-m-d',strtotime($res[$i]['Starttime']));
            $res[$i]['EndTime'] = date('Y-m-d',strtotime($res[$i]['EndTime']));
        }


//        print_r($res);
//        exit;

        echo returnData(1,$res);
        exit;
    }

    /**
     *统计关注的技师总数
     * 请求参数：CustomerId 顾客id
     */
    public function countStaffByFollow()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["customerId"])){
            //echo "参数不能为空";
            echo returnData(0,"customerId参数不能为空");
            exit;
        }
        $CustomerId=$data["customerId"];//顾客ID
        $res=Db::table("follower")->where("CustomerId",$CustomerId)->count();
        echo returnData(1,$res);//返回的$res 直接就是 总数
        exit;
    }
    /**
     *转移/获取机构管理权
     * 请求参数：UserId  当前的管理人id TargetUserId 管理权接收人ID。为0表示放弃管理权。接收人为当前用户ID表示获取管理权 FirmId 隶属机构id
     * 1、	修改源和目标管理权用户的user.StaffLevel 和 更新firm.Manager为目标用户
     */
    public function transAdmin()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["TargetUserId"]) || !isset($data["UserId"]) || !isset($data["FirmId"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }
        $UserId=$data["UserId"];//当前的管理人id
        $FirmId=$data["FirmId"];//隶属机构id
        $TargetUserId=$data["TargetUserId"];//管理权接收人ID。为0表示放弃管理权。接收人为当前用户ID表示获取管理权
         //启动事务
        Db::startTrans();
        try{
            if ($TargetUserId==0){
                //表示当前管理人放弃管理权
                //需要把当前管理人 user表的StaffLevel字段更新为2 firm.Manager为0
                $res1=Db::table("user")->where("UserId",$UserId)->update(['StaffLevel' =>2]);
                $res2=Db::table("firm")->where("ID",$FirmId)->update(['Manager' =>0]);
            }else{
                //管理权转移为$TargetUserId 这个人
                // 需要把user.StaffLevel更新为3，firm.Manager为$TargetUserId
                $res1=Db::table("user")->where("UserId",$TargetUserId)->update(['StaffLevel' =>3]);
                $res2=Db::table("firm")->where("ID",$FirmId)->update(['Manager' =>$TargetUserId]);
            }
            // 提交事务
            Db::commit();
            echo returnData(1,"成功");
            exit;
        } catch (\Exception $e) {
            echo returnData(0,"出错了");
            // 回滚事务
            Db::rollback();
            exit;
        }

    }
    /**
     *成员进出管理
     * 返回参数 0失败 1成功
     * 思路：1为加入：加入 更新user表 StaffLevel为3；firm表 成员数量加上当前选中的用户，成员加入成功后，需删除技师/服务项目关联表中该技师“不等于”当前机构FirmId的记录
     *       0为移除 更新user表 StaffLevel为0；FirmId为空  firm表 成员数量减去当前选中的技师
     * 两个不同的name值apply申请 、official正式
     */
    public function manageMember()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["Act"]) || !isset($data["FirmId"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }
        $FirmId=$data["FirmId"];//隶属机构id
        $Act=$data["Act"];//0：出（移出），1：进(加入)
        // 启动事务
        Db::startTrans();
        try{
            if ($Act==0){
                $UserIdArr=$data["official"];//正式成员才能移除 用户ID。多个ID 格式：[34,546,345]
                //移除
                //更新user表 StaffLevel为0；FirmId为空  firm表 成员数量减去当前选中的技师
                $res1=Db::table("user")->where("UserId",'in',$UserIdArr)->update(['StaffLevel' =>0,"FirmId"=>""]);
                $res2=Db::table('firm')->where('ID', $FirmId)->setDec('Staffs', count($UserIdArr));//机构成员减少个数
            }else{
                $UserIdArr=$data["apply"];//申请的人才能有加入权 用户ID。多个ID 格式：[34,546,345]
                //加入 更新user表 StaffLevel为2；  firm表 成员数量加上当前选中的用户
                //成员加入成功后，需删除技师/服务项目关联表中该技师“不等于”当前机构FirmId的记录
                $res1=Db::table("user")->where("UserId",'in',$UserIdArr)->update(['StaffLevel' =>2]);
                $res2=Db::table('firm')->where('ID', $FirmId)->setInc('Staffs', count($UserIdArr));//机构成员增加个数
                $res3=Db::table('servicestaff')->where('StaffId','in',$UserIdArr)->where('FirmId','<>',$FirmId)->delete();
            }
            // 提交事务
            Db::commit();
            echo returnData(1,"成功");
            exit;
        } catch (\Exception $e) {
            echo returnData(0,"出错了");
            // 回滚事务
             Db::rollback();
            exit;
        }

    }

    /**
     *机构成员人数 查询 user表
     * 请求参数：FirmId 机构id
     * 返回参数：
     * CountMember	int	正式成员数
       CountJoinning int	正在申请加入的人数
     */
    public function countMember()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["FirmId"])){
            //echo "参数不能为空";
            echo returnData(0,"FirmId参数不能为空");
            exit;
        }
        $FirmId=$data["FirmId"];//机构id
        //正式成员数 为StaffLevel=2
        $CountMember=Db::table("user")->where("StaffLevel",2)->count();
        // 正在申请加入的人数为 StaffLevel=1
        $CountJoinning=Db::table("user")->where("StaffLevel",1)->count();
        $res=[
          "CountMember" => $CountMember,
            "CountJoinning"=> $CountJoinning
        ];
        echo returnData(1,$res);
        exit;
    }

    /**
     *获取技师认证信息
     * 请求参数:StaffId 技师id
     */
    public function getCertStaff()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["StaffId"])){
            //echo "参数不能为空";
            echo returnData(0,"StaffId参数不能为空");
            exit;
        }
        $StaffId=$data["StaffId"];//技师id
        //通过技师id获取 cert_staff 表
        $res=Db::table("cert_staff")->where("StaffId",$StaffId)->find();
        //看图片保存方案定
        $res["FacePic"]=json_decode($res["FacePic"],true);
        $res["DiplomaPic"]=json_decode($res["DiplomaPic"],true);
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
     *新建和修改技师认证 （1表查询：cert_staff）
     * 请求参数
     * CertId	Y	String	认证ID。为空或0表示增加
        CertName		string	真实姓名，同身份证
        CertGender		int	性别。0：女，1：男
        CertIDNo		string	身份证号码
        CertAddr		string	认证地址同身份证
        FacePic?		string	人像图片
        DiplomaPic?			学历图片，3张

     */
    ///////////////////图片请求和上传方案确定后再写////////////////////////////////////
    public function saveCertStaff()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["CertId"])){
            //echo "参数不能为空";
            echo returnData(0,"StaffId参数不能为空");
            exit;
        }
        $StaffId=$data["CertId"];//认证ID。为空或0表示增加
        $CertName=$data["CertName"];//真实姓名，同身份证
        $CertGender=$data["CertGender"];//性别。0：女，1：男
        $CertIDNo=$data["CertIDNo"];//身份证号码
        $CertAddr=$data["CertAddr"];//认证地址同身份证
        $FacePic=$data["FacePic"];//人像图片
        $DiplomaPic=$data["DiplomaPic"];//学历图片，3张


    }

    /**
     * 申请加入机构
     */
    public function applyForFirm(){
        // 修改用户staffLevel 为申请中，修改隶属机构的firmid,同时将机构
        $request=Request::instance();
        $data=$request->param();
        $uid = $data['uid'];
        $firmId = $data['firmId'];
        if($firmId == 0){
            //取消
            $_data =[
                'FirmId' => $firmId,
                'StaffLevel' => 0,
            ];
        }else{
            $_data =[
                'FirmId' => $firmId,
                'StaffLevel' => 1,
            ];
        }
        $res = DB::table('user')->where('UserId','=',$uid)->update($_data);
        echo returnData(1,$res);

    }

    /**
     * 获取当前用户的隶属状态   返回stafflevel
     */
    public function judgeIsStaff(){
        $instance = Request::instance();
        $param = $instance->param();
        if(isset($param['uid'])){
            $uid = $param['uid'];
            $data = Db::table('user')->where('UserId','=',$uid)->field(['FirmId','StaffLevel'])->find();
            echo returnData(1,$data);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 获取技师名片需要的数据
     * 1.获取该技师在机构中选中的所有服务项目
     */
    public function staffCardInfo(){
        $request = Request::instance();
        $param = $request->param();
        if(isset($param['staffId']) && isset($param['firmId']) && isset($param['userId'])){
//            $staffId = $param['staffId'];
//            $firmId = $param['firmId'];
            $staffId  = 115;
            $firmId   = 90;
            $userId = $param['userId'];//用户id
            $serviceIds = Db::table('servicestaff')
                ->where('StaffId','=',$staffId)
                ->where('FirmId','=',$firmId)
                ->field('ServiceId')
                ->select();
            $serviceIds = array_reduce($serviceIds, function ($result, $value) {
                return array_merge($result, array_values($value));
            }, array());
            $services = Db::table('service')
                ->where('ServiceId','in',$serviceIds)
                ->select();
            for($i=0;$i<count($services);$i++){
                $minPrice = $services[$i]['Price_Min'];// 主分类
                $maxPrice = $services[$i]['Price_Max'];// 子分类
                if($maxPrice == ""){  //最高价为空
                    $maxPrice = 0;

                }else{
                    $maxPrice=sprintf("%.2f",( $services[$i]["Price_Max"]/100));
                }
                $minPrice=sprintf("%.2f",( $services[$i]["Price_Min"]/100));
                $services[$i]['Price_Min'] = $minPrice;
                $services[$i]['Price_Max'] = $maxPrice;
            }
            // 得到该用户在该技师下的服务总数量
            $countService = Db::table('service_resn')->where('CustomerId','=',$userId)->where('StaffId','=',$staffId)->field('count(RESNId) changeCount')->find();
            array_push($services,['countService' => $countService]);
//            print_r($services);
//            var_dump($services[0]['MainCat']);
            // 获取技师服务 end
            echo returnData(1,$services);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }
   /*
   *统计晒单收藏总数
   */
   public function countPokerByFavor(){
       $request=Request::instance();
       $data=$request->param();
       if (!isset($data["customerId"])){
           //echo "参数不能为空";
           echo returnData(0,"customerId参数不能为空");
           exit;
       }
       $CustomerId=$data["customerId"];//顾客ID
       $res=Db::table("poker_favor")->where("UserId",$CustomerId)->count();
       echo returnData(1,$res);//返回的$res 直接就是 总数
       exit;
   }
   /*
   * 获取我的晒单收藏
   */
    /**
     * 技师 ----  我的 ------  更换头像
     */
    public function changeAvatar(){
        $instance = Request::instance();
        $param = $instance->param();
        $domain=$instance->domain(); // 获取当前域名
        $oldAvatar = $param['oldAvatar'];  //旧头像
        $staffId = $param['userId'];   // 用户id
        $file = $instance->file('avatar');
        $name1 = date('Ymd');
        $name2 = time().rand(100000,999999);
        $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "user" . DS .$name1, $name2);

        // 启动事务
        Db::startTrans();
        try{
            if ($info2) {
                // 存入相对路径/upload/日期/文件名
                $image = $info2->getSaveName();
                $picName = $name1 . '/' . $image;
                $fullStr = $domain."/static/images/user/".$picName;
                // 得到就图片，删除就图片
                $oldName = Db::table('user')->where('UserId','=',$staffId)->field('Avatar')->find();
                $oldName = $oldName['Avatar'];
                $k = 'images/user/';
                $s = strpos($oldName,$k);
                $str = substr($oldName,$s + strlen($k));
                echo $str;
                if(file_exists(ROOT_PATH . 'public' . DS . 'static' . DS . 'images' . DS . 'user' . DS . $str)){
                    unlink(ROOT_PATH . 'public' . DS . 'static' . DS . 'images' . DS . 'user' . DS . $str);
                }
                // 将图片完整链接存入数据库
                Db::table('user')->where('UserId','=',$staffId)->update(['Avatar' => $fullStr]);


            }
            // 提交事务
            Db::commit();
            echo returnData(1,$fullStr);
            exit;
        } catch (\Exception $e) {
            dump($e->getMessage());
            // 回滚事务
            Db::rollback();
            //注意：我们做了回滚处理，所以id为1039的数据还在
        }

        echo returnData(0,'更换头像失败');
        exit;


    }
  /*
  * 获取我的晒单收藏
  */
    public function getPokerByFavor(){
        $request=Request::instance();
        $data=$request->param();
        $Min="";
        $Max="";
        if(isset($data['min']) && isset($data['max'])){
            $Min=$data["min"];
            $Max=$data["max"];
        }
        $res=Db::table('bullet')->where(['Origin'=>0])->field(['OriginId'])->buildSql();
        if($Min!="" && $Max!=""){
            $res1=Db::table('poker')
                ->alias('p')
                ->join([$res=>'b'],'b.OriginId=p.ID','left')
                ->join("poker_favor f","p.ID=f.PokerId","right")
                ->where('f.UserId',6)
                ->group('p.ID')
                ->field(["f.PokerId",'p.StaffId',"p.StaffPic","p.CustomerPic","count(b.OriginId) Bullets","p.Favor","p.ServiceName","f.accessTime"])
                ->order(['f.accessTime'=>'desc'])
                ->limit($Min,$Max-$Min+1)
                ->select();
        }else{
            $res1=Db::table('poker')
                ->alias('p')
                ->join([$res=>'b'],'b.OriginId=p.ID','left')
                ->join("poker_favor f","p.ID=f.PokerId","right")
                ->where('f.UserId',6)
                ->group('p.ID')
                ->field(["f.PokerId",'p.StaffId',"p.StaffPic","p.CustomerPic","count(b.OriginId) Bullets","p.Favor","p.ServiceName","f.accessTime"])
                ->order(['f.accessTime'=>'desc'])
                ->select();
        }





        for($i=0;$i<count($res1);$i++){
            $date1=$res1[$i]['accessTime'];
            $date2 = date("Y-m",strtotime($date1 ));
            $res1[$i]['newDate']=$date2;
        }
        //以newDate分组合并
        $arr=array();

        foreach($res1 as $k=>$v){
            $arr[$v['newDate']][]=$v;

        }
        $arr1=[];
        foreach ($arr as $k=>$v){
            $arr1[]=$v;
        }


//       print_r($arr1);
//       exit;



        if (!$res1){
            echo returnData(0,"出错了");
            exit;
        }

        echo returnData(1,$arr1);
        exit;
    }

    /**
     * 上传形象照片
     */
    public function uploadStaffImage(){
        $instance = Request::instance();
        $param = $instance->param();
        if(!isset($param['staffId']) && !isset($param['pos']) && !isset($param['isFile'])){
            echo returnData(0,'请求参数不能为空');
            exit;
        }
        $staffId = $param['staffId'];  // 技师id
        $pos = $param['pos'];  // 上传图片键名
        $isFile = $param['isFile']; // 是否是文件
        $domain=$instance->domain(); // 获取当前域名
        $fullStr = ""; // 图片完整姓名
        if ($isFile) {
            // true
            $file = $instance->file('avatar');
            $name1 = date('Ymd'); // 文件夹名字
            $name2 = time().rand(100000,999999); // 图片名字
            // 验证图片
            $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "user" . DS .$name1, $name2);
            if ($info2) {
                // 存入相对路径/upload/日期/文件名
                $image = $info2->getSaveName();
                $picName = $name1 . '/' . $image;
                $fullStr = $domain."/static/images/user/".$picName; // 数据库存储的图片数据
            }

        }

        // 得到数据库中的数据
        $personPic = Db::table('user')
            ->where('UserId','=',$staffId)
            ->field('PersonPic')
            ->find();
        $personPicStr = $personPic['PersonPic'];  // 数据库中的字符串  {'A0':'','A1':'','A2':''}
        $picArr = ['A0'=>'','A1'=>'','A2'=>'']; // 记录数据
        if($personPicStr == NULL){
            $picArr[$pos] = $fullStr;
        }else{
            $picArr = json_decode($personPicStr,true);
            $oldPic = $picArr[$pos];// 查看是否存在旧照片

            if(strlen($oldPic) > 0){
                // 删除旧照片
                echo $oldPic;
                // 得到照片的名字   日期/照片名    http://ljp2.jujiaoweb.com/static/images/user/20190926/1569492302384957.jpg
                $k = 'images/user/';
                $s = strpos($oldPic,$k);
                $str = substr($oldPic,$s + strlen($k));
                if(file_exists(ROOT_PATH . 'public' . DS . 'static' . DS . 'images' . DS . 'user' . DS . $str)){
                    unlink(ROOT_PATH . 'public' . DS . 'static' . DS . 'images' . DS . 'user' . DS . $str);
                }
            }
            $picArr[$pos] = $fullStr;
        }
        $personPic = Db::table('user')
            ->where('UserId','=',$staffId)
            ->update(['PersonPic'=>json_encode($picArr)]);
        if($personPic){
            echo returnData(1,'上传成功');
            exit;
        }else{
            echo returnData(1,'上传失败');
            exit;
        }

    }

    /**
     * 得到形象图片
     */
    public function getStaffImage(){
        $instance = Request::instance();
        $param = $instance->param();
        if(!isset($param['staffId'])){
            echo returnData(0,'请求参数不能为空');
            exit;
        }
        $staffId = $param['staffId'];
        $data = Db::table('user')->where("UserId",'=',$staffId)->field('PersonPic')->find();
        $str = $data['PersonPic'];
        $arr = json_decode($str,true);
        echo returnData(1,$arr);
        exit;
    }
    /**
     * 技师 --- 我的日记
     */
    public function getDiary(){
        $request = Request::instance();
        $param = $request->param();
        if(!isset($param['staffId']) && !isset($param['pages']) && !isset($param['userId'])){
            echo returnData(0,'请求参数不能为空');
            exit;
        }
        $staffId = $param['staffId'];// staffId == -1   顾客访问关注技师的日记，  staffId  != -1 ,技师访问自己的日记
        $userId = $param['userId'];
        $pqages = $param['pages']; //  分页
        $count = 5; // 数量
        if($staffId != -1){
            // 得到技师的头像和真实姓名
            $info = Db::table('user')->where('UserId','=',$staffId)->field(['RealName','Avatar','Certificated'])->find();
            // 得到技师的所有日记
            $diary = Db::table('staff_diary')
                ->where('StaffId','=',$staffId)
                ->order('CreateTime desc')
                ->limit($pqages * $count,$count)
                ->select();

            // 得到点赞数，并查看技师自己是否点赞
            for($i=0;$i<count($diary);$i++){
                //访问人 是否点赞
                $isZan = Db::table('staffdiary_liked')
                    ->where('DiaryId','=',$diary[$i]['DiaryId'])
                    ->where('UserId','=',$userId)
                    ->field('Id')
                    ->find();
                if($isZan['Id']){
                    $diary[$i]['isZan'] = 1;
                }else{
                    $diary[$i]['isZan'] = 0;
                }

            }

            for($i=0;$i<count($diary);$i++){
                $diary[$i]['info'] = $info;
            }
            echo returnData(1,$diary);
            exit;
        }else{
            // 得到顾客关注的技师
            $staffIds = Db::table('follower')->where('CustomerId','=',$userId)->field('StaffId')->select();
            $result = [];
            array_walk_recursive($staffIds, function($value) use (&$result) {
                array_push($result, $value);
            });
            $staffIds = $result; // 关注的技师一维数组



            // 得到技师的身份
            if(count($staffIds) > 0){
                // 得到顾客关注的所有的技师的所有日记
                $allData = Db::table('staff_diary')
                    ->where('StaffId','in',$staffIds)
                    ->order('CreateTime desc')
                    ->limit($pqages * $count,$count)
                    ->select();
                for($i=0;$i<count($allData);$i++){
                    $id = $allData[$i]['StaffId']; // 日记中技师的id
                    // 获取这条日记中，该技师的信息
                    $info = Db::table('user')
                        ->where('UserId','=',$id)
                        ->field(['UserId','RealName','Avatar','Certificated'])
                        ->find();
                    $allData[$i]['info'] = $info;
                    //*****************************************贾加 获取弹幕
                    $DiaryId=$allData[$i]['DiaryId'];
                   // echo '=='.$DiaryId;


                }
                // 得到点赞数，并查看技师自己是否点赞
                for($i=0;$i<count($allData);$i++){
                    //访问人 是否点赞
                    $isZan = Db::table('staffdiary_liked')
                        ->where('DiaryId','=',$allData[$i]['DiaryId'])
                        ->where('UserId','=',$userId)
                        ->field('Id')
                        ->find();
                    if($isZan['Id']){
                        $allData[$i]['isZan'] = 1;
                    }else{
                        $allData[$i]['isZan'] = 0;
                    }

                }
                echo returnData(1,$allData);
                exit;
            }else{
                echo returnData(0,'您还没有关注任何技师');
                exit;
            }
        }

    }
    /**
     * 技师-添加日记
     */
    public function addDiary(){
        $instance = Request::instance();
        $param = $instance->param();
        if(!isset($param['staffId']) && !isset($param['imgNameArr']) && !isset($param['diray']) && !isset($param['delImgs'])){
            echo returnData(0,'请求参数不能为空');
            exit;
        }
        $staffId = $param['staffId'];
        $content = $param['diray'];
        $imgNameArr = $param['imgNameArr'];
        $delPic = $param['delImgs']; // 删除的图片数组
        $imgsStr = implode(',',$imgNameArr);
        $data = [];
        $data['StaffId'] = $staffId;
        $data['Contents'] = $content;
        $data['Pic']      =  $imgsStr;
        $data['CreateTime'] = date("Y-m-d H-i-s");

        // 存储日记
        Db::table('staff_diary')->insert($data);
        // 日记数量加1
        Db::table('user')->where("UserId",'=',$staffId)->setInc('Diary');
        // 删除没用的图片
        $path = ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "user" . DS;
        for($i=0;$i<count($delPic);$i++){
            $img = $path.$delPic[$i];
            if(file_exists($img)){
                unlink($img);
            }
        }
        echo returnData(1,'success');
        exit;
    }
    /**
     * 处理图片，返回图片名字
     */
    public function handImg()
    {
        //获取表单上传文件
        $request = Request::instance();
        $file = $request->file('diaryImg');
        $name1 = date('Ymd');
        $name2 = time() . rand(100000, 999999);
        $info2 = $file->validate(['ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "user" . DS . $name1, $name2);
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();
            $picName = $name1 . '/' . $image;
            echo returnData(1, $picName);
            exit;
        }else{
            echo returnData(0, "后台上传失败");
            exit;
        }
    }

    /**
     * 点赞操作
     */
    public function likeDiary(){
        $instance = Request::instance();
        $param = $instance->param();
        if(!isset($param['userId']) && !isset($param['diaryId']) && !isset($param['type'])){
            echo returnData(0,'请求参数不能为空');
            exit;
        }
        $userId = $param['userId'];
        $diaryId= $param['diaryId'];
        $type = $param['type'];

        if($type == 1){
            // 点赞
            Db::table('staffdiary_liked')
                ->insert(['DiaryId' => $diaryId,'UserId' => $userId,'CreateTime' => date('Y-m-d H-i-s')]);

            // 技师日记表点赞数加1
            Db::table('staff_diary')
                ->where('DiaryId' ,'=',$diaryId)
                ->setInc('Liked');
            echo returnData(1,'点赞');
            exit;
        }else{
            // 取消点赞
            Db::table('staffdiary_liked')
                ->where('DiaryId','=',$diaryId)
                ->where('UserId','=',$userId)
                ->delete();
            // 技师日记表点赞数减1
            Db::table('staff_diary')
                ->where('DiaryId' ,'=',$diaryId)
                ->setDec('Liked');
            echo returnData(1,'取消点赞');
            exit;

        }


    }
    //得到用户晒单收藏详细信息
    public function getFavorDetail(){
        //得到 staffid pokerid
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["staffId"]) || !isset($data["pokerId"]) ){
            echo returnData(0,"参数不能为空");
            exit;
        }
        $staffId=$data['staffId'];
        $pokerId=$data['pokerId'];

        $serverData=Db::table('poker')
            ->where('ID',$pokerId)
            ->field(['ServiceName','StaffPic','CustomerPic'])
            ->find();
        $bullets=Db::table('bullet')
            ->where('Origin',0)
            ->where('OriginId',$pokerId)
            ->field(['NickName nickName','Discription text'])
            ->select();
        $staffInfo=Db::table('user')
            ->where('UserId',$staffId)
            ->field(['NickName','Certificated','Avatar','Satisfection'])
            ->find();
        //print_r($res2);
        //$arrMerge=array_merge($res,$res1,$res2);
        $StaffPicArr=json_decode($serverData["StaffPic"],true);
        $PicArr=[];
        //print_r($serverData["CustomerPic"]);
       // echo '-----'.$serverData["CustomerPic"];
        $AllkeysArr=[];

        if(empty($serverData["CustomerPic"])){
           //如果顾客没有上传图片
            $PicArr= $StaffPicArr;
            $StaffPicArrkeys=array_keys($StaffPicArr);
            $AllkeysArr=array_merge($StaffPicArrkeys);
        }else{
            $CustomerPicArr=json_decode($serverData["CustomerPic"],true);
            $PicArr=array_merge($StaffPicArr,$CustomerPicArr);
            $StaffPicArrkeys=array_keys($StaffPicArr);
            $CustomerPicArrkeys=array_keys($CustomerPicArr);
            $AllkeysArr=array_merge($StaffPicArrkeys,$CustomerPicArrkeys);
        }
       
        //print_r($PicArr);
//        $res1["StaffPic"]=$StaffPicArr;
//        $res1["CustomerPic"]=$CustomerPicArr;


        $preArr=[];

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
        //   print_r($res1);
        $pokerPic=$res1['pokerPic'];
        for($j=0;$j<count($pokerPic);$j++){
            if($pokerPic[$j]['type']==2){
                array_splice($pokerPic,$j,1);
            }
        }
        //   print_r($pokerPic);
        $res1["finalPokerPic"]=$pokerPic;
//        exit;
        $arr=[
            'serverData'=>$serverData,
            'picList'=>$res1,
            'bullets'=>$bullets,
            'staffInfo'=>$staffInfo
        ];

        echo returnData(1,$arr);
        exit;
    }
    /**
     *更改顾客基本信息
     */
    public function updateCusInfo(){
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["customerId"]) || !isset($data["userNickName"]) || !isset($data["changeSex"]) ){
            echo returnData(0,"参数不能为空");
            exit;
        }
        $customerId=$data['customerId'];  //顾客userid
        $userNickName=$data['userNickName'];  //更改的昵称
        $changeSex=$data['changeSex'];     //更改性别
        $res=Db::table('user')->where('UserId', $customerId)->update(['NickName' => $userNickName,'Gender'=>$changeSex]);
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }

        echo returnData(1,'修改信息成功');
        exit;



    }
    /**
     * 得到用户关注的技师 日志的弹幕
     */
    public function getDiaryDoomm(){
        $request = Request::instance();
        $param = $request->param();
        if(!isset($param['staffId']) && !isset($param['pages']) && !isset($param['userId'])){
            echo returnData(0,'请求参数不能为空');
            exit;
        }
        $staffId = $param['staffId'];// staffId == -1   顾客访问关注技师的日记，  staffId  != -1 ,技师访问自己的日记
        $userId = $param['userId'];
        $pqages = $param['pages']; //  分页
        $count = 5; // 数量
        $staffIds = Db::table('follower')->where('CustomerId','=',$userId)->field('StaffId')->select();
        $result = [];
        array_walk_recursive($staffIds, function($value) use (&$result) {
            array_push($result, $value);
        });
        $staffIds = $result; // 关注的技师一维数组
        // 得到技师的身份
        if(count($staffIds) > 0){
            // 得到顾客关注的所有的技师的所有日记
            $allData = Db::table('staff_diary')
                ->where('StaffId','in',$staffIds)
                ->order('CreateTime desc')
                ->limit($pqages * $count,$count)
                ->select();

            for($i=0;$i<count($allData);$i++) {
                $id = $allData[$i]['StaffId']; // 日记中 技师的id
                $diaryId=$allData[$i]['DiaryId'];  //日记  id
                //echo 'id======='.$id;
                //得到diaryid 下的弹幕
                $info=Db::table('bullet')
                    ->where('OriginId','=',$diaryId)
                    ->where('Origin',1)
                    ->field(['NickName nickName','Discription text'])
                    ->select();
                $allData[$i]['doomInfo'] = $info;

            }
            //print_r($allData);
            echo returnData(0,$allData);
        }else{
            echo returnData(0,'您还没有关注任何技师');
            exit;
        }


        exit;
    }

    /**
     * 切换身份   修改entry的值    0 - 顾客端界面   1- 技师端界面
     */
    public function changeEntry(){
        $instance = Request::instance();
        $param = $instance->param();
        if(!isset($param['userId']) && !isset($param['entry'])){
            echo returnData(0,"请求参数不能为空");
            exit;
        }
        $userId = $param['userId'];
        $entry = $param['entry'];
        Db::table("user")->where('UserId','=',$userId)->update(['Entry' => $entry]);
        echo returnData(1,"success");
        exit;

    }
}
