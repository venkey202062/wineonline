import React, { useState } from "react";
import { LWCircle, CheckoutSteps, Btn } from "../components/shared";
import { useCart } from "../contexts/CartContext";

interface Props {
  navigate: (s: string, p?: any) => void;
  goBack: () => void;
  checkoutData: { delivery: { method: string; giftMessage: string } };
  setCheckoutData: (fn: any) => void;
}

const OPTIONS = [
  { id: "standard", label: "Standard Delivery",        price: 7.99,  est: "3–5 working days",   detail: "Mainland UK" },
  { id: "named",    label: "Next or Named Day",         price: 9.99,  est: "Your chosen date",    detail: "Order before 1pm" },
  { id: "unlimited",label: "Unlimited Delivery (6 months)", price: 0, est: "No limits, no fees",  detail: "Was £29.99", free: true },
];

export default function CheckoutDelivery({ navigate, goBack, checkoutData, setCheckoutData }: Props) {
  const { subtotal, totalSavings, items } = useCart();
  const [method, setMethod] = useState(checkoutData.delivery.method || "standard");
  const [gift, setGift] = useState(checkoutData.delivery.giftMessage || "");
  const [giftOpen, setGiftOpen] = useState(false);
  const [unlimitedInfo, setUnlimitedInfo] = useState(false);

  const selected = OPTIONS.find(o => o.id === method)!;
  const deliveryCost = selected.price;
  const orderTotal = subtotal + deliveryCost;

  const handleContinue = () => {
    setCheckoutData((d: any) => ({ ...d, delivery: { method, giftMessage: gift } }));
    navigate("checkout-payment");
  };

  return (
    <div className="screen-content bg-white">
      {/* Header */}
      <div className="bg-white flex items-center justify-between px-5 py-3 border-b border-[#f0ece6]">
        <button onClick={goBack} className="w-9 h-9 rounded-full bg-[#f5f2ec] flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#0d1912" strokeWidth="2.25" strokeLinecap="round"/>
          </svg>
        </button>
        <LWCircle size={38} />
        <button className="text-[13px] font-bold text-[#5a6860]">Help</button>
      </div>

      <CheckoutSteps step={2} />

      {/* Mini order summary */}
      <div className="mx-4 mb-4 card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-[13px] text-[#5a6860]">Your order</p>
          <button onClick={() => navigate("cart")} className="text-[12px] font-bold text-[#C2185B] underline">Edit</button>
        </div>
        {items.slice(0,2).map(item => (
          <div key={item.product.id} className="flex items-center gap-2.5 py-2 border-b border-[#f0ece6] last:border-0">
            <div className="w-9 h-11 bg-[#f5f2ec] rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#0d1912] line-clamp-1">{item.product.name}</p>
              <p className="text-[10px] text-[#5a6860]">Qty {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-[13px]">£{(item.product.price * item.quantity).toFixed(2)}</p>
              {item.product.originalPrice && (
                <p className="text-[10px] text-[#c62b3a] font-bold">
                  Saved £{((item.product.originalPrice - item.product.price) * item.quantity).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
        <div className="pt-2.5 space-y-1.5">
          <div className="flex justify-between text-[12px]">
            <span className="text-[#5a6860]">Subtotal</span>
            <span className="font-semibold">£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[#5a6860]">Delivery</span>
            <span className={`font-semibold ${deliveryCost===0?"text-[#C2185B]":""}`}>
              {deliveryCost===0?"FREE":`£${deliveryCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-[15px] font-black border-t border-[#f0ece6] pt-2">
            <span>ORDER TOTAL</span>
            <span>£{orderTotal.toFixed(2)}</span>
          </div>
          {totalSavings > 0 && (
            <p className="text-right text-[11px] font-bold text-[#c62b3a]">You saved £{totalSavings.toFixed(2)}</p>
          )}
        </div>
      </div>

      {/* Delivery options */}
      <div className="mx-4 mb-4">
        <h2 className="font-black text-[22px] text-[#C2185B] mb-4">Delivery options</h2>

        {/* Unlimited hero */}
        <div className="bg-[#C2185B] rounded-2xl mb-3 overflow-hidden">
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                ♾️ UNLIMITED
              </span>
            </div>
            <h3 className="text-white font-black text-[20px] leading-tight">
              Skip delivery fees forever.<br/>New members go free.
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-white/50 text-[14px] line-through">£29.99</span>
              <span className="text-white font-black text-[26px]">£0.00</span>
            </div>
            <p className="text-white/60 text-[12px] mt-1">6 months unlimited delivery on all orders</p>
            <button onClick={() => setUnlimitedInfo(!unlimitedInfo)}
              className="text-white/70 text-[12px] font-bold underline mt-1 flex items-center gap-1">
              How it works
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                className={`transition-transform ${unlimitedInfo?"rotate-180":""}`}>
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            {unlimitedInfo && (
              <p className="text-white/60 text-[12px] mt-2 leading-relaxed">
                After 6 months, Unlimited is £29.99/year. Cancel anytime. No delivery charges on any orders during membership.
              </p>
            )}
            <button onClick={() => setMethod("unlimited")}
              className="mt-3 btn-pill bg-white text-[#C2185B] font-black text-[14px] px-5 py-2.5 w-full">
              Add Unlimited delivery
            </button>
          </div>
        </div>

        {/* Selection cards */}
        <p className="font-black text-[15px] text-[#0d1912] mb-2.5">Or choose a delivery method:</p>
        <div className="space-y-2.5">
          {OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setMethod(opt.id)}
              className={`w-full flex items-start gap-3.5 p-4 card-sm text-left transition-all ${
                method===opt.id ? "ring-2 ring-[#C2185B]" : ""
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                method===opt.id ? "border-[#C2185B]" : "border-[#d1d5db]"
              }`}>
                {method===opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#C2185B]"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-[14px] text-[#0d1912]">{opt.label}</p>
                  <p className={`font-black text-[14px] flex-shrink-0 ${opt.free?"text-[#C2185B]":"text-[#0d1912]"}`}>
                    {opt.free ? "FREE" : `£${opt.price.toFixed(2)}`}
                  </p>
                </div>
                <p className="text-[12px] text-[#5a6860] mt-0.5">{opt.est}</p>
                <p className="text-[11px] text-[#9ca3af] mt-0.5">{opt.detail}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Gift message */}
        <button
          onClick={() => setGiftOpen(!giftOpen)}
          className="flex items-center gap-2.5 mt-4 text-[14px] font-bold text-[#C2185B]"
        >
          <span className="text-xl">🎁</span>
          Add a greetings card or message
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            className={`ml-auto transition-transform ${giftOpen?"rotate-180":""}`}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {giftOpen && (
          <div className="mt-3">
            <textarea
              value={gift} onChange={e => setGift(e.target.value)} rows={3}
              placeholder="Write your message here…"
              className="w-full border-2 border-[#e4dfd6] rounded-2xl px-4 py-3.5 text-[14px] font-medium text-[#0d1912] resize-none outline-none focus:border-[#C2185B] bg-white"
            />
            <p className="text-right text-[11px] text-[#9ca3af]">{gift.length}/200</p>
          </div>
        )}
      </div>

      <div className="mx-4 mb-4 space-y-3">
        <Btn onClick={handleContinue} full>Continue to review &amp; payment</Btn>
        <Btn onClick={goBack} full outline>Back to shipping</Btn>
      </div>

      <div className="bg-[#C2185B] mx-4 mb-6 rounded-2xl px-4 py-4 text-center">
        <p className="text-white/70 text-[11px] leading-relaxed">
          🌳 Every delivery is green. We offset the carbon emissions of each delivery through reforestation projects.
        </p>
      </div>
    </div>
  );
}
