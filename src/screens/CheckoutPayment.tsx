import React, { useState } from "react";
import { LWCircle, CheckoutSteps, Field, Btn } from "../components/shared";
import { useCart } from "../contexts/CartContext";

interface Props {
  navigate: (s: string, p?: any) => void;
  goBack: () => void;
  checkoutData: any;
  setCheckoutData: (fn: any) => void;
}

const PAYMENT_TABS = [
  { id: "card", label: "Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "apple", label: "Apple Pay", icon: "🍎" },
];

export default function CheckoutPayment({ navigate, checkoutData, setCheckoutData, goBack }: Props) {
  const { subtotal, totalSavings, items } = useCart();
  const [tab, setTab] = useState("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [password, setPassword] = useState("");
  const [termsOk, setTermsOk] = useState(false);
  const [newsOk, setNewsOk] = useState(false);

  const deliveryCost = checkoutData.delivery?.method === "unlimited" ? 0
    : checkoutData.delivery?.method === "named" ? 9.99 : 7.99;
  const orderTotal = subtotal + deliveryCost;

  const formatCard = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 16);
    return d.match(/.{1,4}/g)?.join(" ") ?? d;
  };
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const selectedOpt = checkoutData.delivery?.method === "unlimited" ? "Unlimited (Free)"
    : checkoutData.delivery?.method === "named" ? "Next/Named Day (£9.99)"
    : "Standard (£7.99)";

  const handlePlaceOrder = () => {
    setCheckoutData((d: any) => ({ ...d, payment: { tab, cardName } }));
    navigate("order-confirmation");
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

      <CheckoutSteps step={3} />

      {/* Review section */}
      <div className="mx-4 mb-4">
        <h2 className="font-black text-[22px] text-[#C2185B] mb-3">Review &amp; payment</h2>

        {/* Order summary */}
        <div className="card p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-black text-[15px] text-[#0d1912]">Your order</p>
            <button onClick={() => navigate("cart")} className="text-[12px] font-bold text-[#C2185B] underline">Edit</button>
          </div>
          {items.slice(0, 2).map(item => (
            <div key={item.product.id} className="flex items-center gap-3 py-2.5 border-b border-[#f0ece6] last:border-0">
              <div className="w-10 h-12 rounded-xl overflow-hidden bg-[#f5f2ec] flex-shrink-0">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#0d1912] line-clamp-1">{item.product.name}</p>
                <p className="text-[11px] text-[#5a6860]">Qty {item.quantity}</p>
              </div>
              <p className="font-black text-[13px]">£{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          {items.length > 2 && (
            <button onClick={() => navigate("cart")} className="text-[12px] font-bold text-[#C2185B] mt-1.5">
              +{items.length - 2} more items
            </button>
          )}
        </div>

        {/* Delivery address */}
        {checkoutData.shipping?.addressLine1 && (
          <div className="card p-4 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-black text-[14px] text-[#0d1912]">Delivering to</p>
              <button onClick={() => navigate("checkout-shipping")} className="text-[12px] font-bold text-[#C2185B] underline">Edit</button>
            </div>
            <p className="text-[13px] font-semibold text-[#0d1912]">
              {checkoutData.shipping.firstName} {checkoutData.shipping.lastName}
            </p>
            <p className="text-[12px] text-[#5a6860]">{checkoutData.shipping.addressLine1}</p>
            {checkoutData.shipping.addressLine2 && (
              <p className="text-[12px] text-[#5a6860]">{checkoutData.shipping.addressLine2}</p>
            )}
            <p className="text-[12px] text-[#5a6860]">{checkoutData.shipping.city}, {checkoutData.shipping.postcode}</p>
          </div>
        )}

        {/* Delivery method */}
        <div className="card p-4 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-[14px] text-[#0d1912]">Delivery method</p>
              <p className="text-[13px] text-[#5a6860] mt-0.5">{selectedOpt}</p>
            </div>
            <button onClick={() => navigate("checkout-delivery")} className="text-[12px] font-bold text-[#C2185B] underline">Edit</button>
          </div>
        </div>

        {/* Order total card */}
        <div className="card p-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5a6860]">Subtotal</span>
              <span className="font-semibold">£{subtotal.toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-[13px]">
                <span className="text-[#5a6860]">Savings</span>
                <span className="font-bold text-[#c62b3a]">−£{totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5a6860]">Delivery</span>
              <span className={`font-semibold ${deliveryCost === 0 ? "text-[#C2185B]" : ""}`}>
                {deliveryCost === 0 ? "FREE" : `£${deliveryCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-[18px] font-black border-t border-[#f0ece6] pt-2.5">
              <span>ORDER TOTAL</span>
              <span>£{orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="mx-4 mb-4">
        <h3 className="font-black text-[18px] text-[#0d1912] mb-3">Payment</h3>

        {/* Payment tabs */}
        <div className="flex gap-2 mb-3">
          {PAYMENT_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-[13px] font-bold border-2 transition-all ${
                tab === t.id
                  ? "border-[#C2185B] bg-[#FCE4EC] text-[#C2185B]"
                  : "border-[#e4dfd6] bg-white text-[#5a6860]"
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {tab === "card" && (
          <div className="card p-5 space-y-4">
            <Field label="Name on card" value={cardName} onChange={setCardName} placeholder="As it appears on card" />
            <div>
              <p className="text-[12px] font-black text-[#5a6860] uppercase tracking-wide mb-1.5">Card number</p>
              <div className="relative">
                <input
                  type="text" inputMode="numeric"
                  value={cardNum}
                  onChange={e => setCardNum(formatCard(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className="w-full border-2 border-[#e4dfd6] rounded-2xl px-4 py-3.5 text-[15px] font-mono font-semibold outline-none focus:border-[#C2185B] bg-white pr-14"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-5 h-3 rounded-sm bg-[#eb001b]" />
                  <div className="w-5 h-3 rounded-sm bg-[#f79e1b] opacity-80 -ml-2" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[12px] font-black text-[#5a6860] uppercase tracking-wide mb-1.5">Expiry</p>
                <input
                  type="text" inputMode="numeric"
                  value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="w-full border-2 border-[#e4dfd6] rounded-2xl px-4 py-3.5 text-[15px] font-mono font-semibold outline-none focus:border-[#C2185B] bg-white"
                />
              </div>
              <div>
                <p className="text-[12px] font-black text-[#5a6860] uppercase tracking-wide mb-1.5">CVV</p>
                <input
                  type="password" inputMode="numeric"
                  value={cvv} onChange={e => setCvv(e.target.value.slice(0, 4))}
                  placeholder="•••"
                  className="w-full border-2 border-[#e4dfd6] rounded-2xl px-4 py-3.5 text-[15px] font-mono font-semibold outline-none focus:border-[#C2185B] bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f5f2ec] rounded-xl px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9ca3af" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] text-[#9ca3af] font-medium">256-bit SSL encrypted · Payments by Adyen</span>
            </div>
          </div>
        )}

        {tab === "paypal" && (
          <div className="card p-5 text-center">
            <p className="text-[14px] text-[#5a6860] mb-4">You will be redirected to PayPal to complete your purchase.</p>
            <div className="w-20 h-20 rounded-full bg-[#003087] flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-[28px]">P</span>
            </div>
            <p className="text-[12px] text-[#9ca3af]">Click &quot;Place order&quot; below to proceed to PayPal</p>
          </div>
        )}

        {tab === "apple" && (
          <div className="card p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <p className="font-bold text-[15px] text-[#0d1912] mb-1">Apple Pay</p>
            <p className="text-[12px] text-[#9ca3af]">Use Face ID or Touch ID to confirm your payment</p>
          </div>
        )}
      </div>

      {/* Age verification */}
      <div className="mx-4 mb-4 card p-4">
        <p className="font-black text-[14px] text-[#0d1912] mb-1">Age verification — 18+ only</p>
        <p className="text-[12px] text-[#5a6860] mb-3">
          We are required by law to verify the age of the recipient.
        </p>
        <div className="flex gap-2">
          {[
            { label: "Day", val: dobDay, set: setDobDay, max: 2, ph: "DD" },
            { label: "Month", val: dobMonth, set: setDobMonth, max: 2, ph: "MM" },
            { label: "Year", val: dobYear, set: setDobYear, max: 4, ph: "YYYY" },
          ].map(f => (
            <div key={f.label} className={f.label === "Year" ? "flex-[2]" : "flex-1"}>
              <p className="text-[10px] font-black text-[#9ca3af] uppercase tracking-wide mb-1">{f.label}</p>
              <input
                type="text" inputMode="numeric"
                placeholder={f.ph} value={f.val}
                onChange={e => f.set(e.target.value.slice(0, f.max))}
                className="w-full border-2 border-[#e4dfd6] rounded-2xl px-3 py-3 text-center text-[15px] font-bold outline-none focus:border-[#C2185B] bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Create account */}
      <div className="mx-4 mb-4 card p-4 bg-[#FFF0F5] border border-[#F8BBD0]">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#C2185B] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" fill="white"/>
              <path d="M2 19c0-4.4 4.5-8 10-8s10 3.6 10 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="font-black text-[14px] text-[#0d1912]">Create your Laithwaites account</p>
            <p className="text-[12px] text-[#5a6860] mt-0.5">
              Save your details, track orders, and access exclusive member offers.
            </p>
          </div>
        </div>
        <Field
          label="Create password" type="password" value={password}
          onChange={setPassword} placeholder="Min. 8 characters"
          hint="Optional — skip to checkout as guest"
        />
      </div>

      {/* T&Cs */}
      <div className="mx-4 mb-4 space-y-3">
        {[
          {
            checked: termsOk, toggle: () => setTermsOk(!termsOk),
            text: "I agree to the Terms & Conditions and Privacy Policy. By placing this order I confirm I am 18 years of age or over.",
          },
          {
            checked: newsOk, toggle: () => setNewsOk(!newsOk),
            text: "I would like to receive exclusive offers, wine recommendations, and news from Laithwaites by email.",
          },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <button
              onClick={item.toggle}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                item.checked ? "bg-[#C2185B] border-[#C2185B]" : "border-[#d1d5db] bg-white"
              }`}
            >
              {item.checked && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
            </button>
            <p className="text-[12px] text-[#5a6860] leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-4 mb-4">
        <Btn onClick={handlePlaceOrder} full disabled={!termsOk}>
          Place order · £{orderTotal.toFixed(2)}
        </Btn>
        <p className="text-center text-[11px] text-[#9ca3af] mt-2">
          By clicking &quot;Place order&quot; you agree to our terms
        </p>
      </div>

      <div className="bg-[#C2185B] mx-4 mb-6 rounded-2xl px-4 py-4 text-center">
        <p className="text-white/70 text-[11px] leading-relaxed">
          🌳 Every delivery is carbon neutral. We offset emissions through certified reforestation projects.
        </p>
      </div>
    </div>
  );
}
