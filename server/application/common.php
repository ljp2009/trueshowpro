<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------
// 你的 APPID AK SK
const APP_ID = '17069985';
const API_KEY = 'HBKjmHkLNNmp9VBdIfnoDNk0';
const SECRET_KEY = '5NGOGltEGAGGmYVlrNab9hEBEvGiIv3d';
// 应用公共文件
function returnData($code,$msg,$others=""){
    $arr = array(
        "code" => $code,
        "msg" => $msg,
        "others" => $others
    );
    $data = json_encode($arr);
    return $data;
}

//封装curl 抓取数据
function curl($url, $method = "get", $type = "http", $data = "")
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    if ($type == "https") {
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);//不做服务器认证
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);//不做客户端认证
    }
    if ($method == "post") {
        curl_setopt($ch, CURLOPT_POST, true);//设置请求是POST方式
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);//设置POST请求的数据
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}
//人脸识别方法
function face($image){
    require_once 'AipFace.php';

//// 你的 APPID AK SK
//    const APP_ID = '17069985';
//    const API_KEY = 'HBKjmHkLNNmp9VBdIfnoDNk0';
//    const SECRET_KEY = '5NGOGltEGAGGmYVlrNab9hEBEvGiIv3d';

    $client = new AipFace(APP_ID, API_KEY, SECRET_KEY);

// https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566546114061&di=12945d7541e4e69ce8f5bd74051009de&imgtype=0&src=http%3A%2F%2Fimg4q.duitang.com%2Fuploads%2Fitem%2F201503%2F07%2F20150307162806_hRLjn.thumb.700_0.jpeg
//
// $image = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566546114061&di=12945d7541e4e69ce8f5bd74051009de&imgtype=0&src=http%3A%2F%2Fimg4q.duitang.com%2Fuploads%2Fitem%2F201503%2F07%2F20150307162806_hRLjn.thumb.700_0.jpeg";
//$image="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566546281536&di=0a9fe261dbbf010b6032741fa514dd9c&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201305%2F26%2F20130526140022_5fMJe.jpeg";
   // $image="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1569464376&di=e47bf3ff55bf6f3b2420597070495765&src=http://img.xinxic.com/img/9c763cf152033f65.jpg";
    $imageType = "URL";

// 调用人脸检测
    $client->detect($image, $imageType);

// 如果有可选参数
    $options = array();
//    $options["face_field"] = "age";
//    $options["max_face_num"] = 2;
//    $options["face_type"] = "LIVE";
//    $options["liveness_control"] = "LOW";

// 带参数调用人脸检测
    $data=$client->detect($image, $imageType, $options);
    return $data;

}


