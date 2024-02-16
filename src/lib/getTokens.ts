import jwt from "jsonwebtoken";

export const getTokens = (payload: any) => ({
  accessToken: jwt.sign(payload, String(process.env.REFRESH_SECRET), {
    expiresIn: "15s",
  }),
  refreshToken: jwt.sign(payload, String(process.env.ACCESS_SECRET), {
    expiresIn: "30m",
  }),
});
