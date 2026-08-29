import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { NavBar, Stepper, Btn, DeliveryBar } from "../components/shared";

interface Props {
  navigate: (s: string, p?: any) => void;
  goBack: () => void;
}

export default function CartScreen({ navigate, goBack }: Props) {
  const { items, removeFromCart, setQty, subtotal, totalSavings, deliveryCost, orderTotal, totalItems } = useCart();
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [voucher, setVoucher] = useState("");

  if (items.length === 0) {
    return (
      <div className="screen-content bg-white">
        <NavBar title="Basket" onBack={goBack} />
        <div className="flex flex-col items-center justify-center h-[65dvh] px-8 text-center">
          <div className="w-24 h-24 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6z" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="#9ca3af" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="font-black text-[26px] text-[#0d1912] mb-2">Your basket is empty</h2>
          <p className="text-[14px] text-[#5a6860] mb-7">
            Discover over 500 award-winning wines and start filling your basket
          </p>
          <Btn onClick={goBack} full>Browse wines</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content bg-white">
      <NavBar title={`Basket · ${totalItems} ${totalItems===1?"item":"items"}`} onBack={goBack} />

      {/* Subscribe upsell */}
      <div className="mx-4 mt-3 bg-[#C2185B] rounded-2xl p-4 flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">♾️</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-[14px] leading-none">Subscribe &amp; Save 20%</p>
          <p className="text-white/60 text-[11px] mt-0.5">Save on this order and every future case</p>
        </div>
        <button className="btn-pill bg-white text-[#C2185B] text-[11px] font-black px-3 py-1.5 flex-shrink-0">
          Learn more
        </button>
      </div>

      {/* Items */}
      <div className="mx-4 mt-3 card divide-y divide-[#f0ece6]">
        {items.map(item => (
          <div key={item.product.id} className="flex gap-3 p-4">
            <button
              onClick={() => navigate("pdp", { productId: item.product.id })}
              className="w-16 h-20 rounded-xl overflow-hidden bg-[#f5f2ec] flex-shrink-0"
            >
              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover"/>
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate("pdp", { productId: item.product.id })}
                    className="text-left"
                  >
                    <p className="text-[14px] font-bold text-[#0d1912] leading-tight line-clamp-2">{item.product.name}</p>
                    <p className="text-[11px] text-[#5a6860] mt-0.5">{item.product.subtitle}</p>
                  </button>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-[16px] text-[#0d1912]">
                    £{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  {item.product.originalPrice && (
                    <>
                      <p className="text-[11px] line-through text-[#9ca3af]">
                        £{(item.product.originalPrice * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[11px] font-bold text-[#c62b3a]">
                        Saved £{((item.product.originalPrice - item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <Stepper
                  qty={item.quantity} compact
                  onInc={() => setQty(item.product.id, item.quantity + 1)}
                  onDec={() => setQty(item.product.id, item.quantity - 1)}
                />
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-[#c62b3a]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery bar */}
      <div className="mt-3">
        <DeliveryBar subtotal={subtotal} />
      </div>

      {/* Voucher */}
      <div className="mx-4 mt-3 card p-4">
        <button
          onClick={() => setVoucherOpen(!voucherOpen)}
          className="flex items-center gap-2 text-[14px] font-bold text-[#C2185B] w-full"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M16 7v10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="2 2"/>
          </svg>
          Have a voucher or gift certificate?
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            className={`ml-auto transition-transform ${voucherOpen?"rotate-180":""}`}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {voucherOpen && (
          <div className="flex gap-2 mt-3">
            <input
              type="text" value={voucher} onChange={e => setVoucher(e.target.value)}
              placeholder="Enter code"
              className="flex-1 border-2 border-[#e4dfd6] rounded-2xl px-4 py-3 text-[14px] font-semibold outline-none focus:border-[#C2185B] bg-[#f5f2ec]"
            />
            <button className="btn-pill bg-[#C2185B] text-white px-5 py-3 text-[13px] font-bold">
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Order summary */}
      <div className="mx-4 mt-3 mb-4 card p-4">
        <h3 className="font-black text-[16px] text-[#0d1912] mb-3">Order summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-[14px]">
            <span className="text-[#5a6860]">Subtotal</span>
            <span className="font-semibold">£{subtotal.toFixed(2)}</span>
          </div>
          {totalSavings > 0 && (
            <div className="flex justify-between text-[14px]">
              <span className="text-[#5a6860]">Savings</span>
              <span className="font-bold text-[#c62b3a]">−£{totalSavings.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-[14px]">
            <span className="text-[#5a6860]">Delivery</span>
            <span className={`font-semibold ${deliveryCost===0?"text-[#C2185B]":""}`}>
              {deliveryCost===0?"FREE":`£${deliveryCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-[18px] font-black border-t border-[#f0ece6] pt-3 mt-1">
            <span>Total</span>
            <span>£{orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Sticky checkout */}
      <div className="sticky-cta">
        <Btn onClick={() => navigate("checkout-shipping")} full>
          Checkout · £{orderTotal.toFixed(2)}
        </Btn>
        <div className="flex items-center justify-center gap-2 mt-2.5 flex-wrap">
          {["Visa","Mastercard","PayPal","Apple Pay","Google Pay"].map(pm => (
            <div key={pm} className="bg-[#f5f2ec] border border-[#e4dfd6] rounded-lg px-2 py-0.5">
              <span className="text-[9px] font-bold text-[#5a6860]">{pm}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9ca3af" strokeWidth="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-[11px] text-[#9ca3af] font-medium">256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
