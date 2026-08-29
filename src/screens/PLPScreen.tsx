import React, { useState, useMemo } from "react";
import { products, Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { NavBar, Stars, QuickAdd, TypePill, Btn } from "../components/shared";

interface Props {
  navigate: (s: string, p?: any) => void;
  goBack: () => void;
  params?: { type?: string; style?: string };
}

const SORTS = ["Recommended", "Bestselling", "Price: Low–High", "Price: High–Low", "Highest Rated", "Biggest Saving"];

const FILTER_GROUPS = [
  { key: "type",    label: "Wine type",  opts: ["Red","White","Rosé","Sparkling","Champagne"] },
  { key: "country", label: "Country",    opts: ["France","Italy","Spain","New Zealand","Argentina","England"] },
  { key: "price",   label: "Price",      opts: ["Under £10","£10–£15","£15–£25","Over £25"] },
  { key: "body",    label: "Body",       opts: ["Light-bodied","Medium-bodied","Full-bodied"] },
];

export default function PLPScreen({ navigate, goBack, params }: Props) {
  const { addToCart, items, setQty } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const [sort, setSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [active, setActive] = useState<Record<string, string[]>>(
    params?.type ? { type: [params.type] } : {}
  );

  const qty = (id: string) => items.find(i => i.product.id === id)?.quantity ?? 0;
  const totalActive = Object.values(active).flat().length;

  const toggle = (key: string, val: string) => {
    setActive(prev => {
      const cur = prev[key] ?? [];
      const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
      if (!next.length) { const { [key]: _, ...rest } = prev; return rest; }
      return { ...prev, [key]: next };
    });
  };

  const list = useMemo(() => {
    let r = [...products];
    if (active.type?.length)    r = r.filter(p => active.type.includes(p.type));
    if (active.country?.length) r = r.filter(p => active.country.includes(p.country));
    if (active.price?.length)   r = r.filter(p => active.price.some(pr =>
      pr === "Under £10" ? p.price < 10
      : pr === "£10–£15" ? p.price >= 10 && p.price <= 15
      : pr === "£15–£25" ? p.price > 15 && p.price <= 25
      : p.price > 25
    ));
    if (sort === "Price: Low–High")    r.sort((a,b) => a.price - b.price);
    else if (sort === "Price: High–Low") r.sort((a,b) => b.price - a.price);
    else if (sort === "Highest Rated")   r.sort((a,b) => b.rating - a.rating);
    else if (sort === "Bestselling")     r.sort((a,b) => b.reviewCount - a.reviewCount);
    else if (sort === "Biggest Saving")  r.sort((a,b) => ((b.originalPrice??b.price)-b.price) - ((a.originalPrice??a.price)-a.price));
    return r;
  }, [active, sort]);

  const title = params?.type ? `${params.type} Wine` : "All Wines";

  return (
    <div className="screen-content bg-white">
      {/* Header */}
      <div className="bg-white">
        <NavBar
          title={title}
          onBack={goBack}
          onCart={() => navigate("cart")}
          cartCount={cartCount}
        />

        {/* Filter + sort bar */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setFilterOpen(true)}
            className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold transition-all ${
              totalActive > 0 ? "bg-[#C2185B] text-white" : "bg-[#f5f2ec] text-[#0d1912]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Filter {totalActive > 0 ? `(${totalActive})` : ""}
          </button>
          {/* Active chips */}
          {Object.entries(active).flatMap(([k,vs]) =>
            vs.map(v => (
              <button
                key={`${k}-${v}`}
                onClick={() => toggle(k, v)}
                className="flex-shrink-0 flex items-center gap-1 bg-[#F8BBD0] text-[#C2185B] rounded-full px-3 py-1.5 text-[12px] font-bold"
              >
                {v}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            ))
          )}
          <div className="flex-1" />
          <button
            onClick={() => setSortOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 bg-[#f5f2ec] rounded-full px-3.5 py-2 text-[13px] font-bold text-[#0d1912]"
          >
            Sort
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-4 py-2 border-t border-[#f0ece6]">
          <span className="text-[12px] text-[#5a6860] font-medium">{list.length} wines · {sort}</span>
          {totalActive > 0 && (
            <button onClick={() => setActive({})} className="ml-3 text-[12px] font-bold text-[#c62b3a]">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <span className="text-5xl mb-4">🔎</span>
          <h3 className="font-black text-[20px] text-[#0d1912] mb-2">No wines match</h3>
          <p className="text-[14px] text-[#5a6860] mb-5">Try adjusting your filters</p>
          <Btn onClick={() => setActive({})}>Clear filters</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-3">
          {list.map(p => (
            <GridCard
              key={p.id}
              product={p}
              qty={qty(p.id)}
              onTap={() => navigate("pdp", { productId: p.id })}
              onAdd={() => addToCart(p)}
              onInc={() => setQty(p.id, qty(p.id) + 1)}
              onDec={() => setQty(p.id, qty(p.id) - 1)}
            />
          ))}
        </div>
      )}

      {/* Sort sheet */}
      {sortOpen && (
        <>
          <div className="sheet-overlay" onClick={() => setSortOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] sheet z-50 slide-up">
            <div className="flex justify-center pt-3 mb-2">
              <div className="w-10 h-1 rounded-full bg-[#e4dfd6]" />
            </div>
            <div className="px-5 pb-2">
              <h3 className="font-black text-[20px] text-[#0d1912] mb-4">Sort by</h3>
              {SORTS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSort(opt); setSortOpen(false); }}
                  className="w-full flex items-center justify-between py-4 border-b border-[#f0ece6] last:border-0"
                >
                  <span className={`text-[15px] font-semibold ${sort===opt?"text-[#C2185B]":"text-[#0d1912]"}`}>{opt}</span>
                  {sort === opt && (
                    <div className="w-6 h-6 rounded-full bg-[#C2185B] flex items-center justify-center">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
              <div className="h-6" />
            </div>
          </div>
        </>
      )}

      {/* Filter sheet */}
      {filterOpen && (
        <>
          <div className="sheet-overlay" onClick={() => setFilterOpen(false)} />
          <div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] sheet z-50 slide-up flex flex-col"
            style={{ maxHeight: "82dvh" }}
          >
            <div className="flex justify-center pt-3 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#e4dfd6]" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
              <h3 className="font-black text-[20px] text-[#0d1912]">Filter</h3>
              <button onClick={() => setActive({})} className="text-[13px] font-bold text-[#c62b3a]">
                Clear all
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {FILTER_GROUPS.map(g => (
                <div key={g.key} className="mb-6">
                  <h4 className="font-bold text-[14px] text-[#0d1912] mb-2.5">{g.label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {g.opts.map(o => {
                      const on = (active[g.key]??[]).includes(o);
                      return (
                        <button
                          key={o}
                          onClick={() => toggle(g.key, o)}
                          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                            on ? "bg-[#C2185B] text-white" : "bg-[#f5f2ec] text-[#0d1912]"
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 flex-shrink-0 pb-safe">
              <Btn onClick={() => setFilterOpen(false)} full>
                Show {list.length} wines
              </Btn>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GridCard({
  product: p, qty, onTap, onAdd, onInc, onDec,
}: { product: Product; qty: number; onTap:()=>void; onAdd:()=>void; onInc:()=>void; onDec:()=>void }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <button onClick={onTap} className="relative overflow-hidden flex-shrink-0" style={{ height: 200 }}>
        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
        {p.badge && (
          <span className="absolute top-2 left-2 bg-[#C2185B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
            {p.badge}
          </span>
        )}
        {p.originalPrice && (
          <span className="absolute bottom-2 right-2 bg-[#c62b3a] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            SALE
          </span>
        )}
      </button>
      <div className="p-3 flex flex-col flex-1">
        <button onClick={onTap} className="text-left flex-1">
          <TypePill type={p.type} />
          <p className="text-[13px] font-bold text-[#0d1912] leading-tight mt-1 line-clamp-2">{p.name}</p>
          <p className="text-[10px] text-[#5a6860] mt-0.5">{p.country}</p>
          <div className="mt-1"><Stars rating={p.rating} sm /></div>
        </button>
        <div className="flex items-end justify-between mt-2.5">
          <div>
            <span className="font-black text-[15px] text-[#0d1912]">£{p.price.toFixed(2)}</span>
            {p.originalPrice && (
              <div className="text-[10px] line-through text-[#9ca3af]">£{p.originalPrice.toFixed(2)}</div>
            )}
          </div>
          <QuickAdd qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} />
        </div>
      </div>
    </div>
  );
}
