// import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// import local module
import { connection as conn } from '../../mariadb';

export interface IAnnouncement {
  id: number;
  integrated_announcement_status: boolean;
  integrated_announcement_project_name: string;
  project_announcement_name: string;
  announcement_content: string;
  support_business_classification_id: number;
  announcement_start_date: string;
  announcement_end_date: string;
  application_method_in_person_submission_description: string;
  application_method_mail_submission_description: string;
  application_method_fax_submission_description: string;
  application_method_online_submission_description: string;
  application_method_other_descriptions: string;
  application_target_content: string;
  application_exclusion_criteria: string;
  support_region_id: number;
  announcement_company_name: string;
  supervising_organization: string;
  department_in_charge_of_the_project: string;
  project_guidance_url: string;
  contact_persons_phone_number: string;
  detailed_page_url: string;
  preferences: string;
  recruitment_status: boolean;
}

export const businessGetAll = (req: Request, res: Response) => {
  const query = `SELECT * FROM Announcement`;
  let resValue;

  conn.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    console.log(results);
    resValue = results;
  });

  return res.status(StatusCodes.OK).json({
    request: '전체 사업 조회',
    response: resValue,
  });
};
