<?php
namespace app\index\controller;
use think\Cookie;
use think\Db;
use think\Request;
//晒单类
class Poker
{
    /**
     *晒单读取
     * 请求参数:km:公里数，读取距离用户在此范围内的机构的晒单默认5km;MySubCat:晒单子分类,格式“A1,A2,A3,B2,B4”。默认值空表示全部分类
     *
     */
    public function getSeriesPoker()
    {

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
     *晒单收藏
     * 请求参数:PokerId 晒单id  Act：收藏传1/取消收藏传0
     * 思路：通过act参数来决定是添加数据还是删除数据 poker_favor 表
     * 请求地址：http://trueshow/index/poker/PokerFavorite
     */
    public function PokerFavorite()
    {
        $request=Request::instance();
        $data=$request->param();
        //validate验证
        $validate = validate('Poker');
        if(!$validate->scene("PokerFavorite")->check($data)){
            // echo returnData("-1",$validate->getError());
            echo returnData("-1",$validate->getError());
            exit;
        }
        $UserId=$data["UserId"];//用户id
        $PokerId=$data["PokerId"];//晒单id
        $Act=$data["Act"];//是否收藏 收藏为1/取消收藏为0
        $time=date("Y-m-d H:i:s");
        //收藏 取消 时间是不同的，所以不可以不删除直接用
        $data=[
            "PokerId"=>$PokerId,
            "UserId"=>$UserId,
        ];
        if ($Act==1){
            //添加数据 收藏
            $data["accessTime"]=$time;
            $res=Db::table('poker_favor')->insert($data);
            if (!$res){
                //收藏失败
                echo returnData(0,"收藏失败");
                exit;
            }
            echo returnData(1,"收藏成功");
            exit;
        }elseif($Act==0){
            //如果有这条数据 删除 取消收藏
            $res=Db::table('poker_favor')->where($data)->delete();
            if (!$res){
                //收藏失败
                echo returnData(0,"取消收藏失败");
                exit;
            }
            echo returnData(1,"取消收藏成功");
            exit;
        }


    }


    /**
     *获取技师/顾客晒单
     * 请求参数：StaffId/CustomerId  Min:请求的开始序号。默认1  Max:请求的结束序号。默认3
     * 2表查询：Poker，Bullet
     * 返回参数：PokerId StaffPic CustomerPic  Bullets:弹幕数（通过晒单PokerId 查Bullet弹幕表） Favor ServiceName  CreatTime
     * eg:
     */
    public function getPokerByUser()
    {
        //前端传技师StaffId或者顾客CustomerId
        $request=Request::instance();
        $data=$request->param();
        $Min=isset($data["Min"]) ? $data["Min"] : 0;//请求的开始序号  索引值
        $Max=isset($data["Max"]) ? $data["Max"] : 2;//请求的结束序号
        if (isset($data["StaffId"])){
            $id=$data["StaffId"];
            $key="StaffId";
        }elseif (isset($data["CustomerId"])){
            $id=$data["CustomerId"];
            $key="CustomerId";
        }
        //通过参数获取晒单数据
        //先只把晒单的弹幕晒单id获取到
        $subsql = Db::table('bullet')->where(['Origin'=>0])->field('OriginId')->buildSql();
        $res=Db::table('poker')
            ->alias('p')
            ->join([$subsql=> 'b'], "p.ID=b.OriginId","left")
            ->field(["p.ID PokerId","p.StaffPic","p.CustomerPic","count(b.OriginId) Bullets","p.Favor","p.ServiceName","p.CreatTime"])
            ->where(["P.".$key=>$id])
            ->group("p.ID")
            ->order(['p.CreatTime'=>'desc'])
            ->limit($Min,$Max-$Min+1)
            ->select();

        $len=count($res);
        for ($i=0;$i<$len;$i++){
            $res[$i]["StaffPic"]=json_decode($res[$i]["StaffPic"],true);
            $res[$i]["CustomerPic"]=json_decode($res[$i]["CustomerPic"],true);
        }
       // print_r($res);
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res);
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
        if (isset($data["StaffId"])){
           $StaffId= $data["StaffId"];
            $res=Db::table('poker')->where('StaffId',$StaffId)->count();
        }
        if (isset($data["CustomerId"])){
            $CustomerId=$data["CustomerId"];
            $res=Db::table('poker')->where('CustomerId',$CustomerId)->count();
        }

        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
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

        $res["CustomerPic"]=json_decode($res["CustomerPic"],true);
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
        //validate验证
        $validate = validate('Poker');
        if(!$validate->scene("savePoker")->check($data)){
            // echo returnData("-1",$validate->getError());
            echo returnData("-1",$validate->getError());
            exit;
        }
        $RESNId=$data["RESNId"];//约单-服务表ID
        $StaffId=$data["StaffId"];//技师ID
        $Comment=isset($data["Comment"]) ? $data["Comment"] : "";//评价内文
        $Star=isset($data["Star"]) ? $data["Comment"] : 5;//0-5星。默认5
        $RealPic=isset($data["RealPic"]) ? $data["RealPic"] : 1;
        $FaceAllow=isset($data["FaceAllow"]) ? $data["FaceAllow"] : 1;//是否截留人像图片。0：否， 1是
        if (isset($data["ViewAllow"])){//晒单是否允许展示。0：不展示，1：允许，2：禁用。
            //RealPic为0时，此项为0
            if ($RealPic==0){
                $ViewAllow=0;
            }else{
                $ViewAllow=$data["ViewAllow"];
            }
        }
        //通过技师id 查询用户表 user 获取 技师的认证状态 Certificated, 隶属机构id FirmId
        // 通过机构FirmId  查询机构表 firm 获取当前机构的信息 佣金比例 Rakeoff、机构认证状态 Certificated，省份Province
        $resPreData=Db::table("firm")
            ->alias("f")
            ->join("user u","f.ID=u.FirmId")
            ->field(["u.Certificated staffCertificated","u.FirmId","f.Rakeoff","f.Certificated firmCertificated","f.Province"])
            ->where(["u.UserId"=>$StaffId])
            ->find();
        //$resPreData结果：
        //Array
        //(
        //    [staffCertificated] => 0
        //    [FirmId] => 1
        //    [Rakeoff] => 2
        //    [firmCertificated] => 0
        //    [Province] => 河北省
        //)
        $res1=Db::table("user")->where("UserId",$StaffId)->field(["FirmId","Certificated"])->find();
        $staffCertificated=$res1["Certificated"];//技师认证状态
        $staffCertificated=$res1["Certificated"];//机构id
        //通过技师id 查询用户表 user 获取 技师的认证状态


///////////////////////图片的问题等前端布局好弄好方案再写////////////////////////////////////////////
        //如果没有这条数据则是新建 有则是修改
        if (isset($data["PokerId"])){
            //修改这条数据 update

        }else{
            $CustomerId=$data["CustomerId"];//顾客ID
            //新增一条数据 insert

            //添加成功后更新 更新service_RESN表 (顾客或技师已晒单)
        }



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

        $res["StaffPic"]=json_decode($res["StaffPic"],true);
        $res["CustomerPic"]=json_decode($res["CustomerPic"],true);

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
        $len=count($res);
        for ($i=0;$i<$len;$i++){
            $res[$i]["StaffPic"]=json_decode($res[$i]["StaffPic"],true);
            $res[$i]["CustomerPic"]=json_decode($res[$i]["CustomerPic"],true);
        }
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



}
