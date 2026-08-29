import React, { createContext, useContext, useReducer } from "react";
import { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  miniBasketOpen: boolean;
  lastAdded: Product | null;
}

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; productId: string }
  | { type: "SET_QTY"; productId: string; qty: number }
  | { type: "OPEN_MINI" }
  | { type: "CLOSE_MINI" }
  | { type: "CLEAR" };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      const items = existing
        ? state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { product: action.product, quantity: 1 }];
      return { ...state, items, miniBasketOpen: true, lastAdded: action.product };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case "SET_QTY":
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.qty } : i
        ),
      };
    case "OPEN_MINI":
      return { ...state, miniBasketOpen: true };
    case "CLOSE_MINI":
      return { ...state, miniBasketOpen: false };
    case "CLEAR":
      return { items: [], miniBasketOpen: false, lastAdded: null };
    default:
      return state;
  }
}

interface CartCtx {
  items: CartItem[];
  miniBasketOpen: boolean;
  lastAdded: Product | null;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  openMini: () => void;
  closeMini: () => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalSavings: number;
  deliveryCost: number;
  orderTotal: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    miniBasketOpen: false,
    lastAdded: null,
  });

  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalSavings = state.items.reduce((s, i) => {
    const saving = i.product.originalPrice
      ? (i.product.originalPrice - i.product.price) * i.quantity
      : 0;
    return s + saving;
  }, 0);
  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const deliveryCost = subtotal >= 150 ? 0 : subtotal > 0 ? 7.99 : 0;
  const orderTotal = subtotal + deliveryCost;

  return (
    <Ctx.Provider
      value={{
        items: state.items,
        miniBasketOpen: state.miniBasketOpen,
        lastAdded: state.lastAdded,
        addToCart: (p) => dispatch({ type: "ADD", product: p }),
        removeFromCart: (id) => dispatch({ type: "REMOVE", productId: id }),
        setQty: (id, qty) => dispatch({ type: "SET_QTY", productId: id, qty }),
        openMini: () => dispatch({ type: "OPEN_MINI" }),
        closeMini: () => dispatch({ type: "CLOSE_MINI" }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        totalItems,
        subtotal,
        totalSavings,
        deliveryCost,
        orderTotal,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be within CartProvider");
  return ctx;
}
