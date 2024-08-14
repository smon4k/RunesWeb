import pymysql
import requests
import configparser
import time
import datetime
import json
from web3 import Web3

# 读取配置文件
config = configparser.ConfigParser()
config.read('db.conf')

# 获取数据库配置
db_config = {
    'host': config.get('db', 'host'),
    'user': config.get('db', 'user'),
    'password': config.get('db', 'pass'),
    'database': config.get('db', 'name'),
    'port': int(config.get('db', 'port')),
    'charset': config.get('db', 'charset')
}

# 获取RPC URL
rpc_url = config.get('config', 'rpcUrls')
api_url = config.get('config', 'apiUrl')

def check_transaction_status(tx_hash):
    """检查交易状态"""
    try:
        response = requests.post(rpc_url, json={
            "jsonrpc": "2.0",
            "method": "eth_getTransactionReceipt",
            "params": [tx_hash],
            "id": 1
        })
        receipt = response.json().get('result')
        logs = receipt.get('logs', [])
        
        # 打印交易日志
        for log in logs:
            hex_data = log.get('data')
            if hex_data.startswith("0x"):
                hex_data = hex_data[2:]
                # 使用 Python 内置方法进行转换
                decoded_data = bytes.fromhex(hex_data)
                print(decoded_data)
        # print(receipt)
        txExecErrorMsg = ""
        if receipt and receipt.get('status') == '0x0':
           txExecErrorMsg = receipt.get('txExecErrorMsg', 'Unknown error')

        return {'status': receipt.get('status'), 'data': txExecErrorMsg}
    except Exception as e:
        print(f"Error checking transaction status: {e}")
        return None

def get_error_info_message(receipt):
    if receipt.get('logs'):
        logs = receipt['logs']
        error_msg = logs[0].get('data') if logs else ''
        return error_msg
    return "Unknown error" 

def update_transaction_status(connection, tx_hash, status, msg):
    """更新数据库中的交易状态"""
    try:
       with connection.cursor() as cursor:
        # 根据交易hash获取当前状态和执行异常次数
        current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("SELECT status AS current_status, number AS current_number FROM r_transaction_task WHERE hash = %s", (tx_hash,))
        result = cursor.fetchone()
        # print(result)
        if result:
            current_status, current_number = result
            # 根据当前状态和新的执行结果来更新记录
            if status == 2:  # 执行成功
                # 更新状态为成功，并重置执行异常次数
                update_sql = "UPDATE r_transaction_task SET status = %s, data = '', updatetime = %s WHERE hash = %s"
                cursor.execute(update_sql, (status, current_time, tx_hash))
                # print(f"Transaction {tx_hash} succeeded. Status updated to success and attempt count reset.")
            elif status == 3 and current_status != 2:  # 执行失败，且之前未成功
                # 增加执行异常次数
                new_number = current_number + 1
                if new_number <= 10:
                    # 如果异常次数小于或等于10，更新状态和次数
                    update_sql = "UPDATE r_transaction_task SET status = %s, number = %s, data = %s, updatetime = %s WHERE hash = %s"
                    cursor.execute(update_sql, (status, new_number, msg, current_time, tx_hash))
                    # print(f"Transaction {tx_hash} failed. Attempt {new_number} of 10.")
                else:
                    # 如果异常次数超过10次，更新状态为超出尝试次数的状态
                    update_sql = "UPDATE r_transaction_task SET status = %s, data = %s, updatetime = %s WHERE hash = %s"
                    cursor.execute(update_sql, (4, msg, current_time, tx_hash))
                    # print(f"Transaction {tx_hash} has exceeded the maximum number of attempts.")
            # 提交事务
            # connection.commit()
            return True
        else:
            print(f"Transaction hash {tx_hash} not found in the database.")
            return False
    except Exception as e:
        print(f"Error updating transaction status: {e}")
        return False

def call_api_on_success(method, parameter):
    """智能合约执行成功后调用API接口"""
    try:
        payload = json.loads(parameter)
        url = f"{api_url}/Api/Market/{method}"
        # 发送 POST 请求
        response = requests.post(url, json=payload)
        response.raise_for_status()  # 如果请求返回了失败的状态码，将抛出异常]

        # 解析响应的 JSON 数据
        response_data = response.json()
        # print(response_data)
        # 检查响应码是否为 10000，代表成功
        if response_data.get('code') == 10000:
            # print("API call was successful.")
            return response_data
        else:
            print("API call failed with code:", response_data.get('code'), "msg:", response_data.get('msg'))
            return None
    except requests.RequestException as e:
        print(f"Error calling API: {e}")
        return None
    
def listen_for_transaction_updates():
    """监听数据库中的交易状态并更新"""
    connection = pymysql.connect(**db_config)
    # print(connection)
    try:
        while True:
            with connection.cursor() as cursor:
                sql = "SELECT hash, status, number, method, parameter FROM r_transaction_task WHERE status = 1 OR status = 3 LIMIT 10"
                cursor.execute(sql)
                pending_transactions = cursor.fetchall()
                for row in pending_transactions:
                    hash, status, number, method, parameter = row
                    # print(hash)
                    receipt = check_transaction_status(hash)
                    # print(receipt)
                    if receipt is not None:
                        new_status = 2 if receipt['status'] == '0x1' else 3
                        # if new_status != status:
                        is_update = update_transaction_status(connection, hash, new_status, receipt['data'])
                        if(is_update and new_status == 2):
                            api_response = call_api_on_success(method, parameter)
                            if api_response:
                                connection.commit()
                                # print(f"API called successfully. Response: {api_response}")
                        # print(f"Transaction {hash} updated to {new_status }")
            
            # 每隔 2 秒检查一次
            time.sleep(2)
    finally:
        connection.close()

if __name__ == "__main__":
    # listen_for_transaction_updates()
    hash = "0xdffeab2fbb5f01ed3df2f3300711c3913eb0c1470625c5a941f3b7c07d8dc0db"
    check_transaction_status(hash)
