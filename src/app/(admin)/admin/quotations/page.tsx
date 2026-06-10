import { QuotationsManager } from "@/components/admin/QuotationsManager";

export const metadata = { title: "Quotations — Admin" };

export default function QuotationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quotations</h1>
        <p className="text-gray-400 text-sm mt-1">Create and manage client proposals and quotations</p>
      </div>
      <QuotationsManager />
    </div>
  );
}
