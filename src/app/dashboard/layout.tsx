import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex flex-row h-full">
        <AppSidebar side="left" className="h-full" />
        <div className="flex-1">
          <SidebarTrigger />
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}