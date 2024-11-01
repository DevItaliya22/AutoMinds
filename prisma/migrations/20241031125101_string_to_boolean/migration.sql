/*
  Warnings:

  - The `GitHubActionisPublic` column on the `GithubNode` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GithubNode" DROP COLUMN "GitHubActionisPublic",
ADD COLUMN     "GitHubActionisPublic" BOOLEAN;
