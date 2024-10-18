// Import node module
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import axios from 'axios'; // Axios for making HTTP requests

export const authGoogleLogin = async (req: Request, res: Response) => {
    const { accessToken } = req.body; // 클라이언트에서 받은 액세스 토큰

    if (!accessToken) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Access token is required' });
    }

    try {
        // 1. Google API를 사용해 액세스 토큰 검증 및 사용자 정보 가져오기
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        // 2. 사용자 정보 추출
        const userData = response.data; // 여기서 사용자 정보를 가져옵니다.
        console.log(userData)
        
        // 3. 필요한 경우 사용자 정보를 데이터베이스에 저장하거나 처리
        // 예시: const user = await User.findOne({ googleId: userData.sub });

        // 4. 응답 반환 (예시로 사용자 정보를 반환)
        return res.status(StatusCodes.OK).json({
            message: 'User authenticated successfully',
            user: userData // 또는 필요한 사용자 데이터
        });

    } catch (error) {
        // 5. 에러 처리
        console.error('Error fetching user info:', error);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid access token' });
    }
};
