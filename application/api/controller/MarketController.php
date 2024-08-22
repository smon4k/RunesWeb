<?php
// +----------------------------------------------------------------------
// | 文件说明：NFT 市场
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2024 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <xxx@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2024-08
// +----------------------------------------------------------------------
namespace app\api\controller;

use app\api\model\Market;
use app\api\model\MyMarket;
use app\api\model\MarketLog;
use app\api\model\UserNft;
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
        $price_sort = $request->request('price_sort', '', 'trim');
        $time_sort = $request->request('time_sort', '', 'trim');
        $locktime_sort = $request->request('locktime_sort', '', 'trim');
        $merged = $request->request('merged', 0, 'intval');
        $unit_price_start = $request->request('unit_price_start', '', 'trim');
        $unit_price_end = $request->request('unit_price_end', '', 'trim');
        $idAddress = $request->request('id_address', '', 'trim');
        $where = [];
        $where['status'] = 1;
        $order = "id desc";
        if ($regmarket && $regmarket > 0) {
            $where['regmarket'] = $regmarket;
        }
        if($price_sort && $price_sort !== '') {
            $order .= ',unitprice ' . $price_sort;
        }
        if($time_sort && $time_sort !== '') {
            $order .= ',addtime ' . $time_sort;
        }
        if($locktime_sort && $locktime_sort !== '') {
            $order .= ',locktime ' . $locktime_sort;
        }
        if($merged && $merged > 0) {
            if($merged == 1) {
                $where['quantity'] = ['>', 1];
            } else {
                $where['quantity'] = ['<=', 1];
            }
        }
        if($unit_price_start && $unit_price_start !== '') {
            $where['unitprice'] = ['>=', $unit_price_start];
        }
        if($unit_price_end && $unit_price_end !== '') {
            $where['unitprice'] = ['<=', $unit_price_end];
        }
        if($idAddress && $idAddress !== '') {
            $where['chainid|chainto'] = $idAddress;
        }
        $result = Market::getMarketplaceList($where, $page, $limit, $order);
        return $this->as_json($result);
    }

    /**
     * 获取我的已购买或者待出售市场数据
     * @author qinlh
     * @since 2024-08-05
     */
    public function getMyMarketplaceData(Request $request)
    {
        $regmarket = $request->request('regmarket', 0, 'intval');
        $address = $request->request('owner', '', 'trim');
        $page = $request->request('page', 1, 'intval');
        $limit = $request->request('limit', 20, 'intval');
        $idAddress = $request->request('id_address', '', 'trim');
        $merged = $request->request('merged', 0, 'intval');
        $where = [];
        $where['status'] = 1;
        $where['owner'] = $address;
        if ($regmarket && $regmarket > 0) {
            $where['regmarket'] = $regmarket;
        }
        if($merged && $merged > 0) {
            if($merged == 1) {
                $where['amount'] = ['>', 1];
            } else {
                $where['amount'] = ['<=', 1];
            }
        }
        if($idAddress && $idAddress !== '') {
            $where['chainid|owner'] = $idAddress;
        }
        $result = MyMarket::getMyMarketplaceData($where, $page, $limit);
        // p($result);
        return $this->as_json($result);
    }

    /**
     * 获取我的NFT数据
     * @author qinlh
     * @since 2024-08-16
     */
    public function getMyNftData(Request $request)
    {
        $regmarket = $request->request('regmarket', 0, 'intval');
        $address = $request->request('owner', '', 'trim');
        $page = $request->request('page', 1, 'intval');
        $limit = $request->request('limit', 20, 'intval');
        $where = [];
        $where['status'] = 1;
        $where['to'] = $address;
        $result = UserNft::getMyNftData($where, $page, $limit);
        // p($result);
        return $this->as_json($result);
    }

    /**
     * 获取我的正在出售的数据
     * @author qinlh
     * @since 2024-08-07
     */
    public function getSellOrdersData(Request $request)
    {
        $address = $request->request('owner', '', 'trim');
        $page = $request->request('page', 1, 'intval');
        $limit = $request->request('limit', 20, 'intval');
        $where = [];
        // $where['a.status'] = 1;
        $where['a.chainto'] = $address;
        $result = Market::getSellOrdersData($where, $page, $limit);
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
            return $this->as_json('70001', $result['message']);
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
            return $this->as_json('70001', $result['message']);
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
            return $this->as_json('70001', $result['message']);
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
            return $this->as_json('70001', $result['message']);
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
            return $this->as_json('70001', $result['message']);
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
            return $this->as_json('70001', $result['message']);
        }
    }

    /**
     * inscribe 发布
     * @author qinlh
     * @since 2024-08-14
     * https://evm.confluxscan.io/tx/0x1c2fd0122decec511368f759c79edd5d626cb91ed61678ca7adff10aece8ac21
     */
    public function inscribe(Request $request)
    {
        $cfxsId = $request->post('cfxsId', '', 'trim');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $data = $request->post('data', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::inscribe($cfxsId, $sendaddr, $data, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', $result['message']);
        }
    }

    /**
     * CFXs转 NFT Coin
     * @author qinlh
     * @since 2024-08-21
     * https://evm.confluxscan.io/tx/0xb4aeed4a072e6db2e11fbc5de48bd0e3c9bed2431d7860107661e61727a87b50
     */
    public function exchangeCFXsForECR20721(Request $request)
    {
        $cfxsIds = $request->post('cfxsIds/a', [], '');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::exchangeCFXsForECR20721($cfxsIds, $sendaddr, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', $result['message']);
        }
    }

    /**
     * NFT 转 CFXs
     * @author qinlh
     * @since 2024-08-21
     * https://evm.confluxscan.io/tx/0xa9672132fa60dfc7d3d7d5f28313ddc49192d946c53681addbb2cfd933bb082e
     */
    public function ECR20721RedemptionOfCFXs(Request $request)
    {
        $cfxsIds = $request->post('cfxsIds/a', [], '');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::ECR20721RedemptionOfCFXs($cfxsIds, $sendaddr, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', $result['message']);
        }
    }

    /**
     * CFXs 转 Coin
     * @author qinlh
     * @since 2024-08-22
     * https://evm.confluxscan.io/tx/0x8560f2fb3778cf3bf2f3a2865eb375bbc38ac7e2901d503cba8b8470fc28af30
     */
    public function ExchangeCFXsForOnlyECR20(Request $request)
    {
        $cfxsIds = $request->post('cfxsIds/a', [], '');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $result = MyMarket::ExchangeCFXsForOnlyECR20($cfxsIds, $sendaddr, $hash);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', $result['message']);
        }
    }

    /**
     * Coin 转 CFXs
     * @author qinlh
     * @since 2024-08-22
     * https://evm.confluxscan.io/tx/0x48929dbd5316a5a452670f9d4576e0dd7be34c54f02bd9aafef743ac88848e58
     */
    public function ECR20RedemptionOfCFXs(Request $request)
    {
        $newCfxId = $request->post('newCfxId', '', 'trim');
        $amount = $request->post('amount', 0, 'intval');
        $sendaddr = $request->post('sendaddr', '', 'trim');
        $hash = $request->post('hash', '', 'trim');
        $data = $request->post('data', '', 'trim');
        $result = MyMarket::ECR20RedemptionOfCFXs($newCfxId, $amount, $sendaddr, $hash, $data);
        if ($result && $result['code'] == 1) {
            return $this->as_json('ok');
        } else {
            return $this->as_json('70001', $result['message']);
        }
    }


}


// https://evm.confluxscan.io/tx/0x93a18c9c914956a05c570ed524a1beac3aab647fe03fdf6af1407894e4d355f9 //CLS Resolve address

// https://evm.confluxscan.io/tx/0x545f85a9913c3b4b13cb52314561a761cd1a1a1f30319c47cf577c75c653b770 //CLS Set Name

// inscribe
// https://evm.confluxscan.io/tx/0x1c2fd0122decec511368f759c79edd5d626cb91ed61678ca7adff10aece8ac21 inscribe
// https://evm.confluxscan.io/tx/0xeadae3e769fc478d98bf955c5a7c495e2a5ed09a116b81dfd03dd847a57a06ed userDataRegist

// CFXs or NFT https://evm.confluxscan.io/tx/0xb4aeed4a072e6db2e11fbc5de48bd0e3c9bed2431d7860107661e61727a87b50 ExchangeCFXsForECR20721(uint256[] CFXsIds)
// NFT or CFXs https://evm.confluxscan.io/tx/0xa9672132fa60dfc7d3d7d5f28313ddc49192d946c53681addbb2cfd933bb082e ECR20721RedemptionOfCFXs(uint256[] CFXsIds)
// CFXs or Coin https://evm.confluxscan.io/tx/0x8560f2fb3778cf3bf2f3a2865eb375bbc38ac7e2901d503cba8b8470fc28af30 ExchangeCFXsForOnlyECR20(uint256[] CFXsIds)
// Coin or CFXs https://evm.confluxscan.io/tx/0x48929dbd5316a5a452670f9d4576e0dd7be34c54f02bd9aafef743ac88848e58 ECR20RedemptionOfCFXs(uint256 amount)