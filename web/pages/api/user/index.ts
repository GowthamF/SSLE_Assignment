import jwt from "jsonwebtoken";
import type { NextApiHandler } from "next";
import type { User } from "~/prisma";
import { parseCookies } from "nookies";
import { SECRET } from "~/lib/constants";

const UsersHandler: NextApiHandler = async (req, res) => {
  try {
    const cookies = parseCookies({ req });

    const userJwt = jwt.verify(cookies.token, SECRET) as User;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userJwt.id,
      },
    });

    if (user.role !== "SuperAdmin" && user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const users = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        id: true,
        role: true,
      },
    });

    return res.status(200).json(users);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default UsersHandler;
