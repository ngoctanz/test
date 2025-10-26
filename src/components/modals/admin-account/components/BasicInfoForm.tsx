import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GameAccountType,
  GameAccountCategory,
} from "@/types/game-account.type";
import { FormDataType } from "../../../../types/account-type.admin";

interface BasicInfoFormProps {
  formData: FormDataType;
  onChange: (data: FormDataType) => void;
  games?: GameAccountCategory[];
  accountTypes?: Array<{ id: string; name: string }>;
}

export function BasicInfoForm({
  formData,
  onChange,
  games = [],
  accountTypes = [],
}: BasicInfoFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gameCategoryId" className="text-white">
            Game
          </Label>
          {games.length > 0 ? (
            <Select
              value={formData.gameCategoryId?.toString() || ""}
              onValueChange={(value) =>
                onChange({ ...formData, gameCategoryId: Number(value) })
              }
            >
              <SelectTrigger className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white">
                <SelectValue placeholder="Chọn game" />
              </SelectTrigger>
              <SelectContent className="bg-black border border-[#3f9ced]/20 text-white">
                {games.map((game) => (
                  <SelectItem
                    key={game.gameCategoryId}
                    value={game.gameCategoryId.toString()}
                  >
                    {game.gameCategoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="gameCategoryId"
              type="number"
              value={formData.gameCategoryId || ""}
              onChange={(e) =>
                onChange({
                  ...formData,
                  gameCategoryId: Number(e.target.value),
                })
              }
              placeholder="ID danh mục game"
              className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white focus:border-[#3f9ced]/50 focus:ring-[#3f9ced]/20"
              required
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="typeAccount" className="text-white">
            Loại tài khoản
          </Label>
          {accountTypes.length > 0 ? (
            <Select
              value={formData.typeAccount || ""}
              onValueChange={(value) =>
                onChange({ ...formData, typeAccount: value as GameAccountType })
              }
            >
              <SelectTrigger className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent className="bg-black border border-[#3f9ced]/20 text-white">
                {accountTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={formData.typeAccount || "Normal"}
              onValueChange={(value) =>
                onChange({ ...formData, typeAccount: value as GameAccountType })
              }
            >
              <SelectTrigger className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border border-[#3f9ced]/20 text-white">
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Reroll">Reroll</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Mô tả
        </Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
          placeholder="Mô tả chi tiết về tài khoản"
          rows={4}
          className="bg-[#1a1a1a] border border-[#3f9ced]/20 text-white focus:border-[#3f9ced]/50 focus:ring-[#3f9ced]/20"
        />
      </div>
    </>
  );
}
