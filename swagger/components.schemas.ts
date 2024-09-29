/**
 * @swagger
 * components:
 *   schemas:
 *     ChatLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         senderRole:
 *           type: string
 *           example: "CUSTOMER"
 *         content:
 *           type: string
 *           example: "Nice to meet you"
 *         createdAt:
 *           type: string
 *           example: "2024-01-01 12:00:00"
 *         chatroomId:
 *           type: integer
 *           example: 2
 *     ChatroomPreview:
 *       type: object
 *       properties:
 *         chatroomId:
 *           type: integer
 *           example: 1
 *         numberingId:
 *           type: string
 *           example: "1-1"
 *         lastMessage:
 *           type: string
 *           example: "Hello, World"
 *         lastMessageCreateAt:
 *           type: string
 *           example: "2024-01-01 12:00:00"
 *         unreadMessageCount:
 *           type: integer
 *           example: 0
 *     BusinessPreview:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         integrated_project_name:
 *           type: string
 *           example: "Project A"
 *         business_classification_name:
 *           type: string
 *           example: "Classification B"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *     BusinessDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: 공고 id번호
 *           example: 1
 *         integrated_status:
 *           type: boolean
 *           description: 통합 공고 여부 (intg_pbanc_yn)
 *           example: true
 *         integrated_project_name:
 *           type: string
 *           nullable: true
 *           description: 통합 공고 사업명 (intg_pbanc_biz_nm)
 *           example: "통합 공고 사업명"
 *         project_name:
 *           type: string
 *           nullable: true
 *           description: 사업공고명 (biz_pbanc_nm)
 *           example: "사업 공고명"
 *         content:
 *           type: string
 *           nullable: true
 *           description: 공고 내용 (pbanc_ctnt)
 *           example: "공고 내용"
 *         business_classification_id:
 *           type: integer
 *           format: int64
 *           description: 지원사업분류 id (supt_biz_clsfc)
 *           example: 123
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: 공고접수시작일시 (pbanc_rcpt_bgng_dt)
 *           example: "2024-01-01T00:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: 공고접수종료일시 (pbanc_rcpt_end_dt)
 *           example: "2024-12-31T23:59:59Z"
 *         application_method_visit:
 *           type: string
 *           nullable: true
 *           description: 신청방법 방문접수설명 (aply_mthd_vst_rcpt_istc)
 *           example: "방문 접수 설명"
 *         application_method_mail:
 *           type: string
 *           nullable: true
 *           description: 신청방법 우편접수설명 (aply_mthd_pssr_rcpt_istc)
 *           example: "우편 접수 설명"
 *         application_method_fax:
 *           type: string
 *           nullable: true
 *           description: 신청방법 팩스접수설명 (aply_mthd_fax_rcpt_istc)
 *           example: "팩스 접수 설명"
 *         application_method_online:
 *           type: string
 *           nullable: true
 *           description: 신청방법 온라인접수설명 (aply_mthd_onli_rcpt_istc)
 *           example: "온라인 접수 설명"
 *         application_method_others:
 *           type: string
 *           nullable: true
 *           description: 신청방법 기타설명 (aply_mthd_etc_istc)
 *           example: "기타 설명"
 *         application_criteria:
 *           type: string
 *           nullable: true
 *           description: 신청대상내용 (aply_trgt_ctnt)
 *           example: "신청 대상"
 *         application_exclusion_criteria:
 *           type: string
 *           nullable: true
 *           description: 신청대상제외내용 (aply_excl_trgt_ctnt)
 *           example: "신청 제외 대상"
 *         support_region_id:
 *           type: integer
 *           format: int64
 *           description: 지원지역 id (supt_regin)
 *           example: 200
 *         company_name:
 *           type: string
 *           nullable: true
 *           description: 공고기업명 (pbanc_ntrp_nm)
 *           example: "기업명"
 *         supervising_organization:
 *           type: string
 *           nullable: true
 *           description: 주관기관 (sprv_inst)
 *           example: "주관 기관"
 *         department_in_charge:
 *           type: string
 *           nullable: true
 *           description: 사업담당자부서명 (biz_prch_dprt_nm)
 *           example: "담당 부서"
 *         project_guidance_url:
 *           type: string
 *           nullable: true
 *           description: 사업안내 URL (biz_gdnc_url)
 *           example: "https://example.com/guidance"
 *         contact_number:
 *           type: string
 *           nullable: true
 *           description: 담당자연락처번호 (prch_cnpl_no)
 *           example: "010-1234-5678"
 *         detailed_page_url:
 *           type: string
 *           nullable: true
 *           description: 상세 페이지 URL (detl_pg_url)
 *           example: "https://example.com/detail-page"
 *         preferences:
 *           type: string
 *           nullable: true
 *           description: 우대사항 (prfn_matr)
 *           example: "우대 사항"
 *         recruitment_status:
 *           type: boolean
 *           description: 모집진행여부 (rcrt_prgs_yn)
 *           example: true
 *         pre_business_status:
 *           type: boolean
 *           description: 예비창업자 여부
 *           example: false
 *         business_duration:
 *           oneOf:
 *             - type: integer
 *             - type: string
 *           nullable: true
 *           description: 사업업력
 *           example: 3
 *         target_age_id:
 *           type: integer
 *           format: int64
 *           description: 사업연령 id (biz_trgt_age)
 *           example: 45
 *         business_classification_name:
 *           type: string
 *           format: string
 *           description: 지원사업분류 명
 *           example: 글로벌
 *         support_region_name:
 *           type: string
 *           format: string
 *           description: 지원지역 명
 *           example: 전국
 *         age_min:
 *           type: integer
 *           format: int64
 *           description: 최소 연령
 *           example: null
 *         age_max:
 *           type: integer
 *           format: int64
 *           description: 최대 연령
 *           example: 39
 *         application_target_names:
 *           type: string
 *           format: string
 *           description: 지원 대상 명
 *           example: "대학, 대학생, 일반인, 청소년"
 *         total_business_duration:
 *           type: string
 *           format: string
 *           description: 지원 사업 업력 조건
 *           example: "예비 창업자 또는 3년 미만"
 *         total_age:
 *           type: string
 *           format: string
 *           description: 지원 연령 조건
 *           example: "만 39세 미만"
 */
