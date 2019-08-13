<?php
/**
 * Created by PhpStorm.
 * Login: admin
 * Date: 2019/5/5
 * Time: 2:19
 */
namespace app\index\validate;

use think\Validate;

class Login extends Validate
{
    protected $rule = [
        'code'  =>  'require',
        "userinfo"=>  'require',
        "repwd"=> 'require|confirm:pwd|length:3,10',
        'email' =>  'email',
        "tel" =>  'require',
    ];

    protected $message  =   [
        'username.require' => '名称必须',
        'username.length'     => '名称在2~10个字符之内',
        "repwd.confirm" => '需要和密码保持一致',
        'email'        => '满足邮箱格式',
    ];

    protected $scene = [
        'login'  =>  ["code","userinfo"],
    ];
}