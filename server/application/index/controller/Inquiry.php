<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
use think\Request;
//服务项目问询类
class Inquiry  extends Controller
{
    /**
     *获取服务项目的问询
     * 请求参数：ServiceId 服务项目ID 机构id firmId
     * 返回参数：InquiryId	int
            Type	int	类型。0：问，1：答
            UserId	int	用户ID
            NickName	string	用户昵称
            Contents	string	内文
            CreateTime	string	时间
     */
    public function getInquiryByService()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["serviceId"]) || !isset($data["firmId"])){
            echo returnData(0,"参数不能为空");
            exit;
        }
        $ServiceId=$data["serviceId"];//服务项目ID
        $firmId=$data["firmId"];//机构id
        //通过ServiceId参数 查询inquiry表
        $res=Db::table("inquiry")
            ->alias("i")
            ->join("user u","u.UserId=i.UserId")
            ->where(["i.ServiceId"=>$ServiceId,"i.FirmId"=>$firmId])
            ->field(["i.*","u.Avatar"])
            ->select();
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
     *增加一条服务项目问询
     * FirmId 机构id
     *ServiceId	Y	int	服务项目ID
      UserId	Y	int	顾客/技师ID
     * NickName  顾客/技师
        Contents	Y	string	内文
        Type	Y	int	类型。0：问，1：答 （顾客问，技师答）
     * Reply
     *两种情况：问  答
     * 注意：data---》key--value 字段--字段值 7个参数
     * 如果是回答的话  额外一个字段为 对应问的那条记录的Id  InquiryId
     *
     */
    public function addInquiry()
    {
        $request=Request::instance();
        $data=$request->param();
        //  firmId: that.data.firmId,
        //        uid: uid,
        //        nickName: userNickName,
        //        serviceId: serviceId,
        //        contents: that.data.consultInputValue, //内文
        //        type: 0,//0：问，1：答 （顾客问，技师答）
        //        reply: 0 //0：未回复，1：已回复
        $firmId=$data["firmId"];
        $uid=$data["uid"];
        $nickName=$data["nickName"];
        $serviceId=$data["serviceId"];//服务项目ID
        $contents=$data["contents"]; //内文
        $type=$data["type"];//0：问，1：答 （顾客问，技师答）
        $reply=$data["reply"];//0：未回复，1：已回复

      $dataArr=[
          "ServiceId"=>$serviceId,
          "FirmId"=>$firmId,
          "UserId"=>$uid,
          "NickName"=>$nickName,
          "Type"=>$type,
          "Contents"=>$contents,
          "Reply"=>$reply,
          "CreateTime"=>date("Y-m-d H:i:s")
      ];

        if ($type==0){
          //问
            $res=Db::table("inquiry")->insertGetId($dataArr);
            if (!$res){
                echo returnData(0,"出错了");
                exit;
            }
            echo returnData(1,$res);
            exit;
        }else{
            //答 写入回答 同时还要把对应问的那条记录 更新 Reply为1
            //askId 答了那个问题的id
            $inquiryId=$data["inquiryId"];
            $dataArr["askId"]=$inquiryId;
            // 启动事务
            Db::startTrans();
            try{
                $InquiryId=$data["InquiryId"];//答---对应的问那条记录的id
                $res=Db::table("inquiry")->insert($dataArr);
                $res1=Db::table("inquiry")->where("Id",$InquiryId)->update(["Reply"=>1]);
                // 提交事务
                Db::commit();
                echo returnData(1,"发送成功");
                exit;
            } catch (\Exception $e) {
                echo returnData(0,"出错了");
                // 回滚事务
                //Db::rollback();
                exit;
            }
        }
    }

    /**
     *统计未回复询问数量
     * 请求参数：FirmId  隶属机构ID
     */
    public function countUnreplyInquiry()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["FirmId"])){
            echo returnData(0,"参数不能为空");
            exit;
        }
        $FirmId=$data["FirmId"];//隶属机构ID
        $count=Db::table("inquiry")->where(["FirmId"=>$FirmId,"Type"=>0,"Reply"=>0])->count();
        echo returnData(1,$count);
        exit;
    }

    /**
     *获取机构所有服务项目问询
     * 请求参数：FirmId 机构ID
     *
     */
    public function getInquiryByFirm()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["FirmId"])){
            echo returnData(0,"FirmId参数不能为空");
            exit;
        }
        $FirmId=$data["FirmId"];//机构ID
        $res=Db::table("inquiry")->alias("i")->join("service s","i.ServiceId=s.ServiceId")
            ->where(["i.FirmId"=>$FirmId,"i.type"=>0,"i.Reply"=>0])
            ->group("i.ServiceId")
            //->field(["i.ServiceId","s.ServiceName","group_concat(i.Id)","group_concat(i.Type)","group_concat(i.UserId)","group_concat(i.NickName)","group_concat(i.Contents)","group_concat(i.CreateTime)","group_concat(s.Pic)"])
            ->field(["i.ServiceId","s.ServiceName","i.Id","i.Type","i.UserId","i.NickName","i.Contents","i.CreateTime","s.Pic"])
            ->select();
        for ($i=0;$i<count($res);$i++){
            $res[$i]["Pic"]=json_decode($res[$i]["Pic"],true)["MainPic"];//只要主图
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
     *删除一条问询记录
     * 请求参数：问询表id  InquiryId
     */
    public function delInquiry()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["InquiryId"])){
            echo returnData(0,"InquiryId参数不能为空");
            exit;
        }
        $InquiryId=$data["InquiryId"];//问询表id
        $res=Db::table("inquiry")->where("Id",$InquiryId)->delete();
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res);
        exit;

    }



}
