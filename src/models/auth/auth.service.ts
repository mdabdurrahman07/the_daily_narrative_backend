import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config/dotenv.config";
import { ILogin, registerUser } from "./auth.interface";
import { SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../util/jwt";

const createUserIntoDB = async (payload: registerUser) => {
  const { name, email, password, profilePhoto } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExist) {
    throw new Error("user with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  // ? create user
  const createdUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });
  // ! create user profile
  // await prisma.profile.create({
  //   data: {
  //     userId: createdUser.id,
  //     profilePhoto: profilePhoto,
  //   },
  // });

  //  fetch user
  const user = prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

const loginUser = async (payload: ILogin) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  if (user.activeStatus === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contact support");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  // accessToken
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );
  // refreshToken
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMyProfileFromDB = async (userId: string) => {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return userProfile;
};

const updateMyProfileFromDB = () => {}

export const authService = {
  createUserIntoDB,
  loginUser,
  getMyProfileFromDB,
  updateMyProfileFromDB
};
