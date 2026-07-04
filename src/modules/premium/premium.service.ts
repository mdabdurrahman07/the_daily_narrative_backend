import { prisma } from "../../lib/prisma";

const getPremiumContentFromDB = async () => {
  const posts = await prisma.post.findMany({
    where: {
      isPremium: true,
    },
  });
  return posts;
};

export const premiumServices = {
  getPremiumContentFromDB,
};
