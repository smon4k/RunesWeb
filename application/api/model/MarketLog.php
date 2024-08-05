<?php
// +----------------------------------------------------------------------
// | 文件说明：日志记录 NFT 市场 Model
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2021 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <15035574759@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2021-11-29
// +----------------------------------------------------------------------
namespace app\api\model;

use think\Model;

class MarketLog extends Base
{
    /**
     * 添加日志操作记录数据
     * @author qinlh
     * @since 2021-11-28
     */
    public static function addMarketLogData($chainid=0, $address='', $data='', $hash='', $status=0)
    {
        if ($address != '' && $chainid > 0 && $data !== '') {
            $insertId = self::insert(['chainid'=>$chainid, 'address'=>$address, 'data'=>$data, 'time' => date('Y-m-d H:i:s'), 'ip' => getRealIp(), 'hash' => $hash, 'status' => $status]);
            if ($insertId >= 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取我的市场数据
     * @author qinlh
     * @since 2021-11-26
     */
    public static function getMarketHistoryList($where, $page, $limit=20)
    {
        if ($limit <= 0) {
            $limit = config('paginate.list_rows');// 获取总条数
        }
        $count = self::where($where)->alias("a")->join('nft_market b', 'a.nft_id=b.id')->join('nft_grade c', 'b.grade=c.id')->count();//计算总页面
        $allpage = intval(ceil($count / $limit));
        // p($where);
        $lists = self::where($where)
                ->alias("a")
                ->join('nft_market b', 'a.nft_id=b.nft_id')
                ->join('nft_grade c', 'b.grade=c.id')
                ->page($page, $limit)
                ->field('a.*,b.name,c.name as grade_name,b.price,c.power')
                ->order("a.id desc")
                ->select()
                ->toArray();
        if (!$lists) {
            return false;
        }
        foreach ($lists as $key => $val) {
            $lists[$key]['sell_price'] = 0;
            $dataArr = json_decode($val['data'], true);
            if ($dataArr && isset($dataArr['sellPrice'])) {
                $lists[$key]['sell_price'] = $dataArr['sellPrice'];
            }
        }
        return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }
}
