import { Outlet, redirect, useLocation } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/user";
import { useEffect } from "react";

export async function clientLoader() {
  try {
    const user = await account.get();

    if (!user.$id) return redirect("/login");

    const existingUser = await getExistingUser(user.$id);

    if (existingUser?.role === "USER") {
      return redirect("/");
    }

    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (e) {
    console.log("Error in clientLoader", e);
    return redirect("/login");
  }
}

export default function DashboardLayout() {
  const location = useLocation();
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const banners = document.querySelectorAll(
        "div[style*='position: fixed'][style*='z-index: 999999999']"
      );
      banners.forEach((el) => {
        if (
          el.textContent?.includes("Syncfusion") &&
          el.textContent?.includes("license")
        ) {
          el.remove();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run once immediately
    const banners = document.querySelectorAll(
      "div[style*='position: fixed'][style*='z-index: 999999999']"
    );
    banners.forEach((el) => {
      if (
        el.textContent?.includes("Syncfusion") &&
        el.textContent?.includes("license")
      ) {
        el.remove();
      }
    });

    return () => observer.disconnect();
  }, [location]);
  return (
    <div className="admin-layout">
      <MobileSidebar />

      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent>
          <NavItems />
        </SidebarComponent>
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
}
