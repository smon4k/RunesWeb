<?php
namespace app\api\controller;

use think\Request;
use think\Controller;
use RequestService\RequestService;
use app\api\model\TransactionTask;

class TransactiontaskController extends BaseController
{

    /**
     * 写入交易hash数据值
     * @author qinlh
     * @since 2024-08-13
     */
    public function saveTransactionTask(Request $request)
    {
        $address = $request->post('address', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $data = $request->post('data/a', [], '');
        $type = $request->post('type', 0, 'intval');
        $result = TransactionTask::saveTransactionTask($address, $hash, $data, $type);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', 'Error');
        }
    }
}
