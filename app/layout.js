import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export const metadata = { title: "AWEIT — Hub Jeux", description: "Star Citizen — Profit Splitter" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="container-app">
          <Sidebar/>
          <div style={{flex:1}}>
            <header style={{position:'sticky',top:0,zIndex:10,background:'#0b1220',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
              <div style={{maxWidth:1152,margin:'0 auto',padding:'1rem 1.5rem',display:'flex',justifyContent:'space-between'}}>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <div style={{width:8,height:8,borderRadius:9999,background:'#34d399'}}/>
                  <span className="text-sm text-slate-300">GitHub Pages — aweit00.github.io</span>
                </div>
                <nav className="text-sm text-slate-400"><Link href="/" className="hover:text-white">Accueil</Link></nav>
              </div>
            </header>
            <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
