import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "~/prisma";
import type { NextApiHandler } from "next";
import { setCookie } from "nookies";
import { LoginSchema } from "~/lib/schema";
import { SECRET } from "~/lib/constants";

const LoginHandler: NextApiHandler = async (req, res) => {
  const data = await LoginSchema.parseAsync(req.body);

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: data.username,
      },
    });

    await bcrypt.compare(data.password, user.password);

    const newUser = {
      ...user,
      password: undefined,
    };

    const token = jwt.sign(newUser, SECRET, {
      expiresIn: "7d",
    });

    setCookie({ res }, "token", token, {
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      httpOnly: true,
    });

    return res.status(200).send(true);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default LoginHandler;
