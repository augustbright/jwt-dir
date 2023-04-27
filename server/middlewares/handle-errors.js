import ApiError from "../exceptions/api-error.js";

export default function (error, req, res, next) {
    console.log(error);
    if (error instanceof ApiError) {
        return res.status(error.status).json({ message: error.message, errors: error.errors });
    }

    return res.status(500).json({ message: 'Unexpected server error' });
}