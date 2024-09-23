import requests
import mysql.connector
import json
import re
from datetime import datetime
import html  

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
    port=3306,
    password="root",
    # port=3308,
    # password="9604",
    database="seedfinder",
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
                business_duration INT,
                target_age_id INT,
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

        # 필수 데이터 삽입
        cursor.execute('''
            INSERT IGNORE INTO Business_Classification (name) VALUES
            ('글로벌'), ('기술개발(R&D)'), ('멘토링ㆍ컨설팅ㆍ교육'), ('사업화'), ('시설ㆍ공간ㆍ보육'),
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

    for item in data['data']:
        try:
            # 지원사업분류 ID 가져오기 또는 삽입
            business_classification_id = insert_if_not_exists('Business_Classification', 'name', html.unescape(item.get('supt_biz_clsfc')))
            
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
            business_duration_period=max_number
     
            # 나이 범위 추출
            age_ranges = item.get('biz_trgt_age', '').split(',')
            min_age = None
            max_age = None

            if len(age_ranges) > 2:
                # 쉼표가 두 개 이상인 경우: 전 연령으로 처리
                min_age = None
                max_age = None
            elif len(age_ranges) == 2:
                if '미만' in age_ranges:
                    max_age = 39
                else:
                    min_age = 20
            elif len(age_ranges) == 1:
                # 쉼표가 없는 경우: 단일 범위로 처리
                age_range = age_ranges[0].strip()
                if  '이하' in age_range: 
                    max_age = 39
                    min_age = 20
                elif '미만' in age_range:
                    max_age = 20
                elif '이상' in age_range:
                    min_age = 40

            # 나이 범위 ID 가져오기 또는 생성
            if min_age is not None and max_age is not None:
                # 최소 및 최대 나이 모두 제공된 경우
                cursor.execute("SELECT id FROM Target_Age WHERE age_min = %s AND age_max = %s", (min_age, max_age))
            elif min_age is not None:
                # 최소 나이만 제공된 경우
                cursor.execute("SELECT id FROM Target_Age WHERE age_min = %s AND age_max IS NULL", (min_age,))
            elif max_age is not None:
                # 최대 나이만 제공된 경우
                cursor.execute("SELECT id FROM Target_Age WHERE age_min IS NULL AND age_max = %s", (max_age,))
            else:
                # 최소 및 최대 나이 모두 제공되지 않은 경우
                cursor.execute("SELECT id FROM Target_Age WHERE age_min IS NULL AND age_max IS NULL")

            # 이미 존재하는지 확인
            target_age_id = cursor.fetchone()

            if target_age_id:
                # 존재하면 기존 ID 사용
                target_age_id = target_age_id[0]
            else:
                # 존재하지 않으면 새로운 레코드 삽입
                cursor.execute("INSERT INTO Target_Age (age_min, age_max) VALUES (%s, %s)", (min_age, max_age))
                target_age_id = cursor.lastrowid

            




            # 공고 데이터 준비
            cursor.execute('''
                SELECT id, start_date FROM Announcement 
                WHERE integrated_project_name = %s AND project_name = %s
            ''', (html.unescape(item.get('intg_pbanc_biz_nm') or ''), html.unescape(item.get('biz_pbanc_nm') or '')))

            existing_record = cursor.fetchone()
            new_start_date = convert_to_date(item.get('pbanc_rcpt_bgng_dt'))

            if existing_record:
                existing_id = existing_record[0]
                existing_start_date = existing_record[1]
                
                # 새로 들어온 start_date와 기존 start_date 비교
                if new_start_date and (existing_start_date is None or new_start_date > existing_start_date):
                    # 새 start_date가 더 최신이면 업데이트
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
                            business_duration = %s,
                            target_age_id = %s
                        WHERE id = %s
                    ''', 
                    (
                        item.get('intg_pbanc_yn') == 'Y',  # boolean
                        html.unescape(item.get('pbanc_ctnt') or ''),
                        business_classification_id,
                        new_start_date,  # 새로 받은 start_date
                        convert_to_date(item.get('pbanc_rcpt_end_dt')),
                        html.unescape(item.get('aply_mthd_vst_rcpt_istc') or ''),
                        html.unescape(item.get('aply_mthd_pssr_rcpt_istc') or ''),
                        html.unescape(item.get('aply_mthd_fax_rcpt_istc') or ''),
                        html.unescape(item.get('aply_mthd_onli_rcpt_istc') or ''),
                        html.unescape(item.get('aply_mthd_etc_istc') or ''),
                        html.unescape(item.get('aply_trgt_ctnt') or ''),
                        html.unescape(item.get('aply_excl_trgt_ctnt') or ''),
                        support_region_id,
                        html.unescape(item.get('pbanc_ntrp_nm') or ''),
                        html.unescape(item.get('sprv_inst') or ''),
                        html.unescape(item.get('biz_prch_dprt_nm') or ''),
                        html.unescape(item.get('biz_gdnc_url') or ''),
                        html.unescape(item.get('prch_cnpl_no') or ''),
                        html.unescape(item.get('detl_pg_url') or ''),
                        html.unescape(item.get('prfn_matr') or ''),
                        item.get('rcrt_prgs_yn') == 'Y',
                        pre_business_status,
                        business_duration_period,
                        target_age_id,
                        existing_id
                    ))
                
                
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
                        business_duration,
                        target_age_id
                    ) VALUES (%s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''',
                (
                    item.get('intg_pbanc_yn') == 'Y',  # boolean
                    html.unescape(item.get('intg_pbanc_biz_nm') or ''),
                    html.unescape(item.get('biz_pbanc_nm') or ''),
                    html.unescape(item.get('pbanc_ctnt') or ''),
                    business_classification_id,
                    convert_to_date(item.get('pbanc_rcpt_bgng_dt')),
                    convert_to_date(item.get('pbanc_rcpt_end_dt')),
                    html.unescape(item.get('aply_mthd_vst_rcpt_istc') or ''),
                    html.unescape(item.get('aply_mthd_pssr_rcpt_istc') or ''),
                    html.unescape(item.get('aply_mthd_fax_rcpt_istc') or ''),
                    html.unescape(item.get('aply_mthd_onli_rcpt_istc') or ''),
                    html.unescape(item.get('aply_mthd_etc_istc') or ''),
                    html.unescape(item.get('aply_trgt_ctnt') or ''),
                    html.unescape(item.get('aply_excl_trgt_ctnt') or ''),
                    support_region_id,
                    html.unescape(item.get('pbanc_ntrp_nm') or ''),
                    html.unescape(item.get('sprv_inst') or ''),
                    html.unescape(item.get('biz_prch_dprt_nm') or ''),
                    html.unescape(item.get('biz_gdnc_url') or ''),
                    html.unescape(item.get('prch_cnpl_no') or ''),
                    html.unescape(item.get('detl_pg_url') or ''),
                    html.unescape(item.get('prfn_matr') or ''),
                    item.get('rcrt_prgs_yn') == 'Y',
                    pre_business_status,
                    business_duration_period,
                    target_age_id
                )
                )
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
            log_error(f"Error processing item: {e}")
            continue

    conn.commit()

except Exception as e:
    log_error(f"General error: {e}")

finally:
    print('추가완료')
    cursor.close()
    conn.close()
