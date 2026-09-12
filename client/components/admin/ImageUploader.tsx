"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage, type MediaFolder } from "@/lib/adminMedia";
import { ApiError } from "@/lib/adminApi";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: MediaFolder;
  label?: string;
  aspectClassName?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder,
  label = "Image",
  aspectClassName = "aspect-video",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    try {
      const { url } = await uploadImage(file, folder);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-ink-900">{label}</p>
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-black/10 bg-sage-50 ${aspectClassName}`}
      >
        {value ? (
          <Image src={value} alt="" fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-700/50">
            <ImagePlus size={24} />
            <p className="text-xs">No image selected</p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 size={20} className="animate-spin text-primary-700" />
          </div>
        )}

        {value && !isUploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            title="Remove image"
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-card hover:bg-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="mt-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-ink-900 transition-colors hover:border-primary-300 disabled:pointer-events-none disabled:opacity-50"
      >
        {value ? "Replace image" : "Upload image"}
      </button>
    </div>
  );
}
