'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { customerApi, CreateCustomer } from '../../lib/api';
import CustomerForm from '../../components/CustomerForm';

export default function NewCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateCustomer) => {
    setIsLoading(true);
    try {
      const response = await customerApi.create(data);
      toast.success('Customer created successfully!');
      router.push(`/customers/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/customers');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Customer/Lead</h1>
            </div>
          </div>
          
          <CustomerForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}