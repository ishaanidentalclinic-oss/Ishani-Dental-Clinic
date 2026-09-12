import { NextRequest } from "next/server";
import { ok, withErrorHandler, requireAuth, ADMIN_ROLES } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import fs from "fs/promises";
import path from "path";

function sanitizeFilename(originalName: string) {
  const base = (originalName || "image").replace(/\.[^/.]+$/, "");
  const safeBase = base.replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 60) || "image";
  const ext = /\.([a-zA-Z0-9]+)$/.exec(originalName || "")?.[1]?.toLowerCase();
  return ext ? `${safeBase}.${ext}` : safeBase;
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  requireAuth(req, ADMIN_ROLES);

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "ishaani-dental/uploads";

  if (!file || typeof file === "string") {
    throw new AppError("No image file was provided", 400);
  }

  // Validate mime type
  if (!file.type.startsWith("image/")) {
    throw new AppError("Only image files are allowed", 400);
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new AppError("Image size must be less than 5MB", 400);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = `${Date.now()}-${sanitizeFilename(file.name)}`;

  // If Vercel Blob is configured, upload to Blob
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      const { put } = await import("@vercel/blob");
      const pathname = `${folder}/${safeName}`;
      const result = await put(pathname, buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
        token: blobToken,
      });
      return ok({ url: result.url, publicId: result.pathname }, "Image uploaded successfully", 201);
    } catch (err) {
      console.error("[Blob Upload Error]", err);
      throw new AppError("Image upload to blob storage failed", 500);
    }
  }

  // Local fallback: save to public/uploads
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder.replace(/[^a-zA-Z0-9_-]/g, "_"));
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeName);
    await fs.writeFile(filePath, buffer);

    const folderSlug = folder.replace(/[^a-zA-Z0-9_-]/g, "_");
    const publicUrl = `/uploads/${folderSlug}/${safeName}`;
    return ok({ url: publicUrl, publicId: safeName }, "Image uploaded successfully", 201);
  } catch (err) {
    console.error("[Local Upload Error]", err);
    throw new AppError("Failed to save image locally", 500);
  }
});
