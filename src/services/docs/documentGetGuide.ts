// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Import local module
// import { accessTokenVerify } from '../common';

const documentGuideLine = `※ 창업아이템(제품·서비스)개발 · 구체화개병과 이를 뒷받침할 근거, 동기 등을 제시

① 외부적 배경 및 동기 (예 : 사회 · 경제 · 기술적 관점, 국내 · 외 시장의 문제점 기획 등)

② 내부적 배경 및 동기 (예 : 대표자 경험, 가치관, 비전 등의 관점)

※ 배경에서 발견한 문제점과 해결방안, 필요성, 제품 · 서비스를 개발 · 구체화하려는 목적 기재`;

export const documentGetGuide = (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({
    guideLine: documentGuideLine,
  });
};
