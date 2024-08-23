<?php
// +----------------------------------------------------------------------
// | 文件说明：成交记录 Model
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2024 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <xxx@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2024-08-23
// +----------------------------------------------------------------------
namespace app\api\model;

use think\Model;
use think\Config;
use RequestService\RequestService;

class TransactionData extends Base
{
    /**
     * 写入成交记录数据
     * @author qinlh
     * @since 2024-08-23
     */
    public static function saveTransactionData($address='', $formaddress='', $chainid='', $amount=0, $price=0) {
        if($address !== '' && $formaddress !== '' && $chainid !== '' && $amount > 0 && $price > 0) {
            try {
                $insertData = [
                    "address" => $address,
                    "formaddress" => $formaddress,
                    "chainid" => $chainid,
                    "amount" => $amount,
                    "price" => $price,
                    "date" => date("Y-m-d H:i:s")
                ];
                $insertId = self::insert($insertData);
                if($insertId) {
                    return $insertId;
                }
                return false;
            } catch (\Exception $e) {
                return false;
            }
        }
    }

    /**
     * 获取统计数据
     * @author qinlh
     * @since 2024-08-23
     */
    public static function getStatisticsData() {
        try { 
            $minSellPrice = Market::getMinSellPrice(); //最低的挂单价
            $unitPrice = $minSellPrice; //最新的成交价
            $unitPriceRow = self::getNewFindData();
            if($unitPriceRow) {
                $unitPrice = $unitPriceRow['price'];
            }
            $New24DataList = self::getNew24DataList();
            $volume = 0; //最近24小时的所有成交额
            $volumeCount = count($New24DataList);
            foreach ($New24DataList as $key => $val) {
                $volume += (float)$val['price'] * (float)$val['amount'];
            }
            $totalVolume = 0; //所有成交额
            $allDataList = self::getAllDataList();
            $allVolumeCount = count($allDataList);
            foreach ($allDataList as $key => $val) {
                $totalVolume += (float)$val['price'] * (float)$val['amount'];
            }
            $ownerDatas = MyMarket::getUserSlotsNumber();
            $owners = count($ownerDatas); //所有持有slots的用户数量
            $listed = Market::getAllSellAmount(); //所有的挂单数量
            $market_cap = 0;
            return [
                'floor' => $minSellPrice,
                'unit_price' => $unitPrice,
                '24h_volume' => $volume,
                '24h_sales' => $volumeCount,
                'total_volume' => $totalVolume,
                'total_sales' => $allVolumeCount,
                'owners' => $owners,
                'listed' => $listed,
                'market_cap' => $market_cap
            ];
        } catch (\Exception $e) {
            p($e);
            return false;
        }
    }

    /**
     * 获取最新成交记录
     * @author qinlh
     * @since 2024-08-23
     */
    public static function getNewFindData() {
        $res = self::limit(1)->order('id desc')->find();
        if($res) {
            return $res->toArray();
        }
        return [];
    }

    /**
     * 获取最新24小时成交记录
     * @author qinlh
     * @since 2024-08-23
     */
    public static function getNew24DataList() {
        $currentTime = date('Y-m-d H:i:s');
        $time24HoursAgo = date('Y-m-d H:i:s', strtotime('-24 hours'));
        $result = self::where('date', '>', $time24HoursAgo)->select();
        if($result) {
            return $result->toArray();
        }
        return [];
    }

    /**
     * 获取所有成交记录
     * @author qinlh
     * @since 2024-08-23
     */
    public static function getAllDataList() {
        $result = self::select();
        if($result) {
            return $result->toArray();
        }
        return [];
    }
}