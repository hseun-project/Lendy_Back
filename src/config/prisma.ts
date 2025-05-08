import { PrismaClient, LoanType, DuringType, ApplyLoanState } from '@prisma/client';

const prisma = new PrismaClient();
console.log('Prisma has initted');

export { prisma, LoanType, DuringType, ApplyLoanState };
