import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CoverImageSectionProps {
  coverImage: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CoverImageSection({
  coverImage,
  onImageUpload,
}: CoverImageSectionProps) {
  return (
    <div className="space-y-3">
      <Label className="text-white">Ảnh bìa tài khoản</Label>
      <div className="relative group">
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-48 object-cover border border-[#3f9ced]/20 rounded"
          />
        ) : (
          <div className="w-full h-48 bg-[#1a1a1a] border-2 border-dashed border-[#3f9ced]/30 flex items-center justify-center rounded">
            <p className="text-gray-500">Chưa có ảnh</p>
          </div>
        )}

        {/* Upload Overlay */}
        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded">
          <div className="text-center">
            <Upload className="h-6 w-6 text-white mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Chọn ảnh bìa</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
