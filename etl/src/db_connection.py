import psycopg2
from sshtunnel import SSHTunnelForwarder

def get_conn():
    try:
        server = SSHTunnelForwarder(
                ('51.161.9.38', 22),
                #ssh_private_key="</path/to/private/ssh/key>",
                ### in my case, I used a password instead of a private key
                ssh_username="debian",
                ssh_password="SmFy3u7SDPJr", 
                remote_bind_address=('localhost', 5432))
        server.start()
        print ("server connected")

        params = {
                'database': 'mym',
                'user': 'postgres',
                'password': 'securepassword',
                'host': 'localhost',
                'port': server.local_bind_port
                }

        conn = psycopg2.connect(**params)
        #conn.set_session(readonly=True)       
        print ("database connected") 
        return conn,server
    except:
        print("Connection Failed")