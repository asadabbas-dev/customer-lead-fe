"use client";

import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Download,
  ZoomIn,
  Camera,
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{
    id: number;
    name?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          Upload some images to see them in the gallery
        </p>
      </div>
    );
  }

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === 0 ? images.length - 1 : selectedIndex - 1
      );
    }
  };

  const handleDeleteClick = (imageId: number, imageName?: string) => {
    setImageToDelete({ id: imageId, name: imageName });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    setIsDeleting(true);
    try {
      await onDeleteImage(imageToDelete.id);
      toast.success("Image deleted successfully");

      if (selectedIndex !== null) {
        const currentImage = images[selectedIndex];
        if (currentImage.id === imageToDelete.id) {
          closeModal();
        }
      }

      setShowDeleteModal(false);
      setImageToDelete(null);
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadImage = (imageData: string, fileName?: string) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = fileName || "customer-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded");
  };

  return (
    <>
      {/* Grid View */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div
              className="aspect-square bg-slate-100 cursor-pointer relative overflow-hidden"
              onClick={() => openModal(index)}
            >
              <img
                src={image.imageData}
                alt={image.fileName || `Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(image.imageData, image.fileName);
                }}
                className="p-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm transition-colors"
                title="Download"
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(image.id, image.fileName);
                }}
                className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Image Info */}
            <div className="p-3">
              <h4 className="text-sm font-medium text-slate-900 truncate">
                {image.fileName || `Image ${index + 1}`}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(image.uploadedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Carousel */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeModal}
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
                src={images[selectedIndex].imageData}
                alt={
                  images[selectedIndex].fileName || `Image ${selectedIndex + 1}`
                }
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Image Info Panel */}
            <div className="absolute bottom-6 left-6 right-6 bg-black bg-opacity-70 text-white rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {images[selectedIndex].fileName ||
                      `Image ${selectedIndex + 1}`}
                  </h3>
                  <p className="text-sm opacity-75">
                    {selectedIndex + 1} of {images.length} •{" "}
                    {new Date(
                      images[selectedIndex].uploadedAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Action buttons in modal */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      downloadImage(
                        images[selectedIndex].imageData,
                        images[selectedIndex].fileName
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteClick(
                        images[selectedIndex].id,
                        images[selectedIndex].fileName
                      )
                    }
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
              {selectedIndex + 1} / {images.length}
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
