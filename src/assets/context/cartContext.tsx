import React, { createContext, useContext, useState } from "react";
import type { CartItem, CartState } from "../types/types";

interface CartContextType {
  cart: CartState;
  addItem: (resID: string, resName: string, item: CartItem) => void;
  removeItem: (menuItemID: string) => void;
  updateQty: (menuItem: string, qty: number) => void;
  clearCart: () => void;
  pendingConflict: { resID: string; resName: string; item: CartItem } | null;
  resolveConflict: (proceed: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const cart_key = "nyamza:cart";

const empty_cart: CartState = {
  items: [],
  restaurantID: null,
  restaurantName: null,
};
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartState>(() => {
    //   check local storage for the cart
    const saved = localStorage.getItem(cart_key);
    //   if there's a cart item in local storage, set the cart to it, else? set the cart item to an empty scaffold
    return saved ? JSON.parse(saved) : empty_cart;
  });

  const [pendingConflict, setPendingConflict] = useState<{
    resID: string;
    resName: string;
    item: CartItem;
  } | null>(null);

  // simple helper to set cart to localstorage
  const persistence = (state: CartState) => {
    localStorage.setItem(cart_key, JSON.stringify(state));
    setCart(state);
    console.log(cart);
  };

  const addItem = (resID: string, res_name: string, item: CartItem) => {
    //if there are no items in the cart
    if (cart.restaurantID === null) {
      persistence({
        restaurantID: resID,
        restaurantName: res_name,
        items: [item],
      });

      return;
    }

    //if it's the same restaurant or an item is incremented
    if (cart.restaurantID === resID) {
      const existingItems = cart.items.find(
        (i) => i.menuItemID === item.menuItemID,
      );

      const items = existingItems
        ? cart.items.map((m) =>
            m.menuItemID === item.menuItemID
              ? { ...m, quantity: m.quantity + 1 }
              : m,
          )
        : [...cart.items, item];

      persistence({ ...cart, items });
    }

    //different restaurant - we have to set a conflict object
    setPendingConflict({ item: item, resID: resID, resName: res_name });
  };

  const removeItem = (menuID: string) => {
    //find every item that's NOT the item we're trying to remove
    const items = cart.items.filter((f) => f.menuItemID !== menuID);
    // return the items :: condition - if there are no other items, set the cart to an empty cart, else return the items(not incl. the one with menuID)
    persistence(items.length === 0 ? empty_cart : { ...cart, items });
  };

  const updateQuantity = (menuItemID: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemID);
      return;
    }

    const items = cart.items.map((i) =>
      i.menuItemID === menuItemID ? { ...i, quantity: quantity } : i,
    );
    persistence({ ...cart, items });
  };

  const clearCart = () => {
    persistence(empty_cart);
  };
  const resolveConflict = (proceed: boolean) => {
    if (proceed && pendingConflict) {
      persistence({
        restaurantID: pendingConflict.resID,
        restaurantName: pendingConflict.resName,
        items: [pendingConflict.item],
      });
    }
    setPendingConflict(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQty: updateQuantity,
        pendingConflict,
        resolveConflict,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error("useCart needs the context provider to work");
  return context;
};
