import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  // console.log(token);
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, "APP_SECRET", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};
