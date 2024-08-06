<?php
// +----------------------------------------------------------------------
// | 文件说明：NFT 市场
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2024 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <15035574759@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2024-08
// +----------------------------------------------------------------------
namespace app\api\controller;

use app\api\model\Market;
use app\api\model\MyMarket;
use app\api\model\MarketLog;
use app\api\model\Task;
use think\Request;
use think\Controller;
use think\Db;
use RequestService\RequestService;

class MarketController extends BaseController
{
    public function index()
    {
        return $this->fetch('index');
    }

    /**
     * 获取市场NFT所有列表数据
     * @author qinlh
     * @since 2024-08-05
     */
    public function getMarketplaceList(Request $request)
    {
        $regmarket = $request->request('regmarket', 0, 'intval');
        $page = $request->request('page', 1, 'intval');
        $limit = $request->request('limit', 20, 'intval');
        $name = $request->request('name', '', 'trim');
        $where = [];
        $where['a.status'] = 1;
        if ($regmarket && $regmarket > 0) {
            $where['a.regmarket'] = $regmarket;
        }
        if ($name && $name !== '') {
            $where['a.name'] = ['like',"%" . $name . "%"];
        }
        $result = Market::getMarketplaceList($where, $page, $limit);
        return $this->as_json($result);
    }

    /**
     * 获取我的已购买市场数据
     * @author qinlh
     * @since 2024-08-05
     */
    public function getMyMarketplaceData(Request $request)
    {
        $regmarket = $request->request('regmarket', 0, 'intval');
        $address = $request->request('owner', '', 'trim');
        $page = $request->request('page', 1, 'intval');
        $limit = $request->request('limit', 20, 'intval');
        $name = $request->request('name', '', 'trim');
        $where = [];
        // $where['a.status'] = 1;
        $where['a.owner'] = $address;
        if ($regmarket && $regmarket > 0) {
            $where['a.regmarket'] = $regmarket;
        }
        if ($name && $name !== '') {
            $where['b.name'] = ['like',"%" . $name . "%"];
        }
        $result = MyMarket::getMyMarketplaceData($where, $page, $limit);
        // p($result);
        return $this->as_json($result);
    }

    /**
     * 购买 支持批量购买
     * @author qinlh
     * @since 2024-08-05
     * https://evm.confluxscan.io/tx/0x68cbd444406ecfc4e03f6756227ee6306c84ca9b7fb010e7b80008feec019c04
     */
    public function batchUnlockingScript(Request $request)
    {
        $cfxsIds = $request->post('cfxsIds/a', [], '');
        // $amounts = $request->post('amounts/a', [], '');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::batchUnlockingScript($cfxsIds, $sendaddr, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', 'Error');
        }
    }

    /**
     * 售卖交易
     * @author qinlh
     * @since 2024-08-06
     * https://evm.confluxscan.io/tx/0xc9615b18b0db86750d57abdc9e919771b367e1cad6dc635b940e13bb3daa2582
     */
    public function lockingScriptbatch(Request $request)
    {
        $cfxsIds = $request->post('cfxsIds/a', [], '');
        $amounts = $request->post('amounts/a', [], '');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $lockhours = $request->post('lockhours', 0, 'intval');
        $result = MyMarket::lockingScriptbatch($cfxsIds, $amounts, $sendaddr, $lockhours, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', 'Error');
        }
    }

    /**
     * 取消售卖交易
     * @author qinlh
     * @since 2024-08-06
     * https://evm.confluxscan.io/tx/0x3c04e5226ca0f3422f20be5d8c52228c36019b2516174542f6eb40f62d3e288f
     */
    public function ownerUnlockingScript(Request $request)
    {
        $cfxsId = $request->post('cfxsId', '', 'trim');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::ownerUnlockingScript($cfxsId, $sendaddr, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', 'Error');
        }
    }

    /**
     * 合并交易
     * @author qinlh
     * @since 2024-08-06
     * https://evm.confluxscan.io/tx/0x6e3fab902bcc9ff31c59872a90e3f76cb7a2d37fe0cf259098064c09a77787fe 单个
     * https://evm.confluxscan.io/tx/0xad5c32833b88173073a951c24fd0cfc7276209c1dd196901a731ef892f8c4213 多个
     */
    public function processTransaction(Request $request)
    {
        $cfxsIds = $request->post('cfxsIds/a', [], '');
        $amount = $request->post('amount', 0, 'intval');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $newCfxId = $request->post('newCfxId', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::processTransaction($cfxsIds, $newCfxId, $amount, $sendaddr, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', 'Error');
        }
    }

    /**
     * 拆分交易
     * @author qinlh
     * @since 2024-08-06
     * https://evm.confluxscan.io/tx/0xdffeab2fbb5f01ed3df2f3300711c3913eb0c1470625c5a941f3b7c07d8dc0db
     */
    public function splitProcessTransaction(Request $request)
    {
        $cfxsId = $request->post('cfxsId', '', 'trim');
        $amounts = $request->post('amounts/a', [], '');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $newCfxIds = $request->post('newCfxIds/a', [], '');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::splitProcessTransaction($cfxsId, $newCfxIds, $amounts, $sendaddr, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', 'Error');
        }
    }

    /**
     * 转增交易
     * @author qinlh
     * @since 2024-08-06
     * https://evm.confluxscan.io/tx/0xe490e140caa324a7c17fac1e3be3f2f06219c9f17a0c92ac153ca42c2ac16af8
     */
    public function transfer(Request $request)
    {
        $cfxsIds = $request->post('cfxsIds/a', [], '');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $toaddr = $request->post('toaddr', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::transfer($cfxsIds, $sendaddr, $toaddr, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', 'Error');
        }
    }








    /**
     * 获取市场NFT热门列表数据
     * @author qinlh
     * @since 2021-11-26
     */
    public function getMarketplaceHotList(Request $request)
    {
        $page = $request->request('page', 1, 'intval');
        $limit = $request->request('limit', 20, 'intval');
        $name = $request->request('name', '', 'trim');
        $where = [];
        $where['a.status'] = 1;
        $where['a.is_hot'] = 1;
        if ($name && $name !== '') {
            $where['name'] = ['like',"%" . $name . "%"];
        }
        $result = Market::getMarketplaceHotList($where);
        return $this->as_json($result);
    }

    /**
     * 获取指定id详情数据
     * @author qinlh
     * @since 2021-11-26
     */
    public function getMarketplaceDetailData(Request $request)
    {
        $nftId = $request->request('nftId', 0, 'intval');
        $address = $request->request('owner', 0, 'trim');
        $result = Market::getMarketplaceDetailData($address, $nftId);
        return $this->as_json($result);
    }

    /**
     * 获取我的市场已出售数据
     * @author qinlh
     * @since 2021-11-26
     */
    public function getMyMarketplaceSaleData(Request $request)
    {
        // $type = $request->request('type', 0, 'intval');
        $address = $request->request('owner', '', 'trim');
        $page = $request->request('page', 1, 'intval');
        $limit = $request->request('limit', 20, 'intval');
        $name = $request->request('name', '', 'trim');
        $where = [];
        $where['a.type'] = 2;
        $where['a.address'] = $address;
        if ($name && $name !== '') {
            $where['b.name'] = ['like',"%" . $name . "%"];
        }
        $result = MyMarket::getMyMarketplaceData($where, $page, $limit);
        // p($result);
        return $this->as_json($result);
    }

    /**
     * 添加任务
     * 发起购买请求成功
     * @author qinlh
     * @since 2021-12-04
     */
    public function pullAddUserMarketplace(Request $request)
    {
        $address = $request->post('owner', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $nft_id = $request->post('nft_id', '', 'intval');
        $command = 'app\marketplace\model\MyMarket::addUserMarketplace(' . "'" . $address . "'" .  ',' . $nft_id . "," . "'" . $hash . "'" . ');';
        $result = Task::addTaskData($address, $nft_id, $hash, $command, 'Buy');
        if ($result) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', '添加任务失败');
        }
    }

    /**
     * 添加任务
     * 发起合约请求成功
     * 出售 取消出售
     * @author qinlh
     * @since 2021-11-28
     */
    public function pullSellTaskData(Request $request)
    {
        $address = $request->post('owner', '', 'trim');
        $nft_id = $request->post('nft_id', '', 'intval');
        $type = $request->post('type', '', 'intval'); // 2：出售 3：取消出售
        $crownsAddress = $request->post('crownsAddress', '', 'trim');
        $sellPrice = $request->post('sellPrice', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $command = 'app\marketplace\model\MyMarket::setUserMarketplaceStatus(' . "'" . $address . "'" . ',' . $nft_id . ',' . $type . ',' .  "'" . $sellPrice . "'" . ',' . "'" . $crownsAddress . "'" . ',' . "'" .$hash . "'" .');';
        // p($command);
        $remark = '';
        if ($type == 2) {
            $remark = 'Sell';
        }
        if ($type == 3) {
            $remark = 'Cancel Sell';
        }
        $result = Task::addTaskData($address, $nft_id, $hash, $command, $remark);
        if ($result) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', '添加任务失败');
        }
    }

    /**
     * 添加任务
     * 发起合约请求成功
     * 发送nft到指定token
     * @author qinlh
     * @since 2021-11-28
     */
    public function pullSendTransform(Request $request)
    {
        $formAddress = $request->post('formAddress', '', 'trim');
        $toAddress = $request->post('toAddress', '', 'trim');
        $nft_id = $request->post('nft_id', '', 'intval');
        $hash = $request->post('hash', '', 'trim');
        $command = 'app\marketplace\model\MyMarket::sendTransform(' . "'" . $formAddress . "'" . ',' . "'" . $toAddress . "'" . ',' . $nft_id . ',' . "'" . $hash . "'" . ');';
        $result = Task::addTaskData($formAddress, $nft_id, $hash, $command, 'Send');
        if ($result) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', '添加任务失败');
        }
    }

    /**
     * 购买成功 添加到我的市场
     * @author qinlh
     * @since 2021-11-28
     */
    public function addUserMarketplace(Request $request)
    {
        $address = $request->request('owner', '', 'trim');
        $hash = $request->request('hash', '', 'trim');
        $nft_id = $request->request('nft_id', '', 'intval');
        $result = MyMarket::addUserMarketplace($address, $nft_id, $hash);
        if ($result && $result['code'] == 1) {
            if (!empty($hash)) {
                Task::getHashSetIsSuccess($hash); //设置任务为成功 不再自动执行
            }
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', '添加我的市场失败');
        }
    }

    /**
     * 修改用户市场状态
     * 出售 取消出售 发送
     * @author qinlh
     * @since 2021-11-28
     */
    public function setUserMarketplaceStatus(Request $request)
    {
        $address = $request->request('owner', '', 'trim');
        $nft_id = $request->request('nft_id', '', 'intval');
        $type = $request->request('type', '', 'intval');
        $hash = $request->request('hash', '', 'trim');
        $crownsAddress = $request->request('crownsAddress', '', 'trim');
        $sellPrice = $request->request('sellPrice', '', 'trim');
        $result = MyMarket::setUserMarketplaceStatus($address, $nft_id, $type, $sellPrice, $crownsAddress, $hash);
        if ($result && $result['code'] == 1) {
            if (!empty($hash)) {
                Task::getHashSetIsSuccess($hash); //设置任务为成功 不再自动执行
            }
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', '修改状态失败');
        }
    }

    /**
     * 发送nft到指定token
     * @author qinlh
     * @since 2021-11-28
     */
    public function sendTransform(Request $request)
    {
        $formAddress = $request->request('formAddress', '', 'trim');
        $toAddress = $request->request('toAddress', '', 'trim');
        $nft_id = $request->request('nft_id', '', 'intval');
        $hash = $request->request('hash', '', 'trim');
        $result = MyMarket::sendTransform($formAddress, $toAddress, $nft_id, $hash);
        if ($result && $result['code'] == 1) {
            if (!empty($hash)) {
                Task::getHashSetIsSuccess($hash); //设置任务为成功 不再自动执行
            }
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', '发送失败');
        }
    }

    /**
     * 获取NFT购买人记录
     * @author qinlh
     * @since 2021-11-29
     */
    public function getMarketplaceHistory(Request $request)
    {
        $nft_id = $request->request('nft_id', '', 'intval');
        $result = MyMarket::getMarketplaceHistory($nft_id);
        if ($result) {
            return $this->as_json($result);
        } else {
            return $this->as_json('70001', '获取数据异常');
        }
    }

    /**
     * 获取历史记录数据
     * @author qinlh
     * @since 2021-12-02
     */
    public function getMarketHistoryList(Request $request)
    {
        $page = $request->request('page', 1, 'intval');
        $limit = $request->request('limit', 20, 'intval');
        $address = $request->request('owner', '', 'trim');
        $where = [];
        if ($address && $address !== '') {
            $where['a.address'] = $address;
        }
        $where['a.status'] = [['=', 1],['=', 2], 'OR'];
        $result = MarketLog::getMarketHistoryList($where, $page, $limit);
        // p($result);
        return $this->as_json($result);
    }

    /**
     * 修改异步任务为执行失败
     * @author qinlh
     * @since 2021-11-29
     */
    public function setHashIsError(Request $request)
    {
        $hash = $request->request('hash', '', 'trim');
        $result = Task::setHashIsError($hash);
        if ($result) {
            return $this->as_json($result);
        } else {
            return $this->as_json('70001', '修改数据异常');
        }
    }

    //批量写入数据
    public function getScapesData(Request $request)
    {
        $page = $request->request('page', 1, 'intval');
        $returnArr = [];
        if ($page <= 5) {
            $url = "https://scape.store/api/scapes?type=marketplace_default&networkID=56&page=".$page;
            $data = file_get_contents($url);
            $returnArr = json_decode($data, true);
        }
        // $limit = $request->request('limit', 20, 'intval');
        // p($returnArr);
        $data = [];
        foreach ($returnArr['data'] as $key => $val) {
            $data[] = [
                'nft_id' => $val['id'],
                'nft_address' => $val['nft_address'],
                'wallet_address' => $val['wallet_address'],
                'block_number' => $val['block_number'],
                'txid' => $val['txid'],
                'timestamp' => $val['timestamp'],
                'generation' => $val['generation'],
                'quality' => $val['quality'],
                'img_id' => $val['img_id'],
                'scape_id' => $val['scape_id'],
                'inserted_at' => date("Y-m-d H:i:s"),
                'updated_at' => date("Y-m-d H:i:s"),
                'price' => $val['price'],
                'sell_price' => $val['sell_price'],
                'currency' => $val['currency'],
                'alias' => $val['alias'],
                'name' => $val['name'],
                'description' => $val['description'],
            ];
        }
        // p($data);
        $res = Db::name('market')->insertAll($data);
        if ($res) {
            return $this->as_json("写入数据成功");
        }
    }
}
