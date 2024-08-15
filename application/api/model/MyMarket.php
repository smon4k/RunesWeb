<?php
// +----------------------------------------------------------------------
// | 文件说明：我的 NFT 市场 Model
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2021 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <xxx@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2021-11-27
// +----------------------------------------------------------------------
namespace app\api\model;

use think\Model;

class MyMarket extends Base
{

    /**
     * 获取我的市场数据
     * @author qinlh
     * @since 2021-11-26
     */
    public static function getMyMarketplaceData($where, $page, $limit=1000)
    {
        if ($limit <= 0) {
            $limit = config('paginate.list_rows');// 获取总条数
        }
        $count = self::where($where)->alias("a")->count();//计算总页面
        $allpage = intval(ceil($count / $limit));
        // p($where);
        $lists = self::where($where)
                ->alias("a")
                ->page($page, $limit)
                ->field('a.*')
                ->order("id asc")
                ->select()
                ->toArray();
        if (!$lists) {
            return false;
        }
        return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }


    /**
     * 购买操作
     * @author qinlh
     * @since 2024-08-05
     */
    public static function batchUnlockingScript($cfxsIds=[], $sendaddr='', $hash='')
    {
        if (count($cfxsIds) > 0 && $sendaddr !== '') {
            self::startTrans();
            try {
                $insertCount = 0;
                foreach ($cfxsIds as $key => $cfxId) {
                    $marget = Market::getMarketplaceDetailData($cfxId);
                    if($marget) {
                        $insertData = [
                            'chainid' => $cfxId,
                            'amount' => $marget['quantity'], 
                            'owner' => $sendaddr, 
                            'regaddr' => $marget['chainto'], 
                            'useraddr' => '', 
                            'regmarket' => $marget['regmarket'], 
                            'data' => $marget['data'], 
                            'addtime' => date('Y-m-d H:i:s'), 
                            'modifytime' => date('Y-m-d H:i:s'), 
                            'status' => 1
                        ];
                        $insertId = self::insert($insertData);
                        if ($insertId > 0) {
                            $delRes = Market::delMarketData($cfxId);
                            if($delRes !== false) {
                                MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($insertData), $hash, 1); //记录购买记录
                                $insertCount += 1;
                            }
                        }
                    }
                }
                if ($insertCount == count($cfxsIds)) {
                    self::commit();
                    return ['code' => 1, 'message' => 'ok'];
                } else {
                    self::rollback();
                    return ['code' => 0, 'message' => 'error'];
                }
            } catch (\Exception $e) {
                // p($e);
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        } else {
            return ['code' => 0, 'message' => 'parameter error'];
        }
    }


    /**
     * 出售操作
     * @author qinlh
     * @since 2024-08-06
     */
    public static function lockingScriptbatch($cfxsIds=[], $amounts=[], $sendaddr='', $lockhours=0, $hash='')
    {
        if (count($cfxsIds) > 0 && count($amounts) > 0 && $sendaddr !== '' && $lockhours >= 24) {
            self::startTrans();
            try {
                $insertCount = 0;
                foreach ($cfxsIds as $key => $cfxId) {
                    $marget = self::getMyMarketFind($cfxId);
                    if($marget) {
                        if(strtolower($marget['owner']) === strtolower($sendaddr)) {
                            $amount = $marget['amount'] * $amounts[$key]; //计算总价 数量 * 出售价格
                            $twentyFourHoursLater = date('Y-m-d H:i:s', time() + $lockhours * 3600); //计算锁定时间
                            $insertData = [
                                'chainid' => $cfxId,
                                'chainto' => $sendaddr, 
                                'amount' => $amount, 
                                'unitprice' => $amounts[$key], 
                                'quantity' => $marget['amount'], 
                                'regmarket' => $marget['regmarket'], 
                                'data' => $marget['data'], 
                                'addtime' => date('Y-m-d H:i:s'), 
                                'locktime' => $twentyFourHoursLater, 
                                'modifytime' => date('Y-m-d H:i:s'), 
                                'status' => 1
                            ];
                            $insertId = Market::insertData($insertData);
                            if ($insertId) {
                                $isSetStatus = self::setMyMarketStatus($marget['id'], 2);
                                if($isSetStatus) {
                                    MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($insertData), $hash, 2);
                                    $insertCount += 1;
                                }
                            }
                        }
                    }
                }
                if ($insertCount == count($cfxsIds)) {
                    self::commit();
                    return ['code' => 1, 'message' => 'ok'];
                } else {
                    self::rollback();
                    return ['code' => 0, 'message' => 'error'];
                }
            } catch (\Exception $e) {
                // p($e);
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        } else {
            return ['code' => 0, 'message' => 'parameter error'];
        }
    }

    /**
     * 取消出售操作
     * @author qinlh
     * @since 2024-08-06
     */
    public static function ownerUnlockingScript($cfxsId='', $sendaddr='', $hash='')
    {
        if ($cfxsId !== '' && $sendaddr !== '') {
            self::startTrans();
            try {
                $insertCount = 0;
                $market = Market::getMarketplaceDetailData($cfxsId);
                if($market) {
                    if(strtolower($market['chainto']) === strtolower($sendaddr)) {
                        $isDelRes = Market::delMarketData($cfxsId);
                        if($isDelRes) {
                            $isSetStatus = self::setMyMarketStatus($market['id'], 1);
                            if($isSetStatus) {
                                MarketLog::addMarketLogData($cfxsId, $sendaddr, json_encode($market), $hash, 3);
                                self::commit();
                                return ['code' => 1, 'message' => 'ok'];
                            }
                        }
                    }
                }
                self::rollback();
                return ['code' => 0, 'message' => 'error'];
            } catch (\Exception $e) {
                // p($e);
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        } else {
            return ['code' => 0, 'message' => 'parameter error'];
        }
    }

    /**
     * 合并操作
     * @author qinlh
     * @since 2024-08-06
     */
    public static function processTransaction($cfxsIds=[], $newCfxId='', $amount=0, $sendaddr='', $hash='')
    {
        if (count($cfxsIds) > 0 && $newCfxId !== '' && $amount > 0 && $sendaddr !== '') {
            self::startTrans();
            try {
                $amount = 0;
                foreach ($cfxsIds as $key => $cfxId) {
                    $marget = self::getMyMarketFind($cfxId);
                    if($marget) {
                        $amount += $marget['amount'];
                        self::setMyMarketStatus($marget['id'], 4);
                        MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($marget), $hash, 6, 1);
                    }
                }
                $insertData = [
                    'chainid' => $newCfxId,
                    'amount' => $amount, 
                    'owner' => $sendaddr, 
                    'regaddr' => '', 
                    'useraddr' => '', 
                    'regmarket' => 0, 
                    'data' => '', 
                    'addtime' => date('Y-m-d H:i:s'), 
                    'modifytime' => date('Y-m-d H:i:s'), 
                    'status' => 1
                ];
                $insertId = self::insert($insertData);
                if ($insertId) {
                    MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($insertData), $hash, 6);
                    self::commit();
                    return ['code' => 1, 'message' => 'ok'];
                }
                self::rollback();
                return ['code' => 0, 'message' => 'error'];
            } catch (\Exception $e) {
                // p($e);
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        } else {
            return ['code' => 0, 'message' => 'parameter error'];
        }
    }

    /**
     * 拆分操作
     * @author qinlh
     * @since 2024-08-06
     */
    public static function splitProcessTransaction($cfxsId='', $newCfxIds=[], $amounts=[], $sendaddr='', $hash='')
    {
        if ($cfxsId !== '' && count($newCfxIds) !== '' && count($amounts) > 0 && $sendaddr !== '') {
            self::startTrans();
            try {
                $insertCount = 0;
                $amount = 0;
                $marget = self::getMyMarketFind($cfxsId);
                if($marget) {
                    $isSplit = self::setMyMarketStatus($marget['id'], 3);
                    MarketLog::addMarketLogData($cfxsId, $sendaddr, json_encode($marget), $hash, 5, 1);
                    if($isSplit) {
                        foreach ($newCfxIds as $key => $val) {
                            $insertData = [
                                'chainid' => $val,
                                'amount' => $amounts[$key], 
                                'owner' => $sendaddr, 
                                'regaddr' => '', 
                                'useraddr' => '', 
                                'regmarket' => $marget['regmarket'], 
                                'data' => '', 
                                'addtime' => date('Y-m-d H:i:s'), 
                                'modifytime' => date('Y-m-d H:i:s'), 
                                'status' => 1
                            ];
                            $insertId = self::insert($insertData);
                            if ($insertId) {
                                MarketLog::addMarketLogData($val, $sendaddr, json_encode($insertData), $hash, 5); 
                                $insertCount += 1;
                            }
                        }
                    }
                }
                if ($insertCount == count($newCfxIds)) {
                    self::commit();
                    return ['code' => 1, 'message' => 'ok'];
                } else {
                    self::rollback();
                    return ['code' => 0, 'message' => 'error'];
                }
            } catch (\Exception $e) {
                // p($e);
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        } else {
            return ['code' => 0, 'message' => 'parameter error'];
        }
    }

    /**
     * 转赠
     * @author qinlh
     * @since 2024-08-06
     */
    public static function transfer($cfxsIds=[], $sendaddr='', $toaddr='', $hash='')
    {
        if (count($cfxsIds) > 0 && $sendaddr !== '' && $toaddr !== '') {
            self::startTrans();
            try {
                $insertCount = 0;
                foreach ($cfxsIds as $key => $cfxId) {
                    $marget = self::getMyMarketFind($cfxId);
                    if($marget) {
                        $isSetOwner = self::setMyMarketOwner($cfxId, $toaddr);
                        if($isSetOwner) {
                            $insertCount += 1;
                            MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($marget), $hash, 4); 
                        }
                    }
                }
                if ($insertCount == count($cfxsIds)) {
                    self::commit();
                    return ['code' => 1, 'message' => 'ok'];
                } else {
                    self::rollback();
                    return ['code' => 0, 'message' => 'error'];
                }
            } catch (\Exception $e) {
                // p($e);
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        } else {
            return ['code' => 0, 'message' => 'parameter error'];
        }
    }

    /**
     * 发布
     * @author qinlh
     * @since 2024-08-14
     */
    public static function inscribe($cfxsId='', $sendaddr='', $data='', $hash='')
    {
        if ($cfxsId !== '' && $sendaddr !== '' && $data !== '') {
            self::startTrans();
            try {
                $marget = self::getMyMarketFind($cfxId);
                if($marget) {
                    $isSetData = self::setMyMarketData($cfxId, $data);
                    if($isSetData) {
                        $inscribeData = [
                            "cfxsId" => $cfxsId,
                            "data" => $data
                        ];
                        MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($inscribeData), $hash, 7); 
                        self::commit();
                        return ['code' => 1, 'message' => 'ok'];
                    }
                }
                self::rollback();
                return ['code' => 0, 'message' => 'error'];
            } catch (\Exception $e) {
                // p($e);
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        } else {
            return ['code' => 0, 'message' => 'parameter error'];
        }
    }

    /**
     * 获取符文数据详情
     * @author qinlh
     * @since 2024-08-06
     */
    public static function getMyMarketFind($chainid=0)
    {
        if ($chainid > 0) {
            $res = self::where(['chainid' => $chainid, 'is_deleted' => 0])->find();
            if ($res) {
                return $res->toArray();
            }
        }
        return false;
    }

    /**
     * 删除My数据
     * @author qinlh
     * @since 2021-12-02
     */
    public static function delMyMarketData($chainid = 0)
    {
        if ($chainid > 0) {
            $res = self::where('chainid', $chainid)->delete();
            if ($res) {
                return true;
            }
        }
        return;
    }

    /**
     * 修改状态
     * @author qinlh
     * @since 2024-08-06
     */
    public static function setMyMarketStatus($id = 0, $status=0)
    {
        if ($id > 0 && $status > 0) {
            if($status == 3 || $status == 4) {
                $updateArr = [
                    'status' => $status,
                    'is_deleted' => 1,
                ];
            } else {
                $updateArr = [
                    'status' => $status,
                ];
            }
            $res = self::where('id', $id)->update($updateArr);
            if ($res !== false) {
                return true;
            }
        }
        return;
    }

    /**
     * 修改归属人钱包地址
     * @author qinlh
     * @since 2024-08-06
     */
    public static function setMyMarketOwner($chainid = 0, $owner='')
    {
        if ($chainid !== '' && $owner !== '') {
            $res = self::where('chainid', $chainid)->update(['owner' => $owner]);
            if ($res !== false) {
                return true;
            }
        }
        return;
    }

    /**
     * 修改data数据
     * @author qinlh
     * @since 2024-08-14
     */
    public static function setMyMarketData($chainid = 0, $data='')
    {
        if ($chainid !== '' && $data !== '') {
            $res = self::where('chainid', $chainid)->update(['data' => $data]);
            if ($res !== false) {
                return true;
            }
        }
        return;
    }


    // https://evm.confluxscan.io/tx/0xa550c92633890c85175128c05cc10cf7d54a7e35f43ec2a66175cab1208aec8e  https://evm.confluxscan.io/tx/0x9620cec9686f285900a8a83229ca8a062614525895713a8f5d6e4dfcb5915210 发布符文
















    /**
     * 获取用户对应nft数据
     * @author qinlh
     * @since 2021-11-28
     */
    public static function getUserNftFind($address='', $nft_id=0)
    {
        if ($nft_id > 0 && $address !== '') {
            $res = self::where(['address'=>$address, 'nft_id' => $nft_id])->order('id desc')->find();
            if ($res) {
                return $res->toArray();
            }
        }
        return false;
    }



    /**
     * 获取用户我的市场状态
     * @author qinlh
     * @since 2021-11-28
     */
    public static function getUserNftBuyFind($address='', $nft_id=0, $type = 0)
    {
        if ($nft_id > 0 && $address !== '' && $type > 0) {
            $res = self::where(['address'=>$address, 'nft_id' => $nft_id, 'type' => $type])->find();
            if ($res) {
                return $res->toArray();
            }
        }
        return false;
    }

    /**
     * 修改用户市场状态
     * @author qinlh
     * @since 2021-11-28
     */
    public static function setUserMarketplaceStatus($address='', $nft_id=0, $type=0, $sellPrice='', $crownsAddress='', $hash='')
    {
        if ($address != '' && $nft_id > 0 && $type >= 0) {
            self::startTrans();
            try {
                $isRes = self::getUserNftBuyFind($address, $nft_id, $type); //判断当前用户对应nft状态是否已经存在
                if (!$isRes || empty($isRes)) {
                    $res = self::getUserNftFind($address, $nft_id);
                    if ($res) {
                        // p($res);
                        // if ($type == 1) {
                        //     $where = ['address'=>$address, 'nft_id'=>$nft_id, 'type' => 3];
                        // }
                        $where = ['address'=>$address, 'nft_id'=>$nft_id];
                        $updateArr = ['type'=>$type, 'update_time' => date('Y-m-d H:i:s')];
                        if ($type == 1) { //如果是取消出售的话
                            $where = ['address'=>$address, 'nft_id'=>$nft_id, 'type' => 2];
                        }
                        if ($type == 2) { // 如果是已出售的话
                            $where = ['address'=>$address, 'nft_id'=>$nft_id, 'type' => 1];
                            $updateArr = ['sell_price' => $sellPrice, 'currency' => $crownsAddress, 'type'=>$type, 'update_time' => date('Y-m-d H:i:s')];
                        }
                        $ress = self::where($where)->update($updateArr);
                        if ($ress !== false) {
                            $data = json_encode([
                                'address' => $address,
                                'nft_id' => $nft_id,
                                'type' => $type,
                                'sellPrice' => $sellPrice,
                                'crownsAddress' => $crownsAddress,
                            ]);
                            if ($type == 1) { //已购买或者已取消出售
                                @Market::setMarketTradinStatus($nft_id, 1);
                            }
                            if ($type == 2) { //已出售
                                @Market::setMarketTradinStatus($nft_id, 2);
                            }
                            // if($type == 3) { //已出售成功
                            //     @Market::setMarketTradinStatus($nft_id, 1);
                            // }
                            @MarketLog::addMarketLogData($nft_id, $address, $data, $hash, $type); //记录购买记录
                            // return true;
                            self::commit();
                            return ['code' => 1, 'message' => 'ok'];
                        } else {
                            self::rollback();
                            return ['code' => 0, 'message' => '修改数据异常'];
                        }
                    }
                    self::rollback();
                    return ['code' => 0, 'message' => '获取数据异常'];
                } else {
                    self::commit();
                    return ['code' => 1, 'message' => '同步已执行成功'];
                }
            } catch (\Exception $e) {
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        }
    }

    /**
     * 添加到我的市场列表
     * @author qinlh
     * @since 2021-11-28
     */
    public static function addUserMarketplace($address='', $nft_id=0, $hash='')
    {
        if ($address != '' && $nft_id > 0) {
            self::startTrans();
            try {
                $res = self::getUserNftBuyFind($address, $nft_id, 1); //判断当前用户对应nft是否购买
                if (!$res) {
                    $nftRes = self::where(['nft_id'=>$nft_id, 'type'=>2])->find(); //查询是否有正在出售的nft
                    if ($nftRes) {
                        self::where(['nft_id'=>$nft_id, 'type'=>2])->update(['type' => 3, 'update_time' => date('Y-m-d H:i:s')]); //修改出售状态为已出售成功
                    }
                    $insertId = self::insert(['address'=>$address, 'nft_id'=>$nft_id, 'add_time' => date('Y-m-d H:i:s'), 'type' => 1]);
                    // p($insertId);
                    if ($insertId >= 0) {
                        $data = json_encode([
                            'address' => $address,
                            'nft_id' => $nft_id,
                        ]);
                        @Market::setMarketTradinStatus($nft_id, 1);//修改nft为购买状态
                        @MarketLog::addMarketLogData($nft_id, $address, $data, $hash, 1); //记录购买记录
                        self::commit();
                        return ['code' => 1, 'message' => 'ok'];
                    } else {
                        self::rollback();
                        return ['code' => 0, 'message' => '添加用户对应nft数据异常'];
                    }
                } else {
                    self::commit();
                    return ['code' => 1, 'message' => '同步已执行成功'];
                }
            } catch (\Exception $e) {
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        }
    }

    /**
     * 发送nft到其他地址
     * @author qinlh
     * @since 2021-11-28
     */
    public static function sendTransform($formAddress='', $toAddress='', $nft_id=0, $hash='')
    {
        if ($formAddress != '' && $toAddress != '' && $nft_id > 0) {
            self::startTrans();
            // var_dump(self::getUserNftBuyFind($toAddress, $nft_id, 1));die;
            try {
                $toRes = self::getUserNftBuyFind($toAddress, $nft_id, 1);
                if (!$toRes || empty($toRes)) {
                    $res = self::getUserNftBuyFind($formAddress, $nft_id, 1);
                    // p($res);
                    if ($res) {
                        // p($res);
                        $upRes = self::where('id', $res['id'])->update(['type' => 4, 'update_time' => date('Y-m-d H:i:s')]); //修改发送人状态为已发送
                        // var_dump($upRes);
                        // die;
                        if (false !== $upRes) {
                            // var_dump($toRes);die;
                            // if (!$toRes) {
                                // $updateRes = self::where('id', $res['id'])->update(['address'=>$toAddress, 'time' => date('Y-m-d H:i:s'), 'type' => 1]);
                                $updateRes = self::insert(['address'=>$toAddress, 'nft_id'=>$nft_id, 'add_time' => date('Y-m-d H:i:s'), 'type' => 1]); //添加接收人nft数据
                                // var_dump($updateRes);die;
                                if ($updateRes > 0) {
                                    $data = json_encode([
                                        'formAddress' => $formAddress,
                                        'toAddress' => $toAddress,
                                        'nft_id' => $nft_id,
                                    ]);
                                    @Market::setMarketTradinStatus($nft_id, 1);
                                    @MarketLog::addMarketLogData($nft_id, $formAddress, $data, $hash, 4); //记录购买记录
                                    self::commit();
                                    return ['code' => 1, 'message' => 'ok'];
                                } else {
                                    self::rollback();
                                    return ['code' => 0, 'message' => '添加用户对应nft数据异常'];
                                }
                            // }
                        }
                    }
                    self::rollback();
                    return ['code' => 0, 'message' => '获取数据或者修改数据异常'];
                } else {
                    self::commit();
                    return ['code' => 1, 'message' => '同步已执行成功'];
                }
                return true;
            } catch (\Exception $e) {
                // 回滚事务
                self::rollback();
                $error_msg = json_encode([
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode(),
                ], JSON_UNESCAPED_UNICODE);
                return ['code' => 0, 'message' => $error_msg];
            }
        }
        return false;
    }

    /**
     * 获取购买人历史记录
     * @author qinlh
     * @since 2021-11-29
     */
    public static function getMarketplaceHistory($nft_id=0)
    {
        if ($nft_id > 0) {
        }
    }
}
