<?php
namespace app\index\controller;
//约单类
use think\Controller;
use think\Db;
use think\Request;

class Reservation extends Controller
{
    /**
     *获取技师约单的今天 明天 后天 大后天 +  一共五天的约旦信息
     * 请求参数
     * 技师id
     * 第一次不需要传指定的日期 之后都需要传 分别给清一个标识 ifDate=0 表示第一次  ifDate=1代表之后的每一次
     * 需要渲染到技师约单首页的数据
     */
    public function getStaffReservationInfo(){
        $instance = Request::instance();
        $data = $instance->param();
        $staffId=$data["staffId"];//技师id
        //$staffId=115;
        $ifDate=$data["ifDate"];//标识是否第一次加载 0--第一次加载   1-之后的每一次加载
        //$ifDate=1;
        $dateArr=[];
       if ($ifDate==0){
           for($i = 0; $i < 5; $i++){
               $dateArr[]=date('Y-m-d', strtotime('+'.$i.' day'));
           }
       }else{
           $currentDate=$data["currentDate"];//传过来的指定日期
           $currentDate=date("Y-m-d",strtotime('-1 day',strtotime($currentDate)));
           //$currentDate="2019-09-21";
           for($i = 0; $i < 5; $i++){
               $dateArr[]=date("Y-m-d",strtotime('-'.$i.' day',strtotime($currentDate)));
           }
       }
//        print_r($dateArr);
//        exit;
        $dataArr1=[];
        //按照每一个日期读取 每一天的约单
        //读取技师的上下班时间
        $staffWorkTime=Db::table("user")->where("UserId",$staffId)->field(["WorkStartTime","WorkEndTime"])->find();
        for($i = 0; $i < count($dateArr); $i++){
            if ($ifDate==0){
                if ($i<3){
                    // 0 1 2
                    $dataArr1[$i]["ifshowchinaDay"]=$i;
                }
            }

            $res=Db::table("reservation")
                //->where('PickDate','like','%'.$dateArr[$i].'%')
                ->where(["StaffId"=>$staffId,"PickDate"=>$dateArr[$i]])
                ->where("Status",">",0)
                ->field(["ReservationId","CustomerId","Status","StartTime","EndTime","Shortmsg","StaffId","PriceTotal","FirmId"])
                ->select();
            if(count($res)==0){
                //当前日期没有约单
                $dataArr1[$i]["ifList"]=0;
                $dataArr1[$i]["reservationlist"]=[];
            }else{
                //有约单
                $dataArr1[$i]["ifList"]=1;//有约单
                for($k = 0; $k < count($res); $k++){
                    $res[$k]["StartTime"]=substr($res[$k]["StartTime"],0,5);
                    $res[$k]["EndTime"]=substr($res[$k]["EndTime"],0,5);
                    $res[$k]["Poortime"]=(intval(explode(":", $res[$k]["EndTime"])[0])-intval(explode(":", $res[$k]["StartTime"])[0]))*60;
                    //获取顾客信息
                    $customInfo=Db::table("user")->where("UserId",$res[$k]["CustomerId"])->field(["NickName","Avatar"])->find();
                    $res[$k]["NickName"]=$customInfo["NickName"];//顾客昵称
                    $res[$k]["Avatar"]=$customInfo["Avatar"];//用户头像
                    //获取约单的服务项目信息
                    $serviceinfo=Db::table("service_resn")
                        ->alias("s1")
                        ->join("servicecat s2","s2.Seq=s1.MainCat")
                        ->where("s1.ReservationId",$res[$k]["ReservationId"])
                        ->field(["s2.Name","s1.StaffPoker","s1.CUSTPoker","s1.ServiceName","s1.Price_Min","s1.Duration","s1.Price_Max"])
                        ->select();
                    for($m = 0; $m < count($serviceinfo); $m++){
                        $serviceinfo[$m]["Price_Min"]=number_format( $serviceinfo[$m]["Price_Min"]/100,2);
                        $serviceinfo[$m]["Price_Max"]=number_format( $serviceinfo[$m]["Price_Max"]/100,2);
                    }
                    $res[$k]["service_resn"]=$serviceinfo;


                    //获取当前的约单日志 最新一条
                    $log=Db::table("log")
                       ->where("ActionCode",2)
                        ->whereOr("ActionCode",3)
                        ->where("RelatedId",$res[$k]["ReservationId"])
                        ->order("ActTime desc")
                        ->field(["Actions","ActionCode","ActTime"])
                        ->find();
                    if(count($log)>0){
                        $res[$k]["logActions"]=$log["Actions"];
                        $res[$k]["logActTime"]=date("Y-m-d H:i",strtotime($log["ActTime"]));
                    }

                }
                $dataArr1[$i]["reservationlist"]=$res;
            }
            $dataArr1[$i]["reservationlistLen"]=count($res);
            $dataArr1[$i]["date"]=$dateArr[$i];//2019-08-20

            $dataArr1[$i]["month"]=intval(explode("-",$dateArr[$i])[1]);//月
            $dataArr1[$i]["day"]=intval(explode("-",$dateArr[$i])[2]);;//日

            //查看当前技师当前日期是否是全天休息还是全天上班
            //先通过查看 当前日期 schedule 表 ReservationId=0是否有这个记录 有的话代表技师设置了全体休息
            $ifSleepRes=Db::table("schedule")->where(["StaffId"=>$staffId,"PickDate"=>$dateArr[$i]])->select();

            //获取到每一个日期 技师已经约出去的时间和休息时间
            if(count($ifSleepRes)==0){
                $dataArr1[$i]["ifRest"]=1;//全天上班
                $dataArr1[$i]["scheduleArr"]=[];
            }else{
                //今天有休息时间段
                $dataArr1[$i]["ifRest"]=0;
                for($j = 0; $j < count($ifSleepRes); $j++){
                    $ifSleepRes[$j]["StartTime"]=substr($ifSleepRes[$j]["StartTime"],0,5);
                    $ifSleepRes[$j]["EndTime"]=substr($ifSleepRes[$j]["EndTime"],0,5);
                }
                $dataArr1[$i]["scheduleArr"]=$ifSleepRes;///通过ReservationId 是否等于0来判断是休息还是服务时间
            }
            //技师的上下班时间
            $dataArr1[$i]["startTime"]=substr($staffWorkTime["WorkStartTime"],0,5);
            $dataArr1[$i]["endTime"]=substr($staffWorkTime["WorkEndTime"],0,5);


        }
//

//        print_r($dataArr1);
//        exit;
        echo returnData(1,$dataArr1);
        exit;


    }



    /**
     *通过约单获取服务项目 通过约单获取晒单
     * 当前方法是显示在技师约单 约单状态为5 的页面中
     * 显示约单下的所有服务项目和每一个服务项目的顾客技师的晒单
     */
    public function getServiceresnAndPokerByReservation(){
            //需要得到当前的约单id
//        $instance = Request::instance();
//        $param = $instance->param();
//        $reservationId=$param["reservationId"];//约单id
        $reservationId=20;
        //当前约单对应的技师id 顾客id 最终成交价 隶属机构id
        $res=Db::table("reservation")
            ->where("ReservationId",$reservationId)
            ->field(["ReservationId","StaffId","CustomerId","PriceFinal","FirmId"])
            ->find();
        $res["PriceFinal"]=number_format( $res["PriceFinal"]/100,2);
        $res1=Db::table("service_resn")
            ->where("ReservationId",$reservationId)
            ->field(["RESNId","StaffPoker","CUSTPoker","ServiceId","ServiceName","SubCat"])
            ->select();

        $res2=Db::table("poker")
              ->where("ReservationId",$reservationId)
            ->field(["ID","ReservationId","RESNId","Comment","Star","Province","StaffPic","CustomerPic"])
            ->select();
        for($i=0;$i<count($res2);$i++){
            $res2[$i]["StaffPic"]=json_decode($res2[$i]["StaffPic"],true);
            $res2[$i]["CustomerPic"]=json_decode($res2[$i]["CustomerPic"],true);
        }
        if (count($res2)!=0){
            for($i=0;$i<count($res1);$i++){
                for($j=0;$j<count($res2);$j++){
                    if ($res1[$i]["RESNId"]==$res2[$j]["RESNId"]){
                        //如果对应的服务项目有晒单的话就会有poker这个键
                        $res1[$i]["Poker"]=$res2[$j];
                    }
                }
            }
        }
        $res["service_resn"]=$res1;

//        print_r($res);
//        exit;
        echo returnData(1,$res);
        exit;
    }






    //检查ReservationStatus 约单状态
    public function checkReservationStatus(){
        $instance = Request::instance();
        $param = $instance->param();
        $reservationId=$param["reservationId"];//约单id
        //status为1时 判断当前时间大于预约时间则自动跳转状态3
        $res=Db::table("reservation")->where("ReservationId",$reservationId)->field(["PickDate","StartTime","Status"])->find();
        $startTime=$res["StartTime"];//约单预约开始时间
        $pickDate=$res["PickDate"];//预约的日期
        $pickdatetime=$pickDate." ".$startTime;
        $pickdatetime1=strtotime($pickdatetime);
        $currenttime=time();//当前时间
        $status=$res["Status"];//当前约单的状态
        if($currenttime>$pickdatetime1 && $status==1){
            //修改状态为3
            $res1=Db::table("reservation")->where("ReservationId",$reservationId)->update(["Status"=>3]);
            if($res1){
                echo returnData(1,3);
                exit;
            }
        }else{
            echo returnData(1,$status);
            exit;
        }

    }



    /**
     *获取约单中的技师
     */
    public function getStaffInReservation()
    {
        $instance = Request::instance();
        $param = $instance->param();

        if(isset($param['staffId']) && isset($param['userLng']) && isset($param['userLat'])){


            $staffId = $param['staffId'];   // 技师id
            $userLat = $param['userLat'];
            $userLng = $param['userLng'];
//            $staffId = 113; $userLat = 39.90469; $userLng = 116.40717;
            $firmId = Db::table('user')->where('UserId','=',$staffId)->field('FirmId')->find();
            $firmInfo = Db::table('firm')->where('ID','=',$firmId['FirmId'])->field(['FirmName','FirmAddr','Staffs','Lat','Lng','Certificated'])->find();
            $sql="select ID,ROUND(
        6378.138 * 2 * ASIN(SQRT(POW(SIN(($userLat * PI() / 180 - Lat * PI() / 180) / 2),2) + COS($userLat * PI() / 180) * COS(Lat * PI() / 180) * POW( SIN(( $userLng * PI() / 180 - Lng * PI() / 180 ) / 2),  2) )) * 1000) AS distance from firm where ID=".$firmId['FirmId'];
            $firmdata=Db::query($sql);
            $dis=number_format($firmdata[0]["distance"]/1000,1);
            $firmInfo['dis'] = $dis;
            $firmInfo['staffId'] = $staffId;
            echo returnData(1,$firmInfo);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 获取约单中的技师
     *
     * 预约成功之后，s，获取status为0,1tatus=1的页面下,2,3,4,5的约单
     *
     * status  =  [0,1,2,3]
     *
     * uid   =  1;
     */
    public function getReservation(){
        $request = Request::instance();
        $param = $request->param();
        if(isset($param['userId']) && isset($param['status'])){
            $userId = $param['userId'];     // 用户id
            $status = $param['status'];    // 请求指定状态中的约单信息
            $data = Db::table('reservation')->where('CustomerId','=',$userId)->where('Status','in',$status)->select();
            if(count($data) > 0){
                echo returnData(1,'约单信息为空');
                exit;
            }else{
                echo returnData(2,$data);
                exit;
            }
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 加入购物车：数据库表  service_resn     需要的数据：用户id，技师id，服务信息，机构id
     */
    public function addServiceRESN(){

        $request = Request::instance();
        $param = $request->param();


        if(isset($param['userId']) && isset($param['service']) && isset($param['staffId']) && isset($param['firmId'])){
            $userId = $param['userId'];
            $service = $param['service'];
            $staffId= $param['staffId'];
            $firmId = $param['firmId'];
//            print_r($service);
//            echo $userId."----".$service['ServiceId']."---".$staffId."---".$firmId;

            $data = [
                'StaffId'          =>          $staffId,
                'CustomerId'          =>          $userId,
                'ServiceId'          =>          $service['ServiceId'],
                'FirmId'          =>          $firmId,
                'ServiceName'          =>         $service['ServiceName'],
                'SubCat'          =>         $service['SubCat'],
                'ServiceSub'          =>         $service['ServiceSub'],
                'MainCat'          =>         $service['MainCat'],
                'Price_Min'        =>          $service['Price_Min']*100,
                'Price_Max'        =>          $service['Price_Max']*100,
                'Duration'         =>          $service['Duration'],
                'UsedCount'        =>          $service['UsedCount'],
                'CreateTime'       =>          date('Y-m-d H:i:s')
            ];
//            echo "添加一个新的服务";
//            print_r($data);
            $resId = Db::table('service_resn')->insertGetId($data);
//            $count = Db::table('service_resn')->where('CustomerId','=',$userId)->field('count(RESNId) count')->find();

            if($resId > 0 ){
                //resnid 头像  是否认证
                $otherInfo = Db::table('user')->where('UserId','=',$staffId)->field(['Avatar','Certificated'])->select();
                $data['RESNId'] = $resId;
                $data['avatar'] = $otherInfo[0]['Avatar'];
                $data['certificated'] = $otherInfo[0]['Certificated'];
                $data['Price_Min']=number_format( $data['Price_Min']/100,2);

                echo returnData(1,$data);
                exit;
            }else{

                echo returnData(0,'添加购物车失败');
                exit;
            }
        }else{

            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     *新建约单-服务项目    加入购物车    未用到
     */
    public function addServiceRESN1()
    {
        // 需要的参数 ： userId 用户id   serviceId  服务id  staffId  技师id
        $request = Request::instance();
        $param = $request->param();
        if(isset($param['userId']) && isset($param['serviceId']) && isset($param['staffId'])){
            $userId = $param['userId'];   //用户id
            $serviceId = $param['serviceId'];   //服务id
            $staffId = $param['staffId'];  // 技师id
            $data = [
                'StaffId'      =>        $staffId,
                'CustomerId'      =>        $userId,
                'ServiceId'      =>        $serviceId,
                'CreateTime'      =>        date('Y-m-d H:i;s')

            ];
            $res = Db::table('service_resn')->insert($data);
            if($res > 0){
                echo returnData(1,'success');
                exit;
            }else{
                echo returnData(0,'加入约单失败');
                exit;
            }
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     *移除没有预约成功的约单中的服务项目- 移除约单中的服务
     *
     */
    public function delServiceRESN()
    {
        // 需要的参数 ： userId 用户id   serviceId  服务id  staffId  技师id
        $request = Request::instance();
        $param = $request->param();
        if(isset($param['resnId'])){
            $resnId = $param['resnId'];
            $res = Db::table('service_resn')->where('RESNId','=',$resnId)->delete();
            if($res > 0){
                echo returnData(1,'success');
                exit;
            }else{
                echo returnData(0,'删除约单失败');
                exit;
            }
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     *删除约单-删除未确认的约单   删除所有该用户在该技师的所有服务
     */
    public function delReservation()
    {
        // 需要的参数   用户 userId   技师id   staffId
        $request = Request::instance();
        $param = $request->param();
        if(isset($param['userId']) && isset($param['staffId'])){
            $userId = $param['userId'];   //用户id
            $staffId = $param['staffId'];  // 技师id
            //
            $where = [
                ['StaffId','=',$staffId],
                ['CustomerId','=',$userId],
                ['ReservationId','=',0]
            ];
            $res = Db::table('service_resn')->where($where)->delete();
            if($res > 0){
                echo returnData(1,'success');
                exit;
            }else{
                echo returnData(0,'删除约单失败');
                exit;
            }
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }

    }

    /**
     *  确认约单中的约单   相当于是预约    要修改约单表中的ReservationId
     *  预约的操作：
     * 1、	验证时间区间，技师是否空闲 schedule表
     *
     * 2、	关联读取Service_RESN和Service，取得服务项目，计算最小意向服务价格；
     *
     * 3、	通过promoteId查询采用的优惠活动，计算最小意向交易价格
     *
     * 4、	reservation表增加一条记录
     *
     * 5、	取得最新ID后，更新Service_RESN表和Status字段，及插入服务项目详情（快照）;
     *
     * 6、	技师时间安排表schedule新增记录
     */
    public function comfirmServiceRESN()
    {
//                $start = "13:00:01";
//        $end = "14:00:00";
//        $day = "2019-09-21";
//        $userId = 115;
//        $staffId = 115;
//        $promoteId = [1,2,3];
//        $finalPrice = 155;
//        $resnIds   = [7,8];
        $instance = Request::instance();
        $param = $instance->param();

        if(isset($param['start_time'])
            &&
            isset($param['end_time'])
            &&
            isset($param['day'])
            &&
            isset($param['staffId'])
            &&
            isset($param['userId'])
            &&
            isset($param['promoteId'])
            &&
            isset($param['finalPrice'])
            &&
            isset($param['resnIds'])

        ){

            $start = $param['start_time'];  // 开始时间   时：分：秒     string    12:00:01
            $end = $param['end_time'];  // 结束时间     时：分：秒      string   12:00:01
            $day = $param['day'];   //日期   年-月-日      string    2019-09-21
            $userId = $param['userId'];  // 用户id      number
            $staffId = $param['staffId'];   // 技师id
            $promoteId = $param['promoteId'];   //选取的优惠活动项目ID   array
            $finalPrice = $param['finalPrice'];   // 最终价格    单位： 分
            $resnIds = $param['resnIds'];      // 购物车提交的所有的约单id    array
            $isFree = false;    // 标记时间安排是否合适

            $minPrice = Db::table('service_resn')
            ->where('StaffId','=',$staffId)
            ->where('CustomerId','=',$userId)
            ->field('sum(Price_Min) minPrice')
            ->find();

            ////////// 以上是请求的参数 /////////////////////
            $customerStartDate = strtotime($day." ".$start);  // 顾客提交的完整开始时间戳
            $customerEndDate =strtotime($day." ".$end); // 顾客提交的完整结束时间戳
            // 将提交的开始时间和结束时间与当前的时间戳和七天之后的时间戳进行比较，
            $now = time();
            $nowDay = date("Y-m-d");
            $sevenDay =  date('Y-m-d', strtotime("$nowDay+6 days")); //保留年-月-日
            // 七天之后的晚上十二点的时间戳
            $sevenDay2 = strtotime("$sevenDay 23:59:59");

            // 提交的时间戳必须在现在和七天之后的晚上十二点之间才符合实际
            if($customerStartDate < $now ){
                echo returnData(0,'提交的时间不符合实际');
                exit;
            }
            if($customerEndDate > $sevenDay2){
                echo returnData(0,'提交的时间不符合实际');
                exit;
            }
            if($customerStartDate >= $customerEndDate){
                echo returnData(0,'提交的时间参数不正确');
                exit;
            }
            // 得到时间表 schedule 表中该技师的所有时间
            $data = Db::table('schedule')->where("StaffId",'=',$staffId)->select();
            //得到技师的上班时间和下班时间
            $workTime = Db::table('user')->where('UserId','=',$staffId)->field(['WorkStartTime','WorkEndTime'])->find();
            $workStartTime = $workTime['WorkStartTime'];   // 上班时间
            $workEndTime = $workTime['WorkEndTime'];     // 下班时间
            if(count($data) == 0){
                // 得到技师的上班时间和下班时间
                if(strtotime($workStartTime) <= strtotime($start) && strtotime($workEndTime) >= strtotime($end)){
                    $isFree = true;
                }else{
                    echo returnData(0,'预约时间不在技师工作时间之内');
                    exit;
                }
            }else{

            }
            // 如果提交的时间和存在的时间存在交集，则预约失败
            for($i =0;$i<count($data);$i++){
                $item = $data[$i];
                $staffStart = strtotime($item['PickDate']." ".$item['StartTime']);
                $staffEnd = strtotime($item['PickDate']." ".$item['EndTime']);
                $pickDate = $item['PickDate'];
                $ReservationId = $item['ReservationId'];   // 约单号，如果为0，表示技师不上班

                if( $day == $pickDate){
                    if($ReservationId != 0){
                        if($customerStartDate > $staffEnd || $customerEndDate < $staffStart){
//                            echo "OK";
                            $isFree = true;
                        }
                    }else{
                        echo returnData(0,'技师在'.$day."不上班");
                        exit;
                    }

                }
            }
            if($isFree){
                // 时间安排没有问题
                // 最小意向服务价格
                // 启动事务
                Db::startTrans();
                try{

                // 约单表插入的数据
                $resData = [
                    "StaffId"        =>     $staffId,
                    "CustomerId"     =>     $userId,
                    "PriceTotal"     =>     $minPrice['minPrice'],
                    "PriceFinal"     =>     $finalPrice,
                    "Status"         =>     1,
                    "StartTime"      =>     $start,
                    "EndTime"        =>     $end,
                    "PickDate"       =>     $day,
                    "PromoteItemId"  =>     implode($promoteId,','),
                    "workStartTime"  =>     $workStartTime,
                    "workEndTime"    =>     $workEndTime,
                    "CreateTime"     =>     date("Y-m-d H:i:s")
                ];

                $reservationId = Db::table('reservation')
                    ->insertGetId($resData);
                if($reservationId > 0){
//                    取得最新ID后，更新Service_RESN表和Status字段，及插入服务项目详情（快照）;
                    $pro = implode($promoteId,',');
                    $a = Db::table('service_resn')
                        ->where('RESNId','in',$resnIds)
                        ->update(['ReservationId' => $reservationId,'PromoteId' => $pro]);
                    // 6、	技师时间安排表schedule新增记录
                    // 时间安排表新增的记录
                    $timeData = [
                        "StaffId"               =>       $staffId,
                        "ReservationId"         =>       $reservationId,
                        "StartTime"             =>       $start,
                        "EndTime"               =>       $end,
                        "PickDate"              =>       $day
                    ];
                    $b = Db::table('schedule')->insert($timeData);
                    if($a > 0){
                        if($b > 0){

                        }else{
                            throw new \Exception('预预约失败，技师时间表更新完成');
                        }
                    }else{
                        throw new \Exception('预约失败，更新service_resn表失败');
                    }

                }else{
                    throw new \Exception('预约失败，写入约单信息失败');
                }

                     // 提交事务
                Db::commit();
                echo returnData(1,'预约成功');
                exit;
                } catch (\Exception $e) {
                        dump($e->getMessage());
                        // 回滚事务
                        Db::rollback();
                }
            }else{
                echo returnData(0,$day.$start."-".$day.$end."和技师的工作时间冲突");
                exit;
            }

        }else{
            echo returnData(0,'提交的数据不能为空');
            exit;
        }
    }


    /**
     *获取约单信息  获取指定用户 ， 没有确认的约单信息，同时获取技师头像，并根据技师进行分组
     */
    public function getReservationById()
    {
        $instance = Request::instance();
        $param = $instance->param();
        if(isset($param['uid'])){
            $userId = $param['uid'];
            // 读取信息  StaffId    ServiceName    Price_Min      Price_Max     Duration
            $reservation = Db::table('service_resn')
                ->where('CustomerId','=',$userId)
                ->where('ReservationId','=',0)
                ->field(['RESNId','StaffId','ServiceName','Price_Min','Price_Max','Duration'])
                ->select();
            if(count($reservation) == 0){
                echo returnData(1,'约单信息为空');
                exit;
            }
            for($i =0;$i<count($reservation);$i++){
                // 将最低价和最高价保留两位小数
                $item = $reservation[$i];
                $price_min =number_format( $item['Price_Min']/100,2);
                $price_max =number_format( $item['Price_Max']/100,2);

                $staffId = $item['StaffId'];
                $avatar = Db::table('user')->where('UserId','=',$staffId)->field(['Avatar','NickName','Satisfection','Certificated'])->find();
                $reservation[$i]['avatar'] = $avatar['Avatar'];
                $reservation[$i]['nickName'] = $avatar['NickName'];
                $reservation[$i]['satisfection'] = $avatar['Satisfection'];
                $reservation[$i]['certificated'] = $avatar['Certificated'];
                $reservation[$i]['Price_Min'] = $price_min;
                $reservation[$i]['Price_Max'] =$price_max;
            }
            echo returnData(1,$reservation);
            exit;

        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }



    //通过顾客id 查看是否为老顾客 并且他总消费的金额 reservation 表 PriceFinal最终成交价
    public function getCurrentCustomerTypeAndAllcost(){
        $instance = Request::instance();
        $param = $instance->param();
        $customerId=$param["customerId"];//顾客id
        $firmId=$param["firmId"];//机构id
        $res=Db::table("reservation")
            ->where(["CustomerId"=>$customerId,"FirmId"=>$firmId])
            ->where('Status>=5 AND Status<=7') ////////5-7 都是代表顾客已经支付约单
            ->field(["PriceFinal"])
            ->select();
        $count=count($res);
        $res1=[];
        if($count>=1){
            $allcost=0;
            //老顾客必须消费2笔
            for($i=0;$i<$count;$i++){
                //转换为元 并且保留两位小数
                $allcost+=number_format( $res[$i]["PriceFinal"]/100,2);
            }

            $res1["count"]=$count;//消费了多少笔
            $res1["allcost"]=number_format( $allcost,2); //总消费
        }

        // 数组为空的话  代表不是老顾客
        echo returnData(1,$res1);
        exit;
    }



    //技师约单中 当约单状态为2时需要的数据
    //请求参数 reservationId 约单id
    public function getReservationDataFromStatusTwo(){
        $instance = Request::instance();
        $param = $instance->param();
        $reservationId=$param["reservationId"];//约单id

        //读取约单表  和 优惠表  机构表
        //约单价格 优惠项目子id 机构id
        $res=Db::table("reservation")
            ->where("ReservationId",$reservationId)
            ->field(["PriceTotal","PromoteItemId","FirmId"])
            ->find();
        //sprintf("%.2f",($reservation[$i]["Price_Min"]/100));
        $res["PriceTotal"]=sprintf("%.2f",($res["PriceTotal"]/100));
         $PromoteItemIdArr=explode(",",$res["PromoteItemId"]);//字符串1,2格式
        $res1=Db::table("promote_item")->where("ItemId","in",$PromoteItemIdArr)->field(["ItemId","PromoteType","Discount"])->select();
        for($i=0;$i<count($res1);$i++){
            if($res1[$i]["PromoteType"]==3){
                //
                $res1[$i]["Discounts"]=explode("&",$res1[$i]["Discount"]);
            }
        }
        $res["Promotedesc"]=$res1;
        //读出机构的佣金比
        $firmRakeoff=Db::table("firm")->where("ID",$res["FirmId"])->field(["Rakeoff"])->find()["Rakeoff"];
        $res["Rakeoff"]=$firmRakeoff;
        echo returnData(1,$res);
        exit;
    }


    //技师约单中 状态为2点击请顾客约单时 进入的方法
    //type: 1, //为1需要更新 PromoteItemId
    //        payMessage: payMessage,
    //        reservationId: reservationId
    //
    public function upReservationStatusFromStatusTwo(){
        $instance = Request::instance();
        $param = $instance->param();
        $ReservationId=$param["reservationId"]; //约单id
        $payMessage=$param["payMessage"]; //技师价格说明
        $type=$param["type"]; ////为1需要更新 PromoteItemId
//        print_r($param);
//        exit;
        //更新数据库
        if($type==1){
            $updata=[
                "PromoteItemId"=>"",
                "Status"=>4,
                "PayMessage"=>$payMessage
            ];
            $res=Db::table('reservation')->where('ReservationId', $ReservationId)->update($updata);
        }else{
            $updata1=[
                "Status"=>4,
                "PayMessage"=>$payMessage
            ];
            $res=Db::table('reservation')->where('ReservationId', $ReservationId)->update($updata1);
        }


        if(!$res){
            echo returnData(0,'更新失败');
            exit;
        }
        echo returnData(1,'更新成功');
        exit;


    }


    //更新约单表的 技师简短留言字段
    public function upReservationShortmsg(){
        $instance = Request::instance();
        $param = $instance->param();
        $ReservationId=$param["reservationId"]; //约单id
        $shortmsg=$param["shortmsg"]; //简短留言内容
        //更新数据库
        $res=Db::table('reservation')->where('ReservationId', $ReservationId)->update(['Shortmsg' =>$shortmsg]);
        if(!$res){
            echo returnData(0,'更新失败');
            exit;
        }
        echo returnData(1,'更新成功');
        exit;
    }


    //技师约单 状态为3 验证判断当前时间是否大于预约时间30分钟
    //checkTimeFromStatusThree
    public function checkTimeFromStatusThree(){
        $instance = Request::instance();
        $param = $instance->param();
        $ReservationId=$param["reservationId"]; //约单id
        //status为3时 判断当前时间是否大于预约时间30分钟
        $res=Db::table("reservation")->where("ReservationId",$ReservationId)->field(["PickDate","StartTime"])->find();
        $startTime=$res["StartTime"];//约单预约开始时间
        $pickDate=$res["PickDate"];//预约的日期
        $pickdatetime=$pickDate." ".$startTime;
        $pickdatetime1=strtotime($pickdatetime);
        $currenttime=time();//当前时间
        $poortime=$currenttime-$pickdatetime1;
        if ($poortime>30*60){
            echo returnData(1,"当前时间已经超过预约时间30分钟");
            exit;
        }else{
            echo returnData(0,"当前时间还没超过预约时间30分钟");
            exit;
        }

    }

    //更新用户的爽约数+1 更新约单状态为超时取消
    //请求参数：顾客id   customerId
    public function updUserIncPigeonCUSTandStatus(){
        //
        $request=Request::instance();
        $data=$request->param();
        $customerId=$data["customerId"];//顾客id
        $ReservationId=$data["reservationId"]; //约单id
       


        // 启动事务
        Db::startTrans();
        try {
            //第一步
            //更新 reservation 表的 Status 字段 表示超时取消
           $res=Db::table('reservation')->where('ReservationId', $ReservationId)->update(['Status' =>10]);
            //第二步
            //更新表的字段 爽约数 PigeonCUST
            $res1=Db::table('user')->where('UserId', $customerId)->setInc('PigeonCUST');//作为顾客的爽约数加1

            // 提交事务
            Db::commit();
            echo returnData(1, "取消约单成功");
            exit;
        } catch (\Exception $e) {
            echo returnData(0, "取消约单失败");
            exit;
            // 回滚事务
            Db::rollback();
        }
    }

    /**
     * 约单首页
     */
    public function getAllInfo(){
//        21 19 20
        $instance = Request::instance();
        $param = $instance->param();
        if(isset($param['uid']) && isset($param['userLng']) && isset($param['userLat'])){
            $userId = $param['uid'];   // 用户id
            $userLat = $param['userLat'];
            $userLng =  $param['userLng'];
//        $userId = 115; $userLat = 39.953690;  $userLng = 116.813599;
            // 读取信息  StaffId    ServiceName    Price_Min      Price_Max     Duration
            // service_resn 表中 服务的相关信息读取的是
//            $reservation0 = Db::table('service_resn')
//                ->join("service","service_resn.ServiceId=service.ServiceId")
//                ->where('CustomerId','=',$userId)
//                ->where('ReservationId','=',0)
//                ->field(['service_resn.RESNId','service_resn.StaffId','service_resn.ServiceName','service_resn.Price_Min','service_resn.Price_Max','service_resn.Duration','service_resn.ServiceSub','service_resn.UsedCount',"service_resn.ReservationId","service.Pic","service.Discription"])
//                ->select();
//            print_r($reservation0);

            //进行中的数据读取  约单表
//            $reservation1=Db::table('service_resn')
//                ->join("service","service_resn.ServiceId=service.ServiceId")
//                ->join("reservation","reservation.ReservationId=reservation.ReservationId")
//                ->where('service_resn.ReservationId','>',0)
//                ->field(['service_resn.RESNId','service_resn.StaffId','service_resn.ServiceName','service_resn.Price_Min','service_resn.Price_Max','service_resn.Duration','service_resn.ServiceSub','service_resn.UsedCount',"service_resn.ReservationId","service.Pic","service.Discription"])
//                ->select();

//            print_r($reservation1);

//            $reservation2=array_merge($reservation0,$reservation1);
            $reservation2 = Db::table('service_resn')
                ->join("service","service_resn.ServiceId=service.ServiceId")
                ->where('CustomerId','=',$userId)
                ->where('ReservationId','=',0)
                ->field(['service_resn.RESNId','service_resn.StaffId','service_resn.ServiceName','service_resn.Price_Min','service_resn.Price_Max','service_resn.Duration','service_resn.ServiceSub','service_resn.UsedCount',"service_resn.ReservationId","service.Pic","service.Discription"])
                ->select();


//            print_r($tempArr);

            if(count($reservation2) == 0){
                echo returnData('0','约单信息为空');
                exit;
            }

            //通过技师的不同拆分成多个数组
            $reservation=[];  //获取满足条件的所有数据
            foreach ($reservation2 as $key => $info)
            {
                // 将最低价和最高价保留两位小数getFirmById
                $info["Price_Min"]=sprintf("%.2f",($info["Price_Min"]/100));
                $info["Price_Max"]=sprintf("%.2f",($info["Price_Max"]/100));


                $reservation[$info['StaffId']][] = $info;
            }
            foreach ($reservation as $key =>$info){
                //读取当前技师没空的时间
                $arranageTime = Db::table('schedule')->where('StaffId','=',$key)->select();
                //技师按照日前再分组
//                foreach ($arranageTime as $key1 =>$value){
//                    $arranageTime[$value['PickDate']][]=$value;
//                }

                //读取当前技师的信息
                $avatar = Db::table('user')->where('UserId','=',$key)->field(['Avatar as avatar','NickName as nickName','Satisfection as satisfection','Certificated as certificated','WorkStartTime','WorkEndTime'])->find();

//                echo "当前用户id=".$userId;

                //得到机构的信息
                // 获取机构信息
                $staffId = $key;
//            $staffId = 113; $userLat = 39.90469; $userLng = 116.40717;
                $firmId = Db::table('user')->where('UserId','=',$staffId)->field('FirmId')->find();
                $firmInfo = Db::table('firm')->where('ID','=',$firmId['FirmId'])->field(['FirmName','FirmType','FirmAddr','Staffs','Lat','Lng','Certificated'])->find();
                $sql="select ID,ROUND(
        6378.138 * 2 * ASIN(SQRT(POW(SIN(($userLat * PI() / 180 - Lat * PI() / 180) / 2),2) + COS($userLat * PI() / 180) * COS(Lat * PI() / 180) * POW( SIN(( $userLng * PI() / 180 - Lng * PI() / 180 ) / 2),  2) )) * 1000) AS distance from firm where ID=".$firmId['FirmId'];
                $firmdata=Db::query($sql);
                $dis=number_format($firmdata[0]["distance"]/1000,1);
                $firmInfo['dis'] = $dis;
                $firmInfo['staffId'] = $staffId;
                $firmInfo['firmId']=$firmId['FirmId'];
//                $firmInfo['Satisfection'] = $firmId['Satisfection'];
//                $reservation[$j]['firmInfo'] = $firmInfo;
////////////////////////////获取这个用户在这个机构下面是否是新老顾客///////////////////////

                $consumption = Db::table('reservation')
                    ->where('CustomerId','=',$userId)
                    ->where('Status','=',5)
                    ->where('firmId','=',$firmInfo['firmId'])
                    ->count();
//                echo "当前机构的id=".$firmInfo['firmId']."----数据=".$consumption;
//                $reservation[$j]['consumption']=$consumption>=1?"true":"false";




                $temp=[
                    "reservation"=>$info,
                    "arrangeTime"=>$arranageTime,
                    "staffinfo"=>$avatar,
                    "firmInfo"=>$firmInfo,
                    "consumption"=>$consumption>0?"true":"false"

                ];
                $reservation[$key]=$temp;

            }

            $_temp=[];
            foreach ($reservation as $key =>$value){
//                $value["firmId"]=$key;
                $_temp[]=$value;
            }


//        print_r($_temp);
            echo returnData(1,$_temp);
            exit;
//
        }else{
            echo returnData('0','请求参数不能为空');
            exit;
        }
    }

    /**
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     * 通过firmId 和总价格计算出使用哪个优惠以及最后优惠的价格
     */
    public function getAlternative(){
        $request = Request::instance();
        $param = $request->param();
        $firmId=$param["firmId"];
        $allMoney=$param["allMoney"];
        $uid=$param["uid"];
        print_r($param);
        /////////////////////////////////读取当前机构 下的活动开始时间《现在时间的所有优惠

        $promoteList=[];
        $promote=Db::table('promote')
            ->join("promote_item","promote.PromoteId=promote_item.PromoteId")
            ->where("promote.FirmId",$firmId)
            ->where("promote.EndTime",">= time",date("Y-m-d H:i:s"))
            ->select();


        foreach ($promote as $key =>$item){
            $promoteList[$item["PromoteId"]][]=$item;
        }
        print_r($promoteList);

        ////得对应的所有的优惠活动 然后遍历开始得出优惠最大的数据
        /// $promoteList
        $alternative=[];   //记录每一个优惠的价格 存到数组中

        foreach ($promoteList as $i =>$value){
            //计算每一个优惠活动的最大值
            //得到每一个优惠是叠加还是不叠加
            $alternative[$i]=[];
            $item=$promoteList[$i];
            $currentalternative=$item[0]["alternative"];
            echo $i."----".$currentalternative;
            print_r($item);
            echo "<br>";
            for ($j=0;$j<count($item);$j++){
                $item1=$item[$j];
                print_r($item1);
                if($item1["PromoteType"]==0){
                    //单笔折扣
                    $everyPromote=[
                        "money"=>$allMoney*((100-$item1["Discount"])*0.01),
                        "bigIndex"=>$i,
                        "smallIndex"=>$j,
                        "title"=>$item1["Title"]
                    ];
                    print_r($everyPromote);
                    echo "<br />";
                    $alternative[$i]["promote"]["zhekou"][]=$everyPromote;
                }else if($item1["PromoteType"]==1){
                    //首单折扣
                    //先看当前用户是否属于当前机构的首单用户
                    $reservCount= Db::table('reservation')
                        ->where('CustomerId','=',$uid)
                        ->count();
                    if($reservCount==0){
                        //说明当前用户属于首单
                        $everyPromote=[
                            "money"=>$allMoney*((100-$item1["Discount"])*0.01),
                            "bigIndex"=>$i,
                            "smallIndex"=>$j,
                            "title"=>$item1["Title"]
                        ];
                        $alternative[$i]["promote"]["zhekou"][]=$everyPromote;
                    }

                }else if ($item1["PromoteType"]==2){
                    //熟客折扣
                    //先看当前用户是否属于当前机构的首单用户
                    $reservCount= Db::table('reservation')
                        ->where('CustomerId','=',$uid)
                        ->count();
                    if($reservCount>0){
                        //说明当前用户属于熟客
                        $everyPromote=[
                            "money"=>$allMoney*((100-$item1["Discount"])*0.01),
                            "bigIndex"=>$i,
                            "smallIndex"=>$j,
                            "title"=>$item1["Title"],
                            "pro"=>$item1["Discount"]
                        ];
                        $alternative[$i]["promote"]["zhekou"][]=$everyPromote;
                    }
                }else if($item1["PromoteType"]==3){
                    //单笔满减
                    $moneyArr=explode("&",$item1["Discount"]);
                    if($moneyArr[0]<$allMoney){
                        $everyPromote=[
                            "money"=>$moneyArr[1],
                            "bigIndex"=>$i,
                            "smallIndex"=>$j,
                            "title"=>$item1["Title"],
                            "pro"=>$item1["Discount"]
                        ];
                        $alternative[$i]["promote"]["manjian"][]=$everyPromote;
                    }

                }
            }
            echo "<br>";
            echo "-----打印alternative数组";
            print_r($alternative);
            echo "<br>";
            echo "结束";

            if($currentalternative==0){
                //不叠加
                //得到当前所有优惠列表 进行叠加
                $max=0;
                $maxArr=[];
                if($alternative[$i]["promote"]["manjian"]){

                    //////////满减
                    foreach ($alternative[$i]["promote"]["manjian"] as $key =>$value){
                        if($max<$value["money"]){
                            $max=$value["money"];
                            $maxArr=$value;
                        }
                    }

                }
                if($alternative[$i]["promote"]["zhekou"]){
                    /////////折扣
                    foreach ($alternative[$i]["promote"]["zhekou"] as $key =>$value){
                        if($max<$value["money"]){
                            $max=$value["money"];
                            $maxArr=$value;
                        }
                    }
                    $alternative[$i]["max"]=$max;
                    $alternative[$i]["maxArr"]=$maxArr;
                }


                //////////////////



            }else{
                //=1 叠加

                if($alternative[$i]["promote"]["manjian"]){
                    //////////满减
                    $allmoney1=0;
                    $max=0;
                    $maxmanjian=[];
                    $zhekou=[];
                    foreach ($alternative[$i]["promote"]["manjian"] as $key =>$value){
                        if($max<$value["money"]){
                            $max=$value["money"];
                            $maxmanjian=$value;
                            $allmoney1+=$max;
                            $maxmanjian=$alternative[$i]["promote"]["manjian"];
                        }
                    }

                }
                if($alternative[$i]["promote"]["zhekou"]){
                    /////////折扣
                    foreach ($alternative[$i]["promote"]["zhekou"] as $key =>$value){

                        $allmoney1+=$value["money"];
                        $zhekou[]=$alternative[$i]["promote"]["zhekou"];
                    }
                    $alternative[$i]["max"]=$allmoney1;
                    $alternative[$i]["maxArr"]=[$maxmanjian,$zhekou];
                }
            }

        }
//        ob_clean();
//        print_r($alternative);
        return returnData(0,$alternative);
        exit;
    }

    /**
     *修改约单
     */
    public function updReservationById()
    {
        $request = Request::instance();
        $param = $request->param();
        if(isset($param['status']) && isset($param['resnId']) && isset($param['type'])){
            $type = $param['type'];   // 操作类型
            $status = $param['status'];  // 状态
            $resnId = $param['resnId'];  // 用户id
            if($status == 1){
                // 操作类型有：取消约单，改期，我已到店
                $isFail = true;
                if($type == 1){

                    // 取消约单 修改status=8，修改技师的时间安排（将时间表中reservation=$resnId 的数据删除）
                    Db::startTrans();
                    try{
                        Db::table('reservation')->where('ReservationId','=',$resnId)->update(['Status'=>8]);
                        Db::table('schedule')->where('ReservationId','=',$resnId)->delete();
                        // 提交事务
                        Db::commit();
                    } catch (\Exception $e) {
                        // 回滚事务
                        Db::rollback();
                        $isFail = false;
                    }
                    if($isFail){
                        echo returnData(1,"取消约单成功");
                        exit;
                    }else{
                        echo returnData(0,"取消约单失败");
                        exit;
                    }



                }else if($type == 2){
                    // 改期

                }else if($type == 3){
                    // 我已到店，等待服务
                    $a = Db::table('reservation')->where('ReservationId','=',$resnId)->update(['status'=>2]);
                    if($a > 0){
                        echo returnData(1,"成功");
                        exit;
                    }else{
                        echo returnData(0,"失败");
                        exit;
                    }
                }

            }else if($status == 2){
                if($type == 4){
//                    到店24小时，技师没有发起支付，约单自动取消，约单超时
                    $staffId = $param['staffId'];
                    $res = true;
                    Db::startTrans();
                    try{
                        $r = Db::table('reservation')->where('ReservationId','=',$resnId)->update(['status'=>10]);
                        // 修改用户表   作为技师爽约数加1
                        $u = Db::table('user')->where('UserId','=',$staffId)->setInc('PigeonCUST');
                        // 提交事务
                        Db::commit();
                    } catch (\Exception $e) {
                        // 回滚事务
                        Db::rollback();
                        $res = false;
                    }

                    if($res){
                        echo returnData(1,'success');
                        exit;
                    }else{
                        echo returnData(0,'出现未知错误');
                        exit;
                    }
                }
            }else if($status == 3){
                // 超时通知
            }else if($status == 4){
                if($type == 5){
                    // 拒付
                    Db::table('reservation')->where('ReservationId','=',$resnId)->update(['status'=>7]);
                }
            }else if($status == 5){
                // 支付成功
                Db::table('reservation')->where('ReservationId','=',$resnId)->update(['status'=>6]);
            }
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }
    /**
     *约单二维码
     */
    public function getReservaton2Dcode()
    {

    }
    /**
     *技师未读的约单
     * //通过查看技师约单除了已读的约单 的条数
     */
    public function unReadReservation()
    {
        $instance = Request::instance();
        $data = $instance->param();
        $staffId=$data["staffId"];//技师id
        //先读出约单已读表中技师已读的约单id 组成数组
        $res1=Db::table("reservation_read")->where("StaffId",$staffId)->field(["ReservationId"])->select();
        if (count($res1)!=0){
            $arr=[];
            for ($i=0;$i<count($res1);$i++){
                 $arr[]=$res1[$i]["ReservationId"];
            }

            $count=Db::table("reservation")->where("StaffId",$staffId)->where("ReservationId","not in",$arr)->count();
        }else{
            $count=Db::table("reservation")->where("StaffId",$staffId)->count();
        }

        echo returnData(1,$count);
        exit;

    }

    /**
     *新增技师已读记录
     */
    public function newReadReservation()
    {
        $instance = Request::instance();
        $param = $instance->param();
        $staffId=$param["staffId"];//技师id
        $reservationId=$param["reservationId"];//约单id

        $count=Db::table("reservation_read")->where(["StaffId"=>$staffId,"ReservationId"=>$reservationId])->count();
        if($count==0){
            ////写入数据库
            $insertData=[
                "StaffId"=>$staffId,
                "ReservationId"=>$reservationId,
                "CreateTime"=>date("Y-m-d H:i:s")
            ];
            $res=Db::table("reservation_read")->insert($insertData);
            if(!$res){
                echo returnData(0,"已读失败");
                exit;
            }
            echo returnData(1,"已读成功");
            exit;
        }else{
            echo returnData(2,"已经已读约单了");
            exit;
        }
    }

    /**
     *当前用户与机构成功交易数
     */
    public function CountMyReservation()
    {

    }

    /**
     * 移除约单    移除这个用户在这个技师下面的所有约单
     */
    public function delRESN(){
        $instance = Request::instance();
        $param = $instance->param();
        if(isset($param['userId']) && isset($param['staffId'])){
            $userId = intval($param['userId']);
            $staffId = intval($param['staffId']);
            $res = Db::table('service_resn')->where('StaffId','=',$staffId)->where('CustomerId','=',$userId)->delete();
            if($res > 0 ){
                echo returnData(1,"约单删除成功");
                exit;
            }else{
                echo returnData(0,"没有可以删除的约单");
                exit;
            }
        }else{
            echo returnData(0,"请求参数不能为空");
            exit;
        }
    }

    /**
     * 移除约单    移除这个用户在这个技师下面的指定的订单
     */
    public function delRESNById(){
        $instance = Request::instance();
        $param = $instance->param();
        if(isset($param['RESNId'])){
            $RESNId = intval($param['RESNId']);
            $res = Db::table('service_resn')->where('RESNId','=',$RESNId)->delete();
            if($res > 0 ){
                echo returnData(1,"约单删除成功");
                exit;
            }else{
                echo returnData(0,"没有可以删除的约单");
                exit;
            }
        }else{
            echo returnData(0,"请求参数不能为空");
            exit;
        }
    }

    /**
     * 得到机构的优惠活动
     *
     */
    public function getPromote($firmId){
        //通过allRecod参数 获取对应的活动
        $res=Db::table("promote")
            ->alias("p1")
            ->join("promote_item p2","p1.PromoteId=p2.PromoteId")
            ->group("p1.PromoteId")
            ->where("p1.FirmId",$firmId)
            ->order("p1.EffectiveDate desc")
            ->field(["p1.*","group_concat(p2.PromoteType) PromoteTypes","group_concat(p2.Discount) Discounts"])
            ->select();
        if($res==false){
            //echo "为空";
            return [];
        }
        for ($i=0;$i<count($res);$i++){
            $PromoteTypes=explode(",",$res[$i]["PromoteTypes"]);
            $Discounts=explode(",",$res[$i]["Discounts"]);
            //$res[$i]["status"]=1;
            $now=time();//现在的时间戳
            //$allRecod 0：进行中优惠活动，1：全部优惠活动。
            ////未开始
            if($now<strtotime($res[$i]["EffectiveDate"])){
                //echo $now."未开始"."seq=".$i."---".strtotime($res[$i]["EffectiveDate"])."<br>";
                //未开始算出还有几天开始
                $days=ceil((strtotime($res[$i]["EffectiveDate"])-$now)/60/60/24);
                //结束时间-生效时间的天数和小时数
                $poorDays=floor((strtotime($res[$i]["EndTime"])-strtotime($res[$i]["EffectiveDate"]))/86400);
                //echo "相差天数：".$poorDays."天<br><br>";
                $poorHours=floor((strtotime($res[$i]["EndTime"])-strtotime($res[$i]["EffectiveDate"]))%86400/3600);
                //echo "相差小时数：".$poorHours."小时<br><br>";
                $res[$i]["status"]=[
                    "type"=>0,//标记未开始
                    "day"=>$days
                ];
                $res[$i]["poorTime"]=[
                    "day"=>$poorDays,
                    "hour"=>$poorHours,
                ];
                /////////结束
            }elseif ($now>strtotime($res[$i]["EndTime"])){
                //echo $now."结束".strtotime($res[$i]["EndTime"])."<br>";
                //结束
                $res[$i]["status"]=[
                    "type"=>-1,//标记结束
                    "day"=>-1
                ];
                $res[$i]["poorTime"]=[
                    "day"=>-1,
                    "hour"=>-1,
                ];
                //////////////进行中
            }elseif ($now<=strtotime($res[$i]["EndTime"]) && $now>=strtotime($res[$i]["EffectiveDate"])){
                //echo $now."进行中".strtotime($res[$i]["EndTime"])."----".strtotime($res[$i]["EffectiveDate"])."<br>";
                //进行中 算出还有几天结束
                $days=ceil((strtotime($res[$i]["EndTime"])-$now)/60/60/24);
                //结束时间-当前时间的天数和小时数
                $poorDays=floor((strtotime($res[$i]["EndTime"])-$now)/86400);
                //echo "相差天数：".$poorDays."天<br><br>";
                $poorHours=floor((strtotime($res[$i]["EndTime"])-$now)%86400/3600);
                //echo "相差小时数：".$poorHours."小时<br><br>";

                $res[$i]["status"]=[
                    "type"=>1,//标记进行中
                    "day"=>$days
                ];
                $res[$i]["poorTime"]=[
                    "day"=>$poorDays,
                    "hour"=>$poorHours,
                ];
            }
            for ($j=0;$j<count($PromoteTypes);$j++){
                if ($PromoteTypes[$j]!=3){
                    $Discounts1=$Discounts[$j];//百分比的格式折扣
                    $Discounts[$j]=intval($Discounts[$j])/10;//需要转换为几折
                }else{
                    $Discounts[$j]=explode("&",$Discounts[$j]);
                    $Discounts1=$Discounts[$j];
                }
                $res[$i]["itemActivity"][$j]=[
                    "type"=> $PromoteTypes[$j],
                    "sale"=> $Discounts[$j],//几折
                    "sales"=> $Discounts1,
                ];
            }
            $res[$i]["EffectiveDate"]=date("Y-m-d H:i",strtotime($res[$i]["EffectiveDate"]));
            $res[$i]["EndTime"]=date("Y-m-d H:i",strtotime($res[$i]["EndTime"]));
        }
        return $res;
    }

    /**
     * 约单首页模态框 需要的数据
     */
    public function getCurStaffService(){
        $cat = Db::table('servicecat')->where('Pid','=',0)->select();
        $request = Request::instance();
        $param = $request->param();
        if(isset($param['firmId'])){
            $firmId = $param['firmId'];
            $service = Db::table('service')->where('FirmId','=',$firmId)->where('PullOff','=',0)->select();
            $res = compact('cat','service');
            echo returnData(0,$res);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }


}
