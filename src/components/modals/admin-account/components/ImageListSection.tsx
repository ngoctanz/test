import { useState } from "react";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { GameAccountImage } from "@/types/game-account.type";
import { ImageListItem } from "./ImageListItem";

interface ImageListSectionProps {
  images: GameAccountImage[];
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onReorderImages: (newOrder: GameAccountImage[]) => void;
}

export function ImageListSection({
  images,
  onAddImages,
  onRemoveImage,
  onReorderImages,
}: ImageListSectionProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);

    onReorderImages(newImages);
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-white">Danh sách ảnh chi tiết</Label>
        <p className="text-xs text-gray-400">
          {images.length > 0 ? `${images.length} ảnh` : "Chưa có ảnh"}
        </p>
      </div>

      <p className="text-xs text-gray-400">
        Chọn ảnh để thêm vào tài khoản. Kéo ảnh để sắp xếp lại thứ tự.
      </p>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-[#3f9ced]/30 rounded p-6 bg-[#1a1a1a] hover:bg-[#252525] transition-colors">
        <label className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-[#3f9ced]" />
            <p className="text-sm font-medium text-white">Chọn ảnh để thêm</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF (tối đa 5MB)</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onAddImages}
            className="hidden"
          />
        </label>
      </div>

      {/* Display uploaded images */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium text-white mb-3">
            Ảnh đã thêm ({images.length})
          </p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <ImageListItem
                key={idx}
                imageUrl={img.imageUrl}
                index={idx}
                onRemove={onRemoveImage}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedIndex === idx}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
