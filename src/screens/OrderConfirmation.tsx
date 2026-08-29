import React from "react";
import { LWCircle, Btn } from "../components/shared";
import { useCart } from "../contexts/CartContext";

interface Props {
  navigate: (screen: string, params?: any) => void;
  params?: any;
}

const ORDER_ID = `LW${Math.floor(Math.random() * 900000 + 100000)}`;

const WINES = [
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=400&h=500&fit=crop&auto=format",
];

export default function OrderConfirmation({ navigate, params }: Props) {
  const { items, subtotal, clearCart } = useCart();
  const deliveryCost = params?.deliveryCost ?? 7.99;
  const orderTotal = subtotal + deliveryCost;

  return (
    <div className="screen-content bg-white">
      {/* Header */}
      <div className="bg-[#C2185B] px-5 pt-safe-top pb-5 text-center">
        <LWCircle size={48} />
        <div className="mt-4 w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-white font-black text-[28px] mt-3 leading-tight">
          Order confirmed!
        </h1>
        <p className="text-white/70 text-[14px] mt-1">
          Your wine is on its way. Cheers! 🥂
        </p>
      </div>

      {/* Order reference card */}
      <div className="mx-4 -mt-4 card p-4 mb-4 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#FCE4EC] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="font-black text-[14px] text-[#C2185B]">Order placed successfully</p>
        </div>
        <div className="space-y-2.5">
          {[
            { label: "Order reference", val: ORDER_ID, mono: true, strong: true },
            { label: "Order total", val: `£${orderTotal.toFixed(2)}`, strong: true },
            { label: "Estimated delivery", val: "3–5 working days", green: true },
            { label: "Confirmation sent to", val: params?.email || "your@email.com" },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[12px] text-[#5a6860]">{row.label}</span>
              <span className={`text-[13px] ${row.mono?"font-mono":""} ${row.strong?"font-black":""} ${row.green?"text-[#C2185B] font-bold":""}`}>
                {row.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Items shipped */}
      {items.length > 0 && (
        <div className="mx-4 mb-4 card p-4">
          <p className="font-black text-[15px] text-[#0d1912] mb-3">What we are sending you</p>
          {items.map(item => (
            <div key={item.product.id} className="flex items-center gap-3 py-2.5 border-b border-[#f0ece6] last:border-0">
              <div className="w-10 h-13 rounded-xl overflow-hidden bg-[#f5f2ec] flex-shrink-0" style={{ height: 52 }}>
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#0d1912] line-clamp-1">{item.product.name}</p>
                <p className="text-[11px] text-[#5a6860]">{item.product.subtitle}</p>
                <p className="text-[11px] text-[#9ca3af]">Qty {item.quantity}</p>
              </div>
              <p className="font-black text-[13px]">£{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* What happens next */}
      <div className="mx-4 mb-4 card p-4">
        <p className="font-black text-[15px] text-[#0d1912] mb-3">What happens next?</p>
        <div className="space-y-4">
          {[
            { emoji: "📧", title: "Confirmation email", desc: "We have emailed your order summary and receipt." },
            { emoji: "📦", title: "Order preparation", desc: "Our team is carefully selecting and packing your wines." },
            { emoji: "🚚", title: "Dispatch & tracking", desc: "You will receive free SMS tracking updates once dispatched." },
            { emoji: "🍷", title: "Delivered — enjoy!", desc: "Sit back and enjoy your award-winning wines." },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f2ec] flex items-center justify-center flex-shrink-0 text-xl">
                {step.emoji}
              </div>
              <div>
                <p className="font-bold text-[14px] text-[#0d1912]">{step.title}</p>
                <p className="text-[12px] text-[#5a6860] mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account creation notice */}
      <div className="mx-4 mb-4 bg-[#FCE4EC] border border-[#F48FB1] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[18px]">👤</span>
          <p className="font-black text-[14px] text-[#C2185B]">Your account has been created</p>
        </div>
        <p className="text-[12px] text-[#5a6860] leading-relaxed">
          Check your email for instructions to set your password and access exclusive member benefits, order history, and Subscribe &amp; Save.
        </p>
      </div>

      {/* Recommendations */}
      <div className="mx-4 mb-4">
        <p className="font-black text-[15px] text-[#0d1912] mb-3">You might also like</p>
        <div className="scroll-row">
          {WINES.map((url, i) => (
            <button key={i} onClick={() => navigate("plp")} className="flex-shrink-0 w-28">
              <div className="w-28 h-36 rounded-2xl overflow-hidden bg-[#f5f2ec]">
                <img src={url} alt="Wine" className="w-full h-full object-cover"/>
              </div>
              <p className="text-[11px] font-bold text-[#0d1912] mt-1.5 leading-tight">
                {["Château Beaumont 2020", "Primitivo del Salento", "Chablis 1er Cru"][i]}
              </p>
              <p className="text-[12px] font-black text-[#0d1912]">
                £{[13.99, 11.99, 16.99][i].toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="mx-4 mb-4 space-y-3">
        <Btn onClick={() => { clearCart(); navigate("home"); }} full>
          Continue shopping
        </Btn>
        <Btn onClick={() => navigate("account")} full outline>
          View my order
        </Btn>
      </div>

      {/* Help */}
      <div className="mx-4 mb-4 card p-4">
        <p className="font-black text-[14px] text-[#0d1912] mb-1">Need help?</p>
        <p className="text-[12px] text-[#5a6860] mb-3">Our team is available 7 days a week.</p>
        <div className="flex gap-2">
          {["📞 Call us", "💬 Live chat", "✉️ Email"].map(label => (
            <button key={label}
              className="flex-1 border-2 border-[#e4dfd6] rounded-2xl text-[11px] font-bold text-[#0d1912] py-2.5 text-center bg-white">
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#C2185B] mx-4 mb-6 rounded-2xl px-5 py-5 text-center">
        <p className="text-white font-black text-[16px] tracking-widest mb-1">WINE SHOPPING ONLINE</p>
        <p className="text-white/50 text-[10px] leading-relaxed">
          Wine Shopping Online is part of Direct Wines Ltd.<br/>
          Registered in England &amp; Wales 1095091.
        </p>
        <p className="text-white/30 text-[10px] mt-2">bedrinkaware.co.uk</p>
      </div>
    </div>
  );
}
