import { cn } from "lib/utils";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { logoutUser } from "~/appwrite/auth";

export default function ClientNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const user = useLoaderData();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };
  return (
    <nav
      className={cn(
        location.pathname === `/travel/${params.tripId}`
          ? "bg-white"
          : "glassmorphism",
        "w-full fixed z-50"
      )}
    >
      <header className="root-nav wrapper">
        <Link to="/" className="link-logo">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Travel</h1>
        </Link>

        <aside>
          {user ? (
            <Link
              to="/dashboard"
              className={cn("text-base font-normal text-white", {
                "text-dark-100": location.pathname.startsWith("/travel"),
              })}
            >
              Admin Panel
            </Link>
          ) : (
            <Link
              to="/login"
              className={cn("text-base font-normal text-white", {
                "text-dark-100": location.pathname.startsWith("/travel"),
              })}
            >
              {location.pathname.startsWith("/travel")
                ? "Create a trip"
                : "Login"}
            </Link>
          )}

          {user && (
            <img
              src={user?.image_url || "/assets/images/david.wepb"}
              alt="user"
              referrerPolicy="no-referrer"
            />
          )}

          {user && (
            <button onClick={handleLogout} className="cursor-pointer">
              <img
                src="/assets/icons/logout.svg"
                alt="logout"
                className="size-6 rotate-180"
              />
            </button>
          )}
        </aside>
      </header>
    </nav>
  );
}
