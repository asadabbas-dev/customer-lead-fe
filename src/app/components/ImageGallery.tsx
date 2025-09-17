"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Download,
  ZoomIn,
  Camera,
  Maximize2,
} from "lucide-react";
import { CustomerImage } from "../lib/api";
import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal";

interface ImageGalleryProps {
  images: CustomerImage[];
  onDeleteImage: (imageId: number) => void;
}

export default function ImageGallery({
  images,
  onDeleteImage,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{
    id: number;
    name?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset to first image when images change
  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No images uploaded yet
        </h3>
        <p className="text-slate-500 text-sm">
          Upload some images to see them in the carousel
        </p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleDeleteClick = (imageId?: number, imageName?: string) => {
    const idToDelete = imageId || images[currentIndex]?.id;
    const nameToDelete = imageName || images[currentIndex]?.fileName;

    if (idToDelete) {
      setImageToDelete({ id: idToDelete, name: nameToDelete });
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    setIsDeleting(true);
    try {
      await onDeleteImage(imageToDelete.id);
      toast.success("Image deleted successfully");

      // If deleting current image and it was the last one, go to previous
      if (currentIndex >= images.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }

      setShowDeleteModal(false);
      setImageToDelete(null);
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadImage = (imageData?: string, fileName?: string) => {
    const dataToDownload = imageData || images[currentIndex]?.imageData;
    const nameToDownload = fileName || images[currentIndex]?.fileName;

    if (dataToDownload) {
      const link = document.createElement("a");
      link.href = dataToDownload;
      link.download = nameToDownload || "customer-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded");
    }
  };

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Carousel */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Carousel Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <h3 className="text-base font-semibold text-slate-900">
              Image Gallery
            </h3>
            <span className="text-sm text-slate-500">
              {currentIndex + 1} of {images.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={openFullscreen}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="View fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => downloadImage()}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteClick()}
              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Carousel Display */}
        <div className="relative">
          {/* Main Image */}
          <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
            <img
              src={currentImage.imageData}
              alt={currentImage.fileName || `Image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                  title="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all"
                  title="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Image Info */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <h4 className="text-sm font-medium text-slate-900 mb-1">
              {currentImage.fileName || `Image ${currentIndex + 1}`}
            </h4>
            <p className="text-xs text-slate-500">
              Uploaded on{" "}
              {new Date(currentImage.uploadedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-4 border-t border-slate-200">
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-indigo-500 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={image.imageData}
                    alt={image.fileName || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-6 right-6 text-white hover:text-slate-300 z-20 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-slate-300 z-20 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-slate-300 z-20 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                src={currentImage.imageData}
                alt={currentImage.fileName || `Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Image Info Panel */}
            <div className="absolute bottom-6 left-6 right-6 bg-black bg-opacity-70 text-white rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {currentImage.fileName || `Image ${currentIndex + 1}`}
                  </h3>
                  <p className="text-sm opacity-75">
                    {currentIndex + 1} of {images.length} •{" "}
                    {new Date(currentImage.uploadedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                {/* Action buttons in modal */}
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadImage()}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDeleteClick()}
                    className="flex items-center gap-2 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setImageToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Image"
        message={`Are you sure you want to delete "${
          imageToDelete?.name || "this image"
        }"? This action cannot be undone.`}
        confirmText="Delete Image"
        isLoading={isDeleting}
      />
    </>
  );
}
