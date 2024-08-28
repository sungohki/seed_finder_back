import requests
import mysql.connector
import json
import re
from datetime import datetime

# API URL 및 파라미터
url = "http://apis.data.go.kr/B552735/kisedKstartupService/getAnnouncementInformation"
params = {
    'serviceKey': '9qj+rjK7oUNArRqsZuiJemky1aDEUEKO5hC+D2CELDZsohx46TSqz7flnqFzu9Eo2h5O5iQ3WSqQC19g75vbig==',
    'perPage': 20000,
    'cond[rcrt_prgs_yn::EQ]': 'Y',
    'returnType': 'json'
}

# MariaDB 연결 설정
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="9604",
    database="seedfinder",
    port=3308,
    charset='utf8mb4',
    collation='utf8mb4_general_ci'
)
cursor = conn.cursor()

def convert_to_date(date_str):
    """ 날짜 문자열을 DATE 타입으로 변환 """
    if date_str:
        try:
            return datetime.strptime(date_str, '%Y%m%d').date()
        except ValueError:
            return None
    return None

def log_error(message):
    """ 에러 메시지를 로그 파일에 기록하고 콘솔에 출력 """
    print(message)


def insert_if_not_exists(table_name, column_name, value):
    """ 주어진 값이 테이블에 없으면 삽입하고, ID를 반환 """
    cursor.execute(f"SELECT id FROM {table_name} WHERE {column_name} = %s", (value,))
    record = cursor.fetchone()
    
    if not record:
        cursor.execute(f"INSERT INTO {table_name} ({column_name}) VALUES (%s)", (value,))
        conn.commit()
        return cursor.lastrowid
    else:
        return record[0]


def create_tables():
    try:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Business_Classification (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(20) NOT NULL
            );
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Support_Region (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(20) NOT NULL
            );
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Application_Target (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(20) NOT NULL
            );
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Business_Duration (
                id INT PRIMARY KEY AUTO_INCREMENT,
                period VARCHAR(20) NOT NULL
            );
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Target_Age(
                id INT PRIMARY KEY AUTO_INCREMENT,
                age_min Integer,
                age_max Integer
            );
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Announcement (
                id INT PRIMARY KEY AUTO_INCREMENT,
                integrated_status BOOLEAN NOT NULL,
                integrated_project_name VARCHAR(300),
                project_name VARCHAR(300),
                content VARCHAR(1000),
                business_classification_id INT,
                start_date DATE,
                end_date DATE,
                application_method_visit VARCHAR(300),
                application_method_mail VARCHAR(300),
                application_method_fax VARCHAR(300),
                application_method_online VARCHAR(300),
                application_method_others VARCHAR(300),
                application_criteria VARCHAR(1000),
                application_exclusion_criteria VARCHAR(1000),
                support_region_id INT,
                company_name VARCHAR(300),
                supervising_organization VARCHAR(300),
                department_in_charge VARCHAR(300),
                project_guidance_url VARCHAR(300),
                contact_number VARCHAR(300),
                detailed_page_url VARCHAR(300),
                preferences VARCHAR(300),
                recruitment_status BOOLEAN NOT NULL,
                pre_business_status BOOLEAN NOT NULL,
                Business_Duration_id INT,
                target_age_id INT,
                FOREIGN KEY (Business_Duration_id) REFERENCES Business_Duration(id),
                FOREIGN KEY (target_age_id) REFERENCES Target_Age(id),
                FOREIGN KEY (business_classification_id) REFERENCES Business_Classification(id),
                FOREIGN KEY (support_region_id) REFERENCES Support_Region(id),
                UNIQUE (integrated_project_name, project_name)
            );
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Announcement_Application_Target (
                announcement_id INT,
                application_target_id INT,
                PRIMARY KEY (announcement_id, application_target_id),
                FOREIGN KEY (announcement_id) REFERENCES Announcement(id),
                FOREIGN KEY (application_target_id) REFERENCES Application_Target(id)
            );
        ''')

        # # 필수 데이터 삽입
        cursor.execute('''
            INSERT IGNORE INTO Business_Classification (name) VALUES
            ('글로벌'), ('기술개발(R&amp;D)'), ('멘토링ㆍ컨설팅ㆍ교육'), ('사업화'), ('시설ㆍ공간ㆍ보육'),
            ('융자'), ('정책자금'), ('창업교육'), ('판로ㆍ해외진출'), ('인력'), ('행사ㆍ네트워크');
        ''')

        cursor.execute('''
            INSERT IGNORE INTO Support_Region (name) VALUES
            ('강원'), ('경기'), ('경남'), ('경북'), ('광주'), ('대구'), ('대전'), ('부산'), 
            ('서울'), ('세종'), ('울산'), ('인천'), ('전국'), ('전남'), ('전북'), ('충남'), ('충북');
        ''')

        cursor.execute('''
            INSERT IGNORE INTO Application_Target (name) VALUES
            ('1인 창조기업'), ('대학'), ('연구기관'), ('일반기업'), ('대학생'), ('일반인'), ('청소년');
        ''')

        cursor.execute('''
            INSERT IGNORE INTO Business_Duration (period) VALUES
            ('1년미만'), ('2년미만'), ('3년미만'), ('5년미만'), ('7년미만'), ('10년미만');
        ''')

        conn.commit()
    except mysql.connector.Error as e:
        log_error(f"Error creating tables: {e}")
        raise

# 테이블 생성 함수 호출
create_tables()

try:
    # API 요청
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()  # 오류 발생 시 예외 처리
    
    # JSON 응답 파싱
    data = response.json()

    if not data.get('data'):
        log_error("No data found in API response.")
        raise ValueError("No data found in API response.")

    announcements = []
    
    for item in data['data']:
        try:
            # 지원사업분류 ID 가져오기 또는 삽입
            business_classification_id = insert_if_not_exists('Business_Classification', 'name', item.get('supt_biz_clsfc'))
            
            # 지원지역 ID 가져오기 또는 삽입
            support_region_id = insert_if_not_exists('Support_Region', 'name', item.get('supt_regin'))
            
            
            # 지원대상 ID 가져오기
            apply_target = item.get('aply_trgt', '').split(',')
            target_ids = []

            for target in apply_target:
                target = target.strip()  # 앞뒤 공백 제거
                cursor.execute("SELECT id FROM Application_Target WHERE name = %s", (target,))
                target_id = cursor.fetchone()
                if target_id:
                    target_ids.append(target_id[0])

            # 예비창업자 여부
            business_duration = item.get('biz_enyy')
            pre_business_status = business_duration is not None and "예비" in business_duration
            
            # 사업업력 ID 가져오기
            numbers = re.findall(r'\d+', business_duration or "")
            numbers = [int(num) for num in numbers]
            max_number = max(numbers) if numbers else None
            business_duration_period = f"{max_number}년미만" if max_number else None
            
            cursor.execute("SELECT id FROM Business_Duration WHERE period = %s", (business_duration_period,))
            business_duration_id = cursor.fetchone()
            business_duration_id = business_duration_id[0] if business_duration_id else None

            # 나이 범위 추출
            age_ranges = item.get('biz_trgt_age', '').split(',')
            min_age = None
            max_age = None

            if len(age_ranges) > 2:
                # 쉼표가 두 개 이상인 경우: 전 연령으로 처리
                min_age = 0
                max_age = 100
            elif len(age_ranges) == 2:
                # 쉼표가 하나인 경우: min, max 범위를 추출
                for age_range in age_ranges:
                    age_range = age_range.strip()
                    if '미만' in age_range:
                        max_age = int(re.findall(r'\d+', age_range)[0])
                    elif '이상 ~' in age_range and '이하' in age_range:
                        start, end = age_range.split('~')
                        min_age = int(re.findall(r'\d+', start)[0])
                        max_age = int(re.findall(r'\d+', end)[0])
                    elif '이상' in age_range:
                        min_age = int(re.findall(r'\d+', age_range)[0])
            elif len(age_ranges) == 1:
                # 쉼표가 없는 경우: 단일 범위로 처리
                age_range = age_ranges[0].strip()
                if '미만' in age_range:
                    max_age = int(re.findall(r'\d+', age_range)[0])
                    min_age = None
                elif '이상' in age_range:
                    min_age = int(re.findall(r'\d+', age_range)[0])
                    max_age = None

            # 나이 범위 ID 가져오기 또는 생성
            if min_age is not None and max_age is not None:
                cursor.execute("SELECT id FROM Target_Age WHERE age_min = %s AND age_max = %s", (min_age, max_age))
            elif min_age is not None:
                cursor.execute("SELECT id FROM Target_Age WHERE age_min = %s AND age_max IS NULL", (min_age,))
            elif max_age is not None:
                cursor.execute("SELECT id FROM Target_Age WHERE age_min IS NULL AND age_max = %s", (max_age,))
            else:
                target_age_id = None
            
            target_age_id = cursor.fetchone()
            
            if not target_age_id:
                # Target_Age 테이블에 나이 범위 삽입 후 ID 가져오기
                cursor.execute("INSERT INTO Target_Age (age_min, age_max) VALUES (%s, %s)", (min_age, max_age))
                target_age_id = cursor.lastrowid
            else:
                target_age_id = target_age_id[0]

            # 공고 데이터 준비
            announcements.append((
                item.get('intg_pbanc_yn') == 'Y',  # boolean
                item.get('intg_pbanc_biz_nm'),
                item.get('biz_pbanc_nm'),
                item.get('pbanc_ctnt'),
                business_classification_id,  # integer
                convert_to_date(item.get('pbanc_rcpt_bgng_dt')),
                convert_to_date(item.get('pbanc_rcpt_end_dt')),
                item.get('aply_mthd_vst_rcpt_istc'),
                item.get('aply_mthd_pssr_rcpt_istc'),
                item.get('aply_mthd_fax_rcpt_istc'),
                item.get('aply_mthd_onli_rcpt_istc'),
                item.get('aply_mthd_etc_istc'),
                item.get('aply_trgt_ctnt'),
                item.get('aply_excl_trgt_ctnt'),
                support_region_id,  # integer
                item.get('pbanc_ntrp_nm'),
                item.get('sprv_inst'),
                item.get('biz_prch_dprt_nm'),
                item.get('biz_gdnc_url'),
                item.get('prch_cnpl_no'),
                item.get('detl_pg_url'),
                item.get('prfn_matr'),
                item.get('rcrt_prgs_yn') == 'Y',  # boolean
                pre_business_status,  # boolean
                business_duration_id,  # integer
                target_age_id  # integer
            ))

        except Exception as e:
            log_error(f"Error processing item: {e}")
            continue

    # 공고 데이터 삽입
    for announcement in announcements:
        try:
            # 기존 데이터 확인
            cursor.execute('''
                SELECT id, start_date FROM Announcement 
                WHERE integrated_project_name = %s AND project_name = %s
            ''', (announcement[1], announcement[2]))
            
            existing_record = cursor.fetchone()

            if existing_record:
                existing_id, existing_start_date = existing_record

                # 날짜 비교하여 기존 데이터를 업데이트할지 결정
                if announcement[5] and existing_start_date:
                    if announcement[5] > existing_start_date:  # 새로운 데이터의 start_date가 더 최신인 경우
                        cursor.execute('''
                            UPDATE Announcement SET
                                integrated_status = %s,
                                content = %s,
                                business_classification_id = %s,
                                start_date = %s,
                                end_date = %s,
                                application_method_visit = %s,
                                application_method_mail = %s,
                                application_method_fax = %s,
                                application_method_online = %s,
                                application_method_others = %s,
                                application_criteria = %s,
                                application_exclusion_criteria = %s,
                                support_region_id = %s,
                                company_name = %s,
                                supervising_organization = %s,
                                department_in_charge = %s,
                                project_guidance_url = %s,
                                contact_number = %s,
                                detailed_page_url = %s,
                                preferences = %s,
                                recruitment_status = %s,
                                pre_business_status = %s,
                                Business_Duration_id = %s,
                                target_age_id = %s
                            WHERE id = %s
                        ''', (
                            announcement[0],  # integrated_status
                            announcement[3],  # content
                            announcement[4],  # business_classification_id
                            announcement[5],  # start_date
                            announcement[6],  # end_date
                            announcement[7],  # application_method_visit
                            announcement[8],  # application_method_mail
                            announcement[9],  # application_method_fax
                            announcement[10], # application_method_online
                            announcement[11], # application_method_others
                            announcement[12], # application_criteria
                            announcement[13], # application_exclusion_criteria
                            announcement[14], # support_region_id
                            announcement[15], # company_name
                            announcement[16], # supervising_organization
                            announcement[17], # department_in_charge
                            announcement[18], # project_guidance_url
                            announcement[19], # contact_number
                            announcement[20], # detailed_page_url
                            announcement[21], # preferences
                            announcement[22], # recruitment_status
                            announcement[23], # pre_business_status
                            announcement[24], # Business_Duration_id
                            announcement[25], # target_age_id
                            existing_id  # 업데이트 대상 레코드의 ID
                        ))
                else:
                    print(f"Skipping update: Existing record is newer or the same for {announcement[1]} - {announcement[2]}")
            else:
                # 데이터가 존재하지 않는 경우, 새로운 데이터 삽입
                cursor.execute('''
                    INSERT INTO Announcement (
                        integrated_status,
                        integrated_project_name,
                        project_name,
                        content,
                        business_classification_id,
                        start_date,
                        end_date,
                        application_method_visit,
                        application_method_mail,
                        application_method_fax,
                        application_method_online,
                        application_method_others,
                        application_criteria,
                        application_exclusion_criteria,
                        support_region_id,
                        company_name,
                        supervising_organization,
                        department_in_charge,
                        project_guidance_url,
                        contact_number,
                        detailed_page_url,
                        preferences,
                        recruitment_status,
                        pre_business_status,
                        Business_Duration_id,
                        target_age_id
                    ) VALUES (%s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''', announcement)
                announcement_id = cursor.lastrowid

                # 신청대상(Application_Target) 데이터 삽입
                for target_id in target_ids:
                    try:
                        cursor.execute('''
                            INSERT INTO Announcement_Application_Target (
                                announcement_id,
                                application_target_id
                            ) VALUES (%s, %s)
                        ''', (announcement_id, target_id))
                    except Exception as e:
                        log_error(f"Error inserting application target for announcement {announcement_id}: {e}")
                        continue

        except Exception as e:
            log_error(f"Error inserting/updating announcement: {e}")
            continue

    conn.commit()

except Exception as e:
    log_error(f"General error: {e}")

finally:
    cursor.close()
    conn.close()
