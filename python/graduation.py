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
# 파일위치
url1="C:\\Users\\KJH\\Desktop\\data\\dataTable.xlsx"
url2="C:\\Users\\KJH\\Desktop\\data\\data.xlsx"
# 데이터베이스 연결
conn = pymysql.connect(host=host, user=user, password=password)
region_map = {
    'region1': '전국',
    'region2': '서울',
    'region3': '부산',
    'region4': '대구',
    'region5': '인천',
    'region6': '광주',
    'region7': '대전',
    'region8': '울산',
    'region9': '경기',
    'region10': '강원',
    'region11': '충북',
    'region12': '충남',
    'region13': '전북',
    'region14': '전남',
    'region15': '경북',
    'region16': '경남',
    'region17': '제주',
    'region18': '세종',
    'region10_1': '철원군',
    'region10_2': '춘천시',
    'region10_3': '홍천군',
    'region12_1': '태안군',
    'region13_1': '군산시',
    'region13_2': '김제시',
    'region13_3': '남원시',
    'region13_4': '부안군',
    'region13_5': '순창군',
    'region13_6': '익산시',
    'region13_7': '진안군',
    'region14_1': '신안군',
    'region14_2': '여수시',
    'region14_3': '영광군',
    'region14_4': '영암군',
    'region15_1': '김천시',
    'region15_2': '영양군',
    'region16_1': '거제시',
    'region16_2': '고성군',
    'region16_3': '김해시',
    'region16_4': '양산시',
    'region16_5': '진주시',
    'region16_6': '창원시',
    'region16_7': '통영시',
    'region2_1': '구로구',
    'region2_2': '서초구',
    'region2_3': '송파구',
    'region2_4': '용인시',
    'region2_5': '은평구',
    'region3_1': '진구',
    'region6_1': '동구',
    'region6_2': '북구',
    'region9_1': '고양시',
    'region9_2': '성남시',
    'region9_3': '화성시',
}

try:
    # 데이터베이스 삭제
    with conn.cursor() as curs:
        curs.execute(f"DROP DATABASE IF EXISTS {database}")

    # 데이터베이스 생성
    with conn.cursor() as curs:
        curs.execute(f"CREATE DATABASE {database}")

    # 데이터베이스 선택
    with conn.cursor() as curs:
        curs.execute(f"USE {database}")

    # 테이블 생성 쿼리 실행
    with conn.cursor() as curs:
        curs.execute("""
            CREATE TABLE AgencyTypes (
                agency_type_id INT PRIMARY KEY,
                agency_type_name VARCHAR(100)
            )
        """)
        
        curs.execute("""
            CREATE TABLE Fields (
                field_id INT PRIMARY KEY,
                field_name VARCHAR(100)
            )
        """)

        curs.execute("""
            CREATE TABLE Identities (
                identity_id INT AUTO_INCREMENT PRIMARY KEY,
                detail1 BOOLEAN,
                detail2 BOOLEAN,
                detail3 BOOLEAN,
                detail4 BOOLEAN,
                detail5 BOOLEAN,
                detail6 BOOLEAN,
                detail7 BOOLEAN,
                detail8 BOOLEAN,
                detail9 BOOLEAN
            )
        """)

        curs.execute("""
            CREATE TABLE SpecializationOverall (
                specialization_overall_id INT AUTO_INCREMENT PRIMARY KEY,
                detail1 BOOLEAN,
                detail2 BOOLEAN,
                detail3 BOOLEAN,
                detail4 BOOLEAN,
                detail5 BOOLEAN,
                detail6 BOOLEAN,
                detail7 BOOLEAN,
                detail8 BOOLEAN,
                detail9 BOOLEAN,
                detail10 BOOLEAN,
                detail11 BOOLEAN,
                detail12 BOOLEAN,
                detail13 BOOLEAN,
                detail14 BOOLEAN,
                detail15 BOOLEAN,
                detail16 BOOLEAN
            )
        """)

        curs.execute("""
            CREATE TABLE SpecializationDetail (
                specialization_detail_id INT AUTO_INCREMENT PRIMARY KEY,
                detail1 BOOLEAN,
                detail2 BOOLEAN,
                detail3 BOOLEAN,
                detail4 BOOLEAN,
                detail5 BOOLEAN,
                detail6 BOOLEAN,
                detail7 BOOLEAN,
                detail8 BOOLEAN,
                detail9 BOOLEAN,
                detail10 BOOLEAN,
                detail11 BOOLEAN,
                detail12 BOOLEAN,
                detail13 BOOLEAN,
                detail14 BOOLEAN,
                detail15 BOOLEAN,
                detail16 BOOLEAN,
                detail17 BOOLEAN,
                detail18 BOOLEAN,
                detail19 BOOLEAN,
                detail20 BOOLEAN,
                detail21 BOOLEAN,
                detail22 BOOLEAN,
                detail23 BOOLEAN,
                detail24 BOOLEAN,
                detail25 BOOLEAN,
                detail26 BOOLEAN,
                detail27 BOOLEAN,
                detail28 BOOLEAN
            )
        """)

        curs.execute("""
            CREATE TABLE Regions (
                region_id INT PRIMARY KEY,
                region_name VARCHAR(100)
            )
        """)

        curs.execute("""
            CREATE TABLE ConditionTable1 (
                condition1_id INT PRIMARY KEY,
                field_id INT,
                identity_id INT,
                special_notes VARCHAR(255),
                specialization_overall_id INT,
                specialization_detail_id INT,
                startup_period_min INT,
                startup_period_max INT,
                age_min INT,
                age_max INT,
                sales_min INT,
                sales_max INT,
                investment_min INT,
                investment_max INT,
                region_id INT,
                FOREIGN KEY (field_id) REFERENCES Fields(field_id),
                FOREIGN KEY (identity_id) REFERENCES Identities(identity_id),
                FOREIGN KEY (specialization_overall_id) REFERENCES SpecializationOverall(specialization_overall_id),
                FOREIGN KEY (specialization_detail_id) REFERENCES SpecializationDetail(specialization_detail_id),
                FOREIGN KEY (region_id) REFERENCES Regions(region_id)
            )
        """)

        curs.execute("""
            CREATE TABLE ConditionTable2 (
                condition2_id INT PRIMARY KEY,
                field_id INT,
                identity_id INT,
                special_notes VARCHAR(255),
                specialization_overall_id INT,
                specialization_detail_id INT,
                startup_period_min INT,
                startup_period_max INT,
                age_min INT,
                age_max INT,
                sales_min INT,
                sales_max INT,
                investment_min INT,
                investment_max INT,
                region_id INT,
                FOREIGN KEY (field_id) REFERENCES Fields(field_id),
                FOREIGN KEY (identity_id) REFERENCES Identities(identity_id),
                FOREIGN KEY (specialization_overall_id) REFERENCES SpecializationOverall(specialization_overall_id),
                FOREIGN KEY (specialization_detail_id) REFERENCES SpecializationDetail(specialization_detail_id),
                FOREIGN KEY (region_id) REFERENCES Regions(region_id)
            )
        """)

        curs.execute("""
            CREATE TABLE Business (
                business_id INT PRIMARY KEY,
                agency_type_id INT,
                business_name VARCHAR(100),
                business_overview VARCHAR(255),
                support_content VARCHAR(255),
                support_target VARCHAR(255),
                support_budget VARCHAR(100),
                announcement_date VARCHAR(100),
                competent_ministry VARCHAR(100),
                dedicated_agency VARCHAR(100),
                notes VARCHAR(255),
                condition1_id INT,
                condition2_id Int,
                FOREIGN KEY (agency_type_id) REFERENCES AgencyTypes(agency_type_id),
                FOREIGN KEY (condition1_id) REFERENCES ConditionTable1(condition1_id), 
                FOREIGN KEY (condition2_id) REFERENCES ConditionTable2(condition2_id)          
            )
        """)

        agency_types_data = [
            (1, '중앙부처'),
            (2, '지방자치단체')
        ]

        for data in agency_types_data:
            curs.execute("INSERT INTO AgencyTypes (agency_type_id, agency_type_name) VALUES (%s, %s)", data)

        # Fields 테이블에 데이터 삽입
        fields_data = [
            (1, '사업화'),
            (2, '기술개발(R&D)'),
            (3, '시설/공간/보육'),
            (4, '멘토링/컨설팅/교육'),
            (5, '행사/네트워크'),
            (6, '융자/보증'),
            (7, '인력'),
            (8, '글로벌진출')
        ]

        for data in fields_data:
            curs.execute("INSERT INTO Fields (field_id, field_name) VALUES (%s, %s)", data)

        # Regions 테이블에 데이터 삽입
        regions_data = [
            (1, '전국'),
            (2, '서울'),
            (3, '부산'),
            (4, '대구'),
            (5, '인천'),
            (6, '광주'),
            (7, '대전'),
            (8, '울산'),
            (9, '경기'),
            (10, '강원'),
            (11, '충북'),
            (12, '충남'),
            (13, '전북'),
            (14, '전남'),
            (15, '경북'),
            (16, '경남'),
            (17, '제주'),
            (18, '세종')
        ]

        for data in regions_data:
            curs.execute("INSERT INTO Regions (region_id, region_name) VALUES (%s, %s)", data)
        
        df = pd.read_excel(url1)
        df=df.replace({np.nan:None})

        for idx, row in df.iterrows():
  
            numbers=re.findall(r'\d+',row["기호"])
            number=''.join(numbers)
            row['기호']=number

            numbers=re.findall(r'\d+',row["분야"])
            number=''.join(numbers)
            row['분야']=number

            s = row['신분']
            if pd.notna(s):  
                numbers = [int(char) for char in str(s) if char.isdigit()]
                # identity_data 생성
                identity_data = [True if i in numbers else False for i in range(1, 10)]
                curs.execute("INSERT INTO Identities (detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8, detail9) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", identity_data)
                row['신분'] = curs.lastrowid
                        
            s = row['특화부분 포괄']
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                specialization_data = [True if i in numbers else False for i in range(1, 17)]
                curs.execute("INSERT INTO SpecializationOverall (detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8, detail9, detail10, detail11, detail12, detail13, detail14, detail15, detail16) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", specialization_data)
                row['특화부분 포괄'] = curs.lastrowid

            s = row['특화부분 세부']
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                specialization_data = [True if i in numbers else False for i in range(1, 29)]
                specialization_data = [1 if x else 0 for x in specialization_data]
                curs.execute("INSERT INTO SpecializationDetail (detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8, detail9, detail10, detail11, detail12, detail13, detail14, detail15, detail16, detail17, detail18, detail19, detail20, detail21, detail22, detail23, detail24, detail25, detail26, detail27, detail28) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", specialization_data)
                row['특화부분 세부'] = curs.lastrowid
           

        for idx, row in df.iterrows():
            s = row['창업기간']
            a=-3
            b=-3
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                for num in numbers:
                    if num==1:
                        a=-2
                        b=-2
                    elif num==2:
                        a=-1
                        b=-1
                    elif num==3:
                        a=0
                    elif num==4:
                        b=6
                    elif num==5:
                        b=12
                    elif num==6:
                        a=12
                    elif num==7:
                        a=24
                    elif num==8:
                        b=36
                    elif num==9:
                        a=36
                    elif num==10:
                        a=48
                    elif num==11:
                        b=60
                    elif num==12:
                        a=60
                    elif num==13:
                        b=84
                    elif num==14:
                        b=120

            s = row['나이']
            c=-1
            d=-1
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                for num in numbers:
                    if num==1:
                        c=19
                    elif num==2:
                        d=29
                    elif num==3:
                        d=39
                    elif num==4:
                        c=40
                    elif num==5:
                        d=45
                    elif num==6:
                        d=47
                    elif num==7:
                        d=49
                    elif num==8:
                        d=65

            s = row['매출']
            e=-1
            f=-1
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                for num in numbers:
                    if num==1:
                        f=1.5
                    elif num==2:
                        f=20
                    elif num==3:
                        f=2

            s = row['투자']
            g=-1
            h=-1
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                for num in numbers:
                    if num==1:
                        g=0
                    elif num==2:
                        g=1
                    elif num==3:
                        g=5
                    elif num==4:
                        g=20
                    elif num==5:
                        h=100

            s = row['지역']
            if pd.notna(s): 
                row['지역']=1 
                substrings = [part[6:] for part in s.split(",")]
                if pd.isna(row['특이사항']):
                    row['특이사항'] = ""
                for sub in substrings:
                    if '_' in sub :
                        region_key = 'region' + sub
                        row['특이사항']+=region_map.get(region_key, 'Unknown')
                    else:
                        row['지역']=sub
            else:
                row['지역']=1

            list=[row['기호'],row['분야'],row['신분'],row['특이사항'],row['특화부분 포괄'],row['특화부분 세부'],
                a,b,c,d,e,f,g,h,row['지역']]

        
           
            curs.execute("""
                INSERT INTO ConditionTable1 (
                    condition1_id, field_id, identity_id, special_notes,
                    specialization_overall_id, specialization_detail_id, startup_period_min,
                    startup_period_max, age_min, age_max, sales_min, sales_max,
                    investment_min, investment_max, region_id
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
            """, (
                list
            ))
        conn.commit()

        df = pd.read_excel(url1,sheet_name=1)
        df=df.replace({np.nan:None})

        for idx, row in df.iterrows():
  
            numbers=re.findall(r'\d+',row["기호"])
            number=''.join(numbers)
            row['기호']=number

            numbers=re.findall(r'\d+',row["분야"])
            number=''.join(numbers)
            row['분야']=number

            s = row['신분']
            if pd.notna(s):  
                numbers = [int(char) for char in str(s) if char.isdigit()]
                identity_data = [True if i in numbers else False for i in range(1, 10)]
                curs.execute("INSERT INTO Identities (detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8, detail9) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", identity_data)
                row['신분'] = curs.lastrowid
                        
            s = row['특화부분 포괄']
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                specialization_data = [True if i in numbers else False for i in range(1, 17)]
                curs.execute("INSERT INTO SpecializationOverall (detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8, detail9, detail10, detail11, detail12, detail13, detail14, detail15, detail16) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", specialization_data)
                row['특화부분 포괄'] = curs.lastrowid

            s = row['특화부분 세부']
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                specialization_data = [True if i in numbers else False for i in range(1, 29)]
                curs.execute("INSERT INTO SpecializationDetail (detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8, detail9, detail10, detail11, detail12, detail13, detail14, detail15, detail16, detail17, detail18, detail19, detail20, detail21, detail22, detail23, detail24, detail25, detail26, detail27, detail28) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", specialization_data)
                row['특화부분 세부'] = curs.lastrowid
           

        for idx, row in df.iterrows():
            s = row['창업기간']
            a=-3
            b=-3
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                for num in numbers:
                    if num==1:
                        a=-2
                        b=-2
                    elif num==2:
                        a=-1
                        b=-1
                    elif num==3:
                        a=0
                    elif num==4:
                        b=6
                    elif num==5:
                        b=12
                    elif num==6:
                        a=12
                    elif num==7:
                        a=24
                    elif num==8:
                        b=36
                    elif num==9:
                        a=36
                    elif num==10:
                        a=48
                    elif num==11:
                        b=60
                    elif num==12:
                        a=60
                    elif num==13:
                        b=84
                    elif num==14:
                        b=120

            s = row['나이']
            c=-1
            d=-1
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                for num in numbers:
                    if num==1:
                        c=19
                    elif num==2:
                        d=29
                    elif num==3:
                        d=39
                    elif num==4:
                        c=40
                    elif num==5:
                        d=45
                    elif num==6:
                        d=47
                    elif num==7:
                        d=49
                    elif num==8:
                        d=65

            s = row['매출']
            e=-1
            f=-1
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                for num in numbers:
                    if num==1:
                        f=1.5
                    elif num==2:
                        f=20
                    elif num==3:
                        f=2

            s = row['투자']
            g=-1
            h=-1
            if pd.notna(s):  
                numbers = [int(match.group()) for match in re.finditer(r'\d{1,2}', s)]
                for num in numbers:
                    if num==1:
                        g=0
                    elif num==2:
                        g=1
                    elif num==3:
                        g=5
                    elif num==4:
                        g=20
                    elif num==5:
                        h=100
            

            s = row['지역']
            if pd.notna(s): 
                row['지역']=1 
                substrings = [part[6:] for part in s.split(",")]
                if pd.isna(row['특이사항']):
                    row['특이사항'] = ""
                for sub in substrings:
                    if '_' in sub :
                        region_key = 'region' + sub
                        row['특이사항']+=region_map.get(region_key, 'Unknown')
                    else:
                        row['지역']=sub
            else:
                row['지역']=1

            list=[row['기호'],row['분야'],row['신분'],row['특이사항'],row['특화부분 포괄'],row['특화부분 세부'],
                a,b,c,d,e,f,g,h,row['지역']]
           
            curs.execute("""
                INSERT INTO ConditionTable2 (
                    condition2_id, field_id, identity_id, special_notes,
                    specialization_overall_id, specialization_detail_id, startup_period_min,
                    startup_period_max, age_min, age_max, sales_min, sales_max,
                    investment_min, investment_max, region_id
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
            """, (
                list
            ))
        
        

        df=pd.read_excel(url2,sheet_name=0)
        df=df.replace({np.nan:None})

        for idx, row in df.iterrows():
            if row['기관 종류'] =='중앙부처':
                row['기관 종류']=1
            else :
                row['기관 종류']=2
            
            # row['사업 공고일']= datetime.today().strftime('%Y-%m-%d')
            list=[row['번호'],row['기관 종류'],row['사업명'],row['사업개요'],row['지원내용'],row['지원대상'],row['예산 (억원)'],row['사업 공고일'],row['소관 부처'],row['전담(주관) 기관'],row['비고'],row['번호'],row['번호']]
                
            curs.execute("""
                INSERT INTO Business (
                    business_id, agency_type_id, business_name, business_overview,
                    support_content, support_target,support_budget, announcement_date, competent_ministry,
                    dedicated_agency, notes, condition1_id, condition2_id
                ) VALUES (
                    %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
                )
            """, (
                list
            ))
        conn.commit()
finally:
    # 데이터베이스 연결 종료
    conn.close()

print("데이터베이스 생성 및 초기 데이터 삽입이 완료되었습니다1.")