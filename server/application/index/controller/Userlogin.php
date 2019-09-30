<?php
namespace app\index\controller;

use think\Controller;
use think\Db;
use think\Request;
use think\Config;
use think\Cookie;
//登录类
class Userlogin extends Controller
{
    /**
     *微信授权登录
     * 通过微信号登录后返回用户信息。
     * 前台先授权得到userinfo用户信息，再通过wx.login接口传入code、userinfo数据给服务器端；
     * 服务器端通过code获取到用户openid，判断该openid这条记录是否存在，存在就返回下列数据，不存在就先存入数据库同时返回数据。
     * 返回数据参数说明：code为-1是出错的情况;code为0是参数msg返回数据数组
     */
    public function WechatLogin()
    {
        $config=Config::get('wxmini');//获取小程序的配置
        $appid=$config["appid"];
        $appsecret=$config["appsecret"];
        $request=Request::instance();
        $data=$request->param();

        //validate验证
        $validate = validate('Login');
        if(!$validate->scene("login")->check($data)){
            // echo returnData("-1",$validate->getError());
            echo returnData(0,"出错了");
            exit;
        }
        $code=$data["code"];
        //得到code换取openid
        $url="https://api.weixin.qq.com/sns/jscode2session?appid=$appid&secret=$appsecret&js_code=$code&grant_type=authorization_code";
        $curldata=curl($url,"get","https");
        $data1=json_decode($curldata,true);
//        print_r($data1);
//        exit;
        $openid=$data1["openid"];//获取用户的openid
        $time=date("Y-m-d H:i:s");
        /////////////////////////////////////临时测试的一个openid  现在数据不是真实的
//        $openid="o5_Op5ZK2xzkshU0cKR1nLKub8g0";

        $count=Db::table("user")->where("WachatOpenid","=",$openid)->count();
        if ($count>0){
            //用户存在 证明登录过
            $res=Db::name('user')->where('WachatOpenid',$openid)->field(["UserId","LastLoginTime","Entry","StaffLevel","Reservation","km","MySubCat"])->find();
            if (!$res){
                echo returnData(0,"出错了");
                exit;
            }
            ///////////////////////////////得到当前的时间
            $currentTime=time();
            $lastTime=strtotime($res["LastLoginTime"]);
            $delta=$currentTime-$lastTime;  //时间差》24小时
            $res["ifGuide"]=$delta>24*3600?true:false;       //是否显示引导页



            $updateData=[
                "LastLoginTime"=>date("Y-m-d H:i:s",$currentTime)
            ];
            if($delta>48*3600){
                //////////////////更新数据库中的距离和分类 大于48小时
                $updateData["km"]=5;
                $updateData["MySubCat"]="";

                /////////////////往前端传递的数据
                $res["km"]=5;
                $res["MySubCat"]="";
            }


            /////////////////////把最后登录的时间更新到数据库中
            Db::name('user')->where('WachatOpenid',$openid)->update($updateData);



            echo returnData(1,$res);

            exit;
        }else{
            //不存在 写入数据库 返回数据
            $avatarUrl=$data["avatarUrl"];//头像
            $gender=$data["gender"];//微信里1-男孩 2-女孩
            $gender1=$gender == 1 ? 1 :  0;  //但是数据库设计为0--女 1--男
            $nickName=$data["nickName"];//昵称
            //LastLoginTime,Entry,StaffLevel,Reservation,km,","StaffLevel,MySubCat,UserId
            $inserdata=[
                "NickName"=>$nickName,
                "Gender"=>$gender1,
                "WachatOpenid"=>$openid,
                "Avatar"=>$avatarUrl,
                "LastLoginTime"=>$time,
                "Entry"=>0,
                "StaffLevel"=>0,
                "Reservation"=>0,
                "km"=>5,
                "MySubCat"=>"",
                "City"=>$data["region"]
            ];
            $resid=Db::name('user')->insertGetId($inserdata);
            if (!$resid){
                echo returnData(0,"数据未写入");
                exit;
            }
            $inserdata["UserId"]=$resid;
            $inserdata["ifGuide"]=true;
            //cookie('UserId',$resid, 24*3600);
            //cookie('Entry',$inserdata["Entry"], 24*3600);
            echo returnData(1,$inserdata);
            exit;
        }


    }

    public function UpdateUserCity(){
        $request=Request::instance();
        $data=$request->param();
        $uid=$data["uid"];
        $region=$data["region"];

        //
        $res=Db::table('user')->where('UserId', $uid)->update(['City' => $region]);
        if (!$res){
            echo returnData(0,"更新失败");
            exit;
        }
        echo returnData(1,"更新成功");
        exit;
    }

    //UpdateUserLastLoginTime
    public function UpdateUserLastLoginTime(){

        $request=Request::instance();
        $data=$request->param();
        $uid=$data["uid"];

        //
        $res=Db::table('user')->where('UserId', $uid)->update(['LastLoginTime' => date("Y-m-d H:i:s")]);
        if (!$res){
            echo returnData(0,"更新失败");
            exit;
        }
        echo returnData(1,"更新成功");
        exit;
    }


    /**
     *判断技师是否在线 在线写入表 下线删除这条记录
     * type：0--下线  1-在线
     */
    public function ifInsertStaffOnline(){
        //  StaffId: uid,//
        //                      type:1  // 1-上线 0-下线
        $request=Request::instance();
        $data=$request->param();
        $StaffId=$data["StaffId"];//技师id
        $type=$data["type"];//1-上线 0-下线
        if ($type==1){
            $data=["StaffId"=>$StaffId];

            //判断是否存在这条记录
            $count=Db::table("staff_online")->where("StaffId",$StaffId)->count();
            if ($count==0){
                //写入这条数据
                $res=Db::table("staff_online")->insert($data);
            }else{
                $res=true;
            }

        }else{
            //删除这条数据
            $res=Db::table("staff_online")->where("StaffId",$StaffId)->delete();
        }

        if (!$res){
            echo returnData(0,"操作失败");
            exit;
        }
        echo returnData(1,"操作成功");
        exit;
    }


    /**
     *默认用户端切换
     * 请求参数： CustomerId:顾客ID 。为空表示当前登录用户  Entry:默认用户端。0:顾客端界面，1：技师端界面
     * 前台记得把得到的userid存入缓存中 前台不知道切换去哪个界面的话,在调用上面WechatLogin方法时存一下StaffLevel状态结合处理
     * 更新user表的Entry字段的值
     *
     */
    public function switchEntry()
    {
        $request=Request::instance();
        $data=$request->param();
        //validate验证
        $validate = validate('Login');
        if(!$validate->scene("switchEntry")->check($data)){
            // echo returnData("-1",$validate->getError());
            echo returnData(0,"出错了");
            exit;
        }
        $CustomerId=$data["CustomerId"];//顾客ID
        $Entry=isset($data["Entry"]) ? $data["Entry"] : 0;//Entry:默认用户端。0:顾客端界面，1：技师端界面
        //切换技师端界面 更新Entry字段   切换顾客端界面 更新Entry字段为0
        $res=Db::table('user')->where('UserId', $CustomerId)->update(['Entry' => $Entry]);
        $errorInfo=$Entry==0?"用户端数据未更新,出错了":"技师端数据未更新,出错了";
        if (!$res){
            echo returnData(0,$errorInfo);
            exit;
        }
        echo returnData(1,"切换成功");
        exit;
    }

}
