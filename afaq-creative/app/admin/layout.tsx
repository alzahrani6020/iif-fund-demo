import { getAdminSession } from '@/lib/session';
import { AdminHeader } from '@/components/AdminHeader';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-afaq-bg">
      <AdminHeader
        admin={
          session.isLoggedIn
            ? { name: session.name || undefined, email: session.email || undefined }
            : null
        }
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
