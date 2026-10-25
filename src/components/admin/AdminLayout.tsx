import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Inbox,
  Zap,
  BarChart3,
  Link2,
  Store,
  Bell
} from 'lucide-react';

import { AdminOverview } from './AdminOverview.tsx';
import { AdminProducts } from './AdminProducts.tsx';
import { AdminOrders } from './AdminOrders.tsx';
import { AdminInventory } from './AdminInventory.tsx';
import { AdminInquiries } from './AdminInquiries.tsx';
import { AdminAutomation } from './AdminAutomation.tsx';
import { AdminAnalytics } from './AdminAnalytics.tsx';
import { AdminIntegrations } from './AdminIntegrations.tsx';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'inventory'
  | 'inquiries'
  | 'automation'
  | 'analytics'
  | 'integrations';

export const AdminLayout: React.FC = () => {
  const { setActiveView, notifications, refreshNotifications } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/read', { method: 'POST' });
      await refreshNotifications();
    } catch {
      // ignore
    }
  };

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'orders' as AdminTab, label: 'Orders', icon: ShoppingBag },
    { id: 'products' as AdminTab, label: 'Products', icon: Package },
    { id: 'inventory' as AdminTab, label: 'Inventory', icon: Layers },
    { id: 'inquiries' as AdminTab, label: 'Support Inquiries', icon: Inbox },
    { id: 'automation' as AdminTab, label: 'Automation Centre', icon: Zap },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'integrations' as AdminTab, label: 'Integrations', icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1C1F]">
      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-[#E2DDD3] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-[#1C1C1F]">
                NovaCart<span className="text-[#B89758] italic font-normal ml-0.5">Admin</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-[#7A7875] bg-[#F3EFEA] px-2 py-0.5 rounded border border-[#E7E2DA]">
                Merchant Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-[#4A4845] hover:text-[#1C1C1F] hover:bg-[#F3EFEA] rounded-lg transition-colors"
                title="Notifications"
                aria-label="Store Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B71C1C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E7E2DA] py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-[#F2EEE9] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1C1C1F]">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-[#B89758] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#F2EEE9]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#7A7875]">No notifications</div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 text-xs hover:bg-[#FAF8F5] transition-colors ${
                            !notif.read ? 'bg-[#FFFDF7]' : ''
                          }`}
                        >
                          <p className="font-semibold text-[#1C1C1F]">{notif.title}</p>
                          <p className="text-[#6B6864] text-[11px] mt-0.5">{notif.message}</p>
                          <span className="text-[10px] text-[#9A9690] mt-1 block">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Return to Storefront */}
            <button
              onClick={() => setActiveView('storefront')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1C1F] bg-[#FAF8F5] border border-[#DDD7CE] rounded-lg hover:border-[#1C1C1F] transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto flex gap-1 border-t border-[#F2EEE9]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowNotifications(false);
                }}
                className={`py-3 px-4 text-xs font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#1C1C1F] text-[#1C1C1F] font-semibold'
                    : 'border-transparent text-[#706E69] hover:text-[#1C1C1F]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B89758]' : 'text-[#8A857D]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <AdminOverview onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'inventory' && <AdminInventory />}
        {activeTab === 'inquiries' && <AdminInquiries />}
        {activeTab === 'automation' && <AdminAutomation />}
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'integrations' && <AdminIntegrations />}
      </main>
    </div>
  );
};
