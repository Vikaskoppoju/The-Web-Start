import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#04040a]">
      <AdminSidebar />
      {/* Main content — offset for sidebar */}
      <div className="lg:pl-60 transition-all duration-300">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
