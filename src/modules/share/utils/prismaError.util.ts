import { Prisma } from '@prisma/client';

export const isUniqueConstraintPrismaError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code == 'P2002'
  );
};
