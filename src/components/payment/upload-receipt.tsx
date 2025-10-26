"use client";

import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface UploadReceiptProps {
  onFileChange: (file: File | null) => void;
}

function UploadReceipt({ onFileChange }: UploadReceiptProps) {
  const t = useTranslations("deposit");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file dưới 5MB");
        return;
      }

      // Validate file type
      if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
        alert("Chỉ chấp nhận file PNG, JPG, JPEG!");
        return;
      }

      setUploadedFile(file);
      onFileChange(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    onFileChange(null);
  };

  return (
    <div className="bg-[#1a1d29] rounded-xl border border-[#2a2d3a] p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-purple-400" />
        {t("upload_bill")}
      </h2>
      <p className="text-gray-400 text-xs sm:text-sm mb-4">
        {t("upload_description")}
      </p>

      <div className="space-y-4">
        {/* Upload Area */}
        <label className="block">
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="border-2 border-dashed border-[#3a3d4a] rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-[#16171f]">
            {previewUrl ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="mx-auto max-h-48 rounded-lg object-contain"
                  />
                </div>
                <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {uploadedFile?.name}
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="text-blue-400 text-sm hover:text-blue-300"
                  >
                    {t("change_file")}
                  </button>
                  <span className="text-gray-500">|</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFile();
                    }}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm sm:text-base mb-1">
                  {t("click_to_upload")}
                </p>
                <p className="text-gray-500 text-xs">
                  PNG, JPG, JPEG (Max 5MB)
                </p>
              </>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}

export default UploadReceipt;
