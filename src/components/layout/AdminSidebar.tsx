"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Gift, 
  Plus, 
  FolderOpen, 
  FileText, 
  BookOpen, 
  Settings,
  Globe,
  Home,
  Info,
  Tag,
  Phone,
  Handshake,
  Shield,
  Layers,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Gift, label: "Perksssss", path: "/admin/perks" },
  { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
  { icon: Layers, label: "Subcategories", path: "/admin/subcategories" },
];

const frontendPages = [
  { icon: Home, label: "Homepage", path: "/admin/pages/homepage" },
  { icon: Info, label: "About Us", path: "/admin/pages/about" },
  { icon: Tag, label: "Perks Page", path: "/admin/pages/perks" },
  { icon: Phone, label: "Contact", path: "/admin/pages/contact" },
  { icon: Handshake, label: "Partner With Us", path: "/admin/pages/partner" },
  { icon: Shield, label: "Privacy/TOS", path: "/admin/pages/privacy" },
];

const otherNavItems = [
  { icon: BookOpen, label: "Journal", path: "/admin/journal" },
];

const settingsPages = [
  { icon: Settings, label: "General Settings", path: "/admin/settings/general" },
  { icon: Shield, label: "Security", path: "/admin/settings/security" },
  { icon: Globe, label: "API Settings", path: "/admin/settings/api" },
  { icon: FileText, label: "Email Templates", path: "/admin/settings/email" },
];

const bottomNavItems: typeof settingsPages = [];

export function AdminSidebar() {
  const pathname = usePathname();
  const [frontendPagesOpen, setFrontendPagesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col">
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-white">
          PerksAdmin
        </span>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Main Navigation Items */}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "text-white" // active color
                  : "text-slate-300 hover:text-white" // inactive color
              }`}
              style={{ fontWeight: item.label === "Subcategories" ? 500 : undefined }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}



        {/* Frontend Pages Dropdown Section */}
        <div className="pt-2">
          <button
            onClick={() => setFrontendPagesOpen(!frontendPagesOpen)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium flex-1 text-left">Frontend Pages</span>
            {frontendPagesOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {frontendPagesOpen && (
            <div className="mt-1 ml-3 border-l border-slate-700">
              {frontendPages.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ml-3 ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Other Navigation Items */}
        <div className="pt-2">
          {otherNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Settings Dropdown Section */}
        <div className="pt-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium flex-1 text-left">Settings</span>
            {settingsOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {settingsOpen && (
            <div className="mt-1 ml-3 border-l border-slate-700">
              {settingsPages.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ml-3 ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
      
      {/* Bottom Section - Empty for now */}
      {bottomNavItems.length > 0 && (
        <div className="p-3 border-t border-slate-700">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </aside>
  );
}
