<?php
// +----------------------------------------------------------------------
// | 文件说明：定时任务 Model
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2021 http://www.thinkcmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Author: wuwu <xxx@163.com>
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Date: 2022-02-18
// +----------------------------------------------------------------------
namespace app\api\model;

use think\Model;
use think\Config;
use RequestService\RequestService;

class Task extends Base
{

    /**
    * 处理任务
    * @param int $id 执行的id
    * @return bool
    */
    public static function deal($id)
    {
        // $item = array();
        //处理数据
        if ($id <= 0) { //查询状态为未执行或者执行失败次数小于10次 并且大于上次执行失败3分钟后的数据
            $sql = 'SELECT
                        id,command,`number`
                    FROM
                        s_task 
                    WHERE
                        ( `status` = 0 OR `status` = 3 ) 
                        AND `number` < 3 
                        AND IF ( `end_time` IS NULL, 0 = 0, now() > SUBDATE( `end_time`, INTERVAL - 1 MINUTE ))  -- 1分钟执行一次
                    ORDER BY
                        `id` ASC 
                    LIMIT 1';
            // $item = self::where(['status' => [['eq', 0],['eq', 3], 'or'], 'number' => ['<', 10]])->order(['id' => 'asc'])->find()->toArray();
            $sqlRes = self::query($sql);
            if ($sqlRes && count((array)$sqlRes) > 0) {
                $item = $sqlRes[0];
            } else {
                return true;
            }
            // p($item);
        } else {
            $sql = "SELECT id,command,`number` FROM s_task WHERE id = $id LIMIT 1";
            $sqlRes = self::query($sql);
            if ($sqlRes && count((array)$sqlRes) > 0) {
                $item = $sqlRes[0];
            } else {
                return true;
            }
        }
        // p($item);
        //设置正在执行
        self::where([
            'id' => $item['id'],
        ])->setField([
            'start_time' => date('Y-m-d H:i:s'),
            'remark' => '',
            'status' => 1,
        ]);
        //执行
        log_info('task-start-' . $item['id']);
        try {
            // p($returnArray);
            $EvalResult = eval('return '.$item['command'].';');
            if ($EvalResult && $EvalResult['code'] && $EvalResult['code'] == 1) {
                //设置执行的结束时
                // self::instance()->query('SET AUTOCOMMIT=0;');
                self::where([
                    'id' => $item['id'],
                ])->setField([
                    'remark' => $EvalResult['message'] === "ok" ? '异步执行成功' : $EvalResult['message'],
                    'end_time' => date("Y-m-d H:i:s"),
                    'status' => 2,
                    'data' => isset($EvalResult['data']) ? json_encode($EvalResult['data'], JSON_UNESCAPED_UNICODE) : '',
                ]);
            } else {
                self::where([
                    'id' => $item['id'],
                ])->setField([
                    'remark' => $EvalResult['message'],
                    'end_time' => date("Y-m-d H:i:s"),
                    'status' => 3,
                    'number' => $item['number'] + 1,
                    'data' => '',
                ]);
            }
        } catch (Exception $e) {
            $error_msg = json_encode([
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => $e->getCode(),
            ], JSON_UNESCAPED_UNICODE);
            self::where([
                'id' => $item['id'],
            ])->setField([
                'remark' => $error_msg,
                'end_time' => date("Y-m-d H:i:s"),
                'status' => 3,
                'number' => 10,
                'data' => '',
            ]);
            log_info('task-error', $error_msg);
            if ($id > 0) {
                echo_info('task-error', $error_msg);
            }
        }
        //结束
        log_info('task-end-' . $item['id']);
        return true;
    }

    /**
     * 添加任务数据
     * @author qinlh
     * @since 2022-02-18
     */
    public static function addTaskData($address='', $command='', $desc='')
    {
        if ($address !== '' && $command !== '') {
            $insertData = [
                'address' => $address,
                'command' => $command,
                'desc' => $desc,
                'create_time' => date('Y-m-d H:i:s')
            ];
            $insertId = self::insertGetId($insertData);
            if ($insertId >= 0) {
                return $insertId;
            }
        }
        return 0;
    }
    
    /**
     * 查询hash值是否执行成功
     * 如果没有执行成功 设置为成功
     * @author qinlh
     * @since 2022-02-18
     */
    public static function getTaskIdIsSuccess($task_id='')
    {
        if ($task_id > 0) {
            $res = self::where('id', $task_id)->find();
            if ($res && count((array)$res) > 0) {
                // return $res;
                $data = json_decode($res['data'], true);
                return ['code' => 1, 'status' => $res['status'], 'data' => $data];
            }
        }
        return ['code' => 0, 'data'=>[]];
    }

    /**
     * 合约同步执行失败
     * 修改异步任务为执行失败 不再进行执行
     * @author qinlh
     * @since 2022-02-18
     */
    public static function setHashIsError($hash='')
    {
        if (!empty($hash)) {
            $res = self::where('txid', $hash)->find();
            if ($res) { //如果没有执行成功的话
                self::where('txid', $hash)->setField(['status' => 3, 'number' => 10, 'remark' => '同步执行失败']);
                return true;
            }
        }
        return false;
    }
}
