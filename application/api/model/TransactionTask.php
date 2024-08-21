<?php
// +----------------------------------------------------------------------
// | 文件说明：交易记录 Model
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2021 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <xxx@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2024-08-13
// +----------------------------------------------------------------------
namespace app\api\model;

use think\Model;
use think\Config;
use RequestService\RequestService;

class TransactionTask extends Base
{
    /**
     * 写入交易hash数据值
     * @author qinlh
     * @since 2024-08-13
     */
    public static function saveTransactionTask($address='', $hash='', $data=[], $type=0) {
        if($address !== '' && $hash !== '' && count($data) > 0 && $type > 0) {
            try {
                $method = self::getMethodData($type);
                $insertData = [
                    "address" => $address,
                    "hash" => $hash,
                    "parameter" => json_encode($data, JSON_UNESCAPED_UNICODE),
                    "remark" => $method['name'],
                    "method" => $method['method'],
                    "addtime" => date("Y-m-d H:i:s"),
                    "updatetime" => date("Y-m-d H:i:s"),
                    "type" => $type,
                    "status" => 1,
                    "data" => "",
                    "number" => 0,
                ];
                $insertId = self::insert($insertData);
                if($insertId) {
                    return ['code' => 1, 'message' => "ok"];
                }
                return ['code' => 0, 'message' => "error"];
            } catch (\Exception $e) {
                p($e);
                return ['code' => 0, 'message' => "error"];
            }
        }
    }

    /**
     * 获取对应的方法
     * @author qinlh
     * @since 2024-08-13
     */
    public static function getMethodData($type=0) {
        if($type) {
            $methods = [
                1 => 'batchUnlockingScript',
                2 => 'lockingScriptbatch',
                3 => 'ownerUnlockingScript',
                4 => 'processTransaction',
                5 => 'splitProcessTransaction',
                6 => 'transfer',
                7 => 'inscribe',
                8 => 'exchangeCFXsForECR20721',
                9 => 'ECR20721RedemptionOfCFXs',
            ];
            $messages = [
                1 => '购买',
                2 => '出售',
                3 => '取消出售',
                4 => '合并',
                5 => '拆分',
                6 => '转赠',
                7 => '发布',
                8 => 'CFXs转NFT',
                9 => 'NFT转CFXs',
            ];
            return ['method' => $methods[$type], 'name' => $messages[$type]];
        }
        return "";
    }
}