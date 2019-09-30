<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
use think\Request;
use think\Session;
use WxPayException;

//广告类
class Ad  extends Controller
{


    //newADTemplateSec
    public function newADTemplatePic(){
        $request = Request::instance();
        $data = $request->param();
        $type=$data["type"];
        //index
        $index=$data["index"];//选择的当前的图片的地址
        //获取表单上传文件
        $file = $request->file('img');
//        print_r($data);
        $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "uploads" .DS);
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();

            $arr=["type"=>$type,"img"=>$image,"seq"=>$index];
            echo returnData(1,$arr);
            exit;
        }
    }


    //新增广告模板 /编辑
    public function newADTemplate(){

        $request = Request::instance();
        $data = $request->param();
        $firmId=$data["firmId"];//机构id
        $valueArr=$data["valueArr"];
        $templateId=$data["templateId"];//模板id -1---新建  >0 表示编辑
        $valueArr1=json_decode($valueArr,true);
        $title=isset($valueArr1["title"]) ? $valueArr1["title"]:"" ;//广告卡标题
        $firvalue=isset($valueArr1["firvalue"])?$valueArr1["firvalue"]:"";//各组图对应的文字描述
        $secvalue=isset($valueArr1["secvalue"])? $valueArr1["secvalue"]:"";
        $thirdvalue=isset($valueArr1["thirdvalue"])?$valueArr1["thirdvalue"]:"";
        $coverpic=json_decode($data["coverpic"],true);
        $subPic1=json_decode($data["subPic1"],true);
        $subPic2=json_decode($data["subPic2"],true);
        $subPic3=json_decode($data["subPic3"],true);
        $allimgurlArr=json_decode($data["allimgurlArr"],true);
        $insertimgurlAll=json_decode($data["insertimgurlArr"],true);

        //需要比对 差集把文件删除

        $poorimgurlArr=array_diff($allimgurlArr,$insertimgurlAll);//差集
        foreach($poorimgurlArr as $key=>$val){
            if($val!="") {
                $_item = ROOT_PATH . "public/static/images/uploads/" . $val;
                unlink($_item);
            }
        }

//        print_r($data);
//        exit;
        //MainPic SubPic1 SubPic2 SubPic3
        $insert=[
            "Title"=>$title,
            "FirmId"=>$firmId,
            "Text1"=>$firvalue,
            "Text2"=>$secvalue,
            "Text3"=>$thirdvalue,
            "CreateTime"=>date("Y-m-d H:i:s"),
            "MainPic"=>json_encode($coverpic),
            "SubPic1"=>json_encode($subPic1),
            "SubPic2"=>json_encode($subPic2),
            "SubPic3"=>json_encode($subPic3),
        ];
        if ($templateId==-1){
            //新建

            $getinsertid=Db::table("ad_template")->insertGetId($insert);
            if (!$getinsertid){
                echo returnData(0,"上传失败");
                exit;
            }
            echo returnData(1,"上传成功");
            exit;
        }else{
            //编辑

            $res=Db::table("ad_template")->where("TemplateId",$templateId)->update($insert);
            if (!$res){
                echo returnData(0,"上传失败");
                exit;
            }
            echo returnData(1,"上传成功");
            exit;
        }

    }



    /**
     *获取广告卡
     * 
     */
    public function getPrepay()
    {
        $openid="odcH0vkiJCJZWnkLWkrsu2bI5Wsc";
        $product_id="123456";
        $total_fee=1;
//        extract(generateRequestParamVars());
//        //获取openid
//        $user = D(self::$WECHAT_USER_MODEL)->find($user_id);
//        $openid = $user['openid'];

        //引用微信支付API
//        require_once C('APPLICATION_DIR') . '/Home/Libs/WechatPay/lib/WxPay.Api.php';
//        require_once C('APPLICATION_DIR') . '/Home/Libs/WechatPay/lib/WxPay.Notify.php';
//        require_once C('APPLICATION_DIR') . '/Home/Libs/WechatPay/lib/WxPay.Data.php';
//        require_once C('APPLICATION_DIR') . '/Home/Libs/WechatPay/example/log.php';
//        require_once C('APPLICATION_DIR') . '/Home/Libs/WechatPay/example/WxPay.NativePay.php';
//        require_once C('APPLICATION_DIR') . '/Home/Libs/WechatPay/example/WxPay.JsApiPay.php';

        // WxPayUnifiedOrder类会直接设置xml
        $xml = new \WxPayUnifiedOrder();
        $xml->SetBody("购买商品");
        $xml->SetAttach("attach");
        $xml->SetOpenid($openid);
        $xml->SetOut_trade_no($product_id);
        $xml->SetTotal_fee($total_fee * 100);
        $xml->SetTime_start(date("YmdHis", time()));
        $xml->SetTime_expire(date("YmdHis", time() + 600));
        $xml->SetNotify_url("http://ljp.jujiaoweb.com/index/ad/getNotify");
        $xml->SetGoods_tag("goods_tag");
        $xml->SetTrade_type("JSAPI");

        //统一下单(获取prepay_id)
        $nativepay = new \NativePay();
        $result = $nativepay->GetPayUrl($xml);

        //再次签名
        $sign_array = array();
        $sign_array['appId'] = $result['appid'];
        $sign_array['nonceStr'] = $result['nonce_str'];
        $sign_array['package'] = 'prepay_id=' . $result['prepay_id'];
        $sign_array['signType'] = 'MD5';
        $sign_array['timeStamp'] = floor($result['startTimeStamp'] / 1000);

        $sign = new \WxPayDataBase();
        $sign_two = $sign->MakeSigns($sign_array);
        $result['paySign'] = $sign_two;

        $ajaxReturnData['data'] = $result;
//        $this->ajaxReturn($ajaxReturnData);
        echo returnData(1,$ajaxReturnData);
    }
    public function getNotify()
    {
        echo 1111111111;
        exit;
        $xmlData = file_get_contents('php://input');
        libxml_disable_entity_loader(true);
        $data = json_decode(json_encode(simplexml_load_string($xmlData, 'SimpleXMLElement', LIBXML_NOCDATA)), true);
        ksort($data);
        $buff = '';
        foreach ($data as $k => $v) {
            if ($k != 'sign') {
                $buff .= $k . '=' . $v . '&';
            }
        }

        $save = [];
        foreach ($data as $k => $v) {
            $save['key'] = $k . '';
            $save['value'] = $v . '';
            D(self::$NOTIFY_TEST)->add($save);
        }

        $stringSignTemp = $buff . 'key=1d8r14jiu58fs12qsd824j1o52d8r14c';//key为证书密钥
        $sign = strtoupper(md5($stringSignTemp));

        $conditions = [];
        $conditions['order_number'] = $data['out_trade_no'];
        $order = D(self::$ORDER_MODEL)->where($conditions)->find();

        //判断算出的签名和通知信息的签名是否一致
        if ($order && $sign == $data['sign'] && $order['total_price']*100 == $data['total_fee']) {
            $test = [];
            $test['key'] = '校验是否成功';
            $test['value'] = 'yes';
            D(self::$NOTIFY_TEST)->add($test);

            $order_data = [];
            $order_data['shop_status'] = 1;
            D(self::$ORDER_MODEL)->where($conditions)->save($order_data);

            //处理完成之后，告诉微信成功结果
            echo '<xml>
                    <return_code><![CDATA[SUCCESS]]></return_code>
                    <return_msg><![CDATA[OK]]></return_msg>
                  </xml>';
            exit();
        }else{
            echo '<xml>
                    <return_code><![CDATA[FAIL]]></return_code>
                    <return_msg><![CDATA[FAIL]]></return_msg>
                  </xml>';
            exit();
        }
    }

    public function adDistribute(){
        $request = Request::instance();
        $data = $request->param();
        print_r($data);
        ///接收参数
        //Array ( [/index/ad/adDistribute] => [firmId] => 1 [TemplateId] => 98 [PayStatus] => 0 [ClickBuy] => 100 [StartTime] => 2019-09-14 00:00 [EndTime] => 2019-10-14 0:0:0 )
        $firmId=$data["firmId"];
        $TemplateId=$data["TemplateId"];
        $PayStatus=0;
        $ClickBuy=$data["ClickBuy"];
        $StartTime=$data["StartTime"];
        $EndTime=$data["EndTime"];
        $unitPrice=$data["unitPrice"];
        $BillNo=date("YmdHis").$firmId.$TemplateId;  //支付订单号
        $userid=$data["uid"];
        print_r($BillNo);

        //开始往数据库中写入数据  ad_distribute表中写入数据
        $insertdata=[
            "FirmId"=>$firmId,
            "TemplateId"=>$TemplateId,
            "PayStatus"=>$PayStatus,
            "Amount"=>$unitPrice,
            "ClickBuy"=>$ClickBuy,
            "StartTime"=>$StartTime,
            "EndTime"=>$EndTime,
            "BillNo"=>$BillNo
        ];
        Db::table("ad_distribute")
            ->insert($insertdata);

        //通过uid来读取openid
        $openidArr=Db::table("user")
            ->field(["WachatOpenid"])
            ->where("UserId",$userid)
            ->find();
        $openid=$openidArr["WachatOpenid"];
        print_r($openid);
        ///开始支付


        exit;
    }


        /*
         * 微信支付
         */
        public function wxPay(){
            $request = Request::instance();
            $data = $request->param();
//            print_r($data);
            ///接收参数
            //Array ( [/index/ad/adDistribute] => [firmId] => 1 [TemplateId] => 98 [PayStatus] => 0 [ClickBuy] => 100 [StartTime] => 2019-09-14 00:00 [EndTime] => 2019-10-14 0:0:0 )
            $firmId=$data["firmId"];
            $TemplateId=$data["TemplateId"];
            $PayStatus=0;
            $ClickBuy=$data["ClickBuy"];
            $StartTime=$data["StartTime"];
            $EndTime=$data["EndTime"];
            $unitPrice=$data["unitPrice"];
            $BillNo=date("YmdHis").$firmId.$TemplateId;  //支付订单号
            $userid=$data["uid"];
//            print_r($BillNo);

            //开始往数据库中写入数据  ad_distribute表中写入数据
            $insertdata=[
                "FirmId"=>$firmId,
                "TemplateId"=>$TemplateId,
                "PayStatus"=>$PayStatus,
                "Amount"=>$unitPrice,
                "ClickBuy"=>$ClickBuy,
                "StartTime"=>$StartTime,
                "EndTime"=>$EndTime,
                "BillNo"=>$BillNo
            ];
            Db::table("ad_distribute")
                ->insert($insertdata);

            //通过uid来读取openid
            $openidArr=Db::table("user")
                ->field(["WachatOpenid"])
                ->where("UserId",$userid)
                ->find();
            $openid=$openidArr["WachatOpenid"];
//            print_r($openid);

            ///开始支付



            //订单号
        $order=$BillNo;
        $money=1;
//        $money=$unitPrice;
//        $openId="osCLn5a1cz29R47UmLsuNDiTNvS0";
            $openId=$openid;
        $tools = new \JsApiPay();
       // $openId = $tools->GetOpenid();
        //     初始化值对象
        $input = new \WxPayUnifiedOrder();
        //     文档提及的参数规范：商家名称-销售商品类目
        $input->SetBody("购买广告模版".$TemplateId);
        //     订单号应该是由小程序端传给服务端的，在用户下单时即生成，demo中取值是一个生成的时间戳
        $input->SetOut_trade_no("$order");
        //     费用应该是由小程序端传给服务端的，在用户下单时告知服务端应付金额，demo中取值是1，即1分钱
        $input->SetTotal_fee("$money");
        $input->SetNotify_url("http://wovev.com/index/ad/notify");
        $input->SetTrade_type("JSAPI");
        //     由小程序端传给服务端
        $input->SetOpenid($openId);
        //     向微信统一下单，并返回order，它是一个array数组
            $result = \WxPayApi::unifiedOrder($input);
        //     json化返回给小程序端
        header("Content-Type: application/json");
        echo json_encode($result);

        exit;
    }
//    notify函数
    public function notify(){

        $postStr = file_get_contents("php://input");
        file_put_contents("weipay.txt",$postStr);

        //修改数据库
        if (!empty($postStr)) {
            $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
            $out_trade_no = $postObj->out_trade_no;  //得到订单号
            $openid=$postObj->openid;    //得到用户的openid
            $mch_id=$postObj->mch_id;    //得到商户id
            $appid=$postObj->appid;    //得到appid
            $total_fee=$postObj->total_fee;    //支付金额
            $transaction_id=$postObj->transaction_id;           //交易流水号
            //对订单状态进行修改
            //查看当前订单的状态 如果是已经付款成功 下面的就不再执行
            $status=$result=Db::table("ad_distribute")
                ->where("BillNo",$out_trade_no)
                ->field("PayStatus")
                ->find();
            if($status["PayStatus"]==1){
                ////说明已经支付过了
                return;
            }
//

            Db::startTrans();
//
            $result=Db::table("ad_distribute")
                ->where("BillNo",$out_trade_no)
                ->update(["PayStatus"=>1]);




            //先读取到机构的id
            $firmArr=Db::table("ad_distribute")
                ->field(["FirmId","DistId"])
                ->where("BillNo",$out_trade_no)
                ->find();

            $firmId=$firmArr["FirmId"];
            $DistId=$firmArr["DistId"];   //广告投放表中的id

            //通过openid读取用户的uid
            $userInfo=Db::table("user")
                ->field(["UserId","NickName"])
                ->where("WachatOpenid",$openid)
                ->find();
            $userId=$userInfo["UserId"];
            $nickName=$userInfo["NickName"];


            //////////////finance_inc平台收入平台财务结算finance_inc 加入一条数据  说明当前用户购买了广告投入
            $datainc=[
                "PayerId"=>$userId,
                "NickName"=>$nickName,
                "FirmId"=>$firmId,
                "payment"=>"1",
                "BillNo"=>$out_trade_no,
                "PayerName"=>$openid,
                "Amount"=>$total_fee,
                "Items"=>2,
                "ItemsId"=>$DistId,
                "PayTime"=>date("Y-m-d H:i:s")

            ];
            Db::table("finance_inc")
                ->insert($datainc);
            Db::commit();

        }
        exit;
    }

//    public function notify1(){
//
////        $postStr = file_get_contents("php://input");
////        file_put_contents("weipay.txt",$postStr);
//        $postStr='<xml><appid><![CDATA[wxa5ec17098b9f6637]]></appid>
//<bank_type><![CDATA[CFT]]></bank_type>
//<cash_fee><![CDATA[1]]></cash_fee>
//<fee_type><![CDATA[CNY]]></fee_type>
//<is_subscribe><![CDATA[N]]></is_subscribe>
//<mch_id><![CDATA[1502269181]]></mch_id>
//<nonce_str><![CDATA[6sle63xewc512yufi5ewqmqojv388eug]]></nonce_str>
//<openid><![CDATA[osCLn5a1cz29R47UmLsuNDiTNvS0]]></openid>
//<out_trade_no><![CDATA[20190923140039198]]></out_trade_no>
//<result_code><![CDATA[SUCCESS]]></result_code>
//<return_code><![CDATA[SUCCESS]]></return_code>
//<sign><![CDATA[0AE0D2F323295FED29727350AE9E26AF]]></sign>
//<time_end><![CDATA[20190923113159]]></time_end>
//<total_fee>1</total_fee>
//<trade_type><![CDATA[JSAPI]]></trade_type>
//<transaction_id><![CDATA[4200000384201909236024117848]]></transaction_id>
//</xml>';
//
//        //修改数据库
//        if (!empty($postStr)) {
//            $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
//            print_r($postObj);
//            $out_trade_no = $postObj->out_trade_no;  //得到订单号
//            $openid=$postObj->openid;    //得到用户的openid
//            $mch_id=$postObj->mch_id;    //得到商户id
//            $appid=$postObj->appid;    //得到appid
//            $total_fee=$postObj->total_fee;    //支付金额
//            $transaction_id=$postObj->transaction_id;           //交易流水号
//            //对订单状态进行修改
//            //查看当前订单的状态 如果是已经付款成功 下面的就不再执行
//            $status=$result=Db::table("ad_distribute")
//                ->where("BillNo",$out_trade_no)
//                ->field("PayStatus")
//                ->find();
//            if($status["PayStatus"]==1){
//                ////说明已经支付过了
//                return;
//            }
////
//
//            Db::startTrans();
////
//            $result=Db::table("ad_distribute")
//                ->where("BillNo",$out_trade_no)
//                ->update(["PayStatus"=>1]);
//
//
//
//
//            //先读取到机构的id
//            $firmArr=Db::table("ad_distribute")
//                ->field(["FirmId","DistId"])
//                ->where("BillNo",$out_trade_no)
//                ->find();
//            echo "读取机构id";
//            echo "<br>";
//            print_r($firmArr);
//
//            $firmId=$firmArr["FirmId"];
//            $DistId=$firmArr["DistId"];   //广告投放表中的id
//
//            //通过openid读取用户的uid
//            $userInfo=Db::table("user")
//                ->field(["UserId","NickName"])
//                ->where("WachatOpenid",$openid)
//                ->find();
//            $userId=$userInfo["UserId"];
//            $nickName=$userInfo["NickName"];
//
//            echo "读取用户表";
//            echo "<br>";
//            print_r($userInfo);
//
//
//            //////////////finance_inc平台收入平台财务结算finance_inc 加入一条数据  说明当前用户购买了广告投入
//            $datainc=[
//                "PayerId"=>$userId,
//                "NickName"=>$nickName,
//                "FirmId"=>$firmId,
//                "payment"=>"1",
//                "BillNo"=>$out_trade_no,
//                "PayerName"=>$openid,
//                "Amount"=>$total_fee,
//                "Items"=>2,
//                "ItemsId"=>$DistId,
//                "PayTime"=>date("Y-m-d H:i:s")
//
//            ];
//            print_r($datainc);
//            Db::table("finance_inc")
//                ->insert($datainc);
//            Db::commit();
//
//        }
//        exit;
//    }

    /**
     *获取机构广告模板
     * 请求参数 firmId
     * Title标题   MainPic主图  TemplateId模板id

     */
    public function getADTemplateinFirm()
    {
        $request = Request::instance();
        $data = $request->param();
        $firmId=$data["firmId"];//机构id
        //通过机构id
        $res=Db::table("ad_template")->where("FirmId",$firmId)->field(["TemplateId","FirmId","Title","MainPic","CreateTime"])->select();
        for ($i=0;$i<count($res);$i++){
            $res[$i]["CreateDate"]=date("Y-m-d",strtotime($res[$i]["CreateTime"]));
        }
//        print_r($res);
//        exit;
        echo returnData(1,$res);
        exit;
    }

    /**
     *获取一个广告模板
     * 请求参数：templateId 模板id
     */
    public function getADTemplateById()
    {
        $request = Request::instance();
        $data = $request->param();
        $templateId=$data["templateId"];//模板id
        //通过模板id 获取广告模板的详情
        $res=Db::table("ad_template")->where("TemplateId",$templateId)->find();
        $res["MainPic"]=$res["MainPic"] !=""?json_decode($res["MainPic"],true):[];
        if ($res["SubPic1"]!=""){
            $res["SubPic1"]=json_decode($res["SubPic1"],true);
            array_multisort(array_column($res["SubPic1"],'seq'),SORT_ASC,$res["SubPic1"]);
        }else{
            $res["SubPic1"]=[];
        }
        if ($res["SubPic2"]!=""){
            $res["SubPic2"]=json_decode($res["SubPic2"],true);
            array_multisort(array_column($res["SubPic2"],'seq'),SORT_ASC,$res["SubPic2"]);
        }else{
            $res["SubPic2"]=[];
        }
        if ($res["SubPic3"]!=""){
            $res["SubPic3"]=json_decode($res["SubPic3"],true);
            array_multisort(array_column($res["SubPic3"],'seq'),SORT_ASC,$res["SubPic3"]);
        }else{
            $res["SubPic3"]=[];
        }

//        print_r($res);
//        exit;
        echo returnData(1,$res);
        exit;


    }

    /**
     *获取机构投放的广告
     */
    public function getADinFirm()
    {
        $request = Request::instance();
        $data = $request->param();
        $firmId=$data["firmId"];//机构id

        $adList=Db::table("ad_distribute")
            ->field(["ad_template.Title,ad_template.Title,MainPic,ad_distribute.*"])
            ->join("ad_template","ad_distribute.TemplateId=ad_template.TemplateId")
            ->where("ad_distribute.FirmId",$firmId)
            ->order("ad_distribute.DistId desc")
            ->select();
//        print_r($adList);
        echo returnData(1,$adList);
        exit;

    }








    /**
     *删除广告模板
     * 请求参数：templateId 广告模板id
     */
    public function delADTemplate()
    {
        $request = Request::instance();
        $data = $request->param();
        $templateId=$data["templateId"];//模板id
        //需要删除图片地址
        //通过模板id 获取到这条记录的所有图片地址
        $res1=Db::table("ad_template")->where("TemplateId",$templateId)->field(["MainPic","SubPic1","SubPic2","SubPic3"])->find();
        $arr=[];
        $MainPic=json_decode($res1["MainPic"],true);
        $SubPic1=json_decode($res1["SubPic1"],true);
        $SubPic2=json_decode($res1["SubPic2"],true);
        $SubPic3=json_decode($res1["SubPic3"],true);
        $path=ROOT_PATH . "public/static/images/uploads/";
        if($MainPic[0]["img"]!=""){
            $arr[]=$path.$MainPic[0]["img"];
        }
        for($i=0;$i<3;$i++){
            if($SubPic1[$i]["img"]!=""){
                $arr[]=$path .$SubPic1[$i]["img"];
            }
            if($SubPic2[$i]["img"]!=""){
                $arr[]=$path .$SubPic2[$i]["img"];
            }
            if($SubPic3[$i]["img"]!=""){
                $arr[]=$path .$SubPic3[$i]["img"];
            }
        }
        for($i=0;$i<count($arr);$i++){
            if (is_file($arr[$i])){
                unlink($arr[$i]);
            }

        }


        //通过模板id删除这条记录
        $res=Db::table("ad_template")->where("TemplateId",$templateId)->delete();


        if (!$res){
            echo returnData(0,"删除失败");
            exit;
        }
        echo returnData(1,"删除成功");
        exit;
    }

    /**
     *投放（新增）广告
     */
    public function newADDistribute()
    {

    }

    /**
     *获取一个投放广告
     */
    public function getADById()
    {

    }

    /***
     * 广告图片上传测试
     *
     */
    public function AdtestUpload()
    {

        $request = Request::instance();
        $data = $request->param();
        //获取表单上传文件
        $file = $request->file('firmImage');
        $info2 = $file->validate(['size' => '815678', 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "uploads");
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();
            echo $image;
            exit;
            exit;
        } else {
            // 上传失败
        }

    }

   



}
