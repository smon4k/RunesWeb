<?php
namespace app\index\controller;

use think\Request;
use think\Controller;

class IndexController extends Controller
{
    public function index()
    {
        // return 'Hello Runes API';
        return $this->fetch();
    }

    public function test()
    {
        return $this->fetch();
    }
}
