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
    return json_encode($data);
}
