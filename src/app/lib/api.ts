import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';  // Changed to HTTP port 5000

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  referralSource?: string;
  price?: number;
  contactFrequency?: number;
  startDate?: string;
  startTime?: string;
  estimatedDuration?: number;
  isLead: boolean;
  createdAt: string;
  updatedAt: string;
  images: CustomerImage[];
}

export interface CustomerImage {
  id: number;
  customerId: number;
  imageData: string;
  fileName?: string;
  contentType?: string;
  uploadedAt: string;
}

export interface CreateCustomer {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  referralSource?: string;
  price?: number;
  contactFrequency?: number;
  startDate?: string;
  startTime?: string;
  estimatedDuration?: number;
  isLead: boolean;
}

export interface UploadImage {
  imageData: string;
  fileName?: string;
  contentType?: string;
}

// API functions
export const customerApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  getLeads: () => api.get<Customer[]>('/customers/leads'),
  getCustomers: () => api.get<Customer[]>('/customers/customers-only'),
  create: (customer: CreateCustomer) => api.post<Customer>('/customers', customer),
  update: (id: number, customer: CreateCustomer) => api.put<Customer>(`/customers/${id}`, customer),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

export const imageApi = {
  getCustomerImages: (customerId: number) => api.get<CustomerImage[]>(`/customers/${customerId}/images`),
  uploadImage: (customerId: number, image: UploadImage) => api.post<CustomerImage>(`/customers/${customerId}/images`, image),
  uploadImages: (customerId: number, images: UploadImage[]) => api.post<CustomerImage[]>(`/customers/${customerId}/images/batch`, { images }),
  deleteImage: (customerId: number, imageId: number) => api.delete(`/customers/${customerId}/images/${imageId}`),
  getImageCount: (customerId: number) => api.get<number>(`/customers/${customerId}/images/count`),
};