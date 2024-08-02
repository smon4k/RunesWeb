<?php
// +----------------------------------------------------------------------
// | 文件说明：NFT 市场 Model
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2021 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <15035574759@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2021-11-26
// +----------------------------------------------------------------------
namespace app\api\model;

use think\Model;

class Market extends Base
{

    /**
     * 获取市场列表数据
     * @author qinlh
     * @since 2021-11-26
     */
    public static function getMarketplaceList($where, $page, $limit)
    {
        if ($limit <= 0) {
            $limit = config('paginate.list_rows');// 获取总条数
        }
        $count = self::alias('a')
                    ->where($where)
                    ->count();//计算总页面
        $allpage = intval(ceil($count / $limit));
        $lists = self::alias('a')
                    ->where($where)
                    ->page($page, $limit)
                    ->order("id asc")
                    ->field("a.*")
                    ->select()
                    ->toArray();
        if (!$lists) {
            return false;
        }
        return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }

    /**
     * 获取市场热门列表数据
     * @author qinlh
     * @since 2021-11-26
     */
    public static function getMarketplaceHotList($where)
    {
        $lists = self::alias('a')
                    ->join('nft_grade b', 'a.grade=b.id', 'LEFT')
                    ->where($where)
                    ->order("id asc")
                    ->field("a.*,b.name as grade_name,b.power,b.color")
                    ->select()
                    ->toArray();
        if (!$lists) {
            return false;
        }
        return $lists;
    }

    /**
     * 获取详情数据
     * @author qinlh
     * @since 2021-11-26
     */
    public static function getMarketplaceDetailData($address='', $nftId=0)
    {
        $lists = [];
        if ($nftId > 0) {
            $lists = self::alias('a')
                        ->join('nft_my_market c', 'c.nft_id=a.nft_id and c.type=a.tradin_status')
                        ->join('nft_grade b', 'a.grade=b.id', 'LEFT')
                        ->where('a.nft_id', $nftId)
                        ->field("a.*,b.name as grade_name,b.power,b.color,c.sell_price,c.currency")
                        ->find();
            if (!$lists) {
                return false;
            }
            $isBuyRes = MyMarket::getUserNftFind($address, $lists['nft_id']);
            // p($lists);
            $lists['type'] = 0;
            if ($isBuyRes) {
                $lists['type'] = $isBuyRes['type'];
            }
        }
        // p($lists);
        return $lists;
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
}
