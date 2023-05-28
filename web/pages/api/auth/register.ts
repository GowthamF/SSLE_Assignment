import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "~/prisma";
import type { NextApiHandler } from "next";
import { setCookie } from "nookies";
import { RegisterSchema } from "~/lib/schema";
import { SECRET, SALT_ROUNDS } from "~/lib/constants";

const RegisterHandler: NextApiHandler = async (req, res) => {
  const data = await RegisterSchema.parseAsync(req.body);

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      id: true,
      role: true,
    },
  });

  const token = jwt.sign(user, SECRET, {
    expiresIn: "7d",
  });

  setCookie({ res }, "token", token, {
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
    httpOnly: true,
  });

  return res.status(200).send(true);
};

export default RegisterHandler;
