export interface registerUser {
  name: string;
  email: string;
  password: string;
  profilePhoto: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IProfileUpdate {
  name?: string;
  email?: string;
  profilePhoto?: string;
  bio?: string;
}
