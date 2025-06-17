import ClientNavbar from "components/Client/ClientNavbar";
import { Outlet, redirect } from "react-router";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/user";

export async function clientLoader() {
  try {
    const user = await account.get();

    if (!user.$id) return redirect("/login");

    const existingUser = await getExistingUser(user.$id);
    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (e) {
    console.log("Error fetching user", e);
    // return redirect("/login");
  }
}

export default function ClientLayout() {
  return (
    <div className="bg-light-200">
      <ClientNavbar />
      <Outlet />
    </div>
  );
}
