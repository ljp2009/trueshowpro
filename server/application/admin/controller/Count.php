<?php
namespace app\admin\controller;
//统计类
use think\Db;

class Count
{
    /**
     * 三指标总计
     */
    public function countRole()
    {

        $result=Db::table('statistices_months')->field(["FirmSum","StaffSum","CUSTSum"])->select();

        $firmList=0;
        $staffList=0;
        $cusList=0;
        for($i=0;$i<count($result);$i++){
             $firm=$result[$i]['FirmSum'];   //机构数量
             $staff=$result[$i]['StaffSum'];   //技师数量
             $cus=$result[$i]['CUSTSum'];   //geke数量
            $firmList+=$firm;
            $staffList+=$staff;
            $cusList+=$cus;
        }
        $listArr=[
           'firmList' =>$firmList,
            'staffList'=>$staffList,
            'cusList'=>$cusList
        ];

        echo returnData('1',$listArr);
        exit;
        echo $firmList.'----'.$staffList.'----'.$cusList;



//      return 111;
    }

    /**
     * 统计今日经营数据
     */
    public function CountToday()
    {

    }

    /**
     * 日统计经营数据
     */
    public function countDays()
    {

    }
    /**
     * 月统计经营数据
     */
    public function countMonths()
    {

    }

}
