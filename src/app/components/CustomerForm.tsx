"use client";

import React, { useState } from "react";
import { Customer, CreateCustomer } from "../lib/api";

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CreateCustomer) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  isLoading,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CreateCustomer>({
    name: customer?.name || "",
    email: customer?.email || "",
    phoneNumber: customer?.phoneNumber || "",
    address: customer?.address || "",
    referralSource: customer?.referralSource || "",
    price: customer?.price || 0,
    contactFrequency: customer?.contactFrequency || 30,
    startDate: customer?.startDate ? customer.startDate.split("T")[0] : "",
    startTime: customer?.startTime || "",
    estimatedDuration: customer?.estimatedDuration || 60,
    isLead: customer?.isLead ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseFloat(value) || 0
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Basic Information
          </h3>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-custom"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-custom"
              placeholder="customer@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input-custom"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="input-custom resize-none"
              placeholder="Enter complete address"
            />
          </div>
        </div>

        {/* Service Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Service Information
          </h3>

          <div>
            <label
              htmlFor="referralSource"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              How did they find us?
            </label>
            <input
              type="text"
              id="referralSource"
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              className="input-custom"
              placeholder="Google, Referral, etc."
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Service Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="input-custom"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="contactFrequency"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Contact Frequency (days)
            </label>
            <input
              type="number"
              id="contactFrequency"
              name="contactFrequency"
              min="1"
              value={formData.contactFrequency}
              onChange={handleChange}
              className="input-custom"
              placeholder="30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input-custom"
              />
            </div>

            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="input-custom"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="estimatedDuration"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              id="estimatedDuration"
              name="estimatedDuration"
              min="1"
              value={formData.estimatedDuration}
              onChange={handleChange}
              className="input-custom"
              placeholder="60"
            />
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="isLead"
              name="isLead"
              checked={formData.isLead}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-0 focus:ring-offset-0"
            />
            <label
              htmlFor="isLead"
              className="ml-3 block text-sm font-medium text-slate-700"
            >
              This is a lead (not yet a customer)
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading
            ? "Saving..."
            : customer
            ? "Update Customer"
            : "Create Customer"}
        </button>
      </div>
    </form>
  );
}
