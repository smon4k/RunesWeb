<?php
namespace app\api\controller;

use think\Request;
use think\Controller;
use okex\okv5;
use RequestService\RequestService;
use app\tools\model\Binance;
use app\tools\model\Okx;

class TestController extends BaseController
{
    public function index()
    {
        return $this->fetch('index');
    }

    public function test()
    {
        $url = "https://api.huobi.pro/v1/common/symbols";
        $data = $this->postPage($url);
        p($data);
    }
}
