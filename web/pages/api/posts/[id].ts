import prisma from "~/prisma";
import type { NextApiHandler } from "next";
import { parseCookies } from "nookies";
import { validateToken } from "~/services/auth";

const PostHandler: NextApiHandler = async (req, res) => {
  const id = req.query.id?.toString();

  if (req.method === "GET") {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    return res.status(200).json(post);
  } else if (req.method === "DELETE") {
    const cookies = parseCookies({ req });

    const token = cookies.token;

    try {
      if (!token) {
        throw new Error("Unauthorized");
      }

      const user = await validateToken(token);

      // Users can delete their own posts and
      // Admins can delete any post
      if (user.roles.includes("User") && user.roles.includes("Admin")) {
        const post = await prisma.post.findUnique({
          where: {
            id,
          },
        });

        if (
          user.roles.includes("Admin") ||
          (user.roles.includes("User") && user.id === post?.userId)
        ) {
          await prisma.post.delete({
            where: {
              id,
            },
          });

          return res.status(200).send(true);
        }

        return res.status(401).json({ message: "Unauthorized" });
      } else {
        throw new Error("Unauthorized");
      }
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};

export default PostHandler;
