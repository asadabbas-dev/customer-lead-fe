"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Image as ImageIcon,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Target,
  UserCheck,
  Building2,
  Camera,
  Sparkles,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Customer, CustomerImage, customerApi, imageApi } from "../../lib/api";
import ImageUpload from "../../components/ImageUpload";
import ImageGallery from "../../components/ImageGallery";
import CustomerForm from "../../components/CustomerForm";
import DeleteModal from "../../components/DeleteModal";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = parseInt(params.id as string);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [images, setImages] = useState<CustomerImage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageCount, setImageCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCustomer();
    fetchImages();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const response = await customerApi.getById(customerId);
      setCustomer(response.data);
    } catch (error) {
      toast.error("Failed to load customer details");
      router.push("/customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await imageApi.getCustomerImages(customerId);
      setImages(response.data);
      setImageCount(response.data.length);
    } catch (error) {
      console.error("Failed to load images:", error);
    }
  };

  const handleUpdateCustomer = async (data: any) => {
    try {
      const response = await customerApi.update(customerId, data);
      setCustomer(response.data);
      setIsEditing(false);
      toast.success("Customer updated successfully");
    } catch (error) {
      toast.error("Failed to update customer");
    }
  };

  const handleDeleteCustomer = async () => {
    setIsDeleting(true);
    try {
      await customerApi.delete(customerId);
      toast.success("Customer deleted successfully");
      router.push("/customers");
    } catch (error) {
      toast.error("Failed to delete customer");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await imageApi.deleteImage(customerId, imageId);
      fetchImages();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-slate-600 text-sm">
            Loading customer details...
          </p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Customer not found
          </h2>
          <p className="text-slate-600 mb-6">
            The customer you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => router.push("/customers")}
            className="btn-primary"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-50 py-4">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">
                  Edit Customer
                </h1>
              </div>
            </div>

            <CustomerForm
              customer={customer}
              onSubmit={handleUpdateCustomer}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header - Compact */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => router.push("/customers")}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 mb-1">
                    {customer.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.isLead
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {customer.isLead ? (
                        <>
                          <Target className="w-3 h-3 mr-1" />
                          Lead
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Customer
                        </>
                      )}
                    </span>
                    <span className="text-slate-500 text-xs flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created{" "}
                      {new Date(customer.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-secondary text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Customer Information - Compact */}
          <div className="xl:col-span-1 space-y-4">
            {/* Contact Information */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <Mail className="w-4 h-4 text-indigo-600 mr-3" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">Email</p>
                    <p className="text-sm text-slate-900 truncate">
                      {customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <Phone className="w-4 h-4 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Phone</p>
                    <p className="text-sm text-slate-900">
                      {customer.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-slate-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-rose-600 mr-3 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Address
                    </p>
                    <p className="text-sm text-slate-900">{customer.address}</p>
                  </div>
                </div>
                {customer.referralSource && (
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Building2 className="w-4 h-4 text-violet-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        How they found us
                      </p>
                      <p className="text-sm text-slate-900">
                        {customer.referralSource}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service Details - Compact */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4">
              <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                Service Details
              </h3>
              <div className="space-y-3">
                {customer.price && (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="flex items-center text-emerald-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Service Price</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">
                      ${customer.price}
                    </span>
                  </div>
                )}
                {customer.contactFrequency && (
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Contact Frequency
                      </p>
                      <p className="text-sm text-slate-900">
                        Every {customer.contactFrequency} days
                      </p>
                    </div>
                  </div>
                )}
                {customer.startDate && (
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-amber-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Start Date
                      </p>
                      <p className="text-sm text-slate-900">
                        {new Date(customer.startDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {customer.startTime && (
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Clock className="w-4 h-4 text-violet-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Start Time
                      </p>
                      <p className="text-sm text-slate-900">
                        {customer.startTime}
                      </p>
                    </div>
                  </div>
                )}
                {customer.estimatedDuration && (
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Clock className="w-4 h-4 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Duration
                      </p>
                      <p className="text-sm text-slate-900">
                        {customer.estimatedDuration} minutes
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Images Section - Compact */}
          <div className="xl:col-span-2">
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-indigo-600" />
                  Photo Gallery
                  <span className="ml-2 text-sm text-slate-500">
                    ({imageCount}/10)
                  </span>
                </h2>
                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                  {10 - imageCount} slots remaining
                </div>
              </div>

              {/* Image Upload - Compact */}
              <div className="mb-6">
                <ImageUpload
                  customerId={customerId}
                  currentImageCount={imageCount}
                  onImagesUploaded={fetchImages}
                />
              </div>

              {/* Image Gallery */}
              <ImageGallery images={images} onDeleteImage={handleDeleteImage} />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customer?.name}"? This action cannot be undone and will also delete all associated images and data.`}
        confirmText="Delete Customer"
        isLoading={isDeleting}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#f8fafc",
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
}
