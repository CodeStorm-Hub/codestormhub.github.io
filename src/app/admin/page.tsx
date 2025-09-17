import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminDashboard />
    </div>
  );
}

export const metadata = {
  title: 'Admin Dashboard - CodeStorm Hub',
  description: 'Backend automation management dashboard for CodeStorm Hub'
};