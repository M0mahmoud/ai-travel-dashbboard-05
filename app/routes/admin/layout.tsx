import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="admin-layout">
      MobileSidebar
      <aside className="w-full max-w-[270px] hidden lg:block">Aside</aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
}
