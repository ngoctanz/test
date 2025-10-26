import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormDataType } from "../../../../types/account-type.admin";

interface PricingFormProps {
  formData: FormDataType;
  onChange: (data: FormDataType) => void;
}

export function PricingForm({ formData, onChange }: PricingFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="originalPrice" className="text-white">
          Giá gốc ($)
        </Label>
        <Input
          id="originalPrice"
          type="number"
          value={formData.originalPrice || ""}
          onChange={(e) =>
            onChange({
              ...formData,
              originalPrice: e.target.value,
            })
          }
          className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white focus:border-[#3f9ced]/50 focus:ring-[#3f9ced]/20"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentPrice" className="text-white">
          Giá hiện tại ($)
        </Label>
        <Input
          id="currentPrice"
          type="number"
          value={formData.currentPrice || ""}
          onChange={(e) =>
            onChange({
              ...formData,
              currentPrice: e.target.value,
            })
          }
          className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white focus:border-[#3f9ced]/50 focus:ring-[#3f9ced]/20"
          required
        />
      </div>
    </div>
  );
}
