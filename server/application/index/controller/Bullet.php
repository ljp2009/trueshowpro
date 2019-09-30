<?php
namespace app\index\controller;
use think\Controller;
use think\Cookie;
use think\Db;
use think\Request;
//弹幕类
class Bullet   extends Controller
{
    /**
     *获取弹幕
     */
    public function getBullets()
    {

    }


    /**
     *获取用户基于晒单弹幕
     * 通过用户ID查询该用户所发弹幕，基于晒单ID编组。查询条件Origin = 0,来源为晒单;
     */
    public function getBulletsByUserId()
    {
        $request=Request::instance();
        $data=$request->param();
        $uid=$data["uid"];//发送人id
        $start=$data["start"];//加载起始数 默认为0
        $quantity=$data["quantity"];//单次请求加载数量（晒单编组数），默认30
        $res=Db::table("bullet")
            ->where(["Origin"=>0,"UserId"=>$uid])
            ->order('CreateTime desc')
            ->limit($start,$quantity)
            ->field(["BulletId","OriginId","count(BulletId) BulletCount","CreateTime","Discription"])
            ->group("OriginId")
            ->select();

        if(count($res)!=0){
            $res1=$res;
            $last_names = array_column($res1,'BulletId');
            array_multisort($last_names,SORT_DESC,$res1);
            $bestBulletId=$res1[0]["BulletId"];//为了得到当前最大的BulletId
        }else{
            $bestBulletId=0;
        }



//        print_r($res);
//
//        print_r($res1);
//        exit;
        echo returnData(1,$res,$bestBulletId);
        exit;
    }

    /**
     *我的晒单弹幕数量
     */
    public function countMyBullet()
    {
        $request=Request::instance();
        $data=$request->param();
        $uid=$data["uid"];//发送人id
        $count=Db::table("bullet")->where(["UserId"=>$uid,"Origin"=>0])->count();//晒单弹幕
        echo returnData(1,$count);
        exit;
    }


    /**
     *发送弹幕
     *
     */
    public function BulletSend()
    {
        $request=Request::instance();
        $data=$request->param();
        $uid=$data["uid"];//发送人id
        $pokerId=$data["pokerId"];//晒单id
        $nickname=$data["nickname"];//发送人昵称
        $des=$data["des"];//发送内容
        $origin=$data["origin"];//类型---晒单
        $insertData=[
            "OriginId"=>$pokerId,
            "UserId"=>$uid,
            "NickName"=>$nickname,
            "Discription"=>$des,
            "Origin"=>$origin,
            "CreateTime"=>date("Y-m-d H:i:s")
        ];
        $res=Db::table("bullet")->insert($insertData);
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res);
        exit;

    }



}
