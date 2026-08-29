import React, { useState, useRef, useEffect } from "react";
import { products, Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { Stars, QuickAdd, TypePill } from "../components/shared";

interface Props {
  navigate: (s: string, p?: any) => void;
  goBack: () => void;
}

const RECENTS = ["Pinot Noir", "Prosecco", "Cabernet Sauvignon"];
const POPULAR = ["Smooth red wine", "Crisp white", "Champagne", "Rosé", "Under £10", "Wine for dinner"];

export default function SearchScreen({ navigate, goBack }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart, items, setQty } = useCart();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    const lq = q.toLowerCase();
    const res = products.filter(p =>
      p.name.toLowerCase().includes(lq) ||
      p.type.toLowerCase().includes(lq) ||
      p.grape.toLowerCase().includes(lq) ||
      p.country.toLowerCase().includes(lq) ||
      p.region.toLowerCase().includes(lq) ||
      p.subtitle.toLowerCase().includes(lq)
    );
    setResults(res);
    setSearched(true);
  }, [q]);

  const qty = (id: string) => items.find(i => i.product.id === id)?.quantity ?? 0;

  return (
    <div className="screen-content bg-white">
      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-white px-4 pt-3 pb-2 border-b border-[#f0ece6]">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f2ec] flex-shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#0d1912" strokeWidth="2.25" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search wines, grapes, regions…"
              className="w-full bg-[#f5f2ec] rounded-2xl pl-10 pr-9 py-3 text-[15px] text-[#0d1912] font-medium placeholder-[#9ca3af] outline-none"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.25"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"/>
            </svg>
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#9ca3af] flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!q && (
        <div className="px-5 py-5">
          <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-3">Recent</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {RECENTS.map(s => (
              <button key={s} onClick={() => setQ(s)}
                className="flex items-center gap-2 bg-[#f5f2ec] rounded-full px-4 py-2 text-[13px] font-semibold text-[#0d1912]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#9ca3af" strokeWidth="1.75"/>
                  <path d="M12 8v4l3 3" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
                {s}
              </button>
            ))}
          </div>

          <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-3">Popular</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {POPULAR.map(s => (
              <button key={s} onClick={() => setQ(s)}
                className="bg-[#f5f2ec] border border-[#e4dfd6] rounded-full px-4 py-2 text-[13px] font-semibold text-[#0d1912]">
                {s}
              </button>
            ))}
          </div>

          <p className="text-[11px] font-black text-[#9ca3af] uppercase tracking-widest mb-3">Browse by type</p>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { e:"🍷", l:"Red",       t:"Red" },
              { e:"🥂", l:"White",     t:"White" },
              { e:"🌸", l:"Rosé",      t:"Rosé" },
              { e:"✨", l:"Sparkling", t:"Sparkling" },
              { e:"🍾", l:"Champagne", t:"Champagne" },
              { e:"📦", l:"Cases",     t:"Mixed" },
            ].map(c => (
              <button key={c.l} onClick={() => navigate("plp", { type: c.t })}
                className="flex flex-col items-center gap-1.5 bg-[#f5f2ec] rounded-2xl py-3.5 active:scale-95 transition-transform">
                <span className="text-2xl">{c.e}</span>
                <span className="text-[12px] font-bold text-[#0d1912]">{c.l}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <span className="text-[60px] mb-4">🔍</span>
          <h3 className="font-black text-[22px] text-[#0d1912] mb-2">No results for "{q}"</h3>
          <p className="text-[14px] text-[#5a6860] mb-6">Try a different search or browse our wines below</p>
          <button onClick={() => navigate("plp")}
            className="btn-pill bg-[#C2185B] text-white px-6 py-3.5 text-[14px] font-bold shadow-lg shadow-[#C2185B]/25">
            Browse all wines
          </button>
          <div className="mt-8 w-full text-left">
            <p className="font-black text-[16px] text-[#0d1912] mb-3">You might like</p>
            {products.slice(0,3).map(p => (
              <ResultRow key={p.id} p={p} qty={qty(p.id)}
                onTap={() => navigate("pdp",{productId:p.id})}
                onAdd={() => addToCart(p)}
                onInc={() => setQty(p.id, qty(p.id)+1)}
                onDec={() => setQty(p.id, qty(p.id)-1)}
              />
            ))}
          </div>
        </div>
      )}

      {searched && results.length > 0 && (
        <div className="px-5 pt-3">
          <p className="text-[13px] font-semibold text-[#5a6860] mb-3">
            {results.length} results for "<strong className="text-[#0d1912]">{q}</strong>"
          </p>
          {results.map(p => (
            <ResultRow key={p.id} p={p} qty={qty(p.id)}
              onTap={() => navigate("pdp",{productId:p.id})}
              onAdd={() => addToCart(p)}
              onInc={() => setQty(p.id, qty(p.id)+1)}
              onDec={() => setQty(p.id, qty(p.id)-1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResultRow({ p, qty, onTap, onAdd, onInc, onDec }: {
  p: Product; qty: number; onTap:()=>void; onAdd:()=>void; onInc:()=>void; onDec:()=>void;
}) {
  return (
    <div className="flex items-center gap-3.5 py-3 border-b border-[#f0ece6] last:border-0">
      <button onClick={onTap} className="w-16 h-20 rounded-xl overflow-hidden bg-[#f5f2ec] flex-shrink-0">
        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"/>
      </button>
      <button onClick={onTap} className="flex-1 text-left min-w-0">
        <TypePill type={p.type}/>
        <p className="text-[14px] font-bold text-[#0d1912] leading-tight mt-1 line-clamp-2">{p.name}</p>
        <p className="text-[11px] text-[#5a6860]">{p.country} · {p.grape.split(",")[0]}</p>
        <Stars rating={p.rating} count={p.reviewCount} sm/>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-black text-[14px]">£{p.price.toFixed(2)}</span>
          {p.originalPrice && <span className="text-[11px] line-through text-[#9ca3af]">£{p.originalPrice.toFixed(2)}</span>}
        </div>
      </button>
      <QuickAdd qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec}/>
    </div>
  );
}
