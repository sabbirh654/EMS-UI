export interface Tokens {
  token: string;
  refreshToken: string;
};

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}
