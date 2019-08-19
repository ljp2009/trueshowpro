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
     *按分类名获取服务项目
     */
    public function getServiceByCat()
    {

    }

    /**
     *获取服务项目
     */
    public function getServiceById()
    {

    }

    /**
     *增加/保存服务项目
     */
    public function saveService()
    {

    }

    /**
     *服务项目上架/下架
     */
    public function arrangeService()
    {

    }

    /**
     *维护技师选中服务项目
     */
    public function updServiceOfStaff()
    {

    }

    /**
     *约单中的服务项目
     */
    public function getServiceRESN()
    {

    }

    /**
     *我的约单-服务
     */
    public function getMyServiceRESN()
    {

    }

    /**
     *统计机构下服务项目数量
     */
    public function countServiceByFirm()
    {

    }


}
