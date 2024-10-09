// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
import { connection as conn } from '../../config/mariadb';
import { IBusinessDetail } from '.';
import { queryErrorChecker } from '../common';

export const businessGetDetail = (req: Request, res: Response) => {
  const { businessId } = req.params;
  const sql = `
      SELECT 
        A.*, 
        BC.name AS business_classification_name,    -- 지원사업분류 테이블의 name
        SR.name AS support_region_name,             -- 지원지역 테이블의 name
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
        Target_Age TA ON A.target_age_id = TA.id
      JOIN 
        Announcement_Application_Target AAT ON A.id = AAT.announcement_id -- 관계 테이블 조인
      JOIN 
        Application_Target AT ON AAT.application_target_id = AT.id         -- 신청대상 테이블 조인
      WHERE 
      	A.id = ?
      GROUP BY 
        A.id;   -- 공고별로 그룹화
    `;
  const values = [businessId];

  conn.query(sql, values, (err, results) => {
    let resValue: IBusinessDetail;
    if (queryErrorChecker(err, res)) return;
    resValue = Object.values(results)[0] as IBusinessDetail;

    // 사업 업력 출력
    if (resValue.pre_business_status) {
      resValue.total_business_duration = '예비 창업자';
      if (resValue.business_duration)
        resValue.total_business_duration += ` 또는 ${resValue.business_duration}년 미만`;
    } else if (resValue.business_duration)
      resValue.total_business_duration = `${resValue.business_duration}년 미만`;
    else resValue.total_business_duration = `업력 무관`;

    // 타겟 연령 출력
    if (resValue.age_min) {
      resValue.total_age = `만 ${resValue.age_min}세 이상`;
      if (resValue.age_max)
        resValue.total_age += ` 만 ${resValue.age_max}세 이하`;
    } else if (resValue.age_max) {
      resValue.total_age = `만 ${resValue.age_max}세 이하`;
    } else {
      resValue.total_age = `나이 무관`;
    }
    return res.status(StatusCodes.OK).json({
      ...resValue,
    });
  });
};
