"use client"

import * as React from "react"
import {
  Factory,
  List,
  Package,
  ShieldCheck,
  SquareUserRoundIcon,
  UserPlus,
} from "lucide-react"

import { NavMain } from "@/components/Sidebar/nav-main"
import { NavUser } from "@/components/Sidebar/nav-user"
import { NavMasters } from "./nav-master"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
          title: "Sales Person",
          url: "sales-order/sales-person",
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
      ],
    },
    {
      title: "Production",
      url: "#",
      icon: Factory,
      items: [
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
      ]
    }
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
          icon: UserPlus
        },
        {
          title: "Customer List",
          url: "customers",
          icon: List
        },
      ]
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMasters masters={data.masters} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
