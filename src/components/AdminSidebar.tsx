import Link from "next/link";

export default function AdminSidebar({ active }: { active: string }) {
  const navItems = [
    { label: "Dashboardsss", href: "/admin" },
    { label: "All Perks", href: "/admin/perks" },
    { label: "Add Perk", href: "/admin/perks/add" },
    { label: "Leads", href: "/admin/leads" },
    { label: "Contact Submissions", href: "/admin/contact-submissions" },
    { label: "Partner Applications", href: "/admin/partner-applications" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Sub Categories", href: "/admin/subcategories" },
    { label: "Frontend Pages", href: "/admin/pages" },
    { label: "Journal", href: "/admin/journal" },
    { label: "Settings", href: "/admin/settings" },
  ];
  return (
    <aside className="bg-[#181c23] text-white w-64 min-h-screen flex flex-col py-6 px-4 border-r border-[#23272f]">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 rounded-full bg-[#e6b756] flex items-center justify-center text-lg font-bold text-[#1a2233]">P</div>
        <span className="text-xl font-bold text-white">Perks<span className="text-[#e6b756]">Admin</span></span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium hover:bg-[#23272f] ${active === item.label ? "bg-[#23272f] text-[#e6b756]" : "text-white"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
