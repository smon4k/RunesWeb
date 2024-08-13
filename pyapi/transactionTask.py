import pymysql
import requests
import configparser
import time

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
rpc_url = config.get('db', 'rpcUrls')

def check_transaction_status(tx_hash):
    """检查交易状态"""
    try:
        response = requests.post(rpc_url, json={
            "jsonrpc": "2.0",
            "method": "eth_getTransactionReceipt",
            "params": [tx_hash],
            "id": 1
        })
        result = response.json().get('result')
        return result
    except Exception as e:
        print(f"Error checking transaction status: {e}")
        return None

def update_transaction_status(connection, tx_hash, status):
    """更新数据库中的交易状态"""
    try:
        with connection.cursor() as cursor:
            sql = "UPDATE r_transaction_task SET status=%s WHERE hash=%s"
            cursor.execute(sql, (status, tx_hash))
            connection.commit()
    except Exception as e:
        print(f"Error updating transaction status: {e}")

def listen_for_transaction_updates():
    """监听数据库中的交易状态并更新"""
    connection = pymysql.connect(**db_config)
    print(connection)
    try:
        while True:
            with connection.cursor() as cursor:
                sql = "SELECT hash, status FROM r_transaction_task WHERE status=1"
                print(sql)
                cursor.execute(sql)
                pending_transactions = cursor.fetchall()
                print(pending_transactions)
                for tx in pending_transactions:
                    tx_hash, current_status = tx
                    receipt = check_transaction_status(tx_hash)

                    if receipt is not None:
                        status = 'success' if receipt.get('status') == '0x1' else 'failed'
                        if status != current_status:
                            update_transaction_status(connection, tx_hash, status)
                            print(f"Transaction {tx_hash} updated to {status}")
            
            # 每隔 10 秒检查一次
            # time.sleep(10)
    finally:
        connection.close()

if __name__ == "__main__":
    listen_for_transaction_updates()
