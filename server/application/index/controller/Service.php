<?php
namespace app\index\controller;
ini_set('max_execution_time', '100');
use think\Db;
use think\Request;
use think\Controller;
//服务项目类
class Service extends Controller
{

    /**
     *得到肢体于分类的对应关系
     * head
     * eye
     * face
     * nose
     * neck
     * chest
     * arms
     * hand
     * waist
     * abdomen
     * haunch
     * legs
     * foots
     */
    public function getCatByBody(){
        $arr=["head","eye","face","nose","neck","chest","arms","hand","waist","abdomen","haunch","legs","foots"];
        $dataArr=[];
        for ($i=0;$i<count($arr);$i++){
            $item=$arr[$i];
            $data=Db::table("servicecat")->where("Type","like","%$arr[$i]%")->where("Pid","<>",0)->field(["Pid","Seq"])->select();
            $dataArr[$arr[$i]]=$data;
        }
        for ($i=0;$i<count($dataArr);$i++){
            $item1=$dataArr[$arr[$i]];
            //print_r($item1);
            for ($j=0;$j<count($item1);$j++){
                $pid=$item1[$j]["Pid"];
                //echo $pid;
                $seqbypid=Db::table("servicecat")->where("Cid",$pid)->field(["Seq"])->find()["Seq"];
                $dataArr[$arr[$i]][$j]["MainCat"]=$seqbypid;
            }

        }
        echo returnData(1,$dataArr);
//        print_r($dataArr);
        exit;
    }


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
     * 读取用户表中MySubCat，为用 户曾经选中的子分类 如用户最后登录时间大于48小时 MySubCat清空（全选）
     * 通过uid读取user表的MySubCat字段，如果为空的话表示全部分类，如果有值的话，有这些值来决定哪些分类需要选中
     */
    public function getServiceCat()
    {
        $request=Request::instance();
        $data=$request->param();
        $uid=$data["uid"];//用户id
        //读取user表的MySubCat字段
        $MySubCat=Db::table("user")->where("UserId",$uid)->field(["MySubCat"])->find();//得到用户选择的子分类名的字符串 如A,B,C
        $MySubCat1=explode(",",$MySubCat["MySubCat"]);
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

                if (in_array($arr1[$j]["Seq"],$MySubCat1) || $MySubCat1[0]==""){
                    //匹配上了
                    $arr1[$j]["ifselect"]=1; //需要选中

                }else{
                    $arr1[$j]["ifselect"]=0;//

                }
            }
            $res1[$i]["SubCat"]=$arr1;
        }


//        print_r($res1);
//        exit;
        if (!$res1){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res1);
        exit;

    }

    /**
     *按分类名获取机构服务项目
     * Cid	N	int	服务项目分类顺序，数组类型
        FirmId	N	int	所属机构ID。为空表示不限
        PullOff	N	int	0：上架，1：下架；默认-1全部
        Min	N	int	请求的开始序号
        Max	N	int	请求的结束序号
     */
    public function getFirmServiceByCat(){
        $request=Request::instance();
        $data=$request->param();
         $cid=$data["cid"]; //""----全部   选中的项目分类顺序如A

        $firmId=$data["firmId"];

        if($data["pullOff"]!=-1){
            $pullOff=$data["pullOff"];
            $where=["FirmId"=>$firmId,"PullOff"=>$pullOff];
        }else{
            $where=["FirmId"=>$firmId];
        }

        // FirmId和PullOff 字段--字段值

        //var_dump($Cid);
//        $Min=$data["Min"];//请求的开始序号
//        $Max=$data["Max"];//请求的结束序号

            //机构下的所有服务项目
            $res=Db::table("service")
                ->where($where)
                ->where('MainCat','like',"%$cid%")
                //->limit($Min,$Max-$Min+1)
                ->field(["ServiceId","ServiceName","ServiceSub","MainCat","SubCat","Price_Min","Price_Max","Duration","UsedCount","Pic"])
                ->select();

//            print_r($res);
        for ($i=0;$i<count($res);$i++){
            $res[$i]["Price_Min"]=sprintf("%.2f",$res[$i]["Price_Min"]/100);
            $res[$i]["Price_Max"]=sprintf("%.2f",($res[$i]["Price_Max"]/100));
            $res[$i]["Pic"]=json_decode($res[$i]["Pic"],true)[0];
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
        //ServiceId
      //FirmId  ServiceId
        //先判断 该机构是否正常营业
        $request=Request::instance();
        $data=$request->param();
        $FirmId=$data["firmId"];//所属机构ID。
        $ServiceId=$data["serviceId"];//服务项目ID 表的id
        $res1=Db::table("firm")->where("ID",$FirmId)->where("Status","<>",1)->count();
        if ($res1>0){
            //不正常经营
            //需要修改当前的服务项目 PullOff为1 下架
            $res1=Db::table("service")->where("ServiceId",$ServiceId)->update(["PullOff"=>1]);
        }

        $res=Db::table("service")->where("ServiceId",$ServiceId)->find();

        $res["Price_Min"]=sprintf("%.2f",$res["Price_Min"]/100);
        $res["Price_Max"]=sprintf("%.2f",($res["Price_Max"]/100));

//        print_r($res);
//        exit;
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res);
        exit;

    }

    /////////////////通过当前的服务项目id和机构id获取服务当前项目的技师的信息 默认显示一个///////////////////
    public function getServiceStaffInfoById(){
        //
        $request=Request::instance();
        $data=$request->param();
        $FirmId=$data["firmId"];//所属机构ID。
        $ServiceId=$data["serviceId"];//服务项目ID 表的id
        $res=Db::table("servicestaff")
            ->alias("s")
            ->join("user u","s.StaffId=u.UserId")
            ->where(["s.FirmId"=>$FirmId,"s.ServiceId"=>$ServiceId])
            ->field(["u.Avatar","u.Certificated","u.Satisfection","u.NickName","u.UserId","s.ServiceId"])
            ->find();
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
     *
     * 1.
     * 2.user skiller
     *
     */
    public function updServiceOfStaff()
    {
        $request = Request::instance();
        $params = $request->param();
        if(isset($params['staffId']) && isset($params['firmId']) && isset($params['serviceId']) && isset($params['type'])){
            $staffId = $params['staffId'];
            $firmId = $params['firmId'];
            $serviceId = $params['serviceId'];
            $type = $params['type'];   //   0----- 删除    1----- 添加
            if($type == 1){
                //            $cat = $params['catMain'];
                $cat = Db::table('service')->where('ServiceId','=',$serviceId)->field('MainCat')->find();
                // 检查是否存在该用户的数据
                $data = [
                    'StaffId' => $staffId,
                    'FirmId'  =>  $firmId,
                    'ServiceId' => $serviceId,
                    'MainCat'  => $cat['MainCat']
                ];
                $res = Db::table('servicestaff')->insert($data);
                $skill = Db::table('user')->where('UserId','=',$staffId)->field('Skill')->find();
                $skillArr = explode(',',$skill['Skill']);
                // 将大的分类，同时更新到技师擅长位置
                $arr=str_split($cat['MainCat']);
                $catArr = [];
                for($i=0;$i<count($arr);$i++){
                    if($arr[$i] >= 'A' && $arr[$i]<= 'Z'){
                        array_push($catArr,$arr[$i]);
                    }
                }
                $arr2 = array_merge($skillArr,$catArr);
                $arr3 = array_unique($arr2);
                $str = implode(',',$arr3);
                Db::table('user')->where('UserId','=',$staffId)->update(['Skill' => $str]);

                if($res > 0){
                    echo returnData(1,'添加成功1');
                    exit;
                }else{
                    echo returnData(0,'添加失败2');
                    exit;
                }
            }else{
                $where=[['StaffId','=',$staffId],['FirmId','=',$firmId],['ServiceId','=',$serviceId]];
                $res = Db::table('servicestaff')
                    ->where('StaffId','=',$staffId)
                    ->where('FirmId','=',$firmId)
                    ->where('ServiceId','=',$serviceId)
                    ->delete();
                if($res > 0){
                    echo returnData(1,'删除成功1');
                    exit;
                }else{
                    echo returnData(0,'删除失败2');
                    exit;
                }

            }

        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }

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
     * 得到技师晒单 顾客未晒单数量 service_resn表 技师已晒单 顾客未晒单
     */
    public function staffHasPockedCount(){
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["customerId"])){
            echo returnData(0,"customerId参数不能为空");
            exit;
        }
        $CustomerId=$data["customerId"];//顾客id
        $res=Db::table("service_resn")
            ->alias("s")
            ->where(["s.CustomerId"=>$CustomerId,"s.StaffPoker"=>1,"CUSTPoker"=>0])
            ->count();
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
        if (!isset($data["customerId"])){
            echo returnData(0,"customerId参数不能为空");
            exit;
        }
        $CustomerId=$data["customerId"];//顾客id
        //查询 service_resn表 StaffPoker=1 CUSTPoker=0  poker表RESNId=service_resn表RESNId
        $res=Db::table("service_resn")
            ->alias("s")
            ->join("poker p","s.RESNId=p.RESNId")
            ->where(["s.CustomerId"=>$CustomerId,"s.StaffPoker"=>1,"CUSTPoker"=>0])
            ->field(["p.ID pokerId","s.RESNId","s.ServiceId","s.ServiceName","s.ServiceSub","s.StaffPoker","s.Price_Min","s.Price_Max","s.Duration","p.StaffPic"])
            ->group("s.RESNId")
            ->select();
        $len=count($res);

        for ($i=0;$i<$len;$i++){
            $res[$i]["StaffPic"]=json_decode($res[$i]["StaffPic"],true);


        }


        //整理图片
//        $arr=[];
        //删除索引数数组中值为空的值
        for ($j=0;$j<count($res);$j++){
            $staffPic=$res[$j]['StaffPic'];
            $array=array_filter($staffPic,create_function('$v','return !empty($v);'));
            $res[$j]['StaffPic']=$array;
            $arr=[];   //每一个晒单的图片集合
            foreach ($res[$j]['StaffPic'] as $k=>$v){
               // echo  $v;
                //人脸识别
//                $face= face('http://ljp.jujiaoweb.com/static/images/index/'.$v);
//                $errorCode=$face['error_code'];   //error_code=0 代表是人脸
//                if($errorCode==0){
//                    $res[$j]['hasPersonFace']=[
//                        'key'=>$k,
//                        'val'=>$v
//                    ]  ;
//                }
                $arr[]=$v;
            }

            $res[$j]['imgList']=$arr;
        }
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res,$len);
        exit;

    }
    /**
     * 人脸识别的图片技师上传的晒单里的图片
     */
    public function faceRecognition(){
        $request=Request::instance();
        $data=$request->param();
        $servicesImgs=json_decode($data['servicesImgs'],true);
        for($i=0;$i<count($servicesImgs);$i++){
            $face= face('http://ljp.jujiaoweb.com/static/images/index/'.$servicesImgs[$i]);
            $errorCode=$face['error_code'];
            //echo $errorCode;
            if($errorCode==0){
                echo $i;
            }

        }
      //  print_r($data);

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

    /**
     * 得到所有大分类
     */
    public function getMainCat(){
        $res = Db::table("servicecat")->where('Pid','=',0)->field(['Name','Seq'])->select();

        echo returnData(1,$res);
        exit;
    }

    /**
     * 获取服务项目页数据
     */
    public function getServiceProData(){
        $isntance = Request::instance();
        $param = $isntance->param();
        if(isset($param['staffId'])){

            // 得到下架数量   得到所有机构下的服务项目
            $staffId = $param['staffId'];// 机构id
            // 判断是否是加载更多动作
            if(isset($param['time'])){
                $time =$param['time'];
                // 请求机构下所有的服务
                $services = Db::table('service')
                    ->where('FirmId','=',$staffId)
                    ->limit($time,5)
                    ->order('ServiceId inc')
                    ->select();
                if(count($services) > 0){
                    $lastId = $services[count($services)-1]['ServiceId'];
                    for($i=0;$i<count($services);$i++){
                        $services[$i]['Price_Min'] = sprintf("%.2f",($services[$i]['Price_Min']/100));
                        $services[$i]['Price_Max'] = sprintf("%.2f",($services[$i]['Price_Max']/100));
                        $services[$i]['isShow'] = true;
                        $services[$i]['txtStyle'] = '';
                    }
                }else{
                    $lastId = -1;
                }
                $res = compact("services","lastId");
                echo returnData(1,$res);
                exit;
            }

            // 所有的服务分类
            $cat = Db::table("servicecat")->where('Pid','=',0)->field(['Name','Seq'])->select();
            $appendArr = ['isChoose'=> true];
            array_walk($cat,function(&$val,$k,$appendArr){
                $val = array_merge($val, $appendArr);
            },$appendArr);
            // 请求机构下所有的服务
            $services = Db::table('service')
                ->where('FirmId','=',$staffId)
                ->limit(5)
                ->order('ServiceId inc')
                ->select();
            if(count($services) > 0){
                $lastId = $services[count($services)-1]['ServiceId'];
                for($i=0;$i<count($services);$i++){
                    $services[$i]['Price_Min'] = sprintf("%.2f",($services[$i]['Price_Min']/100));
                    $services[$i]['Price_Max'] = sprintf("%.2f",($services[$i]['Price_Max']/100));
                    $services[$i]['isShow'] = true;
                    $allPicStr = $services[$i]['Pic'];
                    $allPicArr = explode(',',$allPicStr);
                    $services[$i]['thumbnail'] = $allPicArr[0];
                }


            }else{
                $lastId =-1;
            }
            // 机构下服务总数量
            $countService = Db::table('service')
                ->where('FirmId','=',$staffId)
                ->field('count(ServiceId) countService')
                ->find();

            // 机构中下架的数量
            $pullOff = Db::table('service')
                ->where('FirmId','=',$staffId)
                ->where('pullOff','=',1)
                ->field('count(ServiceId) pullOffCount')
                ->find();
            $res = compact("cat","pullOff","services",'lastId','countService');
            echo returnData(1,$res);
            exit;
        }else{
            echo returnData(0,'请求参数不能为空');
            exit;
        }

    }


}
