/*
  Warnings:

  - Added the required column `isTrigger` to the `GithubNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GithubNode" ADD COLUMN     "isTrigger" BOOLEAN NOT NULL;
