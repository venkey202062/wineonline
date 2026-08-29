import React, { useState } from "react";
import { products, Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { Stars, Price, Stepper, QuickAdd, Accordion, Btn, TypePill } from "../components/shared";

interface Props {
  navigate: (s: string, p?: any) => void;
  goBack: () => void;
  params: { productId: string };
}

export default function PDPScreen({ navigate, goBack, params }: Props) {
  const p = products.find(x => x.id === params.productId) ?? products[0];
  const { addToCart, items, setQty, totalItems } = useCart();
  const [localQty, setLocalQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const cartQty = items.find(i => i.product.id === p.id)?.quantity ?? 0;
  const recs = products.filter(x => x.type === p.type && x.id !== p.id).slice(0, 4);
  const savings = p.originalPrice ? p.originalPrice - p.price : 0;

  const handleAdd = () => {
    for (let i = 0; i < localQty; i++) addToCart(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="screen-content" style={{ background: "#ede9e2" }}>
      {/* ── Full-bleed hero image ─────────────────────────────── */}
      <div className="relative" style={{ height: "58vh", minHeight: 320 }}>
        <img
          src={p.imageUrl.replace("w=400&h=600", "w=800&h=900")}
          alt={p.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10" />

        {/* Floating nav bar */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-3 pb-2">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.25" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  stroke="white" strokeWidth="1.75"/>
              </svg>
            </button>
            <button
              onClick={() => navigate("cart")}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center relative"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6z" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#c62b3a] text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Badge on image */}
        {p.badge && (
          <div className="absolute top-16 left-4">
            <span className="bg-[#C2185B] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wide">
              {p.badge}
            </span>
          </div>
        )}
        {p.lowStock && (
          <div className="absolute top-16 right-4">
            <span className="bg-[#f59e0b] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
              ONLY A FEW LEFT
            </span>
          </div>
        )}

        {/* Image dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0,1,2].map(d => (
            <div key={d} className={`rounded-full ${d===0?"w-5 h-1.5 bg-white":"w-1.5 h-1.5 bg-white/40"}`}/>
          ))}
        </div>
      </div>

      {/* ── White content panel — overlaps image ─────────────── */}
      <div className="bg-white -mt-6 rounded-t-[28px] relative z-10">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 mb-1">
          <div className="w-10 h-1 rounded-full bg-[#e4dfd6]" />
        </div>

        <div className="px-5 pt-3 pb-2">
          {/* Type + country */}
          <div className="flex items-center gap-2 mb-2">
            <TypePill type={p.type} />
            <span className="text-[12px] text-[#5a6860] font-medium">{p.country} · {p.region}</span>
          </div>

          {/* Title */}
          <h1 className="font-black text-[26px] text-[#0d1912] leading-tight">{p.name}</h1>
          <p className="text-[14px] text-[#5a6860] mt-0.5">{p.subtitle}</p>

          {/* Rating */}
          <div className="flex items-center gap-2.5 mt-2.5">
            <Stars rating={p.rating} count={p.reviewCount} />
            <button className="text-[12px] font-bold text-[#C2185B] underline">Reviews</button>
          </div>

          {/* Description */}
          <p className="text-[14px] text-[#5a6860] leading-relaxed mt-3">{p.description}</p>

          {/* Key attributes row */}
          <div className="flex gap-3 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {[
              { l: "Grape",  v: p.grape.split(",")[0] },
              { l: "Body",   v: p.body },
              { l: "ABV",    v: p.abv },
              { l: "Volume", v: p.volume },
            ].map(a => (
              <div key={a.l} className="flex-shrink-0 bg-[#f5f2ec] rounded-2xl px-4 py-2.5 text-center">
                <div className="text-[10px] text-[#5a6860] font-semibold uppercase tracking-wide">{a.l}</div>
                <div className="text-[13px] font-bold text-[#0d1912] mt-0.5">{a.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Purchase panel ── */}
        <div className="mx-5 mb-4">
          {/* Toggle: one-time vs subscribe */}
          <div className="bg-[#f5f2ec] rounded-2xl p-1 flex mb-4">
            <button
              onClick={() => setSubscribe(false)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                !subscribe ? "bg-white text-[#C2185B] shadow-sm" : "text-[#9ca3af]"
              }`}
            >
              One-time
            </button>
            <button
              onClick={() => setSubscribe(true)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                subscribe ? "bg-white text-[#C2185B] shadow-sm" : "text-[#9ca3af]"
              }`}
            >
              Subscribe
              <span className="bg-[#c62b3a] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">−20%</span>
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <Price
              price={subscribe && p.subscriptionPrice ? p.subscriptionPrice : p.price}
              original={!subscribe ? p.originalPrice : undefined}
              large
            />
            {savings > 0 && !subscribe && (
              <span className="bg-[#c62b3a] text-white text-[11px] font-black px-3 py-1 rounded-full">
                SAVE £{savings.toFixed(2)}
              </span>
            )}
          </div>

          {subscribe && p.subscriptionPrice && (
            <p className="text-[12px] text-[#5a6860] mb-3">
              Enjoy 20% off today and 10% off future cases
            </p>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] font-bold text-[#0d1912]">Quantity</span>
            <Stepper
              qty={localQty}
              onInc={() => setLocalQty(q => q + 1)}
              onDec={() => setLocalQty(q => Math.max(1, q - 1))}
            />
          </div>

          {/* Delivery note */}
          <div className="flex items-start gap-2.5 bg-[#FCE4EC] rounded-2xl p-3.5 mb-4">
            <span className="text-lg mt-0.5">🚚</span>
            <div>
              <p className="text-[13px] font-bold text-[#C2185B]">Standard delivery from £7.99</p>
              <p className="text-[11px] text-[#5a6860]">3–5 working days · Free on 24+ bottles</p>
            </div>
          </div>

          {/* Money-back */}
          <div className="flex items-start gap-2.5 bg-[#f5f2ec] rounded-2xl p-3.5 mb-4">
            <span className="text-lg mt-0.5">💰</span>
            <div>
              <p className="text-[13px] font-bold text-[#0d1912]">100% Money-back Guarantee</p>
              <p className="text-[11px] text-[#5a6860]">Don't love it? We'll refund you in full. No problem.</p>
            </div>
          </div>
        </div>

        {/* ── Expandable wine info ── */}
        <div className="border-t border-[#f0ece6]">
          <Accordion title="Wine details" open>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              {[
                { l:"Country", v:p.country }, { l:"Region", v:p.region },
                { l:"Grape", v:p.grape }, { l:"Body", v:p.body },
                { l:"ABV", v:p.abv }, { l:"Volume", v:p.volume },
              ].map(r => (
                <div key={r.l}>
                  <div className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-wider">{r.l}</div>
                  <div className="text-[14px] font-semibold text-[#0d1912] mt-0.5">{r.v}</div>
                </div>
              ))}
            </div>
          </Accordion>
          <Accordion title="Tasting notes">
            <p>{p.tastingNotes}</p>
          </Accordion>
          <Accordion title="Food pairing">
            <p>{p.foodPairing}</p>
          </Accordion>
          <Accordion title="Allergens & dietary">
            <p>Contains sulphites. Suitable for vegetarians and vegans. Please drink responsibly.</p>
          </Accordion>
        </div>

        {/* ── You might like ── */}
        {recs.length > 0 && (
          <div className="mt-4 mb-2">
            <h2 className="font-black text-[20px] text-[#0d1912] px-5 mb-3">You might also like</h2>
            <div className="scroll-row px-5">
              {recs.map(rec => {
                const rQty = items.find(i => i.product.id === rec.id)?.quantity ?? 0;
                return (
                  <div key={rec.id} className="flex-shrink-0 w-40 card overflow-hidden">
                    <button onClick={() => navigate("pdp", { productId: rec.id })} className="block w-full h-40 bg-[#f5f2ec] overflow-hidden">
                      <img src={rec.imageUrl} alt={rec.name} className="w-full h-full object-cover"/>
                    </button>
                    <div className="p-3">
                      <p className="text-[12px] font-bold text-[#0d1912] line-clamp-2 leading-tight">{rec.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-[13px]">£{rec.price.toFixed(2)}</span>
                        <QuickAdd
                          qty={rQty}
                          onAdd={() => addToCart(rec)}
                          onInc={() => setQty(rec.id, rQty + 1)}
                          onDec={() => setQty(rec.id, rQty - 1)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        <div className="px-5 mt-4 pb-36">
          <h2 className="font-black text-[20px] text-[#0d1912] mb-4">Reviews</h2>
          {/* Rating summary */}
          <div className="card p-4 flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="font-black text-[42px] text-[#0d1912] leading-none">{p.rating}</div>
              <Stars rating={p.rating} />
              <p className="text-[11px] text-[#5a6860] mt-1">{p.reviewCount.toLocaleString()} reviews</p>
            </div>
            <div className="flex-1">
              {[5,4,3,2,1].map(s => (
                <div key={s} className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-[#5a6860] w-2">{s}</span>
                  <div className="flex-1 h-2 bg-[#f0ece6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f59e0b] rounded-full"
                      style={{ width: `${s===Math.round(p.rating)?62:s===Math.round(p.rating)-1?24:6}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Sample reviews */}
          {[
            { name:"James T.", date:"2 weeks ago", rating:5, text:"Absolutely stunning. The depth of flavour is incredible for the price. Will be ordering more." },
            { name:"Sarah M.", date:"1 month ago", rating:5, text:"Our go-to red. Smooth, rich and perfect with Sunday roast. Firm household favourite." },
            { name:"David K.", date:"1 month ago", rating:4, text:"Excellent quality, great value. Delivered promptly. Highly recommend." },
          ].map((r,i) => (
            <div key={i} className="border-b border-[#f0ece6] py-4 last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C2185B] flex items-center justify-center text-white text-[12px] font-bold">
                    {r.name[0]}
                  </div>
                  <span className="font-bold text-[14px] text-[#0d1912]">{r.name}</span>
                </div>
                <span className="text-[11px] text-[#9ca3af]">{r.date}</span>
              </div>
              <Stars rating={r.rating} sm />
              <p className="text-[13px] text-[#5a6860] leading-relaxed mt-1.5">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky add to basket ── */}
      <div className="sticky-cta">
        <div className="flex items-center gap-3">
          <Stepper
            qty={localQty}
            onInc={() => setLocalQty(q => q + 1)}
            onDec={() => setLocalQty(q => Math.max(1, q - 1))}
            compact
          />
          <Btn onClick={handleAdd} full className="flex-1">
            {added
              ? <><svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>Added!</>
              : `Add to basket · £${(p.price * localQty).toFixed(2)}`
            }
          </Btn>
        </div>
      </div>
    </div>
  );
}
