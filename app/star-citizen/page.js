"use client";
import { useEffect, useMemo, useState } from "react";

function formatUEC(n){if(Number.isNaN(n)||!Number.isFinite(n))return "—";return new Intl.NumberFormat("fr-FR",{maximumFractionDigits:2}).format(n)+" UEC";}

export default function StarCitizenProfitSplitter(){
  const[players,setPlayers]=useState([]);
  const[playerName,setPlayerName]=useState("");
  const[playerContribution,setPlayerContribution]=useState("");
  const[saleAmount,setSaleAmount]=useState("");
  const[feeRate,setFeeRate]=useState("0.5");
  const[feeMode,setFeeMode]=useState("deduct");
  const[sessionName,setSessionName]=useState("");

  useEffect(()=>{const saved=localStorage.getItem("sc-profit-splitter");
    if(saved){try{const s=JSON.parse(saved);
      setPlayers(s.players??[]);setSaleAmount(s.saleAmount??"");setFeeRate(s.feeRate??"0.5");setFeeMode(s.feeMode??"deduct");setSessionName(s.sessionName??"");}catch{}}},[]);
  useEffect(()=>{const payload={players,saleAmount,feeRate,feeMode,sessionName};localStorage.setItem("sc-profit-splitter",JSON.stringify(payload));},[players,saleAmount,feeRate,feeMode,sessionName]);

  const totalContribution=useMemo(()=>players.reduce((a,p)=>a+(Number(p.amount)||0),0),[players]);
  const sale=Number(saleAmount)||0;
  const fee=Math.max(0,Number(feeRate)||0)/100;
  const profit=useMemo(()=>sale-totalContribution,[sale,totalContribution]);

  const rows=useMemo(()=>{if(totalContribution<=0)return[];
    return players.map(p=>{const contrib=Number(p.amount)||0;const share=contrib/totalContribution;const grossShare=profit*share;
      const sendAmount=feeMode==="grossUp"?(grossShare<=0?grossShare:grossShare/(1-fee)):grossShare;
      const feeAmount=Math.max(0,sendAmount)*fee;
      const receivedNet=feeMode==="grossUp"?grossShare:sendAmount*(1-fee);
      return{name:p.name,contribution:contrib,share,grossShare,sendAmount,feeAmount,receivedNet};});},[players,totalContribution,profit,fee,feeMode]);

  const totals=useMemo(()=>{const tSend=rows.reduce((a,r)=>a+(Number(r.sendAmount)||0),0);const tFees=rows.reduce((a,r)=>a+(Number(r.feeAmount)||0),0);const tNet=rows.reduce((a,r)=>a+(Number(r.receivedNet)||0),0);return{tSend,tFees,tNet};},[rows]);

  const addPlayer=()=>{const name=(playerName||"").trim();const amount=Number(playerContribution);if(!name)return;if(!Number.isFinite(amount))return;setPlayers(prev=>[...prev,{name,amount}]);setPlayerName("");setPlayerContribution("");};
  const removePlayer=(idx)=>setPlayers(prev=>prev.filter((_,i)=>i!==idx));
  const reset=()=>{setPlayers([]);setPlayerName("");setPlayerContribution("");setSaleAmount("");setFeeRate("0.5");setFeeMode("deduct");setSessionName("");localStorage.removeItem("sc-profit-splitter");};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Star Citizen — Profit Splitter</h1>
          <p className="text-slate-400 mt-1">Les frais sont par défaut <span className="badge">déduits</span> (le receveur paie les frais).</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={reset}>Réinitialiser</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-slate-400">Nom de session</div>
          <input className="input mt-2" placeholder="Ex: Quartzite @ ARC-L1" value={sessionName} onChange={e=>setSessionName(e.target.value)} />
          <div className="mt-4 text-sm text-slate-400">Montant de vente total (UEC)</div>
          <input className="input mt-2" placeholder="Ex: 1 250 000" inputMode="decimal" value={saleAmount} onChange={e=>setSaleAmount(e.target.value.replace(',', '.'))} />
          <div className="mt-4 text-sm text-slate-400">Frais d'envoi (%)</div>
          <input className="input mt-2" placeholder="Ex: 0.5" inputMode="decimal" value={feeRate} onChange={e=>setFeeRate(e.target.value.replace(',', '.'))} />
          <div className="mt-4 text-sm text-slate-400">Mode de frais</div>
          <div className="mt-2 flex gap-2">
            <button className={"btn "+(feeMode==="grossUp"?"btn-primary":"")} onClick={()=>setFeeMode("grossUp")}>Moi je paie les frais</button>
            <button className={"btn "+(feeMode==="deduct"?"btn-primary":"")} onClick={()=>setFeeMode("deduct")}>Frais déduits (receveur)</button>
          </div>
          <div className="mt-4 text-xs text-slate-400"><div className="badge">Profit = Vente − Somme des contributions</div></div>
        </div>

        <div className="card md:col-span-2">
          <div className="text-sm text-slate-400">Ajouter un joueur</div>
          <div className="mt-2 grid sm:grid-cols-3 gap-2">
            <input className="input" placeholder="Pseudo joueur" value={playerName} onChange={e=>setPlayerName(e.target.value)} />
            <input className="input" placeholder="Contribution (UEC)" inputMode="decimal" value={playerContribution} onChange={e=>setPlayerContribution(e.target.value.replace(',', '.'))} />
            <button className="btn btn-primary" onClick={addPlayer}>Ajouter</button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-slate-400">
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-2">Joueur</th>
                  <th className="text-right py-2 px-2">Contribution</th>
                  <th className="text-right py-2 px-2">Part</th>
                  <th className="text-right py-2 px-2">Bénéfice brut</th>
                  <th className="text-right py-2 px-2">À envoyer</th>
                  <th className="text-right py-2 px-2">Frais</th>
                  <th className="text-right py-2 pl-2">Ils reçoivent</th>
                  <th className="text-right py-2 pl-2"></th>
                </tr>
              </thead>
              <tbody>
                {players.length===0&&(<tr><td colSpan={8} className="text-center text-slate-500 py-6">Ajoutez des joueurs pour commencer.</td></tr>)}
                {players.length>0&&rows.map((r,i)=>(
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-2">{r.name}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{formatUEC(r.contribution)}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{(r.share*100).toFixed(2)}%</td>
                    <td className="py-2 px-2 text-right tabular-nums">{formatUEC(r.grossShare)}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{formatUEC(r.sendAmount)}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-slate-400">{formatUEC(r.feeAmount)}</td>
                    <td className="py-2 pl-2 text-right tabular-nums">{formatUEC(r.receivedNet)}</td>
                    <td className="py-2 pl-2 text-right"><button className="btn" onClick={()=>removePlayer(i)}>Suppr.</button></td>
                  </tr>
                ))}
              </tbody>
              {players.length>0&&(<tfoot><tr className="font-medium">
                <td className="py-2 pr-2 text-right">Totals</td>
                <td className="py-2 px-2 text-right tabular-nums">{formatUEC(totalContribution)}</td>
                <td className="py-2 px-2 text-right">—</td>
                <td className="py-2 px-2 text-right tabular-nums">{formatUEC(profit)}</td>
                <td className="py-2 px-2 text-right tabular-nums">{formatUEC(totals.tSend)}</td>
                <td className="py-2 px-2 text-right tabular-nums text-slate-400">{formatUEC(totals.tFees)}</td>
                <td className="py-2 pl-2 text-right tabular-nums">{formatUEC(totals.tNet)}</td>
                <td></td></tr></tfoot>)}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
