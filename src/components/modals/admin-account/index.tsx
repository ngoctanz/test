"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountFormDialogProps } from "../../../types/account-type.admin";
import { useAccountForm } from "../../../hooks/useAccountForm";
import { CoverImageSection } from "./components/CoverImageSection";
import { ImageListSection } from "./components/ImageListSection";
import { BasicInfoForm } from "./components/BasicInfoForm";
import { PricingForm } from "./components/PricingForm";
import { StatusSelect } from "./components/StatusSelect";
import { FormActions } from "./components/FormActions";

export function AccountFormDialog({
  account,
  open,
  onOpenChange,
  onSave,
  games = [],
  accountTypes = [],
}: AccountFormDialogProps) {
  const {
    formData,
    setFormData,
    isLoading,
    handleCoverImageUpload,
    handleMultipleImagesUpload,
    handleRemoveImage,
    handleReorderImages,
    handleSubmit,
  } = useAccountForm(account, open, onSave, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-black border border-[#3f9ced]/20">
        <DialogHeader className="border-b border-[#3f9ced]/20 pb-4">
          <DialogTitle className="text-white">
            {account ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Section */}
          <CoverImageSection
            coverImage={formData.mainImageUrl || ""}
            onImageUpload={handleCoverImageUpload}
          />

          {/* Multiple Images Section */}
          <ImageListSection
            images={formData.images || []}
            onAddImages={handleMultipleImagesUpload}
            onRemoveImage={handleRemoveImage}
            onReorderImages={handleReorderImages}
          />

          {/* Basic Info Form */}
          <BasicInfoForm
            formData={formData}
            onChange={setFormData}
            games={games}
            accountTypes={accountTypes}
          />

          {/* Pricing Form */}
          <PricingForm formData={formData} onChange={setFormData} />

          {/* Status Select */}
          <StatusSelect formData={formData} onChange={setFormData} />

          {/* Form Actions */}
          <FormActions
            onCancel={() => onOpenChange(false)}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
