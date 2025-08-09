"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem=({href,icon,label})=>{
  const pathname=usePathname();
  const active=pathname===href;
  return (
    <Link href={href} className={`${active?"bg-white/10 text-white":""} flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition`}>
      <span className="text-lg">{icon}</span><span className="text-sm">{label}</span>
    </Link>
  );
};

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div style={{width:12,height:12,borderRadius:9999,background:'#0ea5e9'}}/>
          <span>AWEIT</span>
        </div>
        <div className="mt-1 text-xs text-slate-400">Hub Jeux</div>
      </div>
      <nav className="px-2">
        <div className="px-4 pb-2 text-xs uppercase tracking-wider text-slate-500">Jeux</div>
        <NavItem href="/star-citizen" icon="🚀" label="Star Citizen — Profit Splitter"/>
        <div className="px-4 pt-4 pb-2 text-xs uppercase tracking-wider text-slate-500">Autre</div>
        <NavItem href="/aide" icon="❓" label="Aide"/>
        <NavItem href="/parametres" icon="⚙️" label="Paramètres"/>
      </nav>
    </aside>
  );
}
