// import { useReducer } from "react";
import { Type } from "./action.type";

export const initialState = {
  basket: [],
  user: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    //   add items
    case Type.ADD_TO_BASKET: {
      // use find property and check existing item //   }
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );

      if (!existingItem) {
        return {
          ...state,
          basket: [...state.basket, { ...action.item, amount: 1 }],
        };
      } else {
        const updatedBasket = state.basket.map((item) => {
          return item.id === action.item.id
            ? { ...item, amount: item.amount + 1 }
            : item;
        });

        return {
          ...state,
          basket: updatedBasket,
        };
      }
    }

    // remove items
    case Type.REMOVE_FROM_BASKET: {
      const index = state.basket.findIndex((item) => item.id === action.id);
      let newBasket = [...state.basket];
      if (index >= 0) {
        if (newBasket[index].amount > 1) {
          newBasket[index] = {
            ...newBasket[index],
            amount: newBasket[index].amount - 1,
          };
        } else {
          newBasket.splice(index, 1);
        }
      }
      return {
        ...state,
        basket: newBasket,
      };
    }
    // it can also use this one
    // case Type.REMOVE_FROM_BASKET: {
    //   const updatedBasket = state.basket
    //     .map((item) => {
    //       if (item.id === action.id) {
    //         return {
    //           ...item,
    //           amount: item.amount - 1,
    //         };
    //       }
    //       return item;
    //     })
    //     .filter((item) => item.amount > 0);

    //   return {
    //     ...state,
    //     basket: updatedBasket,
    //   };
    // }

    default:
      return state;
  }
};

/* const [state , dispatch] = useReducer(reducer, initalState) */
