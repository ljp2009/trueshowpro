<?php
namespace app\index\controller;
//机构类
use think\Db;
use think\Request;
class Firm
{
    /**
     *获取附近机构
     * 1、获取用户地理位置坐标（微信）
     * 2、按距离参数查找附近机构，结果按最后更新时间排序，为空或不足数量则扩大50km范围重查
     * （营业状态=0，负责人Manager !="" ，技师数staffs>1,晒单数DealPoker>1）,读取数量不大于200，最多扩大范围查3次
     */
//    public function FirmNearby($lat,$lng,$km=5)
//    {
//        ////按照用户的当前位置的经纬度 距离 $km之内的机构信息
//        $slat  =39.98246;//纬度
//        $slng =117.07822;//经度
//
////        $sql = "SELECT *, ROUND(6378.138*2*ASIN(SQRT(POW(SIN(($slat*PI()/180-lat*PI()/180)/2),2)+COS($slat*PI()/180)*COS(lat*PI()/180)*POW(SIN(($slng*PI()/180-lng*PI()/180)/2),2)))) AS juli
////        FROM test1 having juli<=5";
//        $sql = "SELECT *, ROUND(6378.138*2*ASIN(SQRT(POW(SIN(($slat*PI()/180-lat*PI()/180)/2),2)+COS($slat*PI()/180)*COS(lat*PI()/180)*POW(SIN(($slng*PI()/180-lng*PI()/180)/2),2)))) AS juli
//        FROM test1";
//        $shop_list = Db::query($sql);
//
//    }

    public function FirmNearby()
    {
        ////按照用户的当前位置的经纬度 距离 $km之内的机构信息
        $slat  =39.98246;//纬度
        $slng =117.07822;//经度

//        $sql = "SELECT *, ROUND(6378.138*2*ASIN(SQRT(POW(SIN(($slat*PI()/180-lat*PI()/180)/2),2)+COS($slat*PI()/180)*COS(lat*PI()/180)*POW(SIN(($slng*PI()/180-lng*PI()/180)/2),2)))) AS juli
//        FROM test1 having juli<=5";
        $sql = "SELECT *, ROUND(6378.138*2*ASIN(SQRT(POW(SIN(($slat*PI()/180-lat*PI()/180)/2),2)+COS($slat*PI()/180)*COS(lat*PI()/180)*POW(SIN(($slng*PI()/180-lng*PI()/180)/2),2)))) AS distance
        FROM test1";
        $shop_list = Db::query($sql);

    }

    /**
     *获取机构基本信息
     */
    public function getFirmById()
    {

    }
    /**
     *获取机构简介信息
     */
    public function getDescInFirm()
    {

    }
    /**
     *搜索机构
     */
    public function searchFirm()
    {

    }

    /**
     *新建/保存机构基础信息
     */
    public function saveFirm()
    {

    }

    /**
     *更新机构信息
     */
    public function updFirm()
    {

    }

    /**
     *新建/修改机构认证
     */
    public function newCertFirm()
    {

    }
    /**
     *获取机构认证信息
     */
    public function getCertFirm()
    {

    }

    /**
     *机构二维码
     */
    public function getFirm2DCode()
    {

    }
}
