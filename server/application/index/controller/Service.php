<?php
namespace app\index\controller;
use think\Db;
use think\Request;
//服务项目类
class Service
{
    /**
     *服务项目主分类 （1表查询，ServiceCat）
     * Range	N	int	选择全部分类或主分类。0：主分类（默认），1：全部分类
     */
    public function get()
    {
        $request=Request::instance();
        $data=$request->param();
        $Range=isset($data["Range"]) ? $data["Range"] : 0;
        if ($Range==0){
            //主分类
            $res=Db::table("servicecat")->where("Pid",0)->select();
        }else{
            //全部分类
            $res=Db::table("servicecat")->select();
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
     *项目分类
     */
    public function getServiceCat()
    {
        $request=Request::instance();
        $data=$request->param();
        //主分类
        $res=Db::table("servicecat")->where("Pid",0)->field(["Cid","Name","Seq"])->select();
        $arr=[];
      foreach ($res as $item){
          $arr[]= $item["Cid"];
      }
        //print_r($res);
        $res1=Db::table("servicecat")->where("Pid","in",$arr)->group("Pid")->field(["Pid","group_concat(Cid) Cid","group_concat(Name) Name","group_concat(Seq) Seq"])->select();
        for ($i=0;$i<count($res1);$i++){
            $res1[$i]["MainName"]=$res[$i]["Name"];
            $res1[$i]["MainSeq"]=$res[$i]["Seq"];
            $res1[$i]["Cid"]=explode(",",$res1[$i]["Cid"]);
            $res1[$i]["Name"]=explode(",",$res1[$i]["Name"]);
            $res1[$i]["Seq"]=explode(",",$res1[$i]["Seq"]);
            $arr1=[];
            for ($j=0;$j<count($res1[$i]["Cid"]);$j++){
                $arr1[$j]["Cid"]=$res1[$i]["Cid"][$j];
                $arr1[$j]["Name"]=$res1[$i]["Name"][$j];
                $arr1[$j]["Seq"]=$res1[$i]["Seq"][$j];
            }
            $res1[$i]["SubCat"]=$arr1;
        }
//        print_r($res1);
//        exit;
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res1);
        exit;

    }

    /**
     *按分类名获取机构服务项目
     * Cid	N	int	服务项目分类顺序，
        FirmId	N	int	所属机构ID。为空表示不限
        PullOff	N	int	0：上架，1：下架；默认0
        Min	N	int	请求的开始序号
        Max	N	int	请求的结束序号
     */
    public function getFirmServiceByCat(){
        $request=Request::instance();
        $data=$request->param();
        ///////////////////////////注意看到时候传过来的cid是什么类型
        $Cid=$data["Cid"];//服务项目分类顺序（例如A,B）为空表示所有分类
        $Cid=json_decode($Cid,true);
        //data的值为一个对象，传的是 FirmId和PullOff 字段--字段值
        $dataArr=json_decode($data["data"],true);//转为数组
        //var_dump($Cid);
        $Min=$data["Min"];//请求的开始序号
        $Max=$data["Max"];//请求的结束序号
        $res=Db::table("service")
            ->where($dataArr)
            ->where('MainCat','in',$Cid)
            ->limit($Min,$Max-$Min+1)->field(["ServiceId","ServiceName","ServiceSub","MainCat","SubCat","Price_Min","Price_Max","Duration","UsedCount","Pic MainPic"])
        ->select();
        for ($i=0;$i<count($res);$i++){
            $res[$i]["MainPic"]=json_decode($res[$i]["MainPic"],true)["MainPic"];
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
     *按分类名获取技师服务项目
     *   *  Cid	N	int	服务项目分类顺序，，（例如A,B）为空表示所有分类
            StaffId	N	int	技师ID。为空表示不限。（后端通过ServiceStaff表查询该技师名下所有服务项目ID）
            FirmId	N	int	所属机构ID。为空表示不限
            PullOff	N	int	0：上架，1：下架；默认0
            Min	N	int	请求的开始序号
            Max	N	int	请求的结束序号
     */
    public function getStaffServiceByCat(){
        //记住要传技师id和他隶属的机构id
        //查询出这个技师擅长的主分类顺序
        $request=Request::instance();
        $data=$request->param();
        $Cid=$data["Cid"];//服务项目分类顺序（例如A,B）为空表示所有分类
        $Cid=json_decode($Cid,true);
        $StaffId=$data["StaffId"];//技师ID。为空表示不限。（后端通过ServiceStaff表查询该技师名下所有服务项目ID）
        $FirmId=$data["FirmId"];//所属机构ID。为空表示不限
        $PullOff=isset($data["PullOff"]) ? $data["PullOff"] : 0;//	0：上架，1：下架；默认0
        $Min=$data["Min"];//请求的开始序号
        $Max=$data["Max"];//请求的结束序号
        //技师擅长的所有分类
        $res=Db::table("service")
            ->alias("s")
            ->join("servicestaff ss","s.FirmId=ss.FirmId")
            ->where("s.MainCat","in",$Cid)
            ->where(["ss.StaffId"=>$StaffId,"s.PullOff"=>$PullOff])
            ->limit($Min,$Max-$Min+1)
            ->field(["s.ServiceId","s.ServiceName","s.ServiceSub","s.MainCat","s.SubCat","s.Price_Min","s.Price_Max","s.Duration","s.UsedCount","s.Pic MainPic"])
            ->select();
        for ($i=0;$i<count($res);$i++){
            $res[$i]["MainPic"]=json_decode($res[$i]["MainPic"],true)["MainPic"];
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
     *获取服务项目
     */
    public function getServiceById()
    {
      //FirmId  ServiceId
        //先判断 该机构是否正常营业
        $request=Request::instance();
        $data=$request->param();
        $FirmId=$data["FirmId"];//所属机构ID。
        $ServiceId=$data["ServiceId"];//服务项目ID 表的id
        $res1=Db::table("firm")->where("ID",$FirmId)->where("Status","<>",1)->count();
        if ($res1>0){
            //不正常经营
            //需要修改当前的服务项目 PullOff为1 下架
            $res1=Db::table("service")->where("ServiceId",$ServiceId)->update(["PullOff"=>1]);
        }

        $res=Db::table("service")->where("ServiceId",$ServiceId)->find();
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
     *增加/保存服务项目
     * ServiceId	N	int	服务项目ID。为空表示新增
    FirmId			隶属机构
    ServiceName			服务项目名称
    ServiceSub			服务项目副标题
    MainCat			分类代码
    SubCat			子分类代码
    Price_Min			最低价格
    Price_Max			最高价格
    Duration			服务时长，分钟
    Discription			服务项目描述
    Pic			图片上传和保存方案待定

     */
    public function saveService()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["data"]) || !isset($data["UserId"])|| !isset($data["NickName"])){
            echo returnData(0,"data参数不能为空");
            exit;
        }
        $UserId=$data["UserId"];//用户id
        $NickName=$data["NickName"];//用户昵称
        $dataArr=json_decode($data["data"],true);//除了ServiceId 和CreateTime的其他字段和字段值
        //图片看 到时候的布局情况再修改

        $ServiceId=isset($dataArr["ServiceId"]) ? $dataArr["ServiceId"] :"";//服务项目ID
        //接收主分类的顺序  eg：A,B
        $MainCat=$dataArr["MainCat"];//主分类代码
        $FirmId=$dataArr["FirmId"];//隶属机构
        $currentTime=date("Y-m-d H:i:s");
        $dataArr["CreateTime"]=$currentTime;
        $MainCated=Db::table("firm")->where("ID",$FirmId)->value("ServiceMainCat");//机构已经有的主分类代码
        $datalog=[
            "UserId"=>$UserId,
            "NickName"=>$NickName,
            "ActionCode"=>4,
            "ActTime"=>date("Y-m-d H:i:s",$currentTime)
        ];
        // 启动事务
        Db::startTrans();
        try{
            if(strpos($MainCated,$MainCat) === false){
                $CurrentMainCat=$MainCated.$MainCat;
                //不包含 把机构表中当前主分类写入
                $res1=Db::table("firm")->where("ID",$FirmId)->update(["ServiceMainCat"=>$CurrentMainCat]);
            }
            //写入日志 新建或者修改
            if ($ServiceId==""){
                //新建记录
                $resId=Db::table("service")->insertGetId($dataArr);//获取刚刚插入的自增id
                $ServiceId=$resId;
                //写入日志
                $datalog["Actions"]="新建";
                $datalog["RelatedId"]=$ServiceId;
                $res2=Db::table("log")->insert($datalog);
            }else{
                //修改
                $res=Db::table("service")->where("ServiceId",$ServiceId)->update($dataArr);
                //写入日志
                $datalog["Actions"]="修改";
                $datalog["RelatedId"]=$ServiceId;
                $datalog=[
                    "UserId"=>$UserId,
                    "NickName"=>$NickName,
                    "Actions"=>"修改",
                    "ActionCode"=>4,
                    "RelatedId"=>$ServiceId,
                    "ActTime"=>date("Y-m-d H:i:s")
                ];
                $res2=Db::table("log")->insert($datalog);
            }
            // 提交事务
            Db::commit();
            echo returnData(1,$ServiceId);
            exit;
        } catch (\Exception $e) {
            echo returnData(0,"出错了");
            // 回滚事务
            Db::rollback();
            exit;
        }



    }

    /**
     *服务项目上架/下架
     * 同时更新对应机构表，增加/修改对应机构的ServiceMainCat。（下架操作需查表统计分类）
     * 请求参数：
             参数	必选	类型	说明
        ServiceId	Y	int	服务项目ID
        PullOff	Y	int	0：上架，1：下架
     */
    public function arrangeService()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["ServiceId"]) || !isset($data["PullOff"])){
            echo returnData(0,"参数不能为空");
            exit;
        }
        $ServiceId=$data["ServiceId"];//服务项目ID
        $PullOff=$data["PullOff"];//0：上架，1：下架
        // 启动事务
        Db::startTrans();
        try{
            //修改记录  （下架操作需查表统计分类）
           $res1=Db::table("service")->where("ServiceId",$ServiceId)->update(["PullOff"=>$PullOff]);
           if ($PullOff==1){
               //下架的操作
               //查询当前下架的服务项目的主分类和机构id
               $MainCatFirmId=Db::table("service")->where("ServiceId",$ServiceId)->field(["MainCat","FirmId"])->find();
               $FirmId=$MainCatFirmId["FirmId"];//当前机构
               $MainCat=$MainCatFirmId["MainCat"];//查询当前下架的服务项目的主分类
               //查询现在此分类上架的有没有
               $count=Db::table("service")->where(["FirmId"=>$FirmId,"MainCat"=>$MainCat])->count();
                if ($count==0){
                    //没有  那就要查询机构表把当前的主分类 去掉了
                    //查询机构表当前机构的主分类
                    $FirmMainCat=Db::table("firm")->where("ID",$FirmId)->field(["ServiceMainCat"])->find()["ServiceMainCat"];
                    $arr = explode(",",$FirmMainCat);
                    $key = array_search($MainCat, $arr);
                    if ($key !== false){
                        array_splice($arr, $key, 1);
                    }
                    //
                    $str=implode(",",$arr);//整合当前要更新到机构表的主分类字符串
                    $res2=Db::table("firm")->where("ID",$FirmId)->update(["ServiceMainCat"=>$str]);
                }
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
     *维护技师选中服务项目
     */
    public function updServiceOfStaff()
    {




    }

    /**
     *约单中的服务项目
     * 请求参数：ReservationId	Y	int	约单表ID
     */
    public function getServiceRESN()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["ReservationId"])){
            echo returnData(0,"ReservationId参数不能为空");
            exit;
        }
        $ReservationId=$data["ReservationId"];//约单表ID
        //通过约单表ID 读取service_resn service表
        $res=Db::table("service_resn")
            ->alias("s1")
            ->join("service s2","s1.ServiceId=s2.ServiceId")
            ->where("s1.ReservationId",$ReservationId)
            ->field(["s1.RESNId","s1.ServiceId","s1.ServiceName","s1.ServiceSub","s1.StaffPoker","s1.CUSTPoker","s1.Price_Min","s1.Price_Max","s1.Duration","s2.Pic MainPic"])
            ->find();
        //图片为第一张 主图
        $res["MainPic"]=json_decode($res["MainPic"],true)["MainPic"];
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
     *我的约单-服务 （2表查询，service_RESN poker）
     * 技师已晒单，“我”未晒单的服务项目
     * 请求参数:CustomerId 顾客Id
     */
    public function getMyServiceRESN()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["CustomerId"])){
            echo returnData(0,"CustomerId参数不能为空");
            exit;
        }
        $CustomerId=$data["CustomerId"];//顾客id
        //查询 service_resn表 StaffPoker=1 CUSTPoker=0  poker表RESNId=service_resn表RESNId
        $res=Db::table("service_resn")
            ->alias("s")
            ->join("poker p","s.RESNId=p.RESNId")
            ->where(["s.CustomerId"=>$CustomerId,"s.StaffPoker"=>1,"CUSTPoker"=>0])
            ->field(["s.RESNId","s.ServiceId","s.ServiceName","s.ServiceSub","s.StaffPoker","s.Price_Min","s.Price_Max","s.Duration","p.StaffPic"])
            ->group("s.RESNId")
            ->select();
        $len=count($res);
        for ($i=0;$i<$len;$i++){
            $res[$i]["StaffPic"]=json_decode($res[$i]["StaffPic"],true);
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
     *统计机构下服务项目数量
     *请求参数：FirmId 机构id
     * 返回参数 服务项目总数
     */
    public function countServiceByFirm()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["FirmId"])){
            echo returnData(0,"FirmId参数不能为空");
            exit;
        }
        $FirmId=$data["FirmId"];//机构id
        //通过机构id查询service 表 记录的条数
        $count=Db::table("service")->where("FirmId",$FirmId)->count();
        echo returnData(1,$count);
        exit;
    }


}
