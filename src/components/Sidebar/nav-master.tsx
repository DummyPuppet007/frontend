import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LucideIcon, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export function NavMasters({
  masters,
}: {
  masters: {
    name: string;
    url: string;
    icon: LucideIcon;
    items: { title: string; url: string; icon: LucideIcon }[];
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Master Data</SidebarGroupLabel>
      <SidebarMenu>
        {masters.map((master) => (
          <SidebarMenuItem key={master.name}>
            <SidebarMenuButton asChild>
              <Link to={master.url}>
                <master.icon />
                <span>{master.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {master.items?.length > 0 && (
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                {master.items?.length > 0 &&
                  master.items.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center space-x-2"
                      >
                        {item.icon && (
                          <item.icon className="text-muted-foreground" />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}

                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
