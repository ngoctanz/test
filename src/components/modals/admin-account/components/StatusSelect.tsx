import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameAccountStatus } from "@/types/game-account.type";
import { FormDataType } from "../../../../types/account-type.admin";

interface StatusSelectProps {
  formData: FormDataType;
  onChange: (data: FormDataType) => void;
}

export function StatusSelect({ formData, onChange }: StatusSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status" className="text-white">
        Trạng thái
      </Label>
      <Select
        value={formData.status || "available"}
        onValueChange={(value) =>
          onChange({ ...formData, status: value as GameAccountStatus })
        }
      >
        <SelectTrigger className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-black border border-[#3f9ced]/20 text-white">
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
          <SelectItem value="reserved">Reserved</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
