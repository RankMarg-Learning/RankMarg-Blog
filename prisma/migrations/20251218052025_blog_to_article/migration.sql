/*
  Warnings:

  - You are about to drop the column `blogId` on the `Seo` table. All the data in the column will be lost.
  - You are about to drop the `Blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BlogToTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[articleId]` on the table `Seo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Seo" DROP CONSTRAINT "Seo_blogId_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToTag" DROP CONSTRAINT "_BlogToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToTag" DROP CONSTRAINT "_BlogToTag_B_fkey";

-- DropIndex
DROP INDEX "Seo_blogId_key";

-- AlterTable
ALTER TABLE "Seo" DROP COLUMN "blogId",
ADD COLUMN     "articleId" TEXT;

-- DropTable
DROP TABLE "Blog";

-- DropTable
DROP TABLE "_BlogToTag";

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "_ArticleToTag_B_index" ON "_ArticleToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Seo_articleId_key" ON "Seo"("articleId");

-- AddForeignKey
ALTER TABLE "Seo" ADD CONSTRAINT "Seo_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
