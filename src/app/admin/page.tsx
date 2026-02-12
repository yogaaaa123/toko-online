'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import MonthlySalesChart from '@/components/admin/MonthlySalesChart';
import StatisticsChart from '@/components/admin/StatisticsChart';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: { id: number; name: string; image: string };
  images: string[];
}

export default function AdminPage() {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
  const totalCustomers = 3782;
  const totalOrders = 5359;
  const totalProducts = products.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={logout} />

      <div className="flex-1 p-8">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats Grid - Simple & Clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ${isLoading ? '...' : totalRevenue.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalCustomers.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 mr-4">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalOrders.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Products</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts - Clean Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlySalesChart />
          <StatisticsChart />
        </div>
      </div>
    </div>
  );
}
