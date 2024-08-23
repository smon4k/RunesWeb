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
        $count = self::where($where)->count();//计算总页面
        $allpage = intval(ceil($count / $limit));
        // p($where);
        $lists = self::where($where)->page($page, $limit)->order("id desc")->select()->toArray();
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
                        $updateData = [
                            'owner' => $sendaddr,
                            'addtime' => date('Y-m-d H:i:s'), 
                            'modifytime' => date('Y-m-d H:i:s'), 
                            'status' => 1
                        ];
                        $insertId = self::where('chainid', $cfxId)->update($updateData);
                        if ($insertId > 0) {
                            $delRes = Market::delMarketData($cfxId);
                            if($delRes !== false) {
                                $insertTranData = TransactionData::saveTransactionData($sendaddr, $marget['chainto'], $cfxId, $marget['quantity'], $marget['amount']); //记录成交
                                if($insertTranData) {
                                    MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($marget), $hash, 1); //记录购买记录
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
                p($e);
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
                            $sellUnPrice = fromWei($amounts[$key]);
                            $countPrice = $marget['amount'] * $sellUnPrice; //计算总价 数量 * 出售价格
                            $twentyFourHoursLater = date('Y-m-d H:i:s', time() + $lockhours * 3600); //计算锁定时间
                            $insertData = [
                                'chainid' => $cfxId,
                                'chainto' => $sendaddr, 
                                'amount' => $countPrice, 
                                'unitprice' => $sellUnPrice, 
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
                                $isSetStatus = self::setMyMarketStatus($cfxId, 2);
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
                            $isSetStatus = self::setMyMarketStatus($cfxsId, 1);
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
                        self::setMyMarketStatus($cfxId, 4);
                        MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($marget), $hash, 6, 1);
                    }
                }
                $insertData = [
                    'chainid' => $newCfxId,
                    'amount' => $amount, 
                    'owner' => $sendaddr, 
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
                    $isSplit = self::setMyMarketStatus($cfxsId, 3);
                    MarketLog::addMarketLogData($cfxsId, $sendaddr, json_encode($marget), $hash, 5, 1);
                    if($isSplit) {
                        foreach ($newCfxIds as $key => $val) {
                            $insertData = [
                                'chainid' => $val,
                                'amount' => $amounts[$key], 
                                'owner' => $sendaddr,
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
                $marget = self::getMyMarketFind($cfxsId);
                if($marget) {
                    $isSetData = self::setMyMarketData($cfxsId, $data);
                    if($isSetData) {
                        $inscribeData = [
                            "cfxsId" => $cfxsId,
                            "data" => $data
                        ];
                        MarketLog::addMarketLogData($cfxsId, $sendaddr, json_encode($inscribeData), $hash, 7); 
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
     * CFXs转 NFT Coin
     * @author qinlh
     * @since 2024-08-21
     */
    public static function exchangeCFXsForECR20721($cfxsIds=[], $sendaddr='', $hash='')
    {
        if (count($cfxsIds) > 0 && $sendaddr !== '') {
            self::startTrans();
            try {
                $insertCount = 0;
                foreach ($cfxsIds as $key => $cfxId) {
                    $marget = self::getMyMarketFind($cfxId);
                    if($marget) {
                        $isDelRes = self::delMyMarketData($cfxId);
                        if($isDelRes) {
                            $insertNftData = [
                                'amount' => $marget['amount'],
                                'tokenid' => $cfxId,
                                'from' => '0x0000000000000000000000000000000000000000',
                                'to' => $sendaddr,
                                'status' => 1
                            ];
                            $insertId = UserNft::insertData($insertNftData);
                            if($insertId) {
                                $intCoinBalance = User::setUserCoinBalance($sendaddr, $marget['amount'], 1); //转Coin
                                if($intCoinBalance) {
                                    $insertCount += 1;
                                    MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($marget), $hash, 8); 
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
     * NFT 转 CFXs
     * @author qinlh
     * @since 2024-08-21
     */
    public static function ECR20721RedemptionOfCFXs($cfxsIds=[], $sendaddr='', $hash='')
    {
        if (count($cfxsIds) > 0 && $sendaddr !== '') {
            self::startTrans();
            try {
                $insertCount = 0;
                foreach ($cfxsIds as $key => $cfxId) {
                    $userNftData = UserNft::getUserNftFind($cfxId);
                    if($userNftData) {
                        $isDelRes = UserNft::delUserNftData($cfxId);
                        if($isDelRes) {
                            $insertData = [
                                'chainid' => $cfxId,
                                'amount' => $userNftData['amount'], 
                                'owner' => $userNftData['to'], 
                                'regmarket' => 0, 
                                'data' => '', 
                                'addtime' => date('Y-m-d H:i:s'), 
                                'modifytime' => date('Y-m-d H:i:s'), 
                                'status' => 1
                            ];
                            $insertId = self::insert($insertData);
                            if($insertId) {
                                $intCoinBalance = User::setUserCoinBalance($sendaddr, $userNftData['amount'], 2); //转Coin
                                if($intCoinBalance) {
                                    $insertCount += 1;
                                    MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($userNftData), $hash, 9); 
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
     * CFXs 转 Coin
     * @author qinlh
     * @since 2024-08-22
     */
    public static function ExchangeCFXsForOnlyECR20($cfxsIds=[], $sendaddr='', $hash='')
    {
        if (count($cfxsIds) > 0 && $sendaddr !== '') {
            self::startTrans();
            try {
                $insertCount = 0;
                foreach ($cfxsIds as $key => $cfxId) {
                    $userMarketData = self::getMyMarketFind($cfxId);
                    if($userMarketData) {
                        $isSetStatus = self::setMyMarketStatus($cfxId, 0);
                        if($isSetStatus) {
                            $intCoinBalance = User::setUserCoinBalance($sendaddr, $userMarketData['amount'], 1); //转Coin
                            if($intCoinBalance) {
                                $insertCount += 1;
                                MarketLog::addMarketLogData($cfxId, $sendaddr, json_encode($userMarketData), $hash, 10); 
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
     * Coin 转 CFXs
     * @author qinlh
     * @since 2024-08-22
     */
    public static function ECR20RedemptionOfCFXs($newCfxId='', $amount=0, $sendaddr='', $hash='', $data='')
    {
        if ($newCfxId !== '' && $sendaddr !== '' && $amount > 0) {
            self::startTrans();
            try {
                $insertData = [
                    'chainid' => $newCfxId,
                    'amount' => $amount, 
                    'owner' => $sendaddr,
                    'regmarket' => 0, 
                    'data' => $data, 
                    'addtime' => date('Y-m-d H:i:s'), 
                    'modifytime' => date('Y-m-d H:i:s'), 
                    'status' => 1
                ];
                $insertId = self::insert($insertData);
                if ($insertId) {
                    $intCoinBalance = User::setUserCoinBalance($sendaddr, $amount, 2); //转Coin
                    if($intCoinBalance) {
                        MarketLog::addMarketLogData($newCfxId, $sendaddr, json_encode($insertData), $hash, 11); 
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
    public static function setMyMarketStatus($chainid = 0, $status=0)
    {
        if ($chainid > 0 && $status >= 0) {
            if($status == 0 || $status == 3 || $status == 4) {
                $updateArr = [
                    'status' => $status,
                    'is_deleted' => 1,
                ];
            } else {
                $updateArr = [
                    'status' => $status,
                ];
            }
            $res = self::where('chainid', $chainid)->update($updateArr);
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

     /**
     * 获取所有持有slots数量
     * @author qinlh
     * @since 2024-08-14
     */
    public static function getUserSlotsNumber() {
        $result = self::where('status', 'in', [1, 2])->distinct(true)->field('owner')->select();
        if($result) {
            return $result->toArray();
        }
        return [];
    }




    // https://evm.confluxscan.io/tx/0xa550c92633890c85175128c05cc10cf7d54a7e35f43ec2a66175cab1208aec8e  https://evm.confluxscan.io/tx/0x9620cec9686f285900a8a83229ca8a062614525895713a8f5d6e4dfcb5915210 发布符文
}
