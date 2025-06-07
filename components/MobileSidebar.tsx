import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Link } from "react-router";
import NavItems from "./NavItems";

export default function MobileSidebar() {
  let isOpen: SidebarComponent;

  const toggleSidebar = () => {
    isOpen.toggle();
  };

  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="size-[30px]"
          />
          <h1>Dashboard</h1>
        </Link>

        <button onClick={toggleSidebar}>
          <img
            src="/assets/icons/menu.svg"
            alt="Menu Icon"
            className="size-7"
          />
        </button>
      </header>

      <SidebarComponent
        width="270px"
        // @ts-ignore
        ref={(sidebar) => (isOpen = sidebar)}
        created={() => isOpen.hide()}
        type="Push"
        position="Left"
        enableDock={false}
        showBackdrop={true}
        closeOnDocumentClick={true}
      >
        <NavItems handleClick={toggleSidebar} />
      </SidebarComponent>
    </div>
  );
}
