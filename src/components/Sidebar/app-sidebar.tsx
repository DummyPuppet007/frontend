"use client";

import * as React from "react";
import {
  BellRing,
  Factory,
  List,
  Package,
  ShieldCheck,
  SquareUserRoundIcon,
  UserPlus,
  Warehouse,
} from "lucide-react";

import { NavMain } from "@/components/Sidebar/nav-main";
import { NavUser } from "@/components/Sidebar/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { NavMasters } from "./nav-master";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Sales Order",
      url: "#",
      icon: Package,
      isActive: true,
      items: [
        {
          title: "Create Sales Order",
          url: "sales-order/create",
        },
        {
          title: "Sales Order List",
          url: "sales-order",
        },
        {
          title: "Sales Person",
          url: "sales-order/sales-person",
        },
      ],
    },
    {
      title: "Production",
      url: "#",
      icon: Factory,
      items: [
        {
          title: "Production Order List",
          url: "production/production-list",
        },
        {
          title: "Machine Type",
          url: "production/machine-types",
        },
        {
          title: "Machine Model",
          url: "production/machine-models",
        },
        {
          title: "Make",
          url: "production/make",
        },
        {
          title: "Power Rating",
          url: "production/power-rating",
        },
      ],
    },
    {
      title: "Authentication",
      url: "#",
      icon: ShieldCheck,
      items: [
        {
          title: "Register User",
          url: "auth/register",
        },
        {
          title: "Users",
          url: "auth/users",
        },
        {
          title: "Role",
          url: "auth/roles",
        },
        {
          title: "Action",
          url: "auth/actions",
        },
        {
          title: "Module",
          url: "auth/modules",
        },
        {
          title: "Permission",
          url: "auth/permissions",
        },
        {
          title: "Role Permission",
          url: "auth/role-permission",
        },
        {
          title: "User Permission",
          url: "auth/user-permission",
        },
        {
          title: "Route Permission",
          url: "auth/route-permission",
        },
        {
          title: "Field Permission",
          url: "auth/field-permissions"
        }
      ],
    },
  ],
  masters: [
    {
      name: "Customer",
      url: "customers",
      icon: SquareUserRoundIcon,
      items: [
        {
          title: "Create Customer",
          url: "create-customer",
          icon: UserPlus,
        },
        {
          title: "Customer List",
          url: "customers",
          icon: List,
        },
      ],
    },
    {
      name: "Notification Center",
      url: "notifications",
      icon: BellRing,
      items: []
    },
    {
      name: "Logging",
      url: "logging",
      icon: Warehouse,
      items: []
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className=" border-r-4 border-gray-300 shadow-md"
    >
      <div className="bg-gray-200 h-screen">
        <SidebarHeader>
          <div className="transition-all duration-300 ease-in-out group-[[data-collapsible=icon]]/sidebar-wrapper:opacity-0 group-[[data-collapsible=icon]]/sidebar-wrapper:h-0">
            <Link to="/dashboard">
              <img
                src="/images/crm-logo.png"
                alt="Sales CRM Logo"
                className="mx-auto w-32 py-3"
              />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className=" border-gray-30'0 text-black">
          <NavMain items={data.navMain} />
          <NavMasters masters={data.masters} />
        </SidebarContent>
        <SidebarRail />
      </div>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
