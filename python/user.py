import pymysql
import pandas as pd
import re
import numpy as np
from datetime import datetime

# 데이터베이스 연결 정보
host = 'localhost'
user = 'root'
password = 'asd@9604'
database = 'business'
# 데이터베이스 연결
conn = pymysql.connect(host=host, user=user, password=password)


try:
    # 데이터베이스 선택
    with conn.cursor() as curs:
        curs.execute(f"USE {database}")
    
    with conn.cursor() as curs:
        curs.execute("""
            CREATE TABLE USER (
                UID INT AUTO_INCREMENT PRIMARY KEY,
                id varchar(100),
                pw varchar(100)
            )
        """)

        curs.execute("""
            CREATE TABLE USERINFORM (
                INFORM_ID INT AUTO_INCREMENT PRIMARY KEY,
                UID int,
                field_id INT,
                identity_id INT,
                specialization_overall_id INT,
                specialization_detail_id INT,
                startup_period INT,
                age INT,
                sale INT,
                investment INT,
                region_id INT,
                FOREIGN KEY (field_id) REFERENCES Fields(field_id),
                FOREIGN KEY (identity_id) REFERENCES Identities(identity_id),
                FOREIGN KEY (specialization_overall_id) REFERENCES SpecializationOverall(specialization_overall_id),
                FOREIGN KEY (specialization_detail_id) REFERENCES SpecializationDetail(specialization_detail_id),
                FOREIGN KEY (region_id) REFERENCES Regions(region_id)
            )
        """)
        
       

finally:
    # 데이터베이스 연결 종료
    conn.close()