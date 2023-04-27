import jwt from 'jsonwebtoken';
import tokenModel from '../models/token-model.js';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const existingToken = await tokenModel.findOne({ user: userId });
        if (existingToken) {
            existingToken.refreshToken = refreshToken;
            await existingToken.save();
            return existingToken;
        }

        return await tokenModel.create({ user: userId, refreshToken });
    }

    async clearToken(refreshToken) {
        await tokenModel.deleteOne({ refreshToken });
    }

    validateRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    }

    validateAccessToken(accessToken) {
        return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    }

    async findRefreshToken(refreshToken) {
        return tokenModel.findOne({ refreshToken });
    }
};

export default new TokenService();