/**
 * CartContext.tsx
 * ----------------
 * This file implements global shopping-cart state for the entire app using
 * React's Context API together with the `useReducer` hook.
 *
 * Why useReducer + Context?
 *   - The cart has multiple related actions (add, remove, update, clear) that
 *     can change state in non-trivial ways. A reducer centralizes that logic
 *     in one pure function, making it easy to test and reason about.
 *   - Context lets every deeply-nested component access the cart and dispatch
 *     actions without "prop drilling" (passing props down through every level).
 *
 * Architecture overview:
 *   1. CartAction  -> discriminated union describing every possible action.
 *   2. CartState   -> shape of the cart state (just an array of products).
 *   3. cartReducer -> pure function: (state, action) => newState.
 *   4. CartContext -> the React context object that holds the state + actions.
 *   5. CartProvider-> wraps the app and provides the cart value to children.
 *   6. useCart     -> custom hook that components call to read/update the cart.
 */

// Import React primitives needed for Context + Reducer pattern.
//   createContext -> creates the context object.
//   useContext    -> reads the context value inside a component.
//   useReducer    -> manages state via a reducer function (alternative to useState).
//   ReactNode     -> TypeScript type for any valid JSX child.
import { createContext, useContext, useReducer, type ReactNode } from "react";
// Import the Product type so the cart knows the shape of items it stores.
import type { Product } from "../Pages/Products/Products";

// --- Action Types ---
// A "discriminated union" — each action is an object with a unique `type`
// string plus any extra fields that action needs. TypeScript uses `type` to
// narrow the union inside the reducer's switch statement, giving us type-safe
// access to `action.product`, `action.quantity`, etc.
type CartAction =
  | { type: "ADD_TO_CART"; product: Product } // add one unit of a product
  | { type: "REMOVE_FROM_CART"; product: Product } // remove one unit (or the item)
  | { type: "UPDATE_QUANTITY"; product: Product; quantity: number } // set an absolute quantity
  | { type: "CLEAR_CART" }; // empty the entire cart

// -- State Type ---
// The entire cart state is just a list of products. Each Product carries its
// own `productCount` field indicating how many units are in the cart.
type CartState = {
  cartItems: Product[];
};

// --- Initial State ---
// The cart starts empty. This object is also reused by CLEAR_CART to reset.
const initialState: CartState = {
  cartItems: [],
};

// --- Reducer ---
// A reducer is a PURE function: given the current state and an action, it
// returns the NEXT state without mutating the original. This makes state
// changes predictable and traceable. React re-renders only when a new state
// object is returned (reference inequality).
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product } = action;
      // Check whether the product is already in the cart (by id).
      const existingIndex = state.cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex !== -1) {
        // Update quantity of existing item
        // Product found -> increment its productCount by 1.
        // We use .map() to create a NEW array (immutability) and only update
        // the matching index, leaving every other item untouched.
        return {
          ...state,
          cartItems: state.cartItems.map((item, index) =>
            index === existingIndex
              ? { ...item, productCount: item.productCount + 1 }
              : item
          ),
        };
      }

      // Add new item with quantity 1
      // Product not in cart -> append a copy of it with productCount set to 1.
      return {
        ...state,
        cartItems: [...state.cartItems, { ...product, productCount: 1 }],
      };
    }

    case "REMOVE_FROM_CART": {
      const { product } = action;
      // Locate the product in the cart.
      const existingIndex = state.cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex !== -1) {
        const existingItem = state.cartItems[existingIndex];
        if (existingItem.productCount > 1) {
          // Decrease quantity
          // More than one unit -> just decrement the count by 1.
          return {
            ...state,
            cartItems: state.cartItems.map((item, index) =>
              index === existingIndex
                ? { ...item, productCount: item.productCount - 1 }
                : item
            ),
          };
        }

        // Remove item from cart
        // Only one unit left -> remove the product entirely using filter,
        // which returns a new array excluding the matching id.
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (item) => item.id !== product.id
          ),
        };
      }
      // Product wasn't in the cart -> nothing to do, return state unchanged.
      return state;
    }

    case "UPDATE_QUANTITY": {
      const { product, quantity } = action;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        // Setting quantity to 0 (or negative) is treated as "remove the item".
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (item) => item.id !== product.id
          ),
        };
      }

      // Set the product's count to the exact `quantity` value provided.
      // This is used when the user types a specific number in the cart UI.
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === product.id
            ? { ...item, productCount: quantity }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      // Reset the cart back to its initial empty state.
      return initialState;

    default:
      // Unknown action type -> return state unchanged (safety net).
      return state;
  }
}

// --- Context ---
// This type describes the VALUE that the context will expose to consumers.
// It includes the current cart items plus four action functions that
// components can call to mutate the cart.
type CartContextType = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  updateQuantity: (product: Product, quantity: number) => void;
  clearCart: () => void;
};

// Create the context object. The type is `CartContextType | undefined` so
// that we can detect when a component uses the context WITHOUT a provider
// (the default value is `undefined`).
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provider ---
// The Provider component wraps the part of the app that needs cart access
// (typically near the root, e.g., in main.tsx). Any descendant component can
// then call `useCart()` to read or update the cart.
export function CartProvider({ children }: { children: ReactNode }) {
  // useReducer returns [currentState, dispatch]. We pass our `cartReducer`
  // and `initialState`. `dispatch` is used to send actions to the reducer.
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // These wrapper functions give consumers a clean, simple API. Instead of
  // forcing components to construct action objects manually, they just call
  // e.g. `addToCart(product)` and the wrapper builds + dispatches the action.
  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", product });
  };

  const removeFromCart = (product: Product) => {
    dispatch({ type: "REMOVE_FROM_CART", product });
  };

  const updateQuantity = (product: Product, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", product, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // The Provider's `value` prop is what useContext returns to consumers.
  // We expose the current cart items plus the four action functions.
  // `children` lets any nested components access this value.
  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// --- Custom Hook ---
// `useCart` is the single entry point components use to access the cart.
// It calls useContext internally and adds a runtime guard: if the context
// is `undefined`, it means the component is NOT inside a <CartProvider>,
// so we throw a clear error instead of silently returning undefined.
// This pattern (context + custom hook with a guard) is a React best practice.
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
