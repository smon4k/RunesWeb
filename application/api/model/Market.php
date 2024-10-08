<?php
// +----------------------------------------------------------------------
// | 文件说明：NFT 市场 Model
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2021 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <xxx@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2024-08-05
// +----------------------------------------------------------------------
namespace app\api\model;

use think\Model;

class Market extends Base
{

    /**
     * 获取市场列表数据
     * @author qinlh
     * @since 2024-08-05
     */
    public static function getMarketplaceList($where, $page, $limit, $order='')
    {
        try {
            if ($limit <= 0) {
                $limit = config('paginate.list_rows');// 获取总条数
            }
            $count = self::where($where)->count();//计算总页面
            $allpage = intval(ceil($count / $limit));
            $lists = self::where($where)
                        ->page($page, $limit)
                        ->order($order)
                        ->field("*")
                        ->select()
                        ->toArray();
            if (!$lists) {
                return false;
            }
            return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
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
    }

    /**
     * 获取我的正在出售的数据
     * @author qinlh
     * @since 2024-08-07
     */
    public static function getSellOrdersData($where, $page, $limit)
    {
        try {
            if ($limit <= 0) {
                $limit = config('paginate.list_rows');// 获取总条数
            }
            $count = self::alias('a')->where($where)->count();//计算总页面
            $allpage = intval(ceil($count / $limit));
            $lists = self::alias('a')
                        ->where($where)
                        ->page($page, $limit)
                        ->order("id desc")
                        ->field("a.*")
                        ->select()
                        ->toArray();
            if (!$lists) {
                return false;
            }
            return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
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
    }

     /**
     * 插入数据
     * @author qinlh
     * @since 2024-08-06
     */
    public static function insertData($insertData=[]) {
        if(count($insertData) > 0) {
            $insertId = self::insert($insertData);
            if($insertId) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取详情数据
     * @author qinlh
     * @since 2024-08-05
     */
    public static function getMarketplaceDetailData($chainid=0)
    {
        $lists = [];
        if ($chainid !== '') {
            $lists = self::where('chainid', $chainid)->find();
            if ($lists) {
                return $lists->toArray();
            }
        }
        return false;
    }

    /**
     * 修改交易状态
     * @author qinlh
     * @since 2021-12-02
     */
    public static function setMarketTradinStatus($nftId = 0, $status=0)
    {
        if ($nftId > 0 && $status > 0) {
            $res = self::where('nft_id', $nftId)->find();
            if ($res) {
                self::where('nft_id', $nftId)->update(['tradin_status' => $status]);
            }
        }
        return;
    }

    /**
     * 删除出售数据
     * @author qinlh
     * @since 2021-12-02
     */
    public static function delMarketData($chainid = 0)
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
     * 获取最小出售价格
     * @author qinlh
     * @since 2024-08-23
     */
    public static function getMinSellPrice() {
        $res = self::min('amount');
        if ($res) {
            return $res;
        }
        return 0;
    }

    /**
     * 获取所有挂单数量
     * @author qinlh
     * @since 2024-08-23
     */
    public static function getAllSellAmount() {
        $amount = self::sum('quantity');
        if ($amount) {
            return $amount;
        }
        return 0;
    }
}
