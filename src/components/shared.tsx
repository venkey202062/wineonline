import React from "react";

/* ── Logo ── */
export function LWLogo({ dark = false, size = "md" }: { dark?: boolean; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "text-[14px]" : "text-[17px]";
  return (
    <span
      style={{ fontWeight: 900, letterSpacing: "0.08em" }}
      className={`${sz} tracking-widest ${dark ? "text-white" : "text-[#C2185B]"}`}
    >
      LAITHWAITES
    </span>
  );
}

export function LWCircle({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-[#c62b3a] flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="text-white font-black" style={{ fontSize: size * 0.3, letterSpacing: "0.04em" }}>LW</span>
    </div>
  );
}

/* ── Stars ── */
export function Stars({ rating, count, sm }: { rating: number; count?: number; sm?: boolean }) {
  const sz = sm ? 11 : 13;
  return (
    <div className="flex items-center gap-1">
      <div className="flex" style={{ gap: 1 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} width={sz} height={sz} viewBox="0 0 20 20">
            <path
              d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.5.91-5.32L2.27 6.62l5.34-.78z"
              fill={s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb"}
            />
          </svg>
        ))}
      </div>
      {count !== undefined && (
        <span className={`text-[#5a6860] ${sm ? "text-[10px]" : "text-[11px]"}`}>({count.toLocaleString()})</span>
      )}
    </div>
  );
}

/* ── Price ── */
export function Price({
  price, original, large, color,
}: { price: number; original?: number; large?: boolean; color?: string }) {
  return (
    <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5">
      <span className={`font-black ${color ?? "text-[#0d1912]"} ${large ? "text-[26px]" : "text-[16px]"}`}>
        £{price.toFixed(2)}
      </span>
      {original && (
        <>
          <span className={`line-through text-[#9ca3af] ${large ? "text-[15px]" : "text-[12px]"}`}>
            £{original.toFixed(2)}
          </span>
          <span className={`font-bold text-[#c62b3a] ${large ? "text-[13px]" : "text-[11px]"}`}>
            Save £{(original - price).toFixed(2)}
          </span>
        </>
      )}
    </div>
  );
}

/* ── Savings badge ── */
export function SaveBadge({ amount, pct }: { amount?: number; pct?: number }) {
  const text = pct ? `-${pct}%` : amount ? `SAVE £${amount.toFixed(2)}` : "";
  return (
    <span className="inline-flex items-center bg-[#c62b3a] text-white text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full">
      {text}
    </span>
  );
}

/* ── Type pill ── */
export function TypePill({ type }: { type: string }) {
  const map: Record<string, string> = {
    Red: "bg-red-50 text-red-700",
    White: "bg-amber-50 text-amber-700",
    "Rosé": "bg-pink-50 text-pink-700",
    Sparkling: "bg-sky-50 text-sky-700",
    Champagne: "bg-purple-50 text-purple-700",
    Mixed: "bg-green-50 text-green-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[type] ?? "bg-gray-100 text-gray-600"}`}>
      {type}
    </span>
  );
}

/* ── Quick Add ── */
export function QuickAdd({
  qty, onAdd, onInc, onDec,
}: { qty: number; onAdd: () => void; onInc: () => void; onDec: () => void }) {
  if (qty === 0) {
    return (
      <button className="quick-add-btn" onClick={(e) => { e.stopPropagation(); onAdd(); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    );
  }
  return (
    <div className="quick-add-counter" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onDec}
        className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg"
      >−</button>
      <span className="text-white font-bold text-[14px] w-5 text-center">{qty}</span>
      <button
        onClick={onInc}
        className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg"
      >+</button>
    </div>
  );
}

/* ── Quantity stepper (larger, for PDP / cart) ── */
export function Stepper({
  qty, onInc, onDec, compact,
}: { qty: number; onInc: () => void; onDec: () => void; compact?: boolean }) {
  const sz = compact ? "w-8 h-8 text-[15px]" : "w-10 h-10 text-[18px]";
  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={onDec}
        className={`${sz} rounded-full border-2 border-[#1a5237] text-[#1a5237] flex items-center justify-center font-bold leading-none transition-colors active:bg-[#1a5237] active:text-white`}
      >
        −
      </button>
      <span className={`font-black text-[#0d1912] ${compact ? "w-5 text-[15px]" : "w-7 text-[18px]"} text-center`}>
        {qty}
      </span>
      <button
        onClick={onInc}
        className={`${sz} rounded-full bg-[#1a5237] text-white flex items-center justify-center font-bold leading-none shadow-lg shadow-[#1a5237]/30 active:opacity-80`}
      >
        +
      </button>
    </div>
  );
}

/* ── Primary pill button ── */
export function Btn({
  children, onClick, full, disabled, red, outline, sm, className,
}: {
  children: React.ReactNode; onClick?: () => void;
  full?: boolean; disabled?: boolean; red?: boolean;
  outline?: boolean; sm?: boolean; className?: string;
}) {
  const base = `btn-pill ${full ? "w-full" : ""} ${sm ? "px-4 py-2.5 text-[13px]" : "px-6 py-4 text-[15px]"} ${className ?? ""}`;
  if (outline) {
    return (
      <button disabled={disabled} onClick={onClick}
        className={`${base} border-2 border-[#C2185B] text-[#C2185B] bg-transparent disabled:opacity-40`}>
        {children}
      </button>
    );
  }
  return (
    <button disabled={disabled} onClick={onClick}
      className={`${base} ${red ? "bg-[#c62b3a] shadow-lg shadow-[#c62b3a]/30" : "bg-[#C2185B] shadow-lg shadow-[#C2185B]/25"} text-white disabled:opacity-40`}>
      {children}
    </button>
  );
}

/* ── Checkout progress ── */
export function CheckoutSteps({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-0 px-6 py-4">
      {[
        { n: 1, label: "Shipping" },
        { n: 2, label: "Delivery" },
        { n: 3, label: "Payment" },
      ].map((s, i) => {
        const done = s.n < step;
        const active = s.n === step;
        return (
          <React.Fragment key={s.n}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black transition-all ${
                  done || active ? "bg-[#C2185B] text-white" : "bg-[#e4dfd6] text-[#9ca3af]"
                }`}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ) : s.n}
              </div>
              <span className={`text-[10px] font-semibold ${active ? "text-[#C2185B]" : done ? "text-[#C2185B]" : "text-[#9ca3af]"}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-px mx-1.5 mb-5 ${done ? "bg-[#C2185B]" : "bg-[#e4dfd6]"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Accordion ── */
export function Accordion({ title, children, open: defaultOpen }: {
  title: string; children: React.ReactNode; open?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  return (
    <div className="border-b border-[#f0ece6]">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-5 text-left gap-3">
        <span className="font-semibold text-[14px] text-[#0d1912]">{title}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          className={`text-[#9ca3af] transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-[13px] text-[#5a6860] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Form field ── */
export function Field({
  label, type, value, onChange, placeholder, error, required, hint,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; required?: boolean; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-bold text-[#5a6860] uppercase tracking-wide">
        {label}{required && <span className="text-[#c62b3a] ml-0.5">*</span>}
      </label>
      <input
        type={type ?? "text"} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border-2 rounded-2xl px-4 py-3.5 text-[15px] text-[#0d1912] bg-white placeholder-[#9ca3af] font-medium transition-all ${
          error ? "border-[#c62b3a] bg-[#fce8ea]" : "border-[#e4dfd6]"
        }`}
      />
      {hint && !error && <span className="text-[11px] text-[#9ca3af]">{hint}</span>}
      {error && <span className="text-[11px] text-[#c62b3a] font-semibold">{error}</span>}
    </div>
  );
}

/* ── Delivery threshold bar ── */
export function DeliveryBar({ subtotal }: { subtotal: number }) {
  const threshold = 150;
  const pct = Math.min(100, (subtotal / threshold) * 100);
  if (subtotal === 0) return null;
  return (
    <div className="card-sm mx-4 mb-3 p-3">
      {subtotal >= threshold ? (
        <div className="flex items-center gap-2">
          <span className="text-lg">🚚</span>
          <span className="text-[13px] font-bold text-[#C2185B]">You've unlocked FREE delivery!</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <span className="text-[12px] text-[#5a6860]">
              Add <strong>£{(threshold - subtotal).toFixed(2)}</strong> for free delivery
            </span>
            <span className="text-[12px] font-bold text-[#C2185B]">{Math.round(pct)}%</span>
          </div>
          <div className="h-2 bg-[#e4dfd6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C2185B] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ── Home top header (on green background) ── */
export function HomeHeader({
  onSearch, onCart, cartCount,
}: { onSearch: () => void; onCart: () => void; cartCount: number }) {
  return (
    <div className="flex items-center justify-between px-5 pt-safe pb-2">
      <LWLogo dark />
      <button onClick={onCart} className="relative w-10 h-10 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6z"
            stroke="white" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] rounded-full bg-[#c62b3a] text-white text-[10px] font-black flex items-center justify-center">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </button>
    </div>
  );
}

/* ── Inner screen back header ── */
export function NavBar({
  title, onBack, onCart, cartCount, transparent, rightSlot,
}: {
  title?: string; onBack: () => void;
  onCart?: () => void; cartCount?: number;
  transparent?: boolean; rightSlot?: React.ReactNode;
}) {
  return (
    <div className={`sticky top-0 z-10 flex items-center justify-between px-4 py-3 gap-3 ${
      transparent ? "bg-transparent" : "bg-white border-b border-[#f0ece6]"
    }`}>
      <button
        onClick={onBack}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          transparent ? "bg-black/30 backdrop-blur-sm" : "bg-[#f5f2ec]"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke={transparent ? "white" : "#0d1912"} strokeWidth="2.25" strokeLinecap="round" />
        </svg>
      </button>
      {title && (
        <span className="font-bold text-[16px] text-[#0d1912] flex-1 text-center leading-tight">
          {title}
        </span>
      )}
      <div className="w-10 flex justify-end flex-shrink-0">
        {rightSlot ?? (
          onCart ? (
            <button
              onClick={onCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                transparent ? "bg-black/30 backdrop-blur-sm" : "bg-[#f5f2ec]"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6z"
                  stroke={transparent ? "white" : "#0d1912"} strokeWidth="1.75" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0"
                  stroke={transparent ? "white" : "#0d1912"} strokeWidth="1.75" strokeLinecap="round" />
              </svg>
              {(cartCount ?? 0) > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#c62b3a] text-white text-[9px] font-black flex items-center justify-center">
                  {(cartCount ?? 0) > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}

/* ── Bottom tab bar ── */
export function TabBar({
  active, onTab, cartCount,
}: { active: string; onTab: (t: string) => void; cartCount: number }) {
  const tabs = [
    { id: "home", label: "Home", Icon: IconHome },
    { id: "plp",  label: "Shop", Icon: IconShop },
    { id: "search", label: "Search", Icon: IconSearch },
    { id: "offers", label: "Offers", Icon: IconOffers },
    { id: "account", label: "Account", Icon: IconAccount },
  ];
  return (
    <div className="bg-white border-t border-[#f0ece6] flex items-stretch pb-safe"
         style={{ boxShadow: "0 -4px 16px rgba(0,0,0,0.06)" }}>
      {tabs.map((t) => {
        const on = active === t.id || (active === "pdp" && t.id === "plp");
        return (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            className="flex-1 flex flex-col items-center gap-1 pt-2.5 pb-1 relative"
          >
            <t.Icon active={on} />
            {t.id === "home" && cartCount > 0 && (
              <span className="absolute top-1.5 right-[14%] w-[16px] h-[16px] rounded-full bg-[#c62b3a] text-white text-[9px] font-black flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
            <span className={`text-[10px] font-semibold ${on ? "text-[#C2185B]" : "text-[#9ca3af]"}`}>
              {t.label}
            </span>
            {on && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C2185B]" />}
          </button>
        );
      })}
    </div>
  );
}

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1z"
        fill={active ? "#C2185B" : "none"}
        stroke={active ? "#C2185B" : "#9ca3af"} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconShop({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6z"
        fill={active ? "#e8f5ee" : "none"}
        stroke={active ? "#C2185B" : "#9ca3af"} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M16 10a4 4 0 01-8 0"
        stroke={active ? "#C2185B" : "#9ca3af"} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7"
        fill={active ? "#e8f5ee" : "none"}
        stroke={active ? "#C2185B" : "#9ca3af"} strokeWidth="1.75" />
      <path d="M21 21l-4.35-4.35" stroke={active ? "#C2185B" : "#9ca3af"} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function IconOffers({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
        fill={active ? "#e8f5ee" : "none"}
        stroke={active ? "#C2185B" : "#9ca3af"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconAccount({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
        fill={active ? "#e8f5ee" : "none"}
        stroke={active ? "#C2185B" : "#9ca3af"} strokeWidth="1.75" />
      <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6"
        stroke={active ? "#C2185B" : "#9ca3af"} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
