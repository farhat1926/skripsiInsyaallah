import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,        // karena masih localhost (HTTP)
    sameSite: "lax",      // JANGAN None kalau tidak HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
