import jwt from "jsonwebtoken";

export function getUserFromToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
