import React from "react";
import { useCart } from "../contexts/CartContext";
import { Btn, Stepper, DeliveryBar } from "./shared";

interface Props {
  onViewCart: () => void;
  onCheckout: () => void;
  onContinue: () => void;
}

export default function MiniBasket({ onViewCart, onCheckout, onContinue }: Props) {
  const { items, lastAdded, closeMini, setQty, subtotal, deliveryCost, orderTotal, totalItems } = useCart();

  return (
    <>
      <div className="sheet-overlay" onClick={closeMini} />
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] sheet z-50 slide-up flex flex-col"
        style={{ maxHeight: "86dvh" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#e4dfd6]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0ece6] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-black text-[16px] text-[#0d1912] leading-none">Added to basket</p>
              {lastAdded && (
                <p className="text-[11px] text-[#5a6860] mt-0.5 max-w-[200px] truncate">{lastAdded.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={closeMini}
            className="w-8 h-8 rounded-full bg-[#f5f2ec] flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#5a6860" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.map(item => (
            <div key={item.product.id} className="flex items-center gap-3 py-3 border-b border-[#f0ece6] last:border-0">
              <div className="w-14 h-18 rounded-xl overflow-hidden bg-[#f5f2ec] flex-shrink-0" style={{ height: 72 }}>
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#0d1912] leading-tight line-clamp-1">{item.product.name}</p>
                <p className="text-[11px] text-[#5a6860]">{item.product.subtitle}</p>
                <div className="mt-2">
                  <Stepper
                    qty={item.quantity} compact
                    onInc={() => setQty(item.product.id, item.quantity + 1)}
                    onDec={() => setQty(item.product.id, item.quantity - 1)}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-[15px] text-[#0d1912]">
                  £{(item.product.price * item.quantity).toFixed(2)}
                </p>
                {item.product.originalPrice && (
                  <p className="text-[10px] text-[#c62b3a] font-bold">
                    Saved £{((item.product.originalPrice - item.product.price) * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary + CTAs */}
        <div className="flex-shrink-0 border-t border-[#f0ece6] pt-3">
          <DeliveryBar subtotal={subtotal} />
          <div className="px-5 mb-3 space-y-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5a6860]">Subtotal ({totalItems} {totalItems===1?"item":"items"})</span>
              <span className="font-bold">£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5a6860]">Delivery</span>
              <span className={`font-bold ${deliveryCost===0?"text-[#C2185B]":""}`}>
                {deliveryCost===0?"FREE":`£${deliveryCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-[16px] font-black border-t border-[#f0ece6] pt-2">
              <span>Total</span>
              <span>£{orderTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="px-5 pb-safe space-y-2.5 pb-4">
            <Btn onClick={onCheckout} full>
              Checkout ({totalItems} {totalItems===1?"item":"items"})
            </Btn>
            <Btn onClick={onViewCart} full outline>
              View basket
            </Btn>
            <button onClick={onContinue} className="w-full text-center text-[13px] font-bold text-[#5a6860] py-1">
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
