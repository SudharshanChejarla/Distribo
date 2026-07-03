import { NavLink } from "react-router-dom";
import { useState } from "react";

import {
  FaTachometerAlt,
  FaBoxes,
  FaTruck,
  FaMoneyBillWave,
  FaUsers,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
}) => {
  const [inventoryOpen, setInventoryOpen] =
    useState(false);

  const menuClass = ({ isActive }) =>
    `
    flex items-center
    ${
      collapsed
        ? "justify-center"
        : "gap-3"
    }
    px-4 py-3
    rounded-xl
    font-medium
    transition-colors
    duration-200
    ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-700 hover:bg-slate-100"
    }
  `;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`
          fixed inset-0
          bg-black/40
          z-30
          lg:hidden
          transition-opacity
          duration-300
          ${
            sidebarOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
        onClick={() =>
          setSidebarOpen(false)
        }
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-16 left-0
          z-40
          h-[calc(100vh-64px)]
          bg-white
          border-r
          border-slate-200

          transition-[width,transform]
          duration-300
          ease-in-out

          ${
            collapsed
              ? "lg:w-20"
              : "lg:w-72"
          }

          w-64

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="p-4 space-y-2">

          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={menuClass}
          >
            <FaTachometerAlt />

            {!collapsed && (
              <span>Dashboard</span>
            )}
          </NavLink>

          {/* Inventory */}
          <button
            onClick={() =>
              setInventoryOpen(!inventoryOpen)
            }
            className={`
              w-full
              flex
              items-center
              ${
                collapsed
                  ? "justify-center"
                  : "justify-between"
              }
              px-4 py-3
              rounded-xl
              hover:bg-slate-100
              transition-colors
              duration-200
            `}
          >
            <span
              className={`
                flex items-center
                ${
                  collapsed
                    ? ""
                    : "gap-3"
                }
              `}
            >
              <FaBoxes />

              {!collapsed && (
                <span>
                  Inventory
                </span>
              )}
            </span>

            {!collapsed &&
              (inventoryOpen ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              ))}
          </button>

          {/* Inventory Submenu */}
          {!collapsed && (
            <div
              className={`
                ml-6
                overflow-hidden
                transition-all
                duration-300
                ease-in-out
                ${
                  inventoryOpen
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div className="space-y-1 py-1">
                <NavLink
                  to="/inventory/add-product"
                  className={menuClass}
                >
                  Add Product
                </NavLink>

                <NavLink
                  to="/inventory/add-stock"
                  className={menuClass}
                >
                  Add Stock
                </NavLink>
              </div>
            </div>
          )}

          {/* Dispatch */}
          <NavLink
            to="/dispatch"
            className={menuClass}
          >
            <FaTruck />

            {!collapsed && (
              <span>
                Daily Dispatch
              </span>
            )}
          </NavLink>

          {/* Returns & Sales */}
          <NavLink
            to="/returns-sales"
            className={menuClass}
          >
            <FaMoneyBillWave />

            {!collapsed && (
              <span>
                Returns & Sales
              </span>
            )}
          </NavLink>

          {/* Sales Executives */}
          <NavLink
            to="/sales-executives"
            className={menuClass}
          >
            <FaUsers />

            {!collapsed && (
              <span>
                Sales Executives
              </span>
            )}
          </NavLink>

          {/* Reports */}
          <NavLink
            to="/reports"
            className={menuClass}
          >
            <FaChartBar />

            {!collapsed && (
              <span>Reports</span>
            )}
          </NavLink>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;