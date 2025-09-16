'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Image as ImageIcon, User, Mail, Phone, MapPin, DollarSign, Calendar, Clock, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Customer, CustomerImage, customerApi, imageApi } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';
import ImageGallery from '../../components/ImageGallery';
import CustomerForm from '../../components/CustomerForm';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = parseInt(params.id as string);
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [images, setImages] = useState<CustomerImage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    fetchCustomer();
    fetchImages();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const response = await customerApi.getById(customerId);
      setCustomer(response.data);
    } catch (error) {
      toast.error('Failed to load customer details');
      router.push('/customers');
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
      console.error('Failed to load images:', error);
    }
  };

  const handleUpdateCustomer = async (data: any) => {
    try {
      const response = await customerApi.update(customerId, data);
      setCustomer(response.data);
      setIsEditing(false);
      toast.success('✅ Customer updated successfully');
    } catch (error) {
      toast.error('Failed to update customer');
    }
  };

  const handleDeleteCustomer = async () => {
    if (confirm('⚠️ Are you sure you want to delete this customer? This action cannot be undone and will also delete all associated images.')) {
      try {
        await customerApi.delete(customerId);
        toast.success('🗑️ Customer deleted successfully');
        router.push('/customers');
      } catch (error) {
        toast.error('Failed to delete customer');
      }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Customer not found</h2>
          <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => router.push('/customers')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <button
                onClick={() => router.push('/customers')}
                className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{customer.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${
                      customer.isLead ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {customer.isLead ? '🎯 Lead' : '✅ Customer'}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Created {new Date(customer.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl shadow-sm hover:bg-blue-50 transition-colors font-medium"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="inline-flex items-center px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl shadow-sm hover:bg-red-50 transition-colors font-medium"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="xl:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white shadow-xl rounded-2xl p-6 animate-slide-up">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-green-600 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{customer.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-red-600 mr-4 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{customer.address}</p>
                  </div>
                </div>
                {customer.referralSource && (
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Users className="w-5 h-5 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">How they found us</p>
                      <p className="text-gray-900">{customer.referralSource}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white shadow-xl rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-green-600" />
                Service Details
              </h3>
              <div className="space-y-4">
                {customer.price && (
                  <div className="flex items-center p-4 bg-green-50 rounded-xl">
                    <DollarSign className="w-5 h-5 text-green-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p className="text-2xl font-bold text-green-600">${customer.price}</p>
                    </div>
                  </div>
                )}
                {customer.contactFrequency && (
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Frequency</p>
                      <p className="text-gray-900">Every {customer.contactFrequency} days</p>
                    </div>
                  </div>
                )}
                {customer.startDate && (
                  <div className="flex items-center p-4 bg-yellow-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-yellow-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p className="text-gray-900">
                        {new Date(customer.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {customer.startTime && (
                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <Clock className="w-5 h-5 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Time</p>
                      <p className="text-gray-900">{customer.startTime}</p>
                    </div>
                  </div>
                )}
                {customer.estimatedDuration && (
                  <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                    <Clock className="w-5 h-5 text-indigo-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estimated Duration</p>
                      <p className="text-gray-900">{customer.estimatedDuration} minutes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="xl:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <ImageIcon className="w-7 h-7 mr-3 text-indigo-600" />
                  Photo Gallery
                  <span className="ml-3 text-lg text-gray-500">({imageCount}/10)</span>
                </h2>
                <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
                  {10 - imageCount} slots remaining
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <ImageUpload
                  customerId={customerId}
                  currentImageCount={imageCount}
                  onImagesUploaded={fetchImages}
                />
              </div>

              {/* Image Gallery */}
              <ImageGallery
                images={images}
                onDeleteImage={handleDeleteImage}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}