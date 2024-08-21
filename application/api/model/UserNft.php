<?php
// +----------------------------------------------------------------------
// | 文件说明：我的 NFT 市场 Model
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2024 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <xxx@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2024-08-16
// +----------------------------------------------------------------------
namespace app\api\model;

use think\Model;

class UserNft extends Base
{
    /**
     * 获取我的NFT数据
     * @author qinlh
     * @since 2024-08-16
     */
    public static function getMyNftData($where, $page, $limit=1000)
    {
        if ($limit <= 0) {
            $limit = config('paginate.list_rows');// 获取总条数
        }
        $count = self::where($where)->count();//计算总页面
        $allpage = intval(ceil($count / $limit));
        // p($where);
        $lists = self::where($where)
                ->page($page, $limit)
                ->field('*')
                ->order("id asc")
                ->select()
                ->toArray();
        if (!$lists) {
            return false;
        }
        return ['count'=>$count,'allpage'=>$allpage,'lists'=>$lists];
    }

    /**
     * 插入数据
     * @author qinlh
     * @since 2024-08-21
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
     * 获取NFT数据详情
     * @author qinlh
     * @since 2024-08-21
     */
    public static function getUserNftFind($tokenid=0)
    {
        if ($tokenid > 0) {
            $res = self::where(['tokenid' => $tokenid])->find();
            if ($res) {
                return $res->toArray();
            }
        }
        return false;
    }

    /**
     * 删除用户NFT数据
     * @author qinlh
     * @since 2024-08-21
     */
    public static function delUserNftData($tokenid = 0)
    {
        if ($tokenid > 0) {
            $res = self::where('tokenid', $tokenid)->delete();
            if ($res) {
                return true;
            }
        }
        return;
    }
}