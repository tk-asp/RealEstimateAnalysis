import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  TrendingUp, 
  Wallet, 
  Calculator, 
  Settings,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "ダッシュボード", href: "/dashboard", icon: TrendingUp },
  { name: "市場データ", href: "/market", icon: Building },
  { name: "ポートフォリオ管理", href: "/portfolio", icon: Wallet },
  { name: "投資分析", href: "/analysis", icon: Calculator },
  { name: "設定", href: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-real-estate-primary rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">不動産投資分析</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onToggle}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 mt-6 px-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={cn(
                      "flex items-center px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                      isActive
                        ? "text-real-estate-primary bg-blue-50"
                        : "text-gray-600 hover:text-real-estate-primary hover:bg-gray-50"
                    )}>
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
