"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Users,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  Target,
  UserCheck,
  Building2,
  Clock,
  Filter,
  User,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Customer, customerApi } from "../lib/api";

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "leads" | "customers">(
    "all"
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, filterType]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerApi.getAll();
      setCustomers(response.data);
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (filterType === "leads") {
      filtered = filtered.filter((customer) => customer.isLead);
    } else if (filterType === "customers") {
      filtered = filtered.filter((customer) => !customer.isLead);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phoneNumber.includes(searchTerm)
      );
    }

    setFilteredCustomers(filtered);
  };

  const handleCreateCustomer = () => {
    router.push("/customers/new");
  };

  const handleCustomerClick = (customerId: number) => {
    router.push(`/customers/${customerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Header Section - More Compact */}
        <div className="mb-4">
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center text-white shadow-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Customer - Lead
                  </h1>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-semibold text-indigo-600">
                        {filteredCustomers.length}
                      </span>
                      {filterType === "leads"
                        ? "leads"
                        : filterType === "customers"
                        ? "customers"
                        : "total"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateCustomer}
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Customer or Lead
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats - Enhanced */}
        {filteredCustomers.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Stats Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200 rounded-full -mr-8 -mt-8 opacity-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {customers.length}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-indigo-900 mb-1">
                    Total Contacts
                  </h3>
                  <p className="text-xs text-indigo-600">
                    All customers & leads
                  </p>
                </div>
              </div>
            </div>

            {/* Leads Stats Card */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200 rounded-full -mr-8 -mt-8 opacity-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-amber-700">
                    {customers.filter((c) => c.isLead).length}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">
                    Active Leads
                  </h3>
                  <p className="text-xs text-amber-600">Potential customers</p>
                </div>
              </div>
            </div>

            {/* Customers Stats Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200 rounded-full -mr-8 -mt-8 opacity-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {customers.filter((c) => !c.isLead).length}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-900 mb-1">
                    Customers
                  </h3>
                  <p className="text-xs text-emerald-600">Converted leads</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter - Enhanced UI */}
        <div className="mb-4">
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Enhanced Search Input */}
              <div className="flex-1 relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200">
                  <Search
                    className={`h-4 w-4 ${
                      searchTerm
                        ? "text-indigo-500"
                        : "text-slate-400 group-hover:text-slate-500"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Enhanced Filter Dropdown */}
              <div className="lg:w-48 relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors duration-200">
                  <Filter
                    className={`h-4 w-4 ${
                      filterType !== "all"
                        ? "text-indigo-500"
                        : "text-slate-400 group-hover:text-slate-500"
                    }`}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(
                      e.target.value as "all" | "leads" | "customers"
                    )
                  }
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="leads">Leads Only</option>
                  <option value="customers">Customers Only</option>
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-slate-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Results Count */}
            {searchTerm && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Found{" "}
                  <span className="font-semibold text-indigo-600">
                    {filteredCustomers.length}
                  </span>{" "}
                  result(s) for "
                  <span className="font-medium">{searchTerm}</span>"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Grid - More Compact Cards */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No customers found
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Get started by adding your first customer or lead."}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateCustomer}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Customer
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => handleCustomerClick(customer.id)}
                className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer"
              >
                {/* Card Header - Compact */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">
                        {customer.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          customer.isLead
                            ? "bg-amber-100 text-amber-700"
                            : "bg-indigo-100 text-indigo-700"
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
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                {/* Card Content - Compact */}
                <div className="space-y-2">
                  <div className="flex items-center text-slate-600 text-sm">
                    <Mail className="w-3 h-3 mr-2 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>

                  <div className="flex items-center text-slate-600 text-sm">
                    <Phone className="w-3 h-3 mr-2 text-slate-500 flex-shrink-0" />
                    <span>{customer.phoneNumber}</span>
                  </div>

                  <div className="flex items-start text-slate-600 text-sm">
                    <MapPin className="w-3 h-3 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1 text-xs">
                      {customer.address}
                    </span>
                  </div>

                  {customer.price && (
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg mt-3">
                      <div className="flex items-center text-slate-700">
                        <DollarSign className="w-3 h-3 mr-1" />
                        <span className="text-xs font-medium">Service</span>
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">
                        ${customer.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer - Compact */}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      <span>{customer.images.length}/10</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(customer.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      customer.isLead ? "bg-amber-400" : "bg-indigo-400"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
