import { createContext, useReducer } from "react";
export const Store = createContext();

const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
  userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM":
      //add to cart
      const newItem = action.payload;
      //newItem with quantity 2
      // console.log('newItem = ' + JSON.stringify(newItem));
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      //existItem with quantity 1
      // console.log('existItem = ' + JSON.stringify(existItem));
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      // console.log('cartItems = ' + JSON.stringify(cartItems));
      //cartItems with quantity
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "USER_SIGNIN": {
      return {...state, userInfo: action.payload}
    }
    case "USER_SIGNOUT": {
      return {...state, userInfo: null}
    }
    default:
      return state;
  }
};

export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log(state);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
};
