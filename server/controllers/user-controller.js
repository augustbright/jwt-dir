import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";
import userModel from "../models/user-model.js";
import tokenService from "../service/token-service.js";
import userService from "../service/user-service.js";
import bcrypt from 'bcrypt';

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;
            const { accessToken, user, refreshToken } = await userService.registraion(email, password);
            res.cookie('refreshToken', refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.json({ user, accessToken });
        } catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                throw new ApiError(400, `User with email ${email} doesn't exist`);
            }

            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                throw new ApiError(400, `Incorrect password`);
            }

            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(user._id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).json({ user: userDto, accessToken: tokens.accessToken });
        } catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            res.clearCookie('refreshToken');
            if (refreshToken) {
                await tokenService.clearToken(refreshToken);
            }
            res.json({});
        } catch (error) {
            next(error);
        }
    }
    async activation(req, res, next) {
        try {

        } catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                throw ApiError.Unauthorized();
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = tokenService.findRefreshToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw ApiError.Unauthorized();
            }

            const user = userModel.findById(userData.id);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(user._id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            }).json({ user: userDto, accessToken: tokens.accessToken });
        } catch (error) {
            next(error);
        }
    }
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
};

export default new UserController();