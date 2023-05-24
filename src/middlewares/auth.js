import { verifyToken } from "../utils/jwt";

export const userAuth = (req, res, next) => {
  try {
    // check if there is token in the request header
    const token = req.header('auth_token');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    // if there is a token in the request header
    const verified = verifyToken(token);
    req.user = verified;
    next();

  } catch (error) {
    return res.status(400).json({ message: 'Invalid Token' });
  }

}