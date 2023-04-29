import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token-service.js";

export default (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(ApiError.Unauthorized());
    }
    const [_, accessToken] = authorization.split(' ');
    if (!accessToken) {
        return next(ApiError.Unauthorized());
    }

    let userData;
    try {
        userData = tokenService.validateAccessToken(accessToken);
    } catch (e) {
        return next(ApiError.Unauthorized(e.message));
    }
    
    if (!userData) {
        return next(ApiError.Unauthorized());
    }

    next();
}