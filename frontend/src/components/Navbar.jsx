import {
  FaBars,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import logo from "../assets/logo.png";


const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed,
}) => {
  // Controls profile dropdown
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") || "User";

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Desktop = collapse sidebar
  // Mobile = open drawer
  const handleHamburger = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <header
      className="
        h-18
        bg-white
        border-b
        border-slate-200
        flex
        items-center
        justify-between
        px-4
        md:px-6
        shadow-sm
      "
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleHamburger}
          className="
            p-2
            rounded-lg
            hover:bg-slate-100
            transition-all
            duration-200
          "
        >
          <FaBars size={20} />
        </button>

        <Link
          to="/dashboard"
          className="
    flex
    items-center
    cursor-pointer
  "
        >
          <img
            src={logo}
            alt="Distribo Logo"
            className="
      h-18
      md:h-18
      w-auto
      object-contain
    "
          />
        </Link>
      </div>

      {/* Right Section */}
      <div
        className="relative"
        ref={dropdownRef}
      >
        <button
          onClick={() => setOpen(!open)}
          className="
            flex
            items-center
            gap-2
            md:gap-3
            px-3
            py-2
            rounded-xl
            hover:bg-slate-100
            transition-all
            duration-200
          "
        >
          <FaUserCircle
            size={34}
            className="text-slate-600"
          />

          <span className="hidden sm:block font-medium">
            {username}
          </span>

          <FaChevronDown
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""
              }`}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`
            absolute
            right-0
            top-14
            w-52
            bg-white
            rounded-2xl
            shadow-xl
            border
            border-slate-200
            overflow-hidden
            z-50
            transition-all
            duration-200

            ${open
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
            }
          `}
        >
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="w-full cursor-pointer px-4 py-3 text-left hover:bg-slate-100  transition-colors"
          >
            Profile
          </button>


          <button
            onClick={handleLogout}
            className="
              w-full 
              px-4 
              py-3 
              text-left 
              text-red-500 
              hover:bg-red-50
              transition-colors 
              cursor-pointer 
            "
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;