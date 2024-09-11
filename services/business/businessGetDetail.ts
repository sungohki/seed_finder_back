// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';

interface IBusinessDetail {
  id: number; // 공고 id번호
  integrated_status: boolean; // 통합 공고 여부 (intg_pbanc_yn)
  integrated_project_name: string | null; // 통합 공고 사업명 (intg_pbanc_biz_nm)
  project_name: string | null; // 사업공고명 (biz_pbanc_nm)
  content: string | null; // 공고 내용 (pbanc_ctnt)
  business_classification_id: number; // 지원사업분류 id (supt_biz_clsfc)
  start_date: Date; // 공고접수시작일시 (pbanc_rcpt_bgng_dt)
  end_date: Date; // 공고접수종료일시 (pbanc_rcpt_end_dt)
  application_method_visit: string | null; // 신청방법 방문접수설명 (aply_mthd_vst_rcpt_istc)
  application_method_mail: string | null; // 신청방법 우편접수설명 (aply_mthd_pssr_rcpt_istc)
  application_method_fax: string | null; // 신청방법 팩스접수설명 (aply_mthd_fax_rcpt_istc)
  application_method_online: string | null; // 신청방법 온라인접수설명 (aply_mthd_onli_rcpt_istc)
  application_method_others: string | null; // 신청방법 기타설명 (aply_mthd_etc_istc)
  application_criteria: string | null; // 신청대상내용 (aply_trgt_ctnt)
  application_exclusion_criteria: string | null; // 신청대상제외내용 (aply_excl_trgt_ctnt)
  support_region_id: number; // 지원지역 id (supt_regin)
  company_name: string | null; // 공고기업명 (pbanc_ntrp_nm)
  supervising_organization: string | null; // 주관기관 (sprv_inst)
  department_in_charge: string | null; // 사업담당자부서명 (biz_prch_dprt_nm)
  project_guidance_url: string | null; // 사업안내 URL (biz_gdnc_url)
  contact_number: string | null; // 담당자연락처번호 (prch_cnpl_no)
  detailed_page_url: string | null; // 상세 페이지 URL (detl_pg_url)
  preferences: string | null; // 우대사항 (prfn_matr)
  recruitment_status: boolean; // 모집진행여부 (rcrt_prgs_yn)
  pre_business_status: boolean; // 예비창업자 여부
  business_duration_id: number; // 사업업력 id (biz_enyy)
  target_age_id: number; // 사업연령 id (biz_trgt_age),
}

export const businessGetDetail = async (req: Request, res: Response) => {
  const { businessId } = req.params;
  let sql: string;
  let resValue: IBusinessDetail;
  const values = [businessId];

  try {
    // sql = `SELECT * FROM Announcement WHERE id = ?`;
    sql = `
      SELECT 
        A.*, 
        BC.name AS business_classification_name,    -- 지원사업분류 테이블의 name
        SR.name AS support_region_name,             -- 지원지역 테이블의 name
        BD.period AS business_duration_period,      -- 사업업력 테이블의 period
        TA.age_min,                                 -- 사업대상연령 테이블의 최소 나이
        TA.age_max,                                 -- 사업대상연령 테이블의 최대 나이
        GROUP_CONCAT(AT.name) AS application_target_names -- 신청대상 테이블의 여러 name 값
      FROM 
        Announcement A
      -- 각 테이블과 조인
      JOIN 
        Business_Classification BC ON A.business_classification_id = BC.id
      JOIN 
        Support_Region SR ON A.support_region_id = SR.id
      JOIN 
        Business_Duration BD ON A.business_duration = BD.id
      JOIN 
        Target_Age TA ON A.target_age_id = TA.id
      JOIN 
        Announcement_Application_Target AAT ON A.id = AAT.announcement_id -- 관계 테이블 조인
      JOIN 
        Application_Target AT ON AAT.application_target_id = AT.id         -- 신청대상 테이블 조인
      GROUP BY 
        A.id;   -- 공고별로 그룹화
      WHERE A.id = ?
    `;

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      resValue = Object.values(results)[0] as IBusinessDetail;
      // console.log(resValue);
      return res.status(StatusCodes.OK).json({
        ...resValue,
      });
    });
  } catch (e) {
    return res.status(StatusCodes.NO_CONTENT).json({
      request: '사업 상세 조회',
      response: e,
    });
  }
};
