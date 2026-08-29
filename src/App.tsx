import React, { useState, useCallback } from "react";
import { CartProvider, useCart } from "./contexts/CartContext";
import { TabBar } from "./components/shared";
import MiniBasket from "./components/MiniBasket";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import PLPScreen from "./screens/PLPScreen";
import PDPScreen from "./screens/PDPScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutShipping from "./screens/CheckoutShipping";
import CheckoutDelivery from "./screens/CheckoutDelivery";
import CheckoutPayment from "./screens/CheckoutPayment";
import OrderConfirmation from "./screens/OrderConfirmation";

type NavEntry = { screen: string; params?: any };

const CHECKOUT_SCREENS = [
  "checkout-shipping",
  "checkout-delivery",
  "checkout-payment",
  "order-confirmation",
];

const defaultShipping = {
  email: "",
  title: "Mr",
  firstName: "",
  lastName: "",
  phone: "",
  postcode: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
};

const defaultDelivery = {
  method: "standard",
  giftMessage: "",
};

function AppContent() {
  const { miniBasketOpen, closeMini, totalItems } = useCart();
  const [history, setHistory] = useState<NavEntry[]>([{ screen: "home" }]);
  const [checkoutData, setCheckoutData] = useState({
    shipping: defaultShipping,
    delivery: defaultDelivery,
  });

  const navigate = useCallback((screen: string, params?: any) => {
    setHistory((h) => [...h, { screen, params }]);
    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  }, []);

  const current = history[history.length - 1];
  const isCheckout = CHECKOUT_SCREENS.includes(current.screen);
  const isConfirmation = current.screen === "order-confirmation";

  const activeTab =
    current.screen === "home"
      ? "home"
      : current.screen === "search"
      ? "search"
      : current.screen === "plp" || current.screen === "pdp"
      ? "plp"
      : "home";

  const handleNavigate = (screen: string, params?: any) => {
    navigate(screen, params);
  };

  return (
    <div className="app-shell">
      {/* Main screen */}
      <div className="flex-1 overflow-hidden">
        {current.screen === "home" && (
          <HomeScreen navigate={navigate} />
        )}
        {current.screen === "search" && (
          <SearchScreen navigate={navigate} goBack={goBack} />
        )}
        {current.screen === "plp" && (
          <PLPScreen navigate={navigate} goBack={goBack} params={current.params} />
        )}
        {(current.screen === "offers") && (
          <PLPScreen navigate={navigate} goBack={goBack} params={{ type: undefined }} />
        )}
        {current.screen === "pdp" && (
          <PDPScreen navigate={navigate} goBack={goBack} params={current.params} />
        )}
        {current.screen === "cart" && (
          <CartScreen navigate={navigate} goBack={goBack} />
        )}
        {current.screen === "checkout-shipping" && (
          <CheckoutShipping
            navigate={navigate}
            goBack={goBack}
            checkoutData={checkoutData}
            setCheckoutData={setCheckoutData}
          />
        )}
        {current.screen === "checkout-delivery" && (
          <CheckoutDelivery
            navigate={navigate}
            goBack={goBack}
            checkoutData={checkoutData}
            setCheckoutData={setCheckoutData}
          />
        )}
        {current.screen === "checkout-payment" && (
          <CheckoutPayment
            navigate={navigate}
            goBack={goBack}
            checkoutData={checkoutData}
            setCheckoutData={setCheckoutData}
          />
        )}
        {current.screen === "order-confirmation" && (
          <OrderConfirmation navigate={navigate} params={current.params} />
        )}
        {/* Account placeholder */}
        {current.screen === "account" && (
          <AccountScreen navigate={navigate} goBack={goBack} />
        )}
      </div>

      {/* Bottom nav (hidden in checkout) */}
      {!isCheckout && (
        <TabBar
          active={activeTab}
          onTab={handleNavigate}
          cartCount={totalItems}
        />
      )}

      {/* Mini basket overlay */}
      {miniBasketOpen && (
        <MiniBasket
          onViewCart={() => { closeMini(); navigate("cart"); }}
          onCheckout={() => { closeMini(); navigate("checkout-shipping"); }}
          onContinue={closeMini}
        />
      )}
    </div>
  );
}

function AccountScreen({ navigate, goBack }: { navigate: (s: string, p?: any) => void; goBack: () => void }) {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = () => {
    if (!email || !password) { setError("Please enter your email and password"); return; }
    setSignedIn(true);
    setError("");
  };

  if (signedIn) {
    return (
      <div className="screen-content bg-white">
        <div className="bg-[#C2185B] px-5 pt-safe-top pb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-black text-2xl">{email[0]?.toUpperCase()}</span>
          </div>
          <p className="text-white font-black text-[20px]">Welcome back!</p>
          <p className="text-white/60 text-[13px] mt-0.5">{email}</p>
        </div>
        <div className="mx-4 -mt-4 card divide-y divide-[#f0ece6] relative z-10 mb-4">
          {["My Orders", "My Details", "Saved Wines", "Delivery Addresses", "Payment Methods", "Subscribe & Save"].map(item => (
            <button key={item} className="w-full flex items-center justify-between px-4 py-4 text-left">
              <span className="font-bold text-[15px] text-[#0d1912]">{item}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          ))}
        </div>
        <div className="mx-4 mb-8">
          <button onClick={() => setSignedIn(false)}
            className="w-full btn-pill border-2 border-[#c62b3a] text-[#c62b3a] font-black py-3.5 text-[14px]">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content bg-white">
      <div className="bg-[#C2185B] px-5 pt-safe-top pb-10">
        <p className="text-white font-black text-[26px] tracking-widest mb-1">LAITHWAITES</p>
        <p className="text-white/60 text-[14px]">Sign in to your account</p>
      </div>
      <div className="mx-4 -mt-5 card p-5 space-y-4 relative z-10 mb-4">
        <div>
          <p className="text-[12px] font-black text-[#5a6860] uppercase tracking-wide mb-1.5">Email address</p>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
            className="w-full border-2 border-[#e4dfd6] rounded-2xl px-4 py-3.5 text-[15px] font-medium outline-none focus:border-[#C2185B] bg-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[12px] font-black text-[#5a6860] uppercase tracking-wide">Password</p>
            <button className="text-[12px] font-bold text-[#C2185B] underline">Forgot password?</button>
          </div>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full border-2 border-[#e4dfd6] rounded-2xl px-4 py-3.5 pr-14 text-[15px] font-medium outline-none focus:border-[#C2185B] bg-white"
            />
            <button onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-[#C2185B]">
              {showPw ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>
        {error && <p className="text-[12px] text-[#c62b3a] font-bold">{error}</p>}
        <button onClick={handleSignIn}
          className="w-full btn-pill bg-[#C2185B] text-white font-black py-4 text-[15px]">
          Sign in
        </button>
        <p className="text-center text-[13px] text-[#5a6860]">
          New to Laithwaites?{" "}
          <button className="font-bold text-[#C2185B] underline">Create account</button>
        </p>
      </div>
      <div className="mx-4 bg-[#C2185B] rounded-2xl p-4 text-center">
        <p className="text-white font-black text-[15px] mb-1">Subscribe &amp; Save 20%</p>
        <p className="text-white/60 text-[12px]">Join thousands of wine lovers saving on every case</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
