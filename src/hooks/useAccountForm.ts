import { useState, useEffect } from "react";
import {
  GameAccount,
  GameAccountImage,
  GameAccountStatus,
  GameAccountType,
} from "@/types/game-account.type";
import { createGameAccount, updateGameAccount } from "@/apis/admin.api";
import { FormDataType, getInitialFormData } from "../types/account-type.admin";

export function useAccountForm(
  account: GameAccount | null | undefined,
  open: boolean,
  onSave: (account: GameAccount) => void,
  onOpenChange: (open: boolean) => void
) {
  const [formData, setFormData] = useState<FormDataType>(
    account || getInitialFormData()
  );
  const [isLoading, setIsLoading] = useState(false);

  /** =============================================
   * 🔁 Reset dữ liệu khi mở dialog
   * ============================================= */
  useEffect(() => {
    if (open) {
      setFormData(account ? account : getInitialFormData());
    }
  }, [account, open]);

  /** =============================================
   * 🖼️ Upload ảnh bìa chính
   * ============================================= */
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        mainImageUrl: reader.result as string,
        ...(account ? { newMainImageFile: file } : { mainImageFile: file }),
      });
    };
    reader.readAsDataURL(file);
  };

  /** =============================================
   * 🖼️ Upload nhiều ảnh phụ
   * ============================================= */
  const handleMultipleImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    const fileArray = Array.from(files);
    const newImages: GameAccountImage[] = [...(formData.images || [])];
    let loaded = 0;

    fileArray.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          imageId: Date.now() + idx,
          imageUrl: reader.result as string,
        });
        loaded++;
        if (loaded === fileArray.length) {
          if (account) {
            setFormData({
              ...formData,
              images: newImages,
              newAdditionalImageFiles: [
                ...(formData.newAdditionalImageFiles || []),
                ...fileArray,
              ],
            });
          } else {
            setFormData({
              ...formData,
              images: newImages,
              additionalImageFiles: [
                ...(formData.additionalImageFiles || []),
                ...fileArray,
              ],
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  /** =============================================
   * ❌ Xóa ảnh (phân biệt ảnh cũ / mới)
   * ============================================= */
  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images?.filter((_, i) => i !== index) || [];
    const removedImage = formData.images?.[index];

    if (!removedImage) return;

    // Nếu account đã có (update)
    if (account) {
      const deleteIds = [...(formData.deleteImageIds || [])];

      // Nếu là ảnh cũ trong DB → add vào deleteImageIds
      if (
        typeof removedImage.imageId === "number" &&
        removedImage.imageId < Date.now() - 1000000
      ) {
        if (!deleteIds.includes(removedImage.imageId)) {
          deleteIds.push(removedImage.imageId);
        }
        setFormData({
          ...formData,
          images: updatedImages,
          deleteImageIds: deleteIds,
        });
      } else {
        // Nếu là ảnh mới (chưa upload lên)
        const updatedFiles = (formData.newAdditionalImageFiles || []).filter(
          (_, i) => i !== index
        );
        setFormData({
          ...formData,
          images: updatedImages,
          newAdditionalImageFiles: updatedFiles,
        });
      }
    } else {
      // Nếu là tài khoản mới
      const updatedFiles = (formData.additionalImageFiles || []).filter(
        (_, i) => i !== index
      );
      setFormData({
        ...formData,
        images: updatedImages,
        additionalImageFiles: updatedFiles,
      });
    }
  };

  /** =============================================
   * ↕️ Sắp xếp lại thứ tự ảnh
   * ============================================= */
  const handleReorderImages = (newOrder: GameAccountImage[]) => {
    setFormData({
      ...formData,
      images: newOrder,
    });
  };

  /** =============================================
   * 💾 Submit (tạo mới / cập nhật)
   * ============================================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra bắt buộc
    if (!formData.gameCategoryId || !formData.description) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!account && !formData.mainImageFile) {
      alert("Vui lòng chọn ảnh bìa chính cho tài khoản mới");
      return;
    }

    if (!account && (!formData.images || formData.images.length === 0)) {
      alert("Vui lòng thêm ít nhất một ảnh cho tài khoản mới");
      return;
    }

    setIsLoading(true);

    try {
      /** ===================== UPDATE ===================== */
      if (account) {
        const fd = new FormData();
        fd.append("gameCategoryId", String(formData.gameCategoryId || ""));
        fd.append("originalPrice", String(formData.originalPrice || 0));
        fd.append("currentPrice", String(formData.currentPrice || 0));
        fd.append("description", formData.description || "");
        fd.append("status", formData.status || "available");
        fd.append("typeAccount", formData.typeAccount || "Normal");

        if (formData.newMainImageFile) {
          fd.append("newMainImage", formData.newMainImageFile);
        }

        if (formData.newAdditionalImageFiles?.length) {
          formData.newAdditionalImageFiles.forEach((f) =>
            fd.append("newAdditionalImages", f)
          );
        }

        // ✅ FIX: gửi deleteImageIds dạng JSON array
        if (formData.deleteImageIds?.length) {
          fd.append("deleteImageIds", JSON.stringify(formData.deleteImageIds));
        }

        const response = await updateGameAccount(account.gameAccountId, fd);

        if (response.data) {
          const updated: GameAccount = {
            ...account,
            gameCategoryId: formData.gameCategoryId!,
            originalPrice: formData.originalPrice!,
            currentPrice: formData.currentPrice!,
            description: formData.description!,
            status: formData.status as GameAccountStatus,
            typeAccount: formData.typeAccount as GameAccountType,
            mainImageUrl: formData.mainImageUrl!,
            images: formData.images!,
          };
          onSave(updated);
          onOpenChange(false);
          alert(response.message || "Cập nhật tài khoản thành công!");
        }
      } else {

      /** ===================== CREATE ===================== */
        const fd = new FormData();
        fd.append("gameCategoryId", String(formData.gameCategoryId || ""));
        fd.append("originalPrice", String(formData.originalPrice || 0));
        fd.append("currentPrice", String(formData.currentPrice || 0));
        fd.append("description", formData.description || "");
        fd.append("status", formData.status || "available");
        fd.append("typeAccount", formData.typeAccount || "Normal");

        if (formData.mainImageFile) {
          fd.append("mainImage", formData.mainImageFile);
        }

        if (formData.additionalImageFiles?.length) {
          formData.additionalImageFiles.forEach((f) =>
            fd.append("additionalImages", f)
          );
        }

        const response = await createGameAccount(fd);
        if (response.data) {
          const newAccount = response.data as GameAccount;
          onSave(newAccount);
          onOpenChange(false);
          alert(response.message || "Tạo tài khoản thành công!");
        }
      }
    } catch (error: any) {
      console.error("🚨 Failed to save account:", error);
      const msg =
        error?.response?.message || error?.message || "Lỗi không xác định";
      alert(`${account ? "Cập nhật" : "Tạo"} tài khoản thất bại: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================================
   * 🔙 Trả về các handler
   * ============================================= */
  return {
    formData,
    setFormData,
    isLoading,
    handleCoverImageUpload,
    handleMultipleImagesUpload,
    handleRemoveImage,
    handleReorderImages,
    handleSubmit,
  };
}
