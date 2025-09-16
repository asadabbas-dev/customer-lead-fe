"use client";

import React, { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { imageApi, UploadImage } from "../lib/api";

interface ImageUploadProps {
  customerId: number;
  currentImageCount: number;
  onImagesUploaded: () => void;
}

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ImageUpload({
  customerId,
  currentImageCount,
  onImagesUploaded,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image format`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      validFiles.push(file);
    }

    const remainingSlots = MAX_IMAGES - currentImageCount;
    if (validFiles.length > remainingSlots) {
      toast.error(
        `Can only upload ${remainingSlots} more images. Maximum is ${MAX_IMAGES} per customer.`
      );
      return validFiles.slice(0, remainingSlots);
    }

    return validFiles;
  };

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      const validFiles = validateFiles(files);
      if (validFiles.length === 0) return;

      setUploading(true);
      try {
        const uploadPromises = validFiles.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            imageData: base64,
            fileName: file.name,
            contentType: file.type,
          } as UploadImage;
        });

        const imagesToUpload = await Promise.all(uploadPromises);

        if (imagesToUpload.length === 1) {
          await imageApi.uploadImage(customerId, imagesToUpload[0]);
          toast.success("Image uploaded successfully!");
        } else {
          await imageApi.uploadImages(customerId, imagesToUpload);
          toast.success(
            `${imagesToUpload.length} images uploaded successfully!`
          );
        }

        onImagesUploaded();

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.response?.data || "Failed to upload images");
      } finally {
        setUploading(false);
      }
    },
    [customerId, currentImageCount, onImagesUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileUpload(e.target.files);
      }
    },
    [handleFileUpload]
  );

  const remainingSlots = MAX_IMAGES - currentImageCount;

  return (
    <div className="w-full">
      <div
        className={`relative border-3 border-dashed rounded-xl p-8 transition-all duration-300 ${
          isDragging
            ? "border-blue-400 bg-blue-50 scale-105"
            : remainingSlots <= 0
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer focus:outline-none"
          disabled={uploading || remainingSlots <= 0}
        />

        <div className="text-center">
          {uploading ? (
            <>
              <Upload className="mx-auto h-16 w-16 text-blue-600 animate-bounce-subtle" />
              <div className="mt-6">
                <p className="text-lg font-medium text-blue-600">
                  Uploading images...
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full animate-pulse"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </>
          ) : remainingSlots <= 0 ? (
            <>
              <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
              <div className="mt-6">
                <p className="text-lg font-medium text-gray-600">
                  Maximum images reached
                </p>
                <p className="text-sm text-gray-500">
                  You have uploaded the maximum of {MAX_IMAGES} images
                </p>
              </div>
            </>
          ) : (
            <>
              <ImageIcon className="mx-auto h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <div className="mt-6">
                <p className="text-lg font-medium text-gray-900">
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF, WebP up to 5MB each
                </p>
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {remainingSlots} slot{remainingSlots !== 1 ? "s" : ""}{" "}
                  remaining
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
