import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";

export default function (req, res, next) {
    if (!validationResult(req).isEmpty()) {
        throw ApiError.BadRequest(validationResult(req).array());
    }
    next();
}