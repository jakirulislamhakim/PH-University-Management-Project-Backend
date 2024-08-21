
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const decodedAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(
            token,
            config.jwt_access_secret_key as string,
        ) as JwtPayload;
        return decoded
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized !')
    }
};

export default decodedAccessToken