import React, { useState } from "react";
import { products, featuredCategories, wineStyles, Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
import { LWLogo, Stars, Price, QuickAdd, SaveBadge, HomeHeader } from "../components/shared";

interface Props {
  navigate: (s: string, p?: any) => void;
}

const CATS = [
  { emoji: "🍷", label: "Red",       type: "Red",       bg: "#7B1D2E" },
  { emoji: "🥂", label: "White",     type: "White",     bg: "#C8A84B" },
  { emoji: "🌸", label: "Rosé",      type: "Rosé",      bg: "#E07A8C" },
  { emoji: "✨", label: "Sparkling", type: "Sparkling",  bg: "#5B6FA6" },
  { emoji: "🍾", label: "Champagne", type: "Champagne", bg: "#A07840" },
  { emoji: "📦", label: "Cases",     type: "Mixed",     bg: "#4A7A5A" },
  { emoji: "🎁", label: "Gifts",     type: "Mixed",     bg: "#8B4A8B" },
];

export default function HomeScreen({ navigate }: Props) {
  const { addToCart, items, setQty } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const qty = (id: string) => items.find(i => i.product.id === id)?.quantity ?? 0;
  const inc = (p: Product) => setQty(p.id, qty(p.id) + 1);
  const dec = (p: Product) => setQty(p.id, qty(p.id) - 1);

  const bestsellers = products.filter(p => ["cabalie-2024","malbec-reserva-2022","marlborough-sauvignon-2023","prosecco-treviso-nv"].includes(p.id));
  const offers      = products.filter(p => p.originalPrice).slice(0, 5);
  const popular     = products.slice(4, 8);

  return (
    <div className="screen-content">
      {/* ── Green hero zone ─────────────────────────────────── */}
      <div className="bg-[#C2185B] px-5 pb-5 pt-safe">
        <HomeHeader
          onSearch={() => navigate("search")}
          onCart={() => navigate("cart")}
          cartCount={cartCount}
        />

        {/* Greeting */}
        <div className="mt-2 mb-4">
          <h1 className="text-white font-black text-[28px] leading-tight">
            Find your perfect wine.
          </h1>
          <p className="text-white/60 text-[13px] mt-1">Over 500 wines hand-picked by our experts</p>
        </div>

        {/* Tappable search pill */}
        <button
          onClick={() => navigate("search")}
          className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-lg shadow-black/10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9ca3af]">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-[#9ca3af] text-[15px] font-medium">Search wines, grapes, regions…</span>
        </button>

        {/* Category scroll row */}
        <div className="scroll-row mt-4 pb-1 -mx-1 px-1">
          {CATS.map((c) => (
            <button
              key={c.label}
              onClick={() => navigate("plp", { type: c.type })}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-white rounded-2xl px-4 py-3 shadow-md min-w-[72px]"
            >
              <span className="text-[26px] leading-none">{c.emoji}</span>
              <span className="text-[#0d1912] font-bold text-[11px] whitespace-nowrap">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── White body — rounded top ─────────────────────────── */}
      <div className="bg-white -mt-4 rounded-t-[28px] pt-5 relative z-10">

        {/* Bestsellers shelf */}
        <Section title="Bestsellers" onAll={() => navigate("plp")}>
          <div className="scroll-row px-5">
            {bestsellers.map(p => (
              <WineCard
                key={p.id} product={p} qty={qty(p.id)}
                onTap={() => navigate("pdp", { productId: p.id })}
                onAdd={() => addToCart(p)} onInc={() => inc(p)} onDec={() => dec(p)}
              />
            ))}
          </div>
        </Section>

        {/* Style quick-pick */}
        <div className="px-5 mb-6">
          <h2 className="font-black text-[22px] text-[#0d1912] mb-1">What are you after?</h2>
          <p className="text-[13px] text-[#5a6860] mb-3">Find wines by style in seconds</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { emoji: "🌶️", label: "Smooth & Rich",   type: "Red" },
              { emoji: "⚡", label: "Bold & Full",     type: "Red" },
              { emoji: "🫐", label: "Light & Fruity",  type: "Red" },
              { emoji: "🍋", label: "Crisp & Dry",     type: "White" },
              { emoji: "🌺", label: "Fruity Rosé",     type: "Rosé" },
              { emoji: "🥂", label: "Sparkling",       type: "Sparkling" },
            ].map(s => (
              <button
                key={s.label}
                onClick={() => navigate("plp", { type: s.type })}
                className="card-sm flex flex-col items-center gap-1 py-3 active:scale-95 transition-transform"
              >
                <span className="text-[22px]">{s.emoji}</span>
                <span className="text-[11px] font-bold text-[#0d1912] text-center leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promo card — Subscribe & Save */}
        <div className="mx-5 mb-6">
          <div className="rounded-[22px] overflow-hidden bg-[#C2185B] relative" style={{ minHeight: 140 }}>
            <img
              src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=300&fit=crop&auto=format"
              alt="Vineyard"
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
            <div className="relative px-5 py-5">
              <span className="inline-block bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                Members only
              </span>
              <h3 className="text-white font-black text-[22px] leading-tight">
                Subscribe<br/>& Save 20%
              </h3>
              <p className="text-white/70 text-[12px] mt-1">Plus 10% off every future case</p>
              <button
                onClick={() => navigate("plp")}
                className="mt-3 btn-pill bg-white text-[#C2185B] text-[13px] font-black px-4 py-2"
              >
                Find out more →
              </button>
            </div>
          </div>
        </div>

        {/* Offers shelf */}
        <Section title="On Offer" sub="Save on these wines today" onAll={() => navigate("offers")}>
          <div className="scroll-row px-5">
            {offers.map(p => (
              <WineCard
                key={p.id} product={p} qty={qty(p.id)}
                onTap={() => navigate("pdp", { productId: p.id })}
                onAdd={() => addToCart(p)} onInc={() => inc(p)} onDec={() => dec(p)}
              />
            ))}
          </div>
        </Section>

        {/* Occasion cards */}
        <div className="px-5 mb-6">
          <h2 className="font-black text-[22px] text-[#0d1912] mb-3">Shop by occasion</h2>
          <div className="space-y-2.5">
            {[
              { label: "Dinner party", sub: "Wines to impress guests",
                img: "https://images.unsplash.com/photo-1560493676-9a6b5fa9e0e3?w=600&h=200&fit=crop&auto=format" },
              { label: "Something special", sub: "Gifts & celebrations",
                img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=200&fit=crop&auto=format" },
              { label: "Weekend BBQ", sub: "Easy-drinking crowd-pleasers",
                img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=200&fit=crop&auto=format" },
            ].map(o => (
              <button
                key={o.label}
                onClick={() => navigate("plp")}
                className="w-full h-24 rounded-[18px] overflow-hidden relative block"
              >
                <img src={o.img} alt={o.label} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
                <div className="relative px-4 py-3 text-left">
                  <div className="text-white font-black text-[18px] leading-none">{o.label}</div>
                  <div className="text-white/70 text-[12px] mt-1">{o.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Popular shelf */}
        <Section title="Popular this week" onAll={() => navigate("plp")}>
          <div className="scroll-row px-5">
            {popular.map(p => (
              <WineCard
                key={p.id} product={p} qty={qty(p.id)}
                onTap={() => navigate("pdp", { productId: p.id })}
                onAdd={() => addToCart(p)} onInc={() => inc(p)} onDec={() => dec(p)}
              />
            ))}
          </div>
        </Section>

        {/* Trust row */}
        <div className="px-5 mb-6">
          <div className="card p-4">
            <h3 className="font-black text-[16px] text-[#0d1912] mb-3">Why Wine Shopping Online?</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { e: "💰", t: "100% Money-back", s: "No questions asked" },
                { e: "🚚", t: "Free delivery",   s: "On 24+ bottles" },
                { e: "🏆", t: "Award-winning",   s: "Wines & service" },
                { e: "⭐", t: "Excellent",        s: "Trustpilot rating" },
              ].map(b => (
                <div key={b.t} className="flex items-center gap-2 bg-[#f5f2ec] rounded-2xl p-2.5">
                  <span className="text-[22px]">{b.e}</span>
                  <div>
                    <div className="text-[11px] font-bold text-[#0d1912]">{b.t}</div>
                    <div className="text-[10px] text-[#5a6860]">{b.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-4" />
      </div>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({
  title, sub, onAll, children,
}: { title: string; sub?: string; onAll: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between px-5 mb-3">
        <div>
          <h2 className="font-black text-[22px] text-[#0d1912] leading-none">{title}</h2>
          {sub && <p className="text-[12px] text-[#5a6860] mt-0.5">{sub}</p>}
        </div>
        <button onClick={onAll} className="text-[13px] font-bold text-[#C2185B]">See all →</button>
      </div>
      {children}
    </div>
  );
}

/* ── Wine shelf card ── */
function WineCard({
  product: p, qty, onTap, onAdd, onInc, onDec,
}: { product: Product; qty: number; onTap: () => void; onAdd: () => void; onInc: () => void; onDec: () => void }) {
  return (
    <div className="flex-shrink-0 w-44 card overflow-hidden">
      {/* Image */}
      <button onClick={onTap} className="block w-full h-48 bg-[#f5f2ec] relative overflow-hidden">
        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
        {p.badge && (
          <span className="absolute top-2 left-2 bg-[#C2185B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
            {p.badge}
          </span>
        )}
        {p.originalPrice && (
          <span className="absolute top-2 right-2 bg-[#c62b3a] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
            SALE
          </span>
        )}
      </button>
      {/* Info */}
      <div className="p-3">
        <button onClick={onTap} className="text-left w-full">
          <p className="text-[12px] font-semibold text-[#5a6860] leading-none mb-0.5">{p.subtitle}</p>
          <p className="text-[13px] font-bold text-[#0d1912] leading-tight line-clamp-2">{p.name}</p>
          <div className="mt-1">
            <Stars rating={p.rating} count={p.reviewCount} sm />
          </div>
        </button>
        <div className="flex items-center justify-between mt-2.5">
          <div>
            <span className="font-black text-[15px] text-[#0d1912]">£{p.price.toFixed(2)}</span>
            {p.originalPrice && (
              <div className="text-[10px] text-[#c62b3a] font-bold">
                was £{p.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          <QuickAdd qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} />
        </div>
      </div>
    </div>
  );
}
