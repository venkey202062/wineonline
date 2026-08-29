import React, { useState } from "react";
import { LWCircle, CheckoutSteps, Field, Btn } from "../components/shared";
import { useCart } from "../contexts/CartContext";

interface SData {
  email: string; title: string; firstName: string; lastName: string;
  phone: string; postcode: string; addressLine1: string; addressLine2: string;
  city: string; county: string;
}

interface Props {
  navigate: (s: string, p?: any) => void;
  goBack: () => void;
  checkoutData: { shipping: SData };
  setCheckoutData: (fn: any) => void;
}

function validate(d: SData) {
  const e: Partial<SData> = {};
  if (!d.email) e.email = "Email required";
  else if (!/\S+@\S+\.\S+/.test(d.email)) e.email = "Enter a valid email";
  if (!d.firstName) e.firstName = "Required";
  if (!d.lastName) e.lastName = "Required";
  if (!d.phone) e.phone = "Phone required";
  if (!d.postcode) e.postcode = "Postcode required";
  if (!d.addressLine1) e.addressLine1 = "Address required";
  if (!d.city) e.city = "Town / city required";
  return e;
}

export default function CheckoutShipping({ navigate, goBack, checkoutData, setCheckoutData }: Props) {
  const { subtotal, totalSavings, deliveryCost, orderTotal, items } = useCart();
  const [form, setForm] = useState<SData>(checkoutData.shipping);
  const [errors, setErrors] = useState<Partial<SData>>({});
  const [manual, setManual] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const set = (k: keyof SData) => (v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const findAddress = () => {
    if (!form.postcode) { setErrors(e => ({ ...e, postcode: "Enter a postcode first" })); return; }
    setForm(f => ({ ...f, addressLine1: "123 Vineyard Close", city: "London", county: "Greater London" }));
    setManual(true);
  };

  const handleContinue = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setCheckoutData((d: any) => ({ ...d, shipping: form }));
    navigate("checkout-delivery");
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

      <CheckoutSteps step={1} />

      {/* Collapsible order summary */}
      <div className="mx-4 mb-4 card overflow-hidden">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6z" stroke="#C2185B" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
            <span className="font-black text-[15px] text-[#C2185B]">Order total: £{orderTotal.toFixed(2)}</span>
            {totalSavings > 0 && (
              <span className="text-[11px] font-bold text-[#c62b3a]">Saving £{totalSavings.toFixed(2)}</span>
            )}
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            className={`text-[#5a6860] transition-transform ${summaryOpen?"rotate-180":""}`}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {summaryOpen && (
          <div className="border-t border-[#f0ece6] px-4 pb-4">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3 py-2.5 border-b border-[#f0ece6] last:border-0">
                <div className="w-10 h-12 bg-[#f5f2ec] rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-[#0d1912] line-clamp-1">{item.product.name}</p>
                  <p className="text-[11px] text-[#5a6860]">Qty: {item.quantity}</p>
                </div>
                <p className="font-black text-[13px]">£{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="pt-3 space-y-1">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#5a6860]">Subtotal</span>
                <span className="font-semibold">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#5a6860]">Delivery</span>
                <span className="font-semibold">{deliveryCost===0?"FREE":`£${deliveryCost.toFixed(2)}`}</span>
              </div>
            </div>
            <button onClick={() => navigate("cart")} className="text-[11px] font-bold text-[#C2185B] underline mt-2">
              Edit order
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="mx-4 card p-5 space-y-5 mb-4">
        <h2 className="font-black text-[22px] text-[#C2185B]">Delivery address</h2>

        <Field label="Email address" type="email" value={form.email} onChange={set("email")}
          placeholder="your@email.com" error={errors.email} required />

        <div className="h-px bg-[#f0ece6]" />

        <div className="space-y-4">
          <p className="font-black text-[15px] text-[#0d1912]">Delivery details</p>

          <div>
            <p className="text-[12px] font-black text-[#5a6860] uppercase tracking-wide mb-1.5">Title</p>
            <select
              value={form.title} onChange={e => set("title")(e.target.value)}
              className="w-32 border-2 border-[#e4dfd6] rounded-2xl px-4 py-3.5 text-[15px] font-medium bg-white outline-none"
            >
              {["Mr","Mrs","Miss","Ms","Dr","Prof"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" value={form.firstName} onChange={set("firstName")} error={errors.firstName} required />
            <Field label="Last name" value={form.lastName} onChange={set("lastName")} error={errors.lastName} required />
          </div>

          <Field label="Mobile number" type="tel" value={form.phone} onChange={set("phone")}
            placeholder="07700 000000" hint="We'll send free SMS delivery updates"
            error={errors.phone} required />
        </div>

        <div className="h-px bg-[#f0ece6]" />

        <div className="space-y-4">
          <p className="font-black text-[15px] text-[#0d1912]">Delivery address</p>

          <div>
            <p className="text-[12px] font-black text-[#5a6860] uppercase tracking-wide mb-1.5">
              Postcode <span className="text-[#c62b3a]">*</span>
            </p>
            <div className="flex gap-2">
              <input
                type="text" value={form.postcode}
                onChange={e => set("postcode")(e.target.value.toUpperCase())}
                placeholder="SW1A 1AA"
                className={`w-28 border-2 rounded-2xl px-4 py-3.5 text-[15px] font-bold uppercase outline-none ${
                  errors.postcode ? "border-[#c62b3a]":"border-[#e4dfd6]"
                }`}
              />
              <button
                onClick={findAddress}
                className="btn-pill border-2 border-[#C2185B] text-[#C2185B] font-bold text-[14px] px-4"
              >
                Find address
              </button>
            </div>
            {errors.postcode && <p className="text-[11px] text-[#c62b3a] font-bold mt-1">{errors.postcode}</p>}
          </div>

          {!manual && (
            <button onClick={() => setManual(true)} className="text-[13px] font-bold text-[#C2185B] underline">
              Enter address manually
            </button>
          )}

          {manual && (
            <div className="space-y-3">
              <Field label="Address line 1" value={form.addressLine1} onChange={set("addressLine1")}
                placeholder="Street address" error={errors.addressLine1} required />
              <Field label="Address line 2 (optional)" value={form.addressLine2} onChange={set("addressLine2")}
                placeholder="Apartment, suite, etc." />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Town / city" value={form.city} onChange={set("city")} error={errors.city} required />
                <Field label="County" value={form.county} onChange={set("county")} placeholder="Optional" />
              </div>
            </div>
          )}
        </div>

        <Btn onClick={handleContinue} full>Continue to delivery</Btn>

        <p className="text-center text-[12px] text-[#5a6860]">
          Already a customer?{" "}
          <button className="font-bold text-[#C2185B] underline">Sign in</button>
          {" "}to fill in your details
        </p>
      </div>

      {/* Trust pills */}
      <div className="px-4 pb-6 grid grid-cols-2 gap-2.5">
        {[
          { e:"💰", t:"100% money-back guarantee" },
          { e:"🚚", t:"Free delivery on 24+ bottles" },
          { e:"🏆", t:"Award-winning wines" },
          { e:"⭐", t:"Excellent Trustpilot rating" },
        ].map(b => (
          <div key={b.t} className="card-sm flex items-center gap-2.5 p-3">
            <span className="text-xl">{b.e}</span>
            <span className="text-[11px] font-bold text-[#0d1912]">{b.t}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#C2185B] mx-4 mb-6 rounded-2xl px-4 py-4 text-center">
        <p className="text-white/70 text-[11px] leading-relaxed">
          🌳 Every delivery is green. We offset the carbon emissions of each delivery through reforestation projects.
        </p>
      </div>
    </div>
  );
}
