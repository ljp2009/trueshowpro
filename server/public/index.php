<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// [ 应用入口文件 ]

// 定义应用目录
define('APP_PATH', __DIR__ . '/../application/');


//导入微信支付的文件
require_once "static/lib/weixinpay/lib/WxPay.Api.php";
require_once "static/lib/weixinpay/WxPay.JsApiPay.php";
require_once 'static/lib/weixinpay/log.php';
require_once "static/lib/weixinpay/lib/WxPay.Data.php";


// 加载框架引导文件
require __DIR__ . '/../thinkphp/start.php';
// \think\Build::module('admin');//创建admin模块