import Link from "next/link";
export default function Page(){
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-2xl font-semibold">Bienvenue 👋</h1>
        <p className="mt-2 text-slate-300">Application active : <span className="font-medium text-white">Star Citizen — Profit Splitter</span>.</p>
        <div className="mt-4"><Link className="btn btn-primary" href="/star-citizen">Ouvrir Profit Splitter</Link></div>
      </section>
    </div>
  );
}
