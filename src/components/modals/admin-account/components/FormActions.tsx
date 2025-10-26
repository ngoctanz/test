import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function FormActions({
  onCancel,
  onSubmit,
  isLoading = false,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t border-[#3f9ced]/20">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border border-[#3f9ced]/20 text-gray-300 hover:text-white hover:bg-[#3f9ced]/10"
        disabled={isLoading}
      >
        Hủy
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        className="bg-[#3f9ced] hover:bg-[#3f9ced]/90 text-black font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Đang lưu...
          </>
        ) : (
          "Lưu thay đổi"
        )}
      </Button>
    </div>
  );
}
