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
    return {
      success: true,
      data: verified,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    } else {
      console.log("Unknown Error Occurred at jwt verification");
    }
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
