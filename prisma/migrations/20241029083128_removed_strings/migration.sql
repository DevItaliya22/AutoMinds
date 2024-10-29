/*
  Warnings:

  - You are about to drop the column `githubNodeId` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `googleNodeId` on the `Node` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Node" DROP COLUMN "githubNodeId",
DROP COLUMN "googleNodeId";
