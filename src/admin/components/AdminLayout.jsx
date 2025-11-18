import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import "../../index.css"
import Img from './image-removebg-preview.png'
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Building2,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAdminAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Newspaper, label: 'News', path: '/admin/news' },
    { icon: Building2, label: 'Company Info', path: '/admin/company-info' },
    { icon: MessageSquare, label: 'Contact Forms', path: '/admin/contacts' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h1
                className={`font-bold text-xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                }`}
              >
                Namangan Mash
              </h1>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-0 hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                {sidebarOpen ? <X size={20} /> : <img style={{height:"30px"}} src={Img}/>}
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span
                    className={`transition-all duration-300 whitespace-nowrap ${
                      sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <ChevronRight
                      size={16}
                      className={`ml-auto transition-all duration-300 ${
                        sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div
                className={`transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                }`}
              >
                <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
  onClick={handleLogout}
  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-all duration-200"
>
  <LogOut style={{ width: "32px", height: "32px" }} className="text-2xl" /> {/* ← bu joy asosiy */}
  <span
    className={`transition-all duration-300 ${
      sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
    }`}
  >
    Logout
  </span>
</button>


          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="lg:p-8 sm:p-5 max-sm:p-2">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;