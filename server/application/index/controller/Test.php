<?php
namespace app\index\controller;

use think\Controller;
use think\Db;

class Test extends Controller
{
    public function index()
    {
        $maincateArr=array("A","B","C","D","E","F","G","H","I");
        $cateArr=array("A1","A2","A3","A4","A5","A6","B1","B2","B3","B4","B5","C1","C2","C3","C4","C5","C6","D1","D2","D3","D4","D5","D6","E1","E2","E3","E4","E5","E6","F1","F2","F3","F4","F5","F6","G1","G2","G3","G4","G5","G6","H1","H2","H3","H4","H5","H6","I1","I2","I3");
        shuffle($cateArr);
//        print_r($cateArr);

//        user表
            $userArr=[];
            for($i=0;$i<100;$i++){

                //求7天以内的时间戳
                $time=time()-rand(0,7)*24*60*60;

                shuffle($cateArr);
                shuffle($maincateArr);
                $FirmId=$i>50?rand(1,50):"";

                $SkillStr="";
                $Certificated="";
                $PigeonStaff="";
                if($FirmId==""){
                    $Entry=0;
                    $StaffLevel=0;

                    //给用户分类赋值
                    $len=rand(0,count($cateArr)-1);
                    $MySubCat=[];
                    for($j=0;$j<$len;$j++){
                        $MySubCat[]=$cateArr[$j];
                    }
                    $MySubCatStr=implode(",",$MySubCat);

                    //顾客爽约
                    $PigeonCUST=rand(0,10);
//                    echo $MySubCatStr."<br>";

                }else{
                    //技师
                    $Entry=1;
                    $StaffLevel=$i<20?1:2;

                    //关注数
                    $Followers=rand(2,30);
                    $Satisfection=rand(0,50);
                    $WorkLike=rand(0,100);
                    $Reservation=rand(0,10);
                    $View=rand(0,100);
                    //技能分类的主分类
                    $len=rand(0,count($maincateArr)-1);
                    $Skill=[];
                    for($k=0;$k<$len;$k++){
                        $Skill[]=$maincateArr[$k];
                    }
                    $SkillStr=implode(",",$Skill);

//                    echo $SkillStr."<br>";


                    //是否认证
                    $Certificated=$i<30?0:1;

                    $PigeonStaff=rand(0,10);



                }


                $itemArr=array(

                    "NickName"=>$i.rand(0,99999),
                    "Gender"=>rand(0,1),
                    "WachatOpenid"=>rand(0,99999),
                    "FirmId"=>$FirmId,
                    "Entry"=>$Entry,
                    "StaffLevel"=>$StaffLevel,
                    "MySubCat"=>$MySubCatStr,
                    "Skill"=>$SkillStr?$SkillStr:"",
                    "Certificated"=>$Certificated?$Certificated:"",
                    "PigeonStaff"=>$PigeonStaff?$PigeonStaff:"",
                    "PigeonCUST"=>$PigeonCUST?$PigeonCUST:"",
                    "LastLoginTime"=>date("Y-m-d H:i:s",$time),


                );

                $userArr[]=$itemArr;
            }

            print_r($userArr);



            echo count($userArr);


            Db::name("user")
                ->insertAll($userArr);
            exit;
    }

    public function firm(){
        //获取主的服务项目
        $maincateArr=array("A","B","C","D","E","F","G","H","I");


        $time=time()-rand(0,7)*24*60*60;
        $firmArr=[];

        for ($i=0;$i<37;$i++){
            shuffle($maincateArr);

            $len=rand(0,count($maincateArr)-1);
            $ServiceMainCat=[];
            for($k=0;$k<$len;$k++){
                $ServiceMainCat[]=$maincateArr[$k];
            }
            $ServiceMainCatStr=implode(",",$ServiceMainCat);


            $itemArr=[
                "FirmName"=>rand(999,99999),
                "FirmTitle"=>rand(99999,9999999),
                "FirmType"=>rand(0,3),
                "Staffs"=>rand(0,10),
                "Lat"=>$this->randomFloat(38.95318, 40.95318),
                "Lng"=>$this->randomFloat(110.813599, 120.813599),
                "DealPoker"=>rand(0,10),
                "Status"=>rand(0,5),
                "Rakeoff"=>rand(1,20),
                "Certificated"=>rand(0,1),
                "Discription"=>"ssdsd",
                "Tester"=>rand(0,2),
                "CreateTime"=>$time,
                "ServiceMainCat"=>$ServiceMainCatStr


            ];

            $firmArr[]=$itemArr;

        }

        print_r($firmArr);

        Db::name("firm")
            ->insertAll($firmArr);
        exit;
    }


    public function poker(){
        $server=["A1","B1","C1"];

        $poker=[];
        for($i=0;$i<50;$i++){
            shuffle($server);
            $PokerCat=$server[rand(0,count($server)-1)];  //服务分类
            $ServiceId=$PokerCat=="A1"?1:($PokerCat=="B1"?2:3);  //服务项目id
            $ServiceName=$i.rand(99,9999);
            $ReservationId=rand(1,10);
            $RESNId=rand(1,10);
            $Rakeoff=rand(1,20);
            $StaffCert=rand(0,1);
            $FirmCert=rand(0,1);
            $Amount=rand(99,999);
            $Star=rand(1,5);
            $Anonym=rand(0,1);
            $RealPic=rand(0,1);
            $Favor=rand(0,20);
            $Read=rand(0,100);
            $ViewAllow=rand(0,2);

            $itemArr=array(
                "PokerCat"=>$PokerCat,
                "ServiceId"=>$ServiceId,
                "ServiceName"=>$ServiceName,
                "ReservationId"=>$ReservationId,
                "RESNId"=>$RESNId,
                "Rakeoff"=>$Rakeoff,
                "StaffCert"=>$StaffCert,
                "FirmCert"=>$FirmCert,
                "Amount"=>$Amount,
                "Star"=>$Star,
                "Anonym"=>$Anonym,
                "RealPic"=>$RealPic,
                "Favor"=>$Favor,
                "Read"=>$Read,
                "ViewAllow"=>$ViewAllow
            );

            $poker[]=$itemArr;

        }
        Db::name("poker")
            ->insertAll($poker);
        print_r($poker);
    }

   public function randomFloat($min = 0, $max = 1) {
        return $min + mt_rand() / mt_getrandmax() * ($max - $min);
    }
}
