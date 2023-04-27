import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";
import userModel from "../models/user-model.js";
import mailService from './mail-service.js';
import tokenService from './token-service.js';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';

class UserService {
    async registraion(email, password) {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, `A user with email ${email} already exists`);
        }

        const activationLink = uuid.v4();
        await mailService.sendActivationLink(email, activationLink);
        const pwHash = await bcrypt.hash(password, 3);
        const user = await userModel.create({email, password: pwHash, activationLink, isActivated: false});

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        tokenService.saveToken(user._id, tokens.refreshToken);

        return { user: userDto, ...tokens };
    }
}

export default new UserService();