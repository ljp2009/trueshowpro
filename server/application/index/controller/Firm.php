<?php
namespace app\index\controller;
//机构类
use think\Controller;
use think\Db;
use think\Request;
class Firm  extends Controller
{
    private $addDis = 500000000000000;//单位 km 扩大的公里数

    /**
     *获取附近机构
     * 1、获取用户地理位置坐标（微信）
     * 2、按距离参数查找附近机构，结果按最后更新时间排序，为空或不足数量则扩大50km范围重查
     * （营业状态=1，负责人Manager !="" ，技师数staffs>1,晒单数DealPoker>1）,读取数量不大于200，最多扩大范围查3次
     *  $userlat--用户纬度,$userlng--用户经度,$km---用户选择的距离 单位km
     */
    public function FirmNearby($userlat, $userlng, $distance)
    {
        ////按照用户的当前位置的经纬度 距离 $km之内的机构信息
        $sql1 = $this->bulidSqlFromFirmNearby($userlat, $userlng, $distance * 1000);
        $firm_list = Db::query($sql1);
        $count1 = count($firm_list);
        if ($count1 < 200) {
            //重新扩大范围查询
            $dis = ($distance + $this->addDis) * 1000;
            $sql2 = $this->bulidSqlFromFirmNearby($userlat, $userlng, $dis);
            $firm_list = Db::query($sql2);
            $count2 = count($firm_list);


            /////记得修改成200
            if ($count2 < 200) {
                //还要扩大范围查询
                $dis1 = ($distance + 2 * $this->addDis) * 1000;
                $sql3 = $this->bulidSqlFromFirmNearby($userlat, $userlng, $dis1);
                $firm_list = Db::query($sql3);

            }
        }
        return $firm_list;
    }


    public function bulidSqlFromFirmNearby($userlat, $userlng, $distance)
    {
//            $sql="select *, ROUND(
//        6378.138 * 2 * ASIN(
//            SQRT(
//                POW(
//                    SIN(
//                        (
//                            $userlat * PI() / 180 - Lat * PI() / 180
//                        ) / 2
//                    ),
//                    2
//                ) + COS($userlat * PI() / 180) * COS(Lat * PI() / 180) * POW(
//                    SIN(
//                        (
//                            $userlng * PI() / 180 - Lng * PI() / 180
//                        ) / 2
//                    ),
//                    2
//                )
//            )
//        ) * 1000
//    ) AS distance from firm where  Status=1 and Manager!='' and Staffs>1 and DealPoker>1 having distance<$distance order by LastUpdate desc";
        $sql = "select *, ROUND(
        6378.138 * 2 * ASIN(SQRT( POW( SIN( (   $userlat * PI() / 180 - Lat * PI() / 180  ) / 2 ),  2 ) + COS($userlat * PI() / 180) * COS(Lat * PI() / 180) * POW( SIN( ( $userlng * PI() / 180 - Lng * PI() / 180  ) / 2 ),  2 )  ) ) * 1000 ) AS distance
         from firm  having distance<$distance order by LastUpdate desc";
        return $sql;
    }


    //返回数据
    public function returmData(){
        $filepath="static/tempfile/pcas-code.json";
        $data=file_get_contents($filepath);
        echo $data;
    }



    /**
     *获取机构基本信息 （2表查询：Firm ,promote）
     * 请求参数：机构id Lng经度  Lat纬度
     */
    public function getFirmById()
    {
        $request = Request::instance();
        $data = $request->param();
        if (!isset($data["firmId"]) || !isset($data["lng"]) || !isset($data["lat"])) {
                echo returnData(0, "参数不能为空");
                exit;
        }
        $firmId = $data["firmId"];//机构ID
        $longitude = $data["lng"];//经度
        $latitude = $data["lat"];//纬度
        $res = Db::table("firm")
            ->field(["*", " ROUND(6378.138*2*ASIN(SQRT(POW(SIN(($latitude*PI()/180-Lat*PI()/180)/2),2)+COS($latitude*PI()/180)*COS(Lat*PI()/180)*POW(SIN(($longitude*PI()/180-Lng*PI()/180)/2),2)))*1000) Distance"])
            ->where(["ID" => $firmId])
            ->find();
        $res["ServiceMainCat"]=explode(",",$res["ServiceMainCat"]);
        $seqArr=Db::table("servicecat")->where("Seq","in",$res["ServiceMainCat"])->field(["Seq","Name"])->select();
//        for($i=0;$i<count($res["ServiceMainCat"]);$i++){
//            $res["ServiceMainCat"][$i]["seq"]= $res["ServiceMainCat"][$i];
//            $res["ServiceMainCat"][$i]["name"]=$seqArr["Name"][$i];
//        }
        $res["MainCatAndName"]=$seqArr;
        //返回的距离 单位为米
        //转换为km
        $res["Distance"]=number_format($res["Distance"]/1000,1);
        $res["pic"]=json_decode($res["pic"],true);
        //ServiceMainCat

//         print_r($res);
//         exit;
        if (!$res) {
            echo returnData(0, "出错了");
            exit;
        }
        echo returnData(1, $res);
        exit;
    }


    /**
     *获取机构简介信息 （1表查询：Firm ）
     * 请求参数：机构id
     * 返回参数：
     * Discription    string    机构简介
     * pic    string    机构简介图片。图片上传和保存方案待定
     */
    public function getDescInFirm()
    {
        $request = Request::instance();
        $data = $request->param();
        if (!isset($data["FirmId"])) {
            echo returnData(0, "FirmId参数不能为空");
            exit;
        }
        $FirmId = $data["FirmId"];//机构ID
        $res = Db::table("firm")->where("ID", $FirmId)->field(["Discription", "pic"])->find();
        //$res["pic"]=json_decode($res["pic"],true);
//        print_r($res);
//        exit;
        // 获取该机构的最新三条修改记录
        $logs = Db::table('log')->where('RelatedId',$FirmId)->limit(3)->order('Id desc')->select();
        $res['log'] = $logs;
        if (!$res) {
            echo returnData(0, "出错了");
            exit;
        }
        echo returnData(1, $res);
        exit;
    }

    /**
     *搜索机构 （2表查询：Firm ,User）
     *搜索机构全称、简称，返回有包含关键词的结果
     */
    public function searchFirm()
    {
        $request = Request::instance();
        $data = $request->param();
        if (!isset($data["Keyword"])) {
            echo returnData(0, "Keyword参数不能为空");
            exit;
        }
        $Keyword = $data["Keyword"];//搜索关键词
        $Min = isset($data["Min"]) ? $data["Min"] : 0;//请求的开始序号  索引值
        $Max = isset($data["Max"]) ? $data["Max"] : 19;//请求的结束序号
        $res = Db::table("firm")
            ->alias("f")
            ->join("user u", "f.Manager=u.UserId", "left")
            ->field(["f.ID", "f.FirmName", "f.FirmTitle", "f.Certificated", "f.Lng", "f.Lat", "f.Province", "f.City", "f.District", "f.FirmAddr", "u.RealName Manager", "u.Mobile"])
            ->where('f.FirmName|f.FirmTitle', 'like', '%' . $Keyword . '%')
            ->limit($Min, $Max - $Min + 1)
            ->select();
        $len = count($res);
        for ($i = 0; $i < $len; $i++) {
            //替换字符串的子串
            //负责人手机号（星号代替5-8位）1380****358
            $res[$i]["Mobile"] = substr_replace($res[$i]["Mobile"], '****', 3, 4);
        }
//        print_r($res);
//         exit;
        if (!$res) {
            echo returnData(0, "出错了");
            exit;
        }
        echo returnData(1, $res);
        exit;
    }

    /**
     *新建/保存机构基础信息
     * 新增时：更新用户表当前用户StaffLevel为负责人（3），和FirmId
     * 思路：如果ID为空即为新增一条数据 为值的话则是更新这条数据的某个数据
     * 返回参数：机构ID
     */
    public function saveFirm()
    {
        $request = Request::instance();
        $data = $request->param();
        //通过参数获取晒单数据
        if (!isset($data["UserId"]) || !isset($data["ID"]) || !isset($data["FirmName"]) || !isset($data["Province"]) || !isset($data["City"]) || !isset($data["District"]) || !isset($data["FirmAddr"])) {
            echo returnData(0, "参数不能为空");
            exit;
        }
        $UserId = $data["UserId"];//当前用户id
        $ID = $data["ID"];//机构ID。传值为空 表示新增
        $FirmName = $data["FirmName"];//机构名称
        $FirmTitle = isset($data["FirmTitle"]) ? $data["FirmTitle"] : "";//机构简称
        $Province = $data["Province"];//省
        $City = $data["City"];//市
        $District = $data["District"];//区/镇
        $Street = $data['Street'];
        $FirmAddr = $data["FirmAddr"];//街道和门牌地址
        $Lng = isset($data["Lng"]) ? $data["Lng"] : "";//经度
        $Lat = isset($data["Lat"]) ? $data["Lat"] : "";//纬度
        $data = [
            "FirmName" => $FirmName,
            "FirmTitle" => $FirmTitle,
            "Province" => $Province,
            "City" => $City,
            "District" => $District,
            "FirmAddr" => $FirmAddr,
            "Street" => $Street,
            "Manager" => $UserId,
            "Lat" => $Lat,
            "Lng" => $Lng,
        ];
        if ($ID == "") {
            //新增机构
            $data["Staffs"] = 1;

            $resfirmId = Db::table("firm")->insertGetId($data);//新增并获取到自增的机构id





            //更新用户表当前用户StaffLevel为负责人（3），和FirmId
            $res = Db::table("user")->where("UserId", $UserId)->update(["StaffLevel" => 3, "FirmId" => $resfirmId]);
            if (!$res) {
                echo returnData(0, "出错了");
                exit;
            }
            echo returnData(1, $resfirmId);
            exit;
        } else {
            //更新记录
            $res = Db::table("firm")->where("ID", $ID)->update($data);
            if (!$res) {
                echo returnData(0, "出错了");
                exit;
            }
            echo returnData(1, $ID);
            exit;
        }
    }


    //更新机构的佣金比  ///////////////////////单独的方法
    public function updateFirmRakeOff()
    {
        //机构id firmId
        //佣金比 rakeOff
        $request = Request::instance();
        $data = $request->param();
        $uid = $data["uid"];//用户id
        $nickName = $data["nickName"];//用户昵称
        $FirmId = $data["firmId"];//机构ID。
        $rakeOff = $data["rakeOff"];//佣金比
// print_r($data);
// exit;
        //先判断日志表中是否有这条记录  没有的话直接写入数据
        //有的话  判断当前时间与这条记录的创建时间相差超过72可以更新数据 小于的话不可更新
        $condition = [
            "UserId" => $uid,
            "NickName" => $nickName,
            "ActionCode" => 5,
            "RelatedId" => $FirmId,
        ];
        $readData = Db::table("log")->where($condition)->order("Id desc")->limit(0)->field(["ActTime"])->find();
        if (count($readData) > 0) {
            // 判断当前时间与这条记录的创建时间相差超过72可以更新数据 小于的话不可更新
            $nowtime = time();
            $actTime = strtotime($readData["ActTime"]);
            // echo $actTime."---".$readData["ActTime"];
            $poorHour = ($nowtime - $actTime) / 3600;//相差的小时数
//           echo $poorHour;

            if ($poorHour < 72) {
                echo returnData(-1, "修改72小时内不能再次修改!!");
                exit;
            }

        }

        // 启动事务
        Db::startTrans();
        try {
            //第一步 插入firm表
            //更新 firm 表的 Discription字段
            $res1 = Db::table("firm")->where("ID", $FirmId)->update(["Rakeoff" => $rakeOff]);
            //第二步 插入log表 //加入日志
            $logdata = [
                "UserId" => $uid,
                "NickName" => $nickName,
                "Actions" => "修改了佣金",
                "ActionCode" => 5,
                "RelatedId" => $FirmId,
                "ActTime" => date("Y-m-d H:i:s")
            ];
            $res2 = Db::table("log")->insert($logdata);
            // 提交事务
            Db::commit();
            echo returnData(1, "更新成功");
            exit;
        } catch (\Exception $e) {
            echo returnData(0, "出错了");
            // 回滚事务
            Db::rollback();
            exit;
        }


    }
//     40天服务项目流水
    public function moneyFlow(){
        $firmId=1;
        //机构id  40天内
        $nowtime=time();
       // $actTime=strtotime($readData["ActTime"]);
        $res=Db::table("finance_inc")
            ->alias("f0")
            ->join("finance_inc f1","f0.ItemsId=f1.ItemsId")
            ->where("f0.FirmId",$firmId)
            ->where("f0.Items",0)
            ->where("f1.Items",1)
            ->field(["f0.PayTime FpayTime","f0.Amount Famount","f1.Amount Rakeoffcast"])
            ->select();
       // print_r($res);

        for($i=0;$i<count($res);$i++){
            //$oldTime=strtotime($res[$i]['PayTime']);
            $charTime=$nowtime-strtotime($res[$i]['FpayTime']);   //604800 604800
            $res[$i]["Famount"]=$res[$i]["Famount"]/100;//机构收的钱 //机构的实际收的钱
            $res[$i]["Rakeoffcast"]=$res[$i]["Rakeoffcast"]/100;//佣金收的钱 平台的钱

            if($charTime>40*24*60*60){
                //40天以外的记录
                array_splice($res,$i,1);
                $i--;
            }

        }
        for($i=0;$i<count($res);$i++){
            $res[$i]["price"]=$res[$i]["Rakeoffcast"]+$res[$i]["Famount"];//当前项目的总价格
            $res[$i]["Rakeoff"]=$res[$i]["Rakeoffcast"]/$res[$i]["price"]*100;//佣金百分比
        }
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }

        echo returnData(1,$res);
        exit;
       // print_r($res);
        exit;
    }
//    佣金修改记录
    public function getFrimRakeOffLogs(){
        $request=Request::instance();
        $data=$request->param();
       // print_r($data);
        $uid=$data["uid"];//用户id
        $nickName=$data["nickName"];//用户昵称
        $FirmId= $data["firmId"];//机构ID。
        $condition=[
            "UserId"=>$uid,
            "NickName"=>$nickName,
            "ActionCode"=>5,
            "RelatedId"=>$FirmId,
        ];
        $readData=Db::table("log")->where($condition)->select();
        print_r($readData);
        for($i=0;$i<count($readData);$i++){
            $ActTime=$readData[$i]['ActTime'];   //修改时间
            echo $ActTime;

        }
        exit;
    }


    /**
     *更新机构信息
     * 1、根据请求参数更新对应字段
     * 2、增加日志记录
     */
    public function updFirm()
    {
        $request = Request::instance();
        $data = $request->param();
        if (!isset($data["FirmId"]) || !isset($data["UserId"]) || !isset($data["NickName"])) {
            echo returnData(0, "FirmId参数不能为空");
            exit;
        }
        $FirmId = $data["FirmId"];//机构ID。
        $UserId = $data["UserId"];//当前用户ID
        $NickName = $data["NickName"];//当前用户的昵称
        if (isset($data["Discription"])) {
            $Discription = $data["Discription"];//机构简介
            //更新 firm 表的 Discription字段
            $res = Db::table("firm")->where("ID", $FirmId)->update(["Discription" => $Discription]);
            //增加日志记录 ActionCode为1：修改公司简介(FirmId)， RelatedId为机构id
            $data = [
                "UserId" => $UserId,
                "NickName" => $NickName,
                "Actions" => "修改公司简介",//描述
                "ActionCode" => 1,
                "RelatedId" => $FirmId,
                "ActTime" => date("Y-m-d H:i:s")
            ];
            $res1 = Db::table("log")->insert($data);
            if ($res && $res1) {
                echo returnData(1, "操作成功");
                exit;
            }
            echo returnData(0, "失败");
            exit;
        }
////////////////////////////上传图片问题需要补////////////////////////////////////////////
        if (isset($data["Pic"])) {
            //机构图片上传和保存方案待定
        }


        if (isset($data["Status"])) {
            $Status = $data["Status"];//营业状态
            //更新 firm 表的 Status 字段
            $res = Db::table("firm")->where("ID", $FirmId)->update(["Status" => $Status]);
        }

        ////////////////////////是否需要换算一下佣金比？？？看前台传来的值决定//////////////////////////////////////////////////////
        if (isset($data["RakeOff"])) {
            $RakeOff = $data["RakeOff"];//佣金比
            //更新 firm 表的 Discription字段
            $res = Db::table("firm")->where("ID", $FirmId)->update(["Rakeoff" => $RakeOff]);
        }
        if (!$res) {
            echo returnData(0, "出错了");
            exit;
        }
        echo returnData(1, "成功");
        exit;

    }

    /**
     *新建/修改机构认证
     * 请求参数：
     *
     * FirmId    N    int    机构ID 必传 为空表示新增 必传 可空可不空
     * 机构信息
     * //CertName    N    string    认证机构名称同营业执照
     * //FirmType    N    int    机构类型。0：个体，1：企业，2：工作室  3:连锁 （工作室，连锁企业在下个版本）
     * //CertFirmID    N    int    营业执照号码
     * //Province    N    int    省
     * // City    N    int    市
     * //District    N    int    区/镇
     * //CertAddr    N    string    认证地址同营业执照
     * //CertPic   N    营业执照照片
     * 经营者信息
     * Juristic    N    string    机构负责人姓名（法人）
     * JuristicIDNo    N    string    法人身份证号
     * JuristicAddr    N    string    法人身份证地址
     * JuristicMobile    N    string    法人手机号
     * IDPic           N           法人身份证照片 正反面两张
     * JuristicGender    N    int    法人性别。0：女，1：男
     * CertStatus    N    int    认证状态：0：未认证，1：等待审核，2：等待支付，3：认证通过，4：不通过
     *
     * 返回参数：FirmId    int    机构ID
     */
    ///////////////////////////////////////还是没有写明白？？？/////////////////////////////////////////////////////////
    /// //分开写函数 分场景
    public function newCertFirm()
    {
        ////////////把第一步数据先存到缓存里 等第二步填写好了之后再统一一次写入数据库
        $request = Request::instance();
        $data = $request->param();
        if (!isset($data["FirmId"])) {
            echo returnData(0, "FirmId参数不能为空");
            exit;
        }
        //validate验证
        $validate = validate('Login');
        if (!$validate->scene("login")->check($data)) {
            // echo returnData("-1",$validate->getError());
            echo returnData("-1", "出错了");
            exit;
        }
        $FirmId = $data["FirmId"];//机构ID。
        $CertId = $data["CertId"];//认证表id 为空表示新增
        $CertName = $data["CertName"];//认证机构名称同营业执照
        $FirmType = $data["FirmType"];//机构类型。0：个体，1：企业，2：工作室  3:连锁 （工作室，连锁企业在下个版本）
        $CertFirmID = $data["CertFirmID"];//营业执照号码
        $Province = $data["Province"];//省
        $City = $data["City"];//市
        $District = $data["District"];//区/镇
        $CertAddr = $data["CertAddr"];//认证地址同营业执照。
        $CertPic = $data["CertPic"];//营业执照照片//////////////////到时候视情况改
        $Juristic = $data["Juristic"];//机构负责人姓名（法人）
        $JuristicIDNo = $data["JuristicIDNo"];//法人身份证号
        $JuristicAddr = $data["JuristicAddr"];//法人身份证地址
        $JuristicMobile = $data["JuristicMobile"];//法人手机号
        $IDPic = $data["IDPic"];//法人身份证照片 正反面两张
        $JuristicGender = $data["JuristicGender"];//法人性别。0：女，1：男
        if ($CertId == "") {
            $data1 = [
                "FirmId" => $FirmId,
                "FirmType" => $FirmType,
                "CertStatus" => 1,//等待审核
                "CertFirmID" => $CertFirmID,
                "CertName" => $CertName,
                "Province" => $Province,
                "City" => $City,
                "District" => $District,
                "CertAddr" => $CertAddr,
                "CertPic" => $CertPic,//营业执照照片///////////////////////看看是否到时候要改
                "Juristic" => $CertPic,
                "JuristicIDNo" => $JuristicIDNo,
                "JuristicAddr" => $JuristicAddr,
                "JuristicMobile" => $JuristicMobile,
                "JuristicGender" => $JuristicGender,
                "IDPic" => $IDPic//身份证照片/ 两张//////////////////////看看是否到时候要改
            ];
            //1.新增机构信息
            $res = Db::table("cert_firm")->insertGetId($data1);//新增并获取当前自增的CertId值
            if (!$res) {
                echo returnData(0, "出错了");
                exit;
            }
            echo returnData(1, $FirmId);//成功了返回机构id
            exit;
        } else {
            //修改 记录有当前firmId的数据

        }


        //审核
        //支付

    }

    /**
     *获取机构认证信息
     */
    public function getCertFirm()
    {
        //一个只是机构的认证信息  一个是后台看见的待审核的认证机构信息
        $request = Request::instance();
        $data = $request->param();
        $FirmId = isset($data["FirmId"]) ? $data["FirmId"] : "";
        if (isset($data["CertStatus"])) {
            $CertStatus = $data["CertStatus"];//认证状态
            ///////////////////////////////一条一条的滑动 应该按索引值来获取
            $res = Db::table("cert_firm")->where("CertStatus", $CertStatus)->select();
        }
        if ($FirmId != 0 || $FirmId != "") {
            //获取这条机构的认证信息
            $res = Db::table("cert_firm")->where("FirmId", $FirmId)->find();
        }

        if (!$res) {
            echo returnData(0, "出错了");
            exit;
        }
        echo returnData(1, "成功");
        exit;
    }

    /**
     *机构二维码
     */
    public function getFirm2DCode()
    {

    }

    /***
     * 图片上传测试
     *
     */
    public function testUpload()
    {
        $sql = "select * from statistices_days where to_days(Days) = to_days(now())";
        $todayData = Db::query($sql);
        if(count($todayData)>0){
            // 平台经营数据日汇总 存在今天的数据，则更新数据
            $st = [];
            $st['FirmSum'] = $todayData[0]['FirmSum']+1;
            $st['LastUpdate'] = date("Y-m-d H:i:s");
            Db::table('statistices_days')->where('Id','=',$todayData[0]['Id'])->update($st);
            echo "1111111111111111111111";
        }else{
            // 平台经营数据日汇总 不存在今天的数据，则添加数据
            $st = [];
            $st['FirmSum'] = 1;
            $st['Days'] = date("Y-m-d H:i:s");
            $st['LastUpdate'] = date("Y-m-d H:i:s");
            Db::table('statistices_days')->insert($st);
            echo "2";
        }
//        Db::table('statistices_days')
//        $request = Request::instance();
//        $data = $request->param();
//
//        //获取表单上传文件
//        $file = $request->file('file');
//        print_r($file);
//        exit;
//        $info2 = $file->validate(['size' => '815678', 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "firm");
//        if ($info2) {
//            // 存入相对路径/upload/日期/文件名
//            $image = $info2->getSaveName();
//            echo $image;
//            exit;
//        } else {
//            // 上传失败
//        }

    }

        /**
         * 获取当前用户申请中的机构
         */
        public function getApplyFirm()
        {

            $request = Request::instance();
            $data = $request->param();
            if(isset($data['uid'])){
                // 通过uid 查询该用户的FirmId
                $firmId = Db::table('user')->where('UserId',115)->field('FirmId')->find();
                $firmId = $firmId['FirmId'];
                // 然后通过这个FIrmId得到该机构的  全称  地址（包括 省，市到门牌号）  该机构的负责人，负责人的手机号



                    $res = Db::table("firm")
                        ->alias("f")
                        ->join("user u", "f.Manager=u.UserId", "left")
                        ->where('f.ID',$firmId)
                        ->field(["f.ID", "f.FirmName", "f.FirmTitle", "f.Certificated", "f.Lng", "f.Lat", "f.Province", "f.City", "f.District", "f.FirmAddr","f.Street", "u.RealName Manager", "u.Mobile"])

                        ->select();
                $res[0]["Mobile"] = substr_replace($res[0]["Mobile"], '****', 3, 4);
                // $res[0]['
//                    if($res)
                    echo returnData(1,$res);
                    exit;

            }else{
                echo returnData(0,'请求参数uid不能为空');
                exit;
            }
        }

    /**
     * 机构首页需要的数据
     */
    public function firmindex(){
        $request = Request::instance();
        $data = $request->param();
        if(isset($data['firmId'])){
            $firmId = $data['firmId'];
//            获取指定机构的信息 名字 地址 是否认证 负责人姓名 负责人电话 服务项目的数量
            $res = Db::table("firm")
                ->alias("f")
                ->join("user u", "f.Manager=u.UserId", "left")
                ->where('f.ID',$firmId)
                ->field(["f.ID", "f.FirmName", "f.FirmTitle","f.Status", "f.Certificated", "f.Lng", "f.Lat", "f.Province", "f.City", "f.District", "f.FirmAddr","f.Street", "u.RealName realName", "u.Mobile"])
                ->select();
            // 获取机构的服务项目数量
            $countService = Db::table('service')
                ->where('FirmId',$firmId)
                ->field(["count('ServiceId') serviceCount"])
                ->select();
            $res[0]["Mobile"] = substr_replace($res[0]["Mobile"], '****', 3, 4);
            $res[0]['serviceCount'] = $countService[0]['serviceCount'];
            // 获取该机构的成员数量以及申请中的成员数量
            $staffs = Db::table('user')
                ->where('FirmId',$firmId)
                ->field(["count('UserId') staffs"])
                ->find();
            $applying = Db::table('user')
                ->where('FirmId',$firmId)
                ->where('StaffLevel',1)
                ->field(['count(UserId) staffApplying'])
                ->find();
            $res[0]['staffs'] = $staffs['staffs'];
            $res[0]['staffApplying'] = $applying['staffApplying'];
            echo returnData(1,$res[0]);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 修改机构信息
     */
    public function supFirm(){
        $request = Request::instance();
        $data = $request->param();
//        FirmName    FirmTitle   Province    City   District    FirmAddr   Street   需要修改的数据库字段

        if(isset($data['firmId']) && isset($data['firmInfo'])){
            $arr = [];
            $arr['FirmName'] = $data['firmInfo']['FirmName'];
            $arr['FirmTitle'] = $data['firmInfo']['FirmTitle'];
            $arr['Province'] = $data['firmInfo']['Province'];
            $arr['City'] = $data['firmInfo']['City'];
            $arr['District'] = $data['firmInfo']['District'];
            $arr['FirmAddr'] = $data['firmInfo']['FirmAddr'];
            $arr['Street'] = $data['firmInfo']['Street'];
            $res = Db::table('firm')->where('ID',$data['firmId'])->update($arr);
            echo returnData(1,$res);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 请求分类的数据
     */
    public function getservice(){
//        $request = Request::instance();
//        $data = $request->param();
        $types = Db::table('servicecat')->select();
        array_walk($types,function(&$value,$key){
           $value['checked'] = 'false';
        });
        $res = $this->getTree($types,0);
        echo returnData(1,$res);
        exit;
    }

    /**
     * 处理分类数据为树形状
     */
    public function getTree($data, $pId)
    {
        $tree = [];
        foreach($data as $k => $v)
        {
            if($v['Pid'] == $pId)
            {        //父亲找到儿子
                $v['Pid'] = $this->getTree($data, $v['Cid']);
                $tree[] = $v;
                //unset($data[$k]);
            }
        }
        return $tree;
    }
    /**
     * 修改机构的状态 营业中，暂停营业
     *
     */
    public function upFirmStatus(){
        $instance = Request::instance();
        $param = $instance->param();
        if(!isset($param['firmId']) && !isset($param['status'])){
            echo returnData(0,'请求参数不能为空');
            exit;
        }
        $firmId = $param['firmId'];
        $status = $param['status'];
        Db::table('firm')->where('ID','=',$firmId)->update(['Status'=>$status]);
    }
    /**
     * 添加机构服务
     */
    public function addFirm(){
        $request = Request::instance();
        $data = $request->param();
        if(isset($data['info']) && isset($data['bigCat']) && isset($data['staffId']) && isset($data['smallCat']) && isset($data['serviceId']) && isset($data['savePicArr']) && isset($data['addPicArr'])) {

            $info = $data['info'];
            $bigCat = $data['bigCat'];
            $smallCat = $data['smallCat'];
            $staffId = $data['staffId'];
            $serviceId = $data['serviceId'];
            $savePicArr = $data['savePicArr']; // 用户最后确认的照片
            $addPicArr = $data['addPicArr'];  // 用户在该界面上传的所有照片
            // 删除没有用到的照片
            $picPath = ROOT_PATH . "public" . DS . "static" . DS . "images"  . DS . "service" . DS;
            for($i=0;$i<count($addPicArr);$i++){
                if(in_array($addPicArr[$i],$savePicArr)){
                }else{
                    if(file_exists($picPath.$addPicArr[$i])){
                        unlink($picPath.$addPicArr[$i]);
                    }
                }
            }
            $arr = [];
            $arr['FirmId'] = $staffId;
            $arr['ServiceName'] = $info['serviceName'];
            $arr['ServiceSub'] = $info['serviceTitle'];
            $arr['Price_Min'] = $info['lowPrice'] * 100;
            $arr['Pic'] = implode(',',$savePicArr);
            if($info['highPrice'] != ""){
                $arr['Price_Max'] = $info['highPrice'] * 100;
            }else{
                $arr['Price_Max'] = "";
            }

            $arr['Duration'] = $info['needTime'];
            $arr['Discription'] = $info['introduce'];
            $arr['MainCat'] = $bigCat;
            $arr['SubCat'] = $smallCat;
            $arr['CreateTime'] = date('Y-m-d H:i:s');
            if($serviceId != -1){
                // 修改数据
                $serviceId = $data['serviceId'];
                Db::table('service')->where('ServiceId','=',$serviceId)->update($arr);

            }else{
                // 添加数据
                $serviceId = Db::table('service')->insertGetId($arr);
            }

            echo returnData(1,$serviceId);
            exit;

        }else{
            echo returnData(0,'请求数据不能为空');
            exit;
        }
    }

    /**
     * 处理图片 ，返回图片名字
     */
    public function handServiceImg(){
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
     * 添加服务图片
     */
    public function addFirmHandleImg(){
        $request = Request::instance();
        $data = $request->param();
        if(isset($data['serviceId'])){
            $serviceId = $data['serviceId'];
            //获取表单上传文件
            $file = $request->file('serviceImage');
            $name1 = date('Ymd');
            $name2 = time().rand(100000,999999);
            $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "service" . DS .$name1, $name2);
            if ($info2) {
                // 存入相对路径/upload/日期/文件名
                $image = $info2->getSaveName();
                $picName = $name1.'/'.$image;
                // 获取数据库的数据
                $pic = Db::table('service')->where('ServiceId',$serviceId)->field(['Pic'])->find();
                if($pic['Pic'] == NULL){
                    //将名字转化成json串存入数据库
                    $picArr =$picName;
                    $str1 = json_encode($picArr);
                    Db::table('service')->where("ServiceId",$serviceId)->update(['Pic' => $str1]);
                }else{
                    // 解析数据库中的json串，变成数组，将新添加的名字放入数组中，将新数组转化成json串，存入数据库中
                    $arr = json_decode($pic['Pic']);
                    array_push($arr,$picName);
                    $str1 = json_encode($arr);
                    Db::table('service')->where("ServiceId",$serviceId)->update(['Pic' => $str1]);

                }
                echo returnData(1,'success');
                exit;
            }
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 机构简介   处理文字信息
     */
    public function firmDesText(){
        $request = Request::instance();
        $data = $request->param();
        if(isset($data['firmId']) && isset($data['des']) && isset($data['userid'])&& isset($data['savePicArr'])  && isset($data['addPicArr'])){
            $firmId = $data['firmId']; // 机构id
            $des = $data['des']; // 简介
            $savePicArr = $data['savePicArr']; // 存储到数据库的图片数组
            $addPicArr = $data['addPicArr']; // 用户上传的所有的图片，包括没有用到的图片
            $path = ROOT_PATH . 'public' . DS . 'static' . DS . 'images' . DS . 'firm' . DS;
            for($i=0;$i<count($addPicArr);$i++){
                if(in_array($addPicArr[$i],$savePicArr)){
                }else{
                    if(is_file($path.$addPicArr[$i])){
                        unlink($path.$addPicArr[$i]);
                    }
                }
            }
            $savePicStr = json_encode($savePicArr);
            Db::table('firm')->where('ID',$firmId)->update(['Discription' => $des,'pic' => $savePicStr]);
            // 添加日志
            //增加日志记录 ActionCode为1：修改公司简介(FirmId)， RelatedId为机构id
            $userId = $data['userid'];
            $NickName = $data['nickName'];
            $data = [
                "UserId" => $userId,
                "NickName" => $NickName,
                "Actions" => "修改公司简介",//描述
                "ActionCode" => 1,
                "RelatedId" => $firmId,
                "ActTime" => date("Y-m-d H:i:s")
            ];
            $res1 = Db::table("log")->insert($data);
            echo returnData(1,"success");
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 机构简介  处理图片信息
     */
    public function firmDesImg(){
        $request = Request::instance();
        $data = $request->param();
        if(isset($data['firmId']) && isset($data['isNull'])){
            //判断是否为空
            $isNull = $data['isNull'];
            $firmId = $data['firmId'];
            $key = $data['key'];
            if($isNull == 0){
                // 空数据
                $this->firmDesImgData($firmId,$key,'');
                echo returnData(0,$key.'空数据不做处理');
                exit;
            }else{
                $picName = '';
                //判断imgStr是不是存在
                if(isset($data['imgStr'])){
                    // 处理上传的图片地址
                    $imgStr = $data['imgStr'];
                    $need = 'static/images/firm/';
                    $arr = explode($need,$imgStr);
                    $imgKey = $arr[1];
                    $this->firmDesImgData($firmId,$key,$imgKey);
                    echo returnData(1,$key.'---img---'.$imgKey.'---'.'图片没有发生变化');
                    exit;
                }else{
                    // 处理上传的图片文件
                    $file = $request->file('descImg');
                    $name1 = date('Ymd');
                    $name2 = time().rand(100000,999999);
                    $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "firm" . DS .$name1, $name2);
                    if ($info2) {
                        // 存入相对路径/upload/日期/文件名
                        $image = $info2->getSaveName();
                        $picName = $name1 . '/' . $image;
                    }
                    $this->firmDesImgData($firmId,$key,$picName);
                    echo returnData(1,$key.'处理上传的图片文件'.'---'.$image.'-----'.$picName.'---'.$picName);
                    exit;
                }

            }
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     *
     */
    public function firmDesImgData($firmId,$key,$picName){
        // 操作数据库
        $dataPic = Db::table('firm')->where("ID",$firmId)->field('pic')->find();
        if($dataPic['pic'] == NULL){
            $p = [$key => $picName];
            $str1 = json_encode($p);
            Db::table('firm')->where("ID",$firmId)->update(['pic' => $str1]);
        }else{
            // 解析数据库中的json串，变成数组，将新添加的名字放入数组中，将新数组转化成json串，存入数据库中
            $arr = json_decode($dataPic['pic'],true);
            $arr[$key] = $picName;
            $str1 = json_encode($arr);
            Db::table('firm')->where("ID",$firmId)->update(['pic' => $str1]);

        }
    }


    /**
     * 获取机构成员信息
     */
    public function getMembers(){
        $request = Request::instance();
        $data = $request->param();
        if(isset($data['firmId'])){
            $firmId = $data['firmId'];
            // 通过机构id获取所有成员，包括负责人，正式成员，申请中的成员
            $memners = Db::table('user')
                ->where('StaffLevel','neq',0)
                ->where('FirmId',$firmId)
                ->field(['UserId','StaffLevel','RealName','Avatar'])
                ->select();
            $arr = [
                'wait' => [],
                'formal' => [],
                'manager' => []
            ];
            // 处理得到的数据，将三种人员分开
            foreach ($memners as $item){
                $item['isChoose'] = 0;
                if($item['StaffLevel'] == 1){
                    // 等待接入
                    array_push($arr['wait'],$item);
                }else if($item['StaffLevel'] == 2){
                    array_push($arr['formal'],$item);
                }else if($item['StaffLevel'] == 3){
                    array_push($arr['manager'],$item);
                }
            }

            echo returnData(1,$arr);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 修改成员状态
     */
    public function changeMembers(){
        $request = Request::instance();
        $data = $request->param();
        if(isset($data['firmId']) && isset($data['mlist'])){
            $firmId = $data['firmId'];
            $userIds = $data['mlist'];
            $type = $userIds[0];
            // wait    同意进入机构     formal    移除机构
            if($type == 'wait'){
                // 修改这个用户的StaffLevel为2
                array_shift($userIds);
                foreach($userIds as $item){
                    Db::table('user')->where('UserId',$item)->update(['StaffLevel'=>2]);
                }

            }else if($type == 'formal'){
                array_shift($userIds);
                foreach($userIds as $item){
                    Db::table('user')->where('UserId',$item)->update(['StaffLevel' => 0 ,'FirmId' => '']);
                }
            }else{
                echo returnData(0,'请求参数错误');
                exit;
            }
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 获取机构下的所有服务
     * 得到所有服务的时候，判断这条服务是否已经被选中
     * 技师id   机构id  服务项目id
     */
    public function getServices(){
        $request = Request::instance();
        $data = $request->param();
        if(isset($data['firmId']) && isset($data['uid'])){
            $firmId = $data['firmId'];
            $uid = $data['uid'];
           $services = Db::table('service')->where('FirmId','=',$firmId)->select();
            $checkedArr = ['checked' => 'false'];
           array_walk($services,function(&$value,$key,$a){
               $value = array_merge($value, $a);
           },$checkedArr);
           for($i =0 ; $i < count($services) ; $i++){
               $item = $services[$i];
               $services[$i]['Price_Min'] = sprintf("%.2f",($services[$i]['Price_Min']/100));
               $services[$i]['Price_Max'] = sprintf("%.2f",($services[$i]['Price_Max']/100));
               $services[$i]['thumbnail'] = json_decode($services[$i]["Pic"],true)[0];
               $serviceId = $item['ServiceId'];
               $res = Db::table('servicestaff')
                   ->where('StaffId',$uid)
                   ->where('FirmId',$firmId)
                   ->where('ServiceId',$serviceId)
                   ->find();

               if($res > 0){
                   // 存在，修改checked的值为true
                   $services[$i]['checked'] = 'true';
               }
           }
            echo returnData(0,$services);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }
    }

    /**
     * 处理图片，返回图片名字
     */
    public function handImg(){
        //获取表单上传文件
        $request = Request::instance();
        $file = $request->file('descImg');
        $name1 = date('Ymd');
        $name2 = time().rand(100000,999999);
        $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "service" . DS .$name1, $name2);
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();
            $picName = $name1 . '/' . $image;
            echo returnData(1,$picName);
            exit;
        }
    }



}
