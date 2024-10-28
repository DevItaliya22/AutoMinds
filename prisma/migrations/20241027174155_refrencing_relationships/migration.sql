/*
  Warnings:

  - You are about to drop the column `NodeId` on the `GithubNode` table. All the data in the column will be lost.
  - You are about to drop the column `NodeId` on the `GoogleNode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nodeId]` on the table `GithubNode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nodeId]` on the table `GoogleNode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nodeId` to the `GithubNode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeId` to the `GoogleNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GithubNode" DROP COLUMN "NodeId",
ADD COLUMN     "nodeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GoogleNode" DROP COLUMN "NodeId",
ADD COLUMN     "nodeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "githubNodeId" TEXT,
ADD COLUMN     "googleNodeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GithubNode_nodeId_key" ON "GithubNode"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleNode_nodeId_key" ON "GoogleNode"("nodeId");

-- AddForeignKey
ALTER TABLE "GoogleNode" ADD CONSTRAINT "GoogleNode_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubNode" ADD CONSTRAINT "GithubNode_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
