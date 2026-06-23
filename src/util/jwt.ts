import Jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { sendResponse } from "./sendResponse";
import httpStatus from "http-status";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = Jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verified = Jwt.verify(token, secret);
    return verified;
  }  catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        console.log("Unknown Error Occurred");
      }
    }
};

export const jwtUtils = {
  createToken,
  verifyToken
};
