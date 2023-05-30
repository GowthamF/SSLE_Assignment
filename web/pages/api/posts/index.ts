import prisma from "~/prisma";
import type { NextApiHandler } from "next";
import { parseCookies } from "nookies";
import { validateToken } from "~/services/auth";
import { PostSchema, PostInput } from "~/lib/schema";

const PostHandler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const posts = await prisma.post.findMany();

    return res.status(200).json(posts);
  } else if (req.method === "POST") {
    const cookies = parseCookies({ req });

    const token = cookies.token;

    try {
      if (!token) {
        throw new Error("Unauthorized");
      }

      const user = await validateToken(token);

      // Only Users can create posts
      if (!user?.roles?.includes("User")) {
        throw new Error("Unauthorized");
      }

      let data: PostInput;

      try {
        data = await PostSchema.parseAsync(req.body);
      } catch {
        return res.status(400).json({ message: "Invalid inputs" });
      }

      const post = await prisma.post.create({
        data: {
          title: data?.title,
          content: data?.content,
          userId: user.id,
        },
      });

      return res.status(200).json(post);
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};

export default PostHandler;
