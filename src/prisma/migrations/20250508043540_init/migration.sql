-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('PRIVATE_LOAN', 'PUBLIC_LOAN');

-- CreateEnum
CREATE TYPE "DuringType" AS ENUM ('DAY', 'MONTH');

-- CreateEnum
CREATE TYPE "ApplyLoanState" AS ENUM ('PENDING', 'APPROVAL', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,
    "creditScore" INTEGER NOT NULL DEFAULT 500,
    "state" CHAR(32),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetail" (
    "id" BIGINT NOT NULL,
    "userCode" TEXT NOT NULL,
    "userName" VARCHAR(6),
    "userSeqNo" VARCHAR(10),
    "apiTranId" VARCHAR(40),

    CONSTRAINT "UserDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "fintechUseNum" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "bankName" VARCHAR(20) NOT NULL,
    "bankNumber" VARCHAR(16),
    "alias" VARCHAR(50) NOT NULL,
    "bankNumberMasked" VARCHAR(20) NOT NULL,
    "ownerName" VARCHAR(20) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("fintechUseNum")
);

-- CreateTable
CREATE TABLE "ApplyLoan" (
    "id" BIGSERIAL NOT NULL,
    "debtId" BIGINT NOT NULL,
    "bondId" BIGINT,
    "loanType" "LoanType" NOT NULL,
    "money" INTEGER NOT NULL,
    "interest" DECIMAL(4,2) NOT NULL,
    "duringType" "DuringType" NOT NULL,
    "during" INTEGER NOT NULL,
    "state" "ApplyLoanState" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ApplyLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" BIGSERIAL NOT NULL,
    "debtId" BIGINT NOT NULL,
    "bondId" BIGINT NOT NULL,
    "money" INTEGER NOT NULL,
    "repay" INTEGER NOT NULL DEFAULT 0,
    "interest" DECIMAL(4,2) NOT NULL,
    "duringType" "DuringType" NOT NULL,
    "during" INTEGER NOT NULL,
    "startDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_state_key" ON "User"("state");

-- AddForeignKey
ALTER TABLE "UserDetail" ADD CONSTRAINT "UserDetail_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplyLoan" ADD CONSTRAINT "ApplyLoan_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplyLoan" ADD CONSTRAINT "ApplyLoan_bondId_fkey" FOREIGN KEY ("bondId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_bondId_fkey" FOREIGN KEY ("bondId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
