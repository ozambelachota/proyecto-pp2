import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/page/auth/store/useUserStore";
import { Link } from "react-router";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Toaster } from "sonner";

// This is sample data.
const data = {
  teams: [
    {
      name: "TELESALUD C.S NUEVO PARAISO",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Pacientes",
      url: "/admin/paciente/",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Crear",
          url: "/admin/paciente/crear-paciente",
        },
        {
          title: "Asignar equipo",
          url: "/admin/paciente/asignacion",
        },
      ],
    },
    {
      title: "EQUIPOOS MEDICOS",
      url: "/admin/equipo/",
      icon: Bot,
      items: [
        {
          title: "Agregar equipo",
          url: "/admin/equipo/crear-equipo",
        },
      ],
    },
    {
      title: "DIAGNOSTICOS",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "CONFIGURACION",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserStore((state) => state.user);
  return (
<>
<Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TELESALUD </span>
                  <span className="truncate text-xs">C.S NUEVO PARAISO</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "",
            email: user.email,
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
    <Toaster position="top-right" theme="dark" />
</>
  );
}
