import { cn } from "lib/utils";
import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";
import { sidebarItems } from "~/constants";

export default function NavItems({
  handleClick,
}: {
  handleClick?: () => void;
}) {
  const navigate = useNavigate();

  const user = useLoaderData();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/assets/icons/logo.svg" className="size-[30px]" alt="Logo" />
        <h1>Dashboard</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ href, icon, id, label }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    width={20}
                    height={20}
                    alt={label}
                    className={`size-5 group-hover:brightness-0 group-hover:invert transition-all ${
                      isActive ? "brightness-0 invert" : "text-dark-200"
                    }`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <img
            src={user?.image_url || "/assets/images/david.webp"}
            alt={user?.name || "Admin"}
            referrerPolicy="no-referrer"
          />

          <article>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </article>

          <button onClick={handleLogout} className="cursor-pointer">
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
}
