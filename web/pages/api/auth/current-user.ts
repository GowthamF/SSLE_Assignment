import jwt from "jsonwebtoken";
import type { NextApiHandler } from "next";
import { parseCookies } from "nookies";
import { SECRET } from "~/lib/constants";

const CurrentUserHandler: NextApiHandler = async (req, res) => {
  try {
    const cookies = parseCookies({ req });

    const user = jwt.verify(cookies.token, SECRET) as jwt.JwtPayload;

    delete user.iat;
    delete user.exp;

    return res.status(200).json(user);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default CurrentUserHandler;
