'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'ড্যাশবোর্ড', icon: '📊' },
    { href: '/admin/products', label: 'পণ্যসমূহ', icon: '📦' },
    { href: '/admin/orders', label: 'অর্ডার সমূহ', icon: '📋' },
    { href: '/admin/settings', label: 'সেটিংস', icon: '⚙️' },
    { href: '/admin/marketing-settings', label: 'মার্কেটিং সেটিংস', icon: '📢' },
  ];

  const isActive = (href) => pathname.startsWith(href);

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">RJ Shop BD Admin</h1>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href) 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          <li>
            <button 
              onClick={() => {
                localStorage.removeItem('isAdminLoggedIn');
                window.location.href = '/';
              }}
              className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-700 text-gray-300"
            >
              <span>🚪</span>
              <span>লগআউট</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}