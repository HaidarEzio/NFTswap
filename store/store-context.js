import { createContext, useReducer } from "react";
export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_MAKER_DATA: "SET_MAKER_DATA",
  SET_TAKER_DATA: "SET_TAKER_DATA",
  SET_TX_HASH: "SET_TX_HASH",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_MAKER_DATA: {
      return { ...state, makerData: action.payload.makerData };
    }
    case ACTION_TYPES.SET_TAKER_DATA: {
      return { ...state, takerData: action.payload.takerData };
    }
    case ACTION_TYPES.SET_TX_HASH: {
      return { ...state, txhash: action.payload.txhash };
    }
    default:
      throw new Error(`Unhandled Action Type: ${action.type}`);
  }
};

const StoreProvider = ({ children }) => {
  const initialState = {
    makerData: "",
    takerData: "",
    txhash: "",
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};
export default StoreProvider;
