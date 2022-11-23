import { prisma } from "../context/PrismaContext";

export const getVariableTest = async () => {
  let test = await prisma.rewardType.findMany();
  return "a"
};
