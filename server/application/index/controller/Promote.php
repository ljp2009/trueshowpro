<?php
namespace app\index\controller;
//优惠活动类
use think\Controller;
use think\Db;
use think\Request;

use EmailFile\PHPMailer;


class Promote extends Controller
{
    //调用发邮件方法
    public function sendEmail(){
        require "static/lib/phpXlsxWriter/xlsxwriter.php";//调用生成execl文件的类文件
        //前端传过来的收件人邮箱
        $request=Request::instance();
        $data=$request->param();
        $toemail=$data["toemail"];//收件人邮箱
        //$toemail="1146383603@qq.com";
        $list=json_decode($data["incdata"],true);//要写入execl文件的数据
        $subject="服务项目收入流水";
        $body="这是40天服务项目流水统计,请注意查收!!";
        //生成execl文件
        //表格头信息
        $header = array(
            '时间'=>'string',//text
            '价格'=>'string',//text
            '佣金'=>'string',
            '收入'=>'string',
        );
      //表格内容
//        $list = array(
//            array('南华证券有限公司','测试1','手机炒股','M11uM+0+QwoRcI3SA','2019-01-15'),
//            array('北华证券有限公司','测试2','电脑炒股','M11uM+0+QwoRcI3SB','2019-01-17'),
//            array('东华证券有限公司','测试3','不要炒股','M11uM+0+QwoRcI3SC','2019-01-16'),
//        );

        $writer = new \XLSXWriter();
        $writer->writeSheetHeader('Sheet1', $header);
        foreach($list as $row)
            $writer->writeSheetRow('Sheet1', $row);
        // 输出文件
        $writer->writeToFile('bill.xlsx');

        if(is_file('bill.xlsx')){
            $file="bill.xlsx";
            $res=$this->Mail($toemail,$subject,$body,$file);
            if ($res==1){
                //删除xlsx文件
                $bol=unlink("bill.xlsx");
                if ($bol){
                    //echo "发送邮件成功";
                    echo returnData(1,"发送邮件成功");
                    exit;
                }
            }else{
                //echo "发送邮件不成功";
                echo returnData(0,"发送邮件不成功");
                exit;
            }
        }else{
            //
            //echo "execl生成不成功";
            echo returnData(0,"execl文件生成不成功");
            exit;
        }

    }


    //
    /**
     * 封装邮件Mail方法
     * address 收件人邮箱
     * subject  邮件标题
     * body   邮件内容
     * file    文件路径
     */
    public function Mail($toemail,$subject,$body,$file=""){
        //$toemail = '1146383603@qq.com';//这里写的是收件人的邮箱
        $mail=new PHPMailer();//PHPMailer
        $mail->isSMTP();// 使用SMTP服务（发送邮件的服务）
        $mail->CharSet = "utf8";// 编码格式为utf8，不设置编码的话，中文会出现乱码
        $mail->Host = "smtp.qq.com";// 发送方的SMTP服务器地址
        $mail->SMTPAuth = true;// 是否使用身份验证
        $mail->Username = "487703445@qq.com";// 申请了smtp服务的邮箱名（自己的邮箱名）
        $mail->Password = "rfieybgwozukbgie";// 发送方的邮箱密码，不是登录密码,是qq的第三方授权登录码,要自己去开启（之前叫你保存的那个密码）
        $mail->SMTPSecure = "ssl";// 使用ssl协议方式,
        $mail->Port = 465;// QQ邮箱的ssl协议方式端口号是465/587
        $mail->setFrom("487703445@qq.com","xiaoxia");// 设置发件人信息，如邮件格式说明中的发件人,
        $mail->addAddress($toemail,'亲爱的你');// 设置收件人信息，如邮件格式说明中的收件人
        $mail->isHTML(true);    //邮件正文是否为html编码 true或false
        $mail->addReplyTo("487703445@qq.com","Reply");// 设置回复人信息，指的是收件人收到邮件后，如果要回复，回复邮件将发送到的邮箱地址
       //$mail->addCC("xxx@163.com");// 设置邮件抄送人，可以只写地址，上述的设置也可以只写地址(这个人也能收到邮件)
       //$mail->addBCC("xxx@163.com");// 设置秘密抄送人(这个人也能收到邮件)
        if ($file !== '') $mail->AddAttachment($file); // 添加附件
        //$mail->AddAttachment("test.xlsx","test.xlsx");// 添加附件

        $mail->Subject = $subject;// 邮件标题
        $mail->Body = $body;// 邮件正文
        //$mail->AltBody = "This is the plain text纯文本";// 这个是设置纯文本方式显示的正文内容，如果不支持Html方式，就会用到这个，基本无用**

        if(!$mail->send()){// 发送邮件
//            echo "Message could not be sent.";
//            echo "Mailer Error: ".$mail->ErrorInfo;// 输出错误信息
            return 0;
        }else{
            //echo '';
            //return '发送成功';
            return 1;
        }
    }




    //获取当前时间
    public function getCurrentDatetime(){
        $datetime=date("Y-m-d H:i");
        $date=explode(" ",$datetime)[0];
        $time=explode(" ",$datetime)[1];
        $arr=[
            "date"=>$date,
            "time"=>$time
        ];
        echo returnData(1,$arr);
        //echo $date."---".$time;
        exit;
    }


    /**
     *计算当前的执行日期时间
     *stillDays: stillDays,//持续天数
    startDateTime: startDateTime,//开始日期时间
    performDays: performDays //执行天数
     */
    public function computeperformdatetime(){

        $request=Request::instance();
        $data=$request->param();
        $stillDays=$data["stillDays"];//持续天数
        $startDateTime=$data["startDateTime"];//开始日期时间
        $performDays=$data["performDays"];//执行天数
        //print_r($data);
        // //计算当前的执行日期时间    开始时间+持续天数 - 执行天数 =执行日期时间
        //执行日期时间戳
        $PerformDateTime=strtotime($startDateTime)+$stillDays*24*60*60-$performDays*24*60*60;
        $PerformDateTime1=date("Y-m-d H:i",$PerformDateTime);//执行日期时间
//        echo $PerformDateTime1."---"."---";
//        exit;
        $date=explode(" ",$PerformDateTime1)[0];
        $time=explode(" ",$PerformDateTime1)[1];
        $arr=[
            "date"=>$date,
            "time"=>$time
        ];
        echo returnData(1,$arr);
        //echo $date."---".$time;
        exit;



    }


    /**
     *获取机构优惠项目
     * FirmId	Y	int	机构ID
    AllRecod	N	int	0：进行中优惠活动，1：全部优惠活动。默认0
    （当前时间介于“开始”和“结束”之间，为进行中）
     */
    public function getPromoteByFirm()
    {
        $request=Request::instance();
        $data=$request->param();
        $firmId=$data["firmId"];//机构id
        $allRecod=$data["allRecod"];//机构id 	0：进行中优惠活动，1：全部优惠活动。
        //通过allRecod参数 获取对应的活动
        $res=Db::table("promote")
            ->alias("p1")
            ->join("promote_item p2","p1.PromoteId=p2.PromoteId")
            ->group("p1.PromoteId")
            ->where("p1.FirmId",$firmId)
            ->order("p1.EffectiveDate desc")
            ->field(["p1.*","group_concat(p2.PromoteType) PromoteTypes","group_concat(p2.Discount) Discounts"])
            ->select();
//print_r($res);
//exit;
        if($res==false){
            //echo "为空";
            echo returnData(0,"没有数据");
            exit;
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

//        print_r($res);
//
//        exit;
        echo returnData(1,$res);
        exit;
    }


    /**
     *查询优惠活项目
     */
    public function getPromoteItemById()
    {

    }


    /**
     *新建优惠活动
     */
    public function newPromote()
    {
        $request=Request::instance();
        $data=$request->param();
//        print_r($data);
//        exit;
        /**
         * //eachSale //单笔折扣 PromoteType 0
        //firstSale //首单折扣   PromoteType 1
        //oldSale //熟客折扣     PromoteType 2
        Array
        (
        [startDateTime] => 2019-09-09 19:45:00
        [effectiveDateTime] => 2019-09-14 19:45:00
        [performDays] => 5
        [stillDays] => 10
        [activityinfo] =>
         * {"firmId":2,
         * "title":"京津冀经济",
         * "ifOverlay":1,
         * "activityArr":[
         * {"type":3,"sale":"1000,100"},
         * {"type":3,"sale":"500,30"},
         * {"type":0,"sale":"88"},
         * {"type":2,"sale":"85"}
         *     ]}
        )
         */

        $activityinfo=json_decode($data["activityinfo"],true);
        $firmId=$activityinfo["firmId"];//机构id
        $ifOverlay=$activityinfo["ifOverlay"];//是否叠加
        $title=$activityinfo["title"];//活动标题
        $activityArr=$activityinfo["activityArr"];//活动类型及优惠数值

        $startDateTime=$data["startDateTime"];//活动开始日期时间
        $effectiveDateTime=$data["effectiveDateTime"];//活动生效日期时间

        $stillDays=$data["stillDays"];//活动持续天数
        ////活动结束时间 开始日期时间+持续天数
        $endDateTime=date("Y-m-d H:i:s",strtotime($startDateTime)+$stillDays*24*60*60);

        $inserPromoteData=[
            "FirmId"=>$firmId,
            "Title"=>$title,
            "alternative"=>$ifOverlay,
            "StartTime"=>$startDateTime,
            "EffectiveDate"=>$effectiveDateTime,
            "EndTime"=>$endDateTime,
            "CreateTime"=>date("Y-m-d H:i:s"),
        ];

        // 启动事务
        Db::startTrans();
        try{
            //第一步 插入promote表 返回 PromoteId
            $resId=Db::table("promote")->insertGetId($inserPromoteData);
            //第二步 插入promote_item表
            $inserpromote_itemData=[];
            for ($i=0;$i<count($activityArr);$i++){
                $inserpromote_itemData[]=[
                    "PromoteId"=>$resId,
                    "PromoteType"=>$activityArr[$i]["type"],
                    "Discount"=>$activityArr[$i]["sale"]
                ];
            }
            $res=Db::table("promote_item")->insertAll($inserpromote_itemData);
            // 提交事务
            Db::commit();
            echo returnData(1,"发布成功");
            exit;
        } catch (\Exception $e) {
            echo returnData(0,"出错了");
            // 回滚事务
            Db::rollback();
            exit;
        }


    }

}
