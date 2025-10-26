import { X, GripVertical } from "lucide-react";

interface ImageListItemProps {
  imageUrl: string;
  index: number;
  onRemove: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (index: number) => void;
  isDragging: boolean;
}

export function ImageListItem({
  imageUrl,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: ImageListItemProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(index)}
      className={`relative group rounded overflow-hidden border border-[#3f9ced]/20 transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <img
        src={imageUrl}
        alt={`Image ${index + 1}`}
        className="w-full h-24 object-cover"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <div className="text-gray-300 flex items-center gap-1">
          <GripVertical className="h-4 w-4" />
          <span className="text-xs">Kéo để sắp xếp</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded transition-all"
          title="Xóa ảnh"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
