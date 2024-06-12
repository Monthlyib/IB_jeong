import Loading from "@/components/Loading";
import AdminMain from "@/components/adminComponents/AdminMain";
import { Suspense } from "react";
export default function AdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminMain />
    </Suspense>
  );
}
