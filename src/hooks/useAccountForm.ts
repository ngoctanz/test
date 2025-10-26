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

  useEffect(() => {
    if (account && open) {
      setFormData(account);
    } else if (!account && open) {
      setFormData(getInitialFormData());
    }
  }, [account, open]);

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (account) {
          setFormData({
            ...formData,
            mainImageUrl: reader.result as string,
            newMainImageFile: file,
          });
        } else {
          setFormData({
            ...formData,
            mainImageUrl: reader.result as string,
            mainImageFile: file,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: GameAccountImage[] = [...(formData.images || [])];
      const fileArray = Array.from(files);
      let filesProcessed = 0;

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            imageId: Date.now() + filesProcessed,
            imageUrl: reader.result as string,
          });
          filesProcessed++;

          if (filesProcessed === fileArray.length) {
            if (account) {
              const existingFiles = formData.newAdditionalImageFiles || [];
              setFormData({
                ...formData,
                images: newImages,
                newAdditionalImageFiles: [...existingFiles, ...fileArray],
              });
            } else {
              const existingFiles = formData.additionalImageFiles || [];
              setFormData({
                ...formData,
                images: newImages,
                additionalImageFiles: [...existingFiles, ...fileArray],
              });
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages =
      formData.images?.filter(
        (_: GameAccountImage, i: number) => i !== index
      ) || [];

    const removedImage = formData.images?.[index];

    if (account) {
      if (
        removedImage?.imageId &&
        typeof removedImage.imageId === "number" &&
        removedImage.imageId < Date.now() - 1000000
      ) {
        const deleteIds = formData.deleteImageIds || [];
        if (!deleteIds.includes(removedImage.imageId)) {
          deleteIds.push(removedImage.imageId);
        }
        setFormData({
          ...formData,
          images: updatedImages,
          deleteImageIds: deleteIds,
        });
      } else {
        const updatedFiles = (formData.newAdditionalImageFiles || []).filter(
          (_, i) => {
            const fileIndex = (formData.images || [])
              .filter((img) => img.imageId > Date.now() - 1000000)
              .indexOf(removedImage!);
            return i !== fileIndex;
          }
        );

        setFormData({
          ...formData,
          images: updatedImages,
          newAdditionalImageFiles: updatedFiles,
        });
      }
    } else {
      const updatedFiles = (formData.additionalImageFiles || []).slice();
      const newImageIndex = (formData.images || []).indexOf(removedImage!);
      if (newImageIndex !== -1 && newImageIndex < updatedFiles.length) {
        updatedFiles.splice(newImageIndex, 1);
      }

      setFormData({
        ...formData,
        images: updatedImages,
        additionalImageFiles: updatedFiles,
      });
    }
  };

  const handleReorderImages = (newOrder: GameAccountImage[]) => {
    setFormData({
      ...formData,
      images: newOrder,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      if (account) {
        const formDataToSend = new FormData();

        if (formData.gameCategoryId) {
          formDataToSend.append(
            "gameCategoryId",
            formData.gameCategoryId.toString()
          );
        }
        if (formData.originalPrice) {
          formDataToSend.append(
            "originalPrice",
            formData.originalPrice.toString()
          );
        }
        if (formData.currentPrice) {
          formDataToSend.append(
            "currentPrice",
            formData.currentPrice.toString()
          );
        }
        if (formData.description) {
          formDataToSend.append("description", formData.description);
        }
        if (formData.status) {
          formDataToSend.append("status", formData.status);
        }
        if (formData.typeAccount) {
          formDataToSend.append("typeAccount", formData.typeAccount);
        }

        if (formData.newMainImageFile) {
          formDataToSend.append("newMainImage", formData.newMainImageFile);
        }

        if (
          formData.newAdditionalImageFiles &&
          formData.newAdditionalImageFiles.length > 0
        ) {
          formData.newAdditionalImageFiles.forEach((file) => {
            formDataToSend.append("newAdditionalImages", file);
          });
        }

        if (formData.deleteImageIds && formData.deleteImageIds.length > 0) {
          formData.deleteImageIds.forEach((imageId) => {
            formDataToSend.append("deleteImageIds", imageId.toString());
          });
        }

        const response = await updateGameAccount(
          account.gameAccountId,
          formDataToSend
        );

        if (response.data) {
          const updatedAccount: GameAccount = {
            ...account,
            gameCategoryId: formData.gameCategoryId || account.gameCategoryId,
            originalPrice: formData.originalPrice || account.originalPrice,
            currentPrice: formData.currentPrice || account.currentPrice,
            description: formData.description || account.description,
            status: (formData.status as GameAccountStatus) || account.status,
            typeAccount:
              (formData.typeAccount as GameAccountType) || account.typeAccount,
            mainImageUrl: formData.mainImageUrl || account.mainImageUrl,
            images: formData.images || account.images,
          };

          onSave(updatedAccount);
          onOpenChange(false);
          alert(response.message || "Cập nhật tài khoản thành công!");
        }
      } else {
        const formDataToSend = new FormData();

        formDataToSend.append(
          "gameCategoryId",
          formData.gameCategoryId?.toString() || ""
        );
        formDataToSend.append(
          "originalPrice",
          formData.originalPrice?.toString() || "0"
        );
        formDataToSend.append(
          "currentPrice",
          formData.currentPrice?.toString() || "0"
        );
        formDataToSend.append("description", formData.description || "");
        formDataToSend.append("status", formData.status || "available");
        formDataToSend.append("typeAccount", formData.typeAccount || "Normal");

        if (formData.mainImageFile) {
          formDataToSend.append("mainImage", formData.mainImageFile);
        }

        if (
          formData.additionalImageFiles &&
          formData.additionalImageFiles.length > 0
        ) {
          formData.additionalImageFiles.forEach((file) => {
            formDataToSend.append("additionalImages", file);
          });
        }

        const response = await createGameAccount(formDataToSend);

        if (response.data) {
          const newAccount = response.data as GameAccount;
          onSave(newAccount);
          onOpenChange(false);
          alert(response.message || "Tạo tài khoản thành công!");
        }
      }
    } catch (error: any) {
      console.error("Failed to save account:", error);
      const errorMessage =
        error?.response?.message || error?.message || "Lỗi không xác định";
      alert(
        `${account ? "Cập nhật" : "Tạo"} tài khoản thất bại: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

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
