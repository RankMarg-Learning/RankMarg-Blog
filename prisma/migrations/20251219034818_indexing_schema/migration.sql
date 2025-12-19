-- CreateIndex
CREATE INDEX "Article_id_idx" ON "Article"("id");

-- CreateIndex
CREATE INDEX "Article_slug_idx" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_published_idx" ON "Article"("published");

-- CreateIndex
CREATE INDEX "Article_category_idx" ON "Article"("category");

-- CreateIndex
CREATE INDEX "Article_createdAt_idx" ON "Article"("createdAt");

-- CreateIndex
CREATE INDEX "Article_updatedAt_idx" ON "Article"("updatedAt");

-- CreateIndex
CREATE INDEX "Tag_id_idx" ON "Tag"("id");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_createdAt_idx" ON "Tag"("createdAt");

-- CreateIndex
CREATE INDEX "Tag_updatedAt_idx" ON "Tag"("updatedAt");
