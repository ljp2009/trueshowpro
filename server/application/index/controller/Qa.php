<?php
namespace app\index\controller;
//问答类
use think\Controller;
use think\Db;
use think\Request;


class Qa extends Controller
{



    //newAPic
    public function newAPic(){
        $request = Request::instance();
        $data = $request->param();
        $seq=$data["seq"];
        //获取表单上传文件
        $file = $request->file('img');
//        print_r($data);
        $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "uploads" .DS);
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();

            $arr=["seq"=>$seq,"img"=>$image];
            echo returnData(1,$arr);
            exit;
        }

    }



    public function newA(){
        $request = Request::instance();
        $data = $request->param();
//        print_r($data);
//        exit;
        $aid=$data["aid"];//答id
        $uid=$data["uid"];//用户id
        $qid=$data["qid"];////""--表示新建 >0表示编辑
        $title=$data["title"];//标题
        $content=$data["content"];//内文
        $anonym=$data["anonym"];//是否匿名 0-否 1-匿名
        $staffLevel=$data["staffLevel"];//隶属状态 0-顾客 2-技师
        //$favorited=$data["favorited"];//收藏数
        $Pic=json_decode($data["picArr"],true);//图片数据
        //需要比对 差集把文件删除
        $allimgurlArr=json_decode($data["allimgurlArr"],true);
        $insertimgurlArr=json_decode($data["insertimgurlArr"],true);
        $poorimgurlArr=array_diff($allimgurlArr,$insertimgurlArr);//差集
        foreach($poorimgurlArr as $key=>$val){
            if($val!="") {
                $_item = ROOT_PATH . "public/static/images/uploads/" . $val;
                unlink($_item);
            }
        }


        //通过$qid来判断是新建还是编辑

        if ($aid==""){
            //新建一个回答
            //第一 回答表:新增一条记录
            //第二 对应的问题表的那条记录的回答数量 ReplyCount 字段自加1
            $insertdata=[
                "Qid"=>$qid,
                "UserId"=>$uid,
                "Title"=>$title,
                "Contents"=>$content,
                "StaffLevel"=>$staffLevel,
                "Liked"=>0,
                "CreatTime"=>date("Y--m-d H:i:s"),
                "Anonym"=>$anonym,
                "Pic"=>json_encode($Pic)
                // "LastUpdate"=>date("Y--m-d H:i:s")
            ];
            // 启动事务
            Db::startTrans();
            try{
                //新建 一条回答
                $aid=Db::table("qna_a")->insertGetId($insertdata);//答id
                //回答数量加1
                $upReplyCount=Db::table("qna_q")->where("Qid",$qid)->setInc('ReplyCount');
                Db::commit();
                echo returnData(1,$aid);////新建的答id
                exit;
            } catch (\Exception $e) {
                echo returnData(0,"出错了");
                // 回滚事务
                Db::rollback();
                exit;

            }


        }else{
            $updata=[
                "Contents"=>$content,
                "StaffLevel"=>$staffLevel,
                //"Liked"=>$favorited,
                "Anonym"=>$anonym,
                "Pic"=>json_encode($Pic)
                // "LastUpdate"=>date("Y--m-d H:i:s")
            ];
            //编辑这条记录
            $res=Db::table("qna_a")->where("Aid",$aid)->update($updata);//
//            if (!$res){
//                echo returnData(0,"出错了");
//                exit;
//            }
            echo returnData(1,$aid);//编辑的答id
            exit;
        }
    }

    //newQPic
    public function newQPic(){
        $request = Request::instance();
        $data = $request->param();
        $seq=$data["seq"];
        //获取表单上传文件
        $file = $request->file('img');
//        print_r($data);
        $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "uploads" .DS);
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();

            $arr=["seq"=>$seq,"img"=>$image];
            echo returnData(1,$arr);
            exit;
        }

    }

    /**
     *新增/编辑问
     */
    public function newQ()
    {
        $request = Request::instance();
        $data = $request->param();
        $uid=$data["uid"];//用户id
        $qid=$data["qid"];////""--表示新建 >0表示编辑
        $title=$data["title"];//标题
        $content=$data["content"];//内文
        $anonym=$data["anonym"];//是否匿名 0-否 1-匿名
        $Pic=json_decode($data["picArr"],true);//图片数据
        //需要比对 差集把文件删除
        $allimgurlArr=json_decode($data["allimgurlArr"],true);
        $insertimgurlArr=json_decode($data["insertimgurlArr"],true);
        $poorimgurlArr=array_diff($allimgurlArr,$insertimgurlArr);//差集
        foreach($poorimgurlArr as $key=>$val){
            if($val!="") {
                $_item = ROOT_PATH . "public/static/images/uploads/" . $val;
                unlink($_item);
            }
        }
        //通过$qid来判断是新建还是编辑
        if ($qid==""){
            $insertdata=[
                "UserId"=>$uid,
                "Title"=>$title,
                "Contents"=>$content,
                "ReplyCount"=>0,
                "Favorited"=>0,
                "CreatTime"=>date("Y--m-d H:i:s"),
                "Ifanonym"=>$anonym,
                "Pic"=>json_encode($Pic)
            ];
            //新建
            $res=Db::table("qna_q")->insert($insertdata);//问题id
            if (!$res){
                echo returnData(0,"写入问答失败");
                exit;
            }
            echo returnData(1,"写入问答成功");
            exit;
        }else{
//            print_r($data);
//            exit;
            $updata=[
                "Title"=>$title,
                "Contents"=>$content,
                "Ifanonym"=>$anonym,
                "Pic"=>json_encode($Pic)
            ];
            //编辑这条记录
            $res=Db::table("qna_q")->where("Qid",$qid)->update($updata);//问题id
            if (!$res){
                echo returnData(0,"写入问答失败");
                exit;
            }
            echo returnData(1,"写入问答成功");
            exit;
        }

    }



    public function timediff($begin_time,$end_time)
    {
        if($begin_time < $end_time){
            $starttime = $begin_time;
            $endtime = $end_time;

        }else{
            $starttime = $end_time;
            $endtime = $begin_time;
        }

        //计算天数
        $timediff = $endtime-$starttime;
        $days = intval($timediff/86400);
        //计算小时数
        $remain = $timediff%86400;
        $hours = intval($remain/3600);
        //计算分钟数
        $remain = $remain%3600;
        $mins = intval($remain/60);
        //计算秒数
        $secs = $remain%60;
        $res=[];
        if($days==0){
            if($hours<1){
                $res = array("min" => $mins.'分');
            }else{
                $res = array("hour" => $hours.'时',"min" => $mins.'分');
            }

        }else if($hours==0){
            $res = array("min" => $mins.'分');
        }else if($days==0 && $hours==0){
            $res = array("min" => $mins.'分');

        }else{
            $res = array("day" => $days.'天',"hour" => $hours.'时',"min" => $mins.'分');
        }

        return $res;
    }




    /**
     *根据推荐条件来获取问答列表的数据
     */
    public function getTitleInQnasFromrecommended($getedArr){
        if (count($getedArr)==0){
            //
            $res=Db::table("qna_q")->select();
            if(count($res)<=12){
                if (count($res)!=0){
                    for($i=0;$i<count($res);$i++){
                        $a=$this->timediff(time(),strtotime($res[$i]['CreatTime']));
                        $res[$i]['charTime']=$a;
                    }
                }

                //记录条数小于12条
                //直接返回这些数据
                echo returnData(1,$res);
                exit;
            }

        }else{
            //
            $getedArr1=[];
            for($i=0;$i<count($getedArr);$i++){
                $getedArr1[$i]=$getedArr[$i]["Qid"];
            }
            //读出当前需要的数据

            $res=Db::table("qna_q")->where("Qid","not in",$getedArr1)->select();
            if(count($res)<=12){
                if (count($res)!=0){
                    for($i=0;$i<count($res);$i++){
                        $a=$this->timediff(time(),strtotime($res[$i]['CreatTime']));
                        $res[$i]['charTime']=$a;
                    }
                }
                //记录条数小于12条
                //直接返回这些数据
                echo returnData(1,$res);
                exit;
            }
        }



//
        //多于12条
        ////CreatTime
        $last_names1 = array_column($res,'CreatTime');
        array_multisort($last_names1,SORT_DESC,$res);
        $returnArr1=[];      //$returnArr  是creattime的

        for($i=0;$i<count($res);$i++){
            if(count($res)>=4){
                if($i<=3){
                    $returnArr1[]=$res[$i];
                    array_splice($res,$i,1);
                    //$i--;
                }
            }

        }

        ////ReplyCount
        $last_names2 = array_column($res,'ReplyCount');
        array_multisort($last_names2,SORT_DESC,$res);
        $returnArr2=[];      //$returnArr  是creattime的
        for($i=0;$i<count($res);$i++){
            if(count($res)>=4){
                if($i<=3){
                    $returnArr2[]=$res[$i];
                    array_splice($res,$i,1);
                    //$i--;
                }
            }

        }

        ////Favorited
        $last_names3 = array_column($res,'Favorited');
        array_multisort($last_names3,SORT_DESC,$res);
        $returnArr3=[];      //$returnArr  是creattime的

        for($i=0;$i<count($res);$i++){
            if(count($res)>=4){
                if($i<=3){
                    $returnArr3[]=$res[$i];
                    array_splice($res,$i,1);
                    //$i--;
                }
            }

        }
        //合并
        $returnArrList=array_merge($returnArr1,$returnArr2,$returnArr3);
//         $a=$this->timediff(time(),strtotime($dateArr[$j]['CreatTime']));
//          $dateArr[$j]['charTime']=$a;
        for($i=0;$i<count($returnArrList);$i++){
            $a=$this->timediff(time(),strtotime($returnArrList[$i]['CreatTime']));
            $returnArrList[$i]['charTime']=$a;
        }
        //print_r($returnArrList);

        echo returnData(1,$returnArrList);
//        print_r($res);
        exit;
    }

    /**
     *
     *除推荐条件其他的条件获取的问答列表
     */
    public function getTitleInQnasFromOthers($uid, $currenttabCurId, $lastIndex,$searchText){
        ////$currenttabCurId 参数来写不同的sql语句
        if ($currenttabCurId==1){
            //收藏  //按照 收藏字段 Favorited 排序
            $res=Db::table("qna_q")->order('Favorited desc')->limit($lastIndex,12)->select();

        }elseif($currenttabCurId==2){
            //我的问
            $res=Db::table("qna_q")->where("UserId",$uid)->limit($lastIndex,12)->select();

        }elseif($currenttabCurId==3){
            //我的答
            $res1=Db::table("qna_a")->where("UserId",$uid)->limit($lastIndex,12)->select();
            if(count($res1)==0){
                echo returnData(1,$res1);//空
                exit;
            }
            $qidArr=[];
            for($i=0;$i<count($res1);$i++){
                $qidArr[]=$res1[$i]["Qid"];
            }
            $res=Db::table("qna_q")->where("Qid","in",$qidArr)->limit($lastIndex,12)->select();

        }elseif ($currenttabCurId==4){
            //搜索   $searchText--关键字  ->where('name|title','like','thinkphp%')
            $res=Db::table("qna_q")->where("Title|Contents","like","%$searchText%")->limit($lastIndex,12)->select();

        }
        if(count($res)!=0){
            for($i=0;$i<count($res);$i++){
                $a=$this->timediff(time(),strtotime($res[$i]['CreatTime']));
                $res[$i]['charTime']=$a;
            }
        }



        echo returnData(1,$res);
        exit;
    }

    //recommended  getTitleInQnasFromrecommended
    /**
     *问答列表 接收条件
     */
    public function getTitleInQnas()
    {
        //CreatTime   ReplyCount   Favorited
        $request = Request::instance();
        $data = $request->param();
        $currenttabCurId=$data["currenttabCurId"];//当前选择的导航id 搜索的话--- 4
        $uid=$data["uid"];//用户
        if ($currenttabCurId==0){
            //推荐
            $getedArr=json_decode($data["msg"],true);//已经得到的数组
            //调用 按推荐那些条件来查数据
            $this->getTitleInQnasFromrecommended($getedArr);
        }else{
            $lastIndex=$data["msg"];//上一次最后值得索引值
            $searchText=$data["searchText"];
            if($lastIndex==-1){
                $lastIndex=0;
            }
            //$currenttabCurId 参数来写不同的sql语句
            // 调用 按推荐那些条件来查数据
            $this->getTitleInQnasFromOthers($uid,$currenttabCurId,$lastIndex,$searchText);
        }
    }






    public function nextData(){

    }


    /**
     *获取一个问题
     * 请求参数 qid uid
     */
    public function getQuestionById()
    {
        $request = Request::instance();
        $data = $request->param();
        $qid=$data["qid"];//问题id
        $uid=$data["uid"];//用户id
        $res=Db::table("qna_q")->where("Qid",$qid)->find();
        $count=Db::table("qna_favor")->where(["Qid"=>$qid,"UserId"=>$uid])->find();
        if(count($res)!=0){
            if($count==0){
                $res["ifFavor"]=0;//未收藏
            }else{
                $res["ifFavor"]=1;//收藏
            }
            $res["Pic"]=json_decode($res["Pic"],true);
        }
//        print_r($res);
//        exit;
        echo returnData(1,$res);
        exit;
    }


    /**首先把这个问题的全部的回答id发送给给前端 aid
     *请求参数 qid
     */
    public function getAnswerIdListById(){
        $request = Request::instance();
        $data = $request->param();
        $qid=$data["qid"];//问题id

        $res=Db::table("qna_a")->where("Qid",$qid)->field(["Aid"])->select();
        if (count($res)==0){
            echo returnData(1,$res);
            exit;
        }
        $aidArr=[];
        for($i=0;$i<count($res);$i++){
            $aidArr[]=$res[$i]["Aid"];
        }
        echo returnData(1,$aidArr);
        exit;
    }
    /**
     *获取一个回答
     * 请求参数 aid uid qid
     */
    public function getAnswerById()
    {
        $request = Request::instance();
        $data = $request->param();
        $aid=$data["aid"];//回答id
        $uid=$data["uid"];//用户id
        $qid=$data["qid"];//问题id
        //answerCount
        $answerCount=$data["answerCount"];//回答总条数
        $res=Db::table("qna_a")->where("Aid",$aid)->find();

        $StaffLevel=$res["StaffLevel"];//当前回答人的身份 是技师还是顾客
        //匿名 头像 性别 是否关注 是否点赞 昵称
        $answerUid=$res["UserId"];//回答人的id
        //通过answerUid 获取回答人的信息
        $answerUinfo=Db::table("user")->where("UserId",$answerUid)->field(["NickName","Gender","Avatar"])->find();
        //
        $qna_likedcount=Db::table("qna_liked")->where(["Qid"=>$qid,"Aid"=>$aid,"UserId"=>$uid])->find();
        //查看用户是否点赞了这条回答
        if (count($qna_likedcount)==0){
            $res["ifLiked"]=0; //未点赞
        }else{
            $res["ifLiked"]=1;//已经点赞
        }
        if ($StaffLevel==2){
            //技师
            //查看当前用户是否关注了这个技师 技师id
            //follower
            $followercount=Db::table("follower")->where(["StaffId"=>$answerUid,"CustomerId"=>$uid])->find();
            //查看用户是否点赞了这条回答
            if (count($followercount)==0){
                $res["iffollower"]=0;//未关注
            }else{
                $res["iffollower"]=1;//已经关注
            }
        }else{
            $res["iffollower"]=0;
        }
        $Liked=$res["Liked"];//点赞数 大于1000的需要转换为 几k
        if($Liked>=1000){
            //把当前数字转换为 几k
            $res["ifOverThousand"]=1;//是否过千了
            $res["nowLiked"]=round($res["Liked"]/1000, 1);
        }else{
            $res["ifOverThousand"]=0;
            $res["nowLiked"]=$res["Liked"];
        }
        $res["Pic"]=json_decode($res["Pic"],true);
        $res["answerCount"]=$answerCount;
        //点赞数量

        $res=array_merge($res,$answerUinfo);
        echo returnData(1,$res);
        exit;
    }

    /**
     *收藏问答
     * 请求参数 qid uid act
     */
    public function favoriteQuestion()
    {
        $request=Request::instance();
        $data=$request->param();
        if ( !isset($data["qid"]) || !isset($data["uid"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }

        $qid=$data["qid"];//问题id
        $uid=$data["uid"];//用户id
        $Act=$data["act"];//0：取消收藏，1收藏

        $data1=[
            "Qid"=>$qid,
            "UserId"=>$uid
        ];

        // 启动事务
        Db::startTrans();
        try{
            if ($Act==0){
                //取消点赞  删除这条记录
                $res=Db::table("qna_favor")->where($data1)->delete();
                $res1=Db::table("qna_q")->where("Qid",$qid)->setDec('Favorited');
                // 提交事务
                Db::commit();
                echo returnData(1,"取消收藏成功");
                exit;
            }else{
                //点赞 添加数据
                $res=Db::table("qna_favor")->insert($data1);
                $res1=Db::table("qna_q")->where("Qid",$qid)->setInc('Favorited');
                // 提交事务
                Db::commit();
                echo returnData(1,"收藏成功");
                exit;
            }

        } catch (\Exception $e) {
            echo returnData(0,"出错了");
            exit;
            // 回滚事务
           // Db::rollback();

        }
    }
    /**
     *点赞回答
     * 请求参数 aid qid uid act
     */
    public function likeAnswer()
    {
        $request=Request::instance();
        $data=$request->param();
        if (!isset($data["aid"])  ||   !isset($data["qid"]) || !isset($data["uid"])){
            //echo "参数不能为空";
            echo returnData(0,"参数不能为空");
            exit;
        }
        $aid=$data["aid"];//回答id
        $qid=$data["qid"];//问题
        $uid=$data["uid"];//用户
        $Act=$data["act"];//0：取消点赞，1点赞

        $data1=[
            "Qid"=>$qid,
            "Aid"=>$aid,
            "UserId"=>$uid
        ];

        // 启动事务
        Db::startTrans();
        try{
            if ($Act==0){
                //取消点赞  删除这条记录
                $res=Db::table("qna_liked")->where($data1)->delete();
                $res1=Db::table("qna_a")->where("Aid",$aid)->setDec('Liked');
                // 提交事务
                Db::commit();
                echo returnData(1,"取消关注成功");
                exit;
            }else{
                //点赞 添加数据
                $res=Db::table("qna_liked")->insert($data1);
                $res1=Db::table("qna_a")->where("Aid",$aid)->setInc('Liked');
                // 提交事务
                Db::commit();
                echo returnData(1,"关注成功");
                exit;
            }

        } catch (\Exception $e) {
            echo returnData(0,"出错了");
            exit;
            // 回滚事务
            //Db::rollback();


        }


    }
    /**
     *用户对当前问题的收藏状态
     */
    public function checkQnaFavor()
    {

    }

    //通过qid获取问题数据 //用于编辑页面
    public function getEditAskById()
    {
        //
        $request = Request::instance();
        $data = $request->param();
        $qid=$data["qid"];
        $res=Db::table("qna_q")
            ->where("Qid",$qid)
            ->field(["Title","Contents","Pic","Ifanonym"])
            ->find();
        if($res["Pic"]!=""){
            $res["Pic"]=json_decode($res["Pic"],true);
            array_multisort(array_column($res["Pic"],'seq'),SORT_ASC,$res["Pic"]);
        }else{
            $res["Pic"]=[];
        }

//        print_r($data);
//        exit;
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res);
        exit;

    }

    ////////////新建-----问///////////////////////////////////////

    /**
     *新增/编辑问 第一步 先存文字
     */
    public function newQFir()
    {
        $request = Request::instance();
        $data = $request->param();
//        print_r($data);
//        exit;

        //  qid:"",
        //        title: title,//用这个值来标记 当前是 >0是编辑  =-1是新建
        //        content: content,
        //        anonym: anonym
        //Array
        //(
        //    [/index/qa/newQnaFir] =>
        //    [qid] =>
        //    [title] => qqqqqqqqqq
        //    [content] => aaaaaaaaaaaaaaa
        //    [anonym] => 1
        //)

        $uid=$data["uid"];//用户id
        $qid=$data["qid"];////""--表示新建 >0表示编辑
        $title=$data["title"];//标题
        $content=$data["content"];//内文
        $anonym=$data["anonym"];//是否匿名 0-否 1-匿名
        //通过$qid来判断是新建还是编辑

        if ($qid==""){
            $insertdata=[
                "UserId"=>$uid,
                "Title"=>$title,
                "Contents"=>$content,
                "ReplyCount"=>0,
                "Favorited"=>0,
                "CreatTime"=>date("Y--m-d H:i:s"),
                "Ifanonym"=>$anonym
            ];
            //新建
            $qid=Db::table("qna_q")->insertGetId($insertdata);//问题id
            if (!$qid){
                echo returnData(0,"出错了");
                exit;
            }
            echo returnData(1,$qid);////新建的问题id
            exit;
        }else{
//            print_r($data);
//            exit;
            $updata=[
                "Title"=>$title,
                "Contents"=>$content,
                "Ifanonym"=>$anonym
            ];
            //编辑这条记录
            $res=Db::table("qna_q")->where("Qid",$qid)->update($updata);//问题id
//            if (!$res){
//                echo returnData(0,"出错了");
//                exit;
//            }
            echo returnData(1,$qid);//编辑的问题id
            exit;
        }

    }

    /**
     *新增/编辑问 第二步 存图片
     */
    public function newQSec()
    {
        ////////////////////////////注意图片文件是一张一张接收的
        $request = Request::instance();
        $data = $request->param();
        $lastid=$data["lastid"];//问题id
        //获取表单上传文件
        $file = $request->file('img');
//        print_r($data);
        $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "uploads");
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();
//            echo $image;
//            exi
            $seq=$data["seq"];//当前图片的索引值
            $lastArr=Db::table("qna_q")->where("Qid",$lastid)->field(["Qid","Pic"])->find();
            $Pic=$lastArr["Pic"];

            if ($Pic==""){
                $arr=[
                    ["img"=>$image,"seq"=>$seq]
                ];
                $Pic=json_encode($arr);
            }else{
                $arr=["img"=>$image,"seq"=>$seq];
                $Pic=json_decode($Pic,true);
                $seqarr=[];
                for ($i=0;$i<count($Pic);$i++){
                    //获取每一个seq
                    $seqarr[]=$Pic[$i]["seq"];
                }
                if (in_array($seq,$seqarr)){
                    for ($i=0;$i<count($Pic);$i++){
                        if ($seq==$Pic[$i]["seq"]){
                            $Pic[$i]["img"]=$image;
                        }
                    }
                }else{
                    $Pic[]=$arr;
                }

                $Pic=json_encode($Pic);
            }
            $res=Db::table("qna_q")->where("Qid",$lastid)->update(["Pic"=>$Pic]);


            if (!$res){
                echo returnData(0,"上传失败");
                exit;
            }
            echo returnData(1,"上传成功");
            exit;
        } else {
            // 上传失败
            echo returnData(0,"上传失败");
            exit;
        }

    }

    /////////////////////////////////


    //通过aid获取答数据 //用于编辑页面
    public function getEditAnswerById()
    {
        //
        $request = Request::instance();
        $data = $request->param();
        $qid=$data["aid"];
        $res=Db::table("qna_a")
            ->where("Aid",$qid)
            ->field(["Title","Contents","Pic","Anonym"])
            ->find();
        if($res["Pic"]!=""){
            $res["Pic"]=json_decode($res["Pic"],true);
            array_multisort(array_column($res["Pic"],'seq'),SORT_ASC,$res["Pic"]);
        }else{
            $res["Pic"]=[];
        }

//        print_r($data);
//        exit;
        if (!$res){
            echo returnData(0,"出错了");
            exit;
        }
        echo returnData(1,$res);
        exit;

    }

    /////////////新建答/编辑答////////////////////////////
    /// 第一步 先存文字
    public function newAFir(){
        $request = Request::instance();
        $data = $request->param();
//        print_r($data);
//        exit;
        $aid=$data["aid"];//答id
        $uid=$data["uid"];//用户id
        $qid=$data["qid"];////""--表示新建 >0表示编辑
        $title=$data["title"];//标题
        $content=$data["content"];//内文
        $anonym=$data["anonym"];//是否匿名 0-否 1-匿名
        $staffLevel=$data["staffLevel"];//隶属状态 0-顾客 2-技师
        //$favorited=$data["favorited"];//收藏数
        //通过$qid来判断是新建还是编辑

        if ($aid==""){
            //新建一个回答
            //第一 回答表:新增一条记录
            //第二 对应的问题表的那条记录的回答数量 ReplyCount 字段自加1
            $insertdata=[
                "Qid"=>$qid,
                "UserId"=>$uid,
                "Title"=>$title,
                "Contents"=>$content,
                "StaffLevel"=>$staffLevel,
                "Liked"=>0,
                "CreatTime"=>date("Y--m-d H:i:s"),
                "Anonym"=>$anonym,
               // "LastUpdate"=>date("Y--m-d H:i:s")
            ];
            // 启动事务
            Db::startTrans();
            try{
                //新建 一条回答
                $aid=Db::table("qna_a")->insertGetId($insertdata);//答id
                //回答数量加1
                $upReplyCount=Db::table("qna_q")->where("Qid",$qid)->setInc('ReplyCount');
                Db::commit();
                echo returnData(1,$aid);////新建的答id
                exit;
            } catch (\Exception $e) {
                echo returnData(0,"出错了");
                // 回滚事务
                Db::rollback();
                exit;

            }


        }else{
            $updata=[
                "Contents"=>$content,
                "StaffLevel"=>$staffLevel,
                //"Liked"=>$favorited,
                "Anonym"=>$anonym,
               // "LastUpdate"=>date("Y--m-d H:i:s")
            ];
            //编辑这条记录
            $res=Db::table("qna_a")->where("Aid",$aid)->update($updata);//
//            if (!$res){
//                echo returnData(0,"出错了");
//                exit;
//            }
            echo returnData(1,$aid);//编辑的答id
            exit;
        }
    }
    ////////第二步 存图片
    public function newASec(){
        ////////////////////////////注意图片文件是一张一张接收的
        $request = Request::instance();
        $data = $request->param();
        $lastid=$data["lastid"];//问题id
        //获取表单上传文件
        $file = $request->file('img');
//        print_r($data);
        $info2 = $file->validate([ 'ext' => 'jpg,png,gif'])->move(ROOT_PATH . "public" . DS . "static" . DS . "images" . DS . "uploads");
        if ($info2) {
            // 存入相对路径/upload/日期/文件名
            $image = $info2->getSaveName();
//            echo $image;
//            exi
            $seq=$data["seq"];//当前图片的索引值
            $lastArr=Db::table("qna_a")->where("Aid",$lastid)->field(["Aid","Pic"])->find();
            $Pic=$lastArr["Pic"];

            if ($Pic==""){
                $arr=[
                    ["img"=>$image,"seq"=>$seq]
                ];
                $Pic=json_encode($arr);
            }else{
                $arr=["img"=>$image,"seq"=>$seq];
                $Pic=json_decode($Pic,true);
                $seqarr=[];
                for ($i=0;$i<count($Pic);$i++){
                    //获取每一个seq
                    $seqarr[]=$Pic[$i]["seq"];
                }
                if (in_array($seq,$seqarr)){
                    for ($i=0;$i<count($Pic);$i++){
                        if ($seq==$Pic[$i]["seq"]){
                            $Pic[$i]["img"]=$image;
                        }
                    }
                }else{
                    $Pic[]=$arr;
                }

                $Pic=json_encode($Pic);
            }
            $res=Db::table("qna_a")->where("Aid",$lastid)->update(["Pic"=>$Pic]);


            if (!$res){
                echo returnData(0,"上传失败");
                exit;
            }
            echo returnData(1,"上传成功");
            exit;
        } else {
            // 上传失败
            echo returnData(0,"上传失败");
            exit;
        }
    }
    ////////////////////////////////////////
    /**
     *修改问答
     */
    public function updQna()
    {

    }


}