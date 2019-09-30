<?php
namespace app\index\controller;
use think\Console;
use think\Controller;
use think\Db;
use think\Request;

//财务结算类
class Finance  extends Controller
{

    /**
     *获取月度成员收支记录
     */
    public function test(){
        $request=Request::instance();
        $data=$request->param();
        $firmId=$data['firmId'];
        $staffIdList=json_decode($data['staffId'],true);
        $monthList=json_decode($data['month'],true);
        print_r($staffIdList);
        print_r($monthList);
        $res="";
        if (in_array("0", $staffIdList) && in_array("0", $monthList)) {
            echo '全部';
            $res=Db::table('finance_sum')
                ->where('FirmId',$firmId)
                ->select();
        }else if( empty($monthList)){
            echo "没有选月份---";
            $res=Db::table("finance_sum")
                ->where("PayerId","in",$staffIdList)
                ->where('FirmId',$firmId)
                ->select();


        }else if(empty($staffIdList)){
            echo "没有选技师---";
            $res=Db::table("finance_sum")
                ->where("Month","in",$monthList)
                ->where('FirmId',$firmId)
                ->select();


        }else{
            echo "选了技师 选择了月份--";
            $res=Db::table("finance_sum")
                ->where("PayerId","in",$staffIdList)
                ->where("Month","in",$monthList)
                ->where('FirmId',$firmId)
                ->select();
        }
        print_r($res);
       // print_r($res1);
            exit;
    }
    public function getFinanceOfStaff()
    {

        $request=Request::instance();
        $data=$request->param();
        $firmId=$data['firmId'];
        //读取当前的机构的佣金
        $rakeOff=Db::table("firm")->where("ID",$firmId)->field(["Rakeoff"])->find()["Rakeoff"];
        $staffIdList=json_decode($data['staffId'],true);
        $monthList=json_decode($data['month'],true);
//        print_r($staffIdList);
//        print_r($monthList);
        $res="";
        if( empty($monthList)){
//            echo "没有选月份---";
            $res=Db::table("finance_sum")
                ->where("PayerId","in",$staffIdList)
                ->where('FirmId',$firmId)
                ->select();


        }else if(empty($staffIdList)){
//            echo "没有选技师---";
            $res=Db::table("finance_sum")
                ->where("Month","in",$monthList)
                ->where('FirmId',$firmId)
                ->select();


        }else if (in_array("0", $staffIdList) && in_array("0", $monthList)) {
//            echo '全部';
            $res=Db::table('finance_sum')
                ->where('FirmId',$firmId)
                ->select();

        }else{
//            echo "选了技师 选择了月份--";
            $res=Db::table("finance_sum")
                ->where("PayerId","in",$staffIdList)
                ->where("Month","in",$monthList)
                ->where('FirmId',$firmId)
                ->select();
        }
//    刚进入页面得到机构下的 所有技师的收支记录
//        $request=Request::instance();
//        $data=$request->param();
//       //print_r($data);
//        $firmId=$data['firmId'];
//        $res=Db::table('finance_sum')
//            ->where('FirmId',$firmId)
//            ->select();

        $nickNameList=[];  //nickname list数组
        $incList=0;         //inc 相加的值
        $exp=$rakeOff;
        $all=0;
        $all1=0;

        for ($i=0;$i<count($res);$i++){
           /// $exp=$res[$i]['Total_exp'];
//            $all+=$res[$i]['Total_inc'];
//            $all-=$all*$exp/100;
            //$eachInc=$res[$i]['Total_inc'];
            $namelist=[
                'nickName'=> $res[$i]['NickName'],
                'staffId'=>$res[$i]['PayerId'],
            ];
            $nickNameList[]=$namelist;
            $incList+=$res[$i]['Total_inc'];
        }


       $nickNameList1=array_unique($nickNameList, SORT_REGULAR);  //去重
//        print_r($nickNameList);
//        print_r($nickNameList1);



        //除了佣金过后的值
        $exceptInc=$incList*$exp/100;
        $retunArr=[
            'nickNameList'=>$nickNameList1,
            'incList'=>$incList,   //交易总金额
            'exp'=>$exp,           //平台佣金2%
            'exceptInc'=>$exceptInc , //扣除钱数  *2的数值
            'remainInc'=>$incList-$exceptInc,   //实际收入
           // "rakeoff"=>$rakeOff
        ];
//184
        echo returnData(1,$retunArr);
        exit;
    }
//    技师收入金额对比
    public function compareFinanceOfStaff(){
        $request=Request::instance();
        $data=$request->param();

        //Array
        //(
        //    [firmId] => 1
        //    [nickNameList] => [{"nickName":"小贾","staffId":2,"index":0,"checked":false},{"nickName":"HQxyl","staffId":3,"index":1,"checked":false},{"nickName":"小黄","staffId":4,"index":2,"checked":false},{"nickName":"6349722","staffId":75,"index":3,"checked":false}]
        //    [choosedMonth] => 0
        //)
        //Array
        //(
        //    [firmId] => 1
        //    [nickNameList] => [{"nickName":"小贾","staffId":2,"index":0,"checked":false},{"nickName":"HQxyl","staffId":3,"index":1,"checked":false}]
        //    [choosedMonth] => ["7","8"]
        //)
        $arr=json_decode($data['nickNameList'],true);
        $monthList1=json_decode($data['choosedMonth'],true);
        $rakeOff=Db::table("firm")->where("ID",$data['firmId'])->field(["Rakeoff"])->find()["Rakeoff"];
        $staffIdList=[];
        $monthList=[];
        for($i=0;$i<count($arr);$i++){
            $staffIdList[]=$arr[$i]['staffId'];
        }
        for($i=0;$i<count($monthList1);$i++){
            $monthList[]=$monthList1[$i];
        }

        $res="";
       // print_r($staffIdList);
        if(empty($data['choosedMonth'])){
//            echo "没有选技师---";
//            $res=Db::table("finance_sum")
//                ->where("PayerId","in",$staffIdList)
//                ->where('FirmId',$data['firmId'])
//                ->select();
            $res=Db::table("finance_sum")
                ->where("PayerId","in",$staffIdList)
                ->where('FirmId',$data['firmId'])
                ->field('sum(Total_inc) sumTotalInc,Total_exp,PayerId,NickName')
                ->group('PayerId')
//                ->group('PayerId')
//                ->sum('Total_inc')
                ->select();




        }else{
            $res=Db::table("finance_sum")
                ->where("PayerId","in",$staffIdList)
                ->where("Month","in",$monthList)
                ->where('FirmId',$data['firmId'])
                ->field('sum(Total_inc) sumTotalInc,Total_exp,PayerId,NickName')
                ->group('PayerId')
//                ->group('PayerId')
//                ->sum('Total_inc')
//                ->field('')
                ->select();

        }

        for($i=0;$i<count($res);$i++){
            $res[$i]['money']=$res[$i]['sumTotalInc']-$res[$i]['sumTotalInc']*$rakeOff/100;
        }
      //  print_r($res);
        //Array
        //(
        //    [0] => Array
        //        (
        //            [sumTotalInc] => 200
        //            [Total_exp] => 10
        //            [PayerId] => 3
        //            [NickName] => HQxyl
        //            [money] => 190
        //        )
        //
        //)

        echo returnData(1,$res);
        //print_r($res);

        exit;
    }

    /**
     *获取机构业务流水
     */
    public function getJournalByFirm()
    {

    }
    /**
     *统计今日经营数据
     */
    public function countToday()
    {

    }
    /**
     *三指标总计
     */
    public function countRole()
    {

    }

    /**
     *日统计经营数据
     */
    public function countDays()
    {

    }

    /**
     *月统计经营数据
     */
    public function countMonths()
    {

    }
}
