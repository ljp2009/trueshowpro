<?php
namespace app\index\controller;
use think\Controller;

use think\Cookie;
use think\Db;
use think\Request;
//日记类
class Diary  extends Controller
{
    /**
     * 获取关注的技师 今日更新的日志数
     */
    public function todayDiarys()
    {

        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["customerId"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }
        $CustomerId=$data["customerId"];//顾客ID
        $res=Db::table("follower")
                ->alias("f")
                ->join("user u","f.StaffId=u.UserId")
                ->where(["f.CustomerId"=>$CustomerId])
                ->field(["u.UserId StaffId","u.NickName NickName","u.Certificated Certificated","u.Experience Experience","u.Satisfection Satisfection","u.Followers Fans","u.Diary Diary","u.WorkLike WorkLike","u.Skill Skill","u.WorkStartTime WorkStartTime","u.WorkEndTime WorkEndTime","u.Avatar Avatar"])
                ->select();





        //通过所有的StaffId  获取今日的日记动态数
        $today=date("Y-m-d");
        // echo $today;
        $allDiaryCount=0;
        $diaryList=[];
        $staffList=[];
        for($j=0;$j<count($res);$j++){
           // print_r($res[$j]);
            $staffId=$res[$j]['StaffId'];
            array_push($staffList,$staffId);
            $res1=Db::table('staff_diary')->where('StaffId',$staffId)->field(['DiaryId','StaffId','CreateTime'])->select();
            if(count($res1)!=0){
                //发表过日记的
                // print_r($res1);
                for($i=0;$i<count($res1);$i++){
                    $teachItem=$res1[$i];
                   // print_r($teachItem);
                    $diaryTime=$teachItem['CreateTime'];
                    $updTime=date("Y-m-d",strtotime($diaryTime));
                   // echo '============'.$updTime;
                    $arr=[];

                    if($updTime==$today){
                       // echo '----------'.$diaryTime;
                        array_push($diaryList,[ 'diaryId'=>  $teachItem['DiaryId'],'staffId'=>$teachItem['StaffId'],'createTime'=>$teachItem['CreateTime']]);

                        array_push($arr,1);
                    }
                    $allDiaryCount+=count($arr);

                }
            }else{
                $allDiaryCount=0;
            }


        }
//        print_r($diaryList);
//        echo '总数量'.$allDiaryCount;
//        exit;
//

//        if (!$allDiaryCount){
//            echo returnData(0,"出错了");
//            exit;
//        }



        if(count($diaryList)==0){
            echo returnData(1,$staffList,$allDiaryCount);
            exit;
        }else{
            echo returnData(1,$staffList,$allDiaryCount);
            exit;
        }



    }

    /**
     *获取技师日记
     */
    public function getDiarys()
    {

    }


    /**
     *日记点赞/取消点赞
     */
    public function likeDiary()
    {

    }
    /**
     *当前用户的日记点赞状态
     */
    public function checkLiked()
    {

    }

    /**
     *新建修改技师日记
     */
    public function saveDiary()
    {

    }


}
