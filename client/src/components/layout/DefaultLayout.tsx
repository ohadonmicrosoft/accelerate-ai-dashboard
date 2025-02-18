import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Workflow,
  Bell,
  Search,
  Menu,
  ChevronRight,
  Home,
  LogOut,
  User,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  tooltip?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    tooltip: "View key metrics and insights"
  },
  {
    title: "AI Chatbot",
    href: "/chatbot",
    icon: MessageSquare,
    tooltip: "Get AI-powered assistance"
  },
  {
    title: "Workflows",
    href: "/workflows",
    icon: Workflow,
    tooltip: "Manage business processes"
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    tooltip: "Access analytics reports"
  }
];

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3);
  const { user, logout } = useAuth();

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logout();
      setLocation("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get current page title for breadcrumb
  const currentPage = navItems.find(item => item.href === location)?.title || "Home";

  const NavItem = ({ item }: { item: NavItem }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                location === item.href ? "bg-primary/5" : "hover:bg-primary/5",
                "transition-all duration-200 ease-in-out"
              )}
              onClick={() => setOpen(false)}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-colors",
                location === item.href ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="font-medium">{item.title}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        {item.tooltip && (
          <TooltipContent side="right">
            <p>{item.tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.[0].toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const Breadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-1 p-0 font-normal hover:bg-transparent">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </Link>
      {currentPage !== "Home" && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{currentPage}</span>
        </>
      )}
    </div>
  );

  const NavContent = () => (
    <ScrollArea className="h-full px-2">
      <div className="space-y-2 py-4">
        <div className="px-2 mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </div>
    </ScrollArea>
  );

  const Header = () => (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/5">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-16 items-center border-b px-6">
                <span className="font-display font-bold text-lg tracking-tight">
                  AccelerateAI
                </span>
              </div>
              <NavContent />
            </SheetContent>
          </Sheet>
        )}
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg tracking-tight">
            AccelerateAI
          </span>
          <Breadcrumb />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/5 relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center animate-pulse">
                        {notifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-2 border-b">
                    <span className="font-medium">Notifications</span>
                    <Button variant="ghost" size="sm">
                      Mark all as read
                    </Button>
                  </div>
                  {notifications > 0 ? (
                    Array(notifications).fill(0).map((_, i) => (
                      <DropdownMenuItem key={i} className="flex flex-col items-start p-3">
                        <span className="font-medium">New Insight Available</span>
                        <span className="text-sm text-muted-foreground">
                          AI has generated new business insights based on your recent data.
                        </span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>You have {notifications} new notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <UserMenu />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container p-4 animate-fade-in">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 w-72 border-r bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center border-b px-6">
          <span className="font-display font-bold text-lg tracking-tight">
            AccelerateAI
          </span>
        </div>
        <NavContent />
      </aside>
      <Header />
      <main className="pl-72">
        <div className="container p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}