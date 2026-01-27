import Head from 'next/head';
import { withAuthRequired } from '@/components/hoc/withAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { NotificationList } from '@/components/ui/NotificationList';

function NotificationsPage() {
  return (
    <>
      <Head>
        <title>Notifikasi - Jejakin</title>
      </Head>

      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
            <p className="text-gray-600 mt-1">
              Semua notifikasi dan update terbaru
            </p>
          </div>

          <NotificationList />
        </div>
      </DashboardLayout>
    </>
  );
}

export default withAuthRequired(NotificationsPage);
