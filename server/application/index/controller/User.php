<?php
namespace app\index\controller;
use think\Db;
use think\Request;
//顾客/技师类
class User
{
    /**
     *获取技师基本信息 servicecat 、user表
     * 请求参数：UserId 技师ID（用户ID）
     */
    public function getStaffById()
    {
        $request=Request::instance();
        $data=$request->param();
        //通过参数获取晒单数据
        if (!isset($data["UserId"])){
            echo returnData(0,"UserId参数不能为空");
            exit;
        }
        $UserId= $data["UserId"];//技师ID（用户ID）
        //通过userid获取user表中技师的信息
        $res=Db::table("user")
            ->where("UserId",$UserId)
            ->field(["NickName","FirmId","Certificated","Experience","Satisfection","Followers Fans","Diary","WorkLike","Skill","WorkStartTime","WorkEndTime","IdPic","Avatar","PersonPic","EducationPic"])
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
    ///////////////////////////////没写完//////////////////////////////
    public function getUser2Dcode()
    {
        $request=Request::instance();
        $data=$request->param();
        //通过参数获取晒单数据
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
        //通过参数获取晒单数据
        if (!isset($data["FirmId"])){
            echo returnData(0,"FirmId参数不能为空");
            exit;
        }
        $Min=isset($data["Min"]) ? $data["Min"] : 0;//请求的开始序号  索引值
        $Max=isset($data["Max"]) ? $data["Max"] : 3;//请求的结束序号
        $FirmId= $data["FirmId"];//机构ID
        //通过机构id获取当前机构下所有技师信息
        $res=Db::table("user")
            ->where("FirmId",$FirmId)
            ->field(["UserId StaffId","NickName","Certificated","Experience","Satisfection","Followers Fans","Diary","WorkLike","Skill","WorkStartTime","WorkEndTime","Avatar"])
            ->order(['LastLoginTime'=>'desc'])
            ->limit($Min,$Max-$Min+1)
            ->select();

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
        //通过参数获取晒单数据
        if (!isset($data["ServiceId"])){
            echo returnData(0,"ServiceId参数不能为空");
            exit;
        }
        $ServiceId= $data["ServiceId"];//服务项目ID
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
            ->field(["UserId StaffId","NickName","Certificated","Experience","Satisfection","Followers Fans","Diary","WorkLike","Skill","WorkStartTime","WorkEndTime","Avatar"])
            ->select();
//        print_r($res1);
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
        }
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
//       print_r($res);
//        exit;
        echo returnData(1,$res);
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
        //通过参数获取晒单数据
        if (!isset($data["UserId"])){
            echo returnData(0,"UserId参数不能为空");
            exit;
        }
        $UserId= $data["UserId"];//顾客ID（用户ID）
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
     * 请求参数：
     * UserId	Y	int	顾客ID（用户ID），不能为空
        NickName	N	string	昵称
        Gender	N	int	性别。0：女，1男
        FirmId	N	int	退出机构时置0
        WorkStartTime	N	string	技师每日上班时间
        WorkEndTime	N	string	技师每日下班时间
        Entry	N	int	0：顾客端，1：技师端
        Diary	N	int	（原有基础上）日记动态增加数。一般为1
        PigeonStaff	N	int	鸽子数。(原有基础上)技师爽约增加数。一般为1
        PigeonCUST	N	int	鸽子数。(原有基础上)顾客爽约增加数。一般为1
     */
    ///////////////////先留着  得简写代码/////////////////////////////
    public function updUser()
    {
        $request=Request::instance();
        $data=$request->param();
        //print_r($data);
        if (!isset($data["UserId"])){
            echo returnData(0,"UserId参数不能为空");
            exit;
        }
        $UserId= $data["UserId"];//顾客ID（用户ID）
      //得到键 值
        if (isset($data["NickName"])){
            $NickName=$data["NickName"];
            //用户修改昵称了 更新user表的 NickName 字段
            $res=Db::table('user')->where('UserId', $UserId)->update(['NickName' => $NickName]);
        }
        if (isset($data["Gender"])){
            $Gender=$data["Gender"];
            $res=Db::table('user')->where('UserId', $UserId)->update(['Gender' => $Gender]);
        }
        if (isset($data["FirmId"])){
            $FirmId=$data["FirmId"];
            $res=Db::table('user')->where('UserId', $UserId)->update(['FirmId' => 0]);//退出机构
        }
        if (isset($data["WorkStartTime"])){
            $WorkStartTime=$data["WorkStartTime"];
            $res=Db::table('user')->where('UserId', $UserId)->update(['WorkStartTime' => $WorkStartTime]);
        }
        if (isset($data["WorkEndTime"])){
            $WorkEndTime=$data["WorkEndTime"];
            $res=Db::table('user')->where('UserId', $UserId)->update(['WorkEndTime' => $WorkEndTime]);
        }
        if (isset($data["Entry"])){
            $Entry=$data["Entry"];
            $res=Db::table('user')->where('UserId', $UserId)->update(['Entry' => $Entry]);
        }
        if (isset($data["Diary"])){
            $Diary=$data["Diary"];
            $res=Db::table('user')->where('UserId', $UserId)->setInc('Diary', $Diary);
        }
        if (isset($data["PigeonStaff"])){
            $PigeonStaff=$data["PigeonStaff"];//一般加1
            $res=Db::table('user')->where('UserId', $UserId)->setInc('PigeonStaff', $PigeonStaff);
        }
        if (isset($data["PigeonCUST"])){
            $PigeonCUST=$data["PigeonCUST"];//一般加1
            $res=Db::table('user')->where('UserId', $UserId)->setInc('PigeonCUST', $PigeonCUST);
        }

        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }

        echo returnData(1,$res);
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
        if (!isset($data["StaffId"])){
            echo returnData(0,"UserId参数不能为空");
            exit;
        }
        if (!isset($data["PickDateStart"])){
            echo returnData(0,"PickDateStart参数不能为空");
            exit;
        }
        $StaffId=$data["StaffId"];//技师ID（用户ID）
        $PickDateStart=$data["PickDateStart"];//需要查询的开始日期 格式：2019-08-01
        if (!isset($data["PickDateEnd"])){
           $PickDateEnd="";//不存在就赋值为空  为空表示仅使用PickDateStart日期
            $res=Db::table("schedule")
                ->where(["PickDate"=>$PickDateStart,"StaffId"=>$StaffId])
                ->field(["group_concat(ReservationId) ReservationId","group_concat(StartTime) StartTime","group_concat(EndTime) EndTime","PickDate"])
                ->group("PickDate")
                ->select();
        }else{
            //存在
            $PickDateEnd=$data["PickDateEnd"];
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
                $StartTime=$res[$i]["StartTime"][$j];
                $EndTime=$res[$i]["EndTime"][$j];
                $arr[$j]["ReservationId"]=$ReservationId;
                $arr[$j]["StartTime"]=$StartTime;
                $arr[$j]["EndTime"]=$EndTime;
                $res[$i]["timein"]=$arr;

            }
        }
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
     *新建技师时间安排 2表查询：schedule,user
     * 请求参数：StaffId  ReservationId(N) StartTime EndTime PickDate
      需先检查技师上下班时间，新建的时间区间不能与当日已有时间区间重叠
     * 思路：在新建技师安排时，就可以看到今天技师的安排时间区间了 已经有了就已经不能选择了
     * 那就可以不需要这两步查询了？？？？
     * 返回参数：ScheId 安排表ID
     */
    public function newScheduleToStaff()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["StaffId"])  ||   !isset($data["StartTime"]) || !isset($data["EndTime"]) || !isset($data["PickDate"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }
        $StaffId=$data["StaffId"];
        $StartTime=$data["StartTime"];
        $EndTime=$data["EndTime"];
        $PickDate=$data["PickDate"];
       $ReservationId=isset($data["ReservationId"]) ? $data["ReservationId"] : 0;
       //添加一条数据 schedule表
        $data=[
            "StaffId"=>$StaffId,
            "ReservationId"=>$ReservationId,
            "StartTime"=>$StartTime,
            "EndTime"=>$EndTime,
            "PickDate"=>$PickDate
        ];
        $resid=Db::table("schedule")->insertGetId($data);//获取刚刚写入的自增id
//        $resData=[
//            "ScheId"=>$resid
//        ];

        if (!$resid){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$resid);
        exit;
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
     *关注/取关技师
     * 请求参数：
     */
    public function FollowStaff()
    {

    }

    /**
     *检查当前用户是否关注技师
     */
    public function checkFollow()
    {

    }


    /**
     *获取关注的技师
     */
    public function getStaffsByFollow()
    {

    }

    /**
     *获取技师业务数据周统计
     */
    public function getStatisticsStaff()
    {

    }

    /**
     *统计关注的技师总数
     */
    public function countStaffByFollow()
    {

    }
    /**
     *转移/获取机构管理权
     */
    public function transAdmin()
    {

    }
    /**
     *成员进出管理
     */
    public function manageMember()
    {

    }

    /**
     *获取技师认证信息
     */
    public function getCertStaff()
    {

    }
    /**
     *新建和修改技师认证
     */
    public function saveCertStaff()
    {

    }


}
