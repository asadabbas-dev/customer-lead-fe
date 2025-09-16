// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Plus, Search, User, Users, MapPin, Phone, Mail, DollarSign, Calendar, Image as ImageIcon, Target, UserCheck } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';
// import { Customer, customerApi } from '../lib/api';

// export default function CustomersPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const type = searchParams.get('type');
  
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState<'all' | 'leads' | 'customers'>(
//     type === 'leads' ? 'leads' : type === 'customers' ? 'customers' : 'all'
//   );

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   useEffect(() => {
//     filterCustomers();
//   }, [customers, searchTerm, filterType]);

//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       const response = await customerApi.getAll();
//       setCustomers(response.data);
//     } catch (error) {
//       toast.error('Failed to load customers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterCustomers = () => {
//     let filtered = customers;

//     if (filterType === 'leads') {
//       filtered = filtered.filter(customer => customer.isLead);
//     } else if (filterType === 'customers') {
//       filtered = filtered.filter(customer => !customer.isLead);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(customer =>
//         customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         customer.phoneNumber.includes(searchTerm)
//       );
//     }

//     setFilteredCustomers(filtered);
//   };

//   const handleCreateCustomer = () => {
//     router.push('/customers/new');
//   };

//   const handleCustomerClick = (customerId: number) => {
//     router.push(`/customers/${customerId}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600 font-medium">Loading customers...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="card p-8 border-l-4 border-blue-500">
//             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//               <div className="flex items-center space-x-4">
//                 <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
//                   {filterType === 'leads' ? '🎯' : filterType === 'customers' ? '👥' : '📊'}
//                 </div>
//                 <div>
//                   <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                     {filterType === 'leads' ? 'Leads' : 
//                      filterType === 'customers' ? 'Customers' : 'All Customers & Leads'}
//                   </h1>
//                   <p className="text-lg text-gray-600">
//                     <span className="font-semibold text-blue-600">{filteredCustomers.length}</span> {' '}
//                     {filteredCustomers.length === 1 ? 'entry' : 'entries'} found
//                   </p>
//                 </div>
//               </div>
              
//               <button
//                 onClick={handleCreateCustomer}
//                 className="btn-primary flex items-center gap-3 group"
//               >
//                 <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
//                 Add New Customer
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="mb-8">
//           <div className="card p-6">
//             <div className="flex flex-col lg:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or phone..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="input-field pl-12"
//                 />
//               </div>
              
//               <div className="lg:w-64">
//                 <select
//                   value={filterType}
//                   onChange={(e) => setFilterType(e.target.value as 'all' | 'leads' | 'customers')}
//                   className="input-field"
//                 >
//                   <option value="all">🔍 All Types</option>
//                   <option value="leads">🎯 Leads Only</option>
//                   <option value="customers">✅ Customers Only</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Customer Grid */}
//         {filteredCustomers.length === 0 ? (
//           <div className="card p-16 text-center">
//             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Users className="w-12 h-12 text-gray-400" />
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-900 mb-4">No customers found</h3>
//             <p className="text-gray-600 text-lg mb-8">
//               {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first customer or lead.'}
//             </p>
//             {!searchTerm && (
//               <button onClick={handleCreateCustomer} className="btn-primary mx-auto">
//                 <Plus className="w-5 h-5 mr-2" />
//                 Add Your First Customer
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//             {filteredCustomers.map((customer, index) => (
//               <div
//                 key={customer.id}
//                 onClick={() => handleCustomerClick(customer.id)}
//                 className="card card-hover cursor-pointer overflow-hidden group"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
                
//                 {/* Card Header */}
//                 <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
//                         {customer.name.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <h3 className="text-xl font-bold mb-1">{customer.name}</h3>
//                         <span className={customer.isLead ? 'badge-lead' : 'badge-customer'}>
//                           {customer.isLead ? (
//                             <>
//                               <Target className="w-3 h-3 mr-1" />
//                               Lead
//                             </>
//                           ) : (
//                             <>
//                               <UserCheck className="w-3 h-3 mr-1" />
//                               Customer
//                             </>
//                           )}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Decorative element */}
//                   <div className="absolute -right-8 -top-8 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
//                   <div className="absolute -right-4 -top-4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
//                 </div>

//                 {/* Card Content */}
//                 <div className="p-6 space-y-4">
//                   <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
//                     <Mail className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
//                     <span className="text-sm truncate">{customer.email}</span>
//                   </div>
                  
//                   <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
//                     <Phone className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
//                     <span className="text-sm">{customer.phoneNumber}</span>
//                   </div>
                  
//                   <div className="flex items-start text-gray-600 hover:text-red-600 transition-colors">
//                     <MapPin className="w-4 h-4 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
//                     <span className="text-sm line-clamp-2">{customer.address}</span>
//                   </div>

//                   {customer.price && (
//                     <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
//                       <div className="flex items-center text-green-700">
//                         <DollarSign className="w-4 h-4 mr-2" />
//                         <span className="text-sm font-medium">Price</span>
//                       </div>
//                       <span className="text-lg font-bold text-green-600">${customer.price}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Card Footer */}
//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center text-gray-500">
//                       <ImageIcon className="w-4 h-4 mr-2" />
//                       <span className="font-medium">{customer.images.length}</span>
//                       <span className="ml-1">image{customer.images.length !== 1 ? 's' : ''}</span>
//                     </div>
//                     <div className="flex items-center text-gray-500">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       <span>{new Date(customer.createdAt).toLocaleDateString('en-US', { 
//                         month: 'short', 
//                         day: 'numeric' 
//                       })}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Hover overlay */}
//                 <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 pointer-events-none"></div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Quick Stats */}
//         {filteredCustomers.length > 0 && (
//           <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="card p-6 text-center">
//               <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
//                 <Users className="w-6 h-6 text-blue-600" />
//               </div>
//               <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
//               <div className="text-gray-600">Total Entries</div>
//             </div>
            
//             <div className="card p-6 text-center">
//               <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
//                 <Target className="w-6 h-6 text-yellow-600" />
//               </div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {customers.filter(c => c.isLead).length}
//               </div>
//               <div className="text-gray-600">Active Leads</div>
//             </div>
            
//             <div className="card p-6 text-center">
//               <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
//                 <UserCheck className="w-6 h-6 text-green-600" />
//               </div>
//               <div className="text-2xl font-bold text-gray-900">
//                 {customers.filter(c => !c.isLead).length}
//               </div>
//               <div className="text-gray-600">Customers</div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             borderRadius: '12px',
//             background: '#363636',
//             color: '#fff',
//           },
//         }}
//       />
//     </div>
//   );
// }


'use client';

export default function TestPage() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#ddd6fe', padding: '2rem'}}>
      <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: '#dc2626'}}>
          Basic HTML Test
        </h1>
        <p style={{color: '#16a34a', marginTop: '1rem'}}>
          This uses inline styles to verify basic rendering works.
        </p>
      </div>
      
      <div className="bg-blue-500 text-white p-4 rounded mt-4">
        This should be BLUE if Tailwind is working
      </div>
      
      <div className="bg-red-500 text-white p-4 rounded mt-4">
        This should be RED if Tailwind is working
      </div>
    </div>
  );
}