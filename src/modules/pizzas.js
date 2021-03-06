import {
  pizzaSize,
  crustType,
  pizzaStyle,
  extraToppings,
  convertToDisplayValue,
} from "../data/pizzaConstants";

// Action type constants
const CHOOSE_OPTION = "CHOOSE_OPTION";
const RESET_BUILDER = "RESET_BUILDER";
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_PIZZA = "REMOVE_PIZZA";
const EDIT_PIZZA = "EDIT_PIZZA";
const DUPLICATE_PIZZA = "DUPLICATE_PIZZA";
const SET_SHOW_LOADER = "SET_SHOW_LOADER";
const HIDE_HOME_MODAL = "HIDE_HOME_MODAL";
const RESET_DEMO = "RESET_DEMO";
const SET_SHOW_LEAVE_BUILDER_MODAL = "SET_SHOW_LEAVE_BUILDER_MODAL";

// Action creators

const chooseOption = (category, id) => {
  return {
    type: CHOOSE_OPTION,
    category: category,
    id,
  };
};

const resetBuilder = () => {
  return {
    type: RESET_BUILDER,
  };
};

const addToCart = (id) => {
  return {
    type: ADD_TO_CART,
    id: id,
  };
};

const removePizza = (id) => {
  return {
    type: REMOVE_PIZZA,
    id,
  };
};

const editPizza = (id) => {
  return {
    type: EDIT_PIZZA,
    id,
  };
};

const duplicatePizza = (id) => {
  return {
    type: DUPLICATE_PIZZA,
    id,
  };
};

const setShowLoader = (boolean) => {
  return {
    type: SET_SHOW_LOADER,
    show: boolean,
  };
};

const hideHomeModal = () => {
  return {
    type: HIDE_HOME_MODAL,
  };
};

const resetDemo = () => {
  return {
    type: RESET_DEMO,
  };
};

const setShowLeaveBuilderModal = (boolean, path = "") => {
  return {
    type: SET_SHOW_LEAVE_BUILDER_MODAL,
    show: boolean,
    path,
  };
};

// initialState;

const initialState = {
  pizzaOptions: [...pizzaSize, ...crustType, ...pizzaStyle, ...extraToppings],
  mdSizeSelected: true,
  subtotalItems: [],
  cart: [],
  cartTotal: 0,
  displayCartTotal: "",
  showLoader: false,
  showHomeModal: true,
  showLeaveBuilder: false,
  afterLeaveBuilderPath: "",
};

// const initialState = {
//   pizzaOptions: [...pizzaSize, ...crustType, ...pizzaStyle, ...extraToppings],
//   mdSizeSelected: true,
//   subtotalItems: [],
//   cart: [
//     {
//       cartId: 1,
//       mdSizeSelected: false,
//       pizzaOptions: [
//         {
//           id: 2,
//           category: "Size",
//           name: "Large (16-inch)",
//           img: null,
//           type: null,
//           value1: 100,
//           value2: 100,
//           displayValue1: "$100",
//           displayValue2: "$100",
//           active: false,
//         },
//         {
//           id: 3,
//           category: "Crust",
//           name: "Regular",
//           img: null,
//           type: null,
//           value1: 100,
//           value2: 100,
//           displayValue1: "$100",
//           displayValue2: "$100",
//           active: false,
//         },
//         {
//           id: 8,
//           category: "Style",
//           name: "Basil & Ricotta",
//           img: "ricotta-basil.jpeg",
//           type: "veg",
//           value1: 100,
//           value2: 100,
//           displayValue1: "$100",
//           displayValue2: "$100",
//           active: false,
//         },
//         {
//           id: 25,
//           category: "Extra Topping",
//           name: "Cranberry",
//           img: null,
//           type: null,
//           value1: 100,
//           value2: 100,
//           displayValue1: "$100",
//           displayValue2: "$100",
//           active: false,
//         },
//         {
//           id: 27,
//           category: "Extra Topping",
//           name: "Fresh Pineapple",
//           img: null,
//           type: null,
//           value1: 100,
//           value2: 100,
//           displayValue1: "$100",
//           displayValue2: "$100",
//           active: false,
//         },
//       ],
//     },
//   ],
//   cartTotal: 400,
//   displayCartTotal: "$400.00",
//   showLoader: false,
//   showHomeModal: true,
//   showLeaveBuilder: false,
//   afterLeaveBuilderPath: "",
// };

// misc functions

const setSelection = (pizzaOptions, category, id) => {
  const newArray = pizzaOptions.concat();
  if (category === "Extra Topping") {
    newArray.forEach((item) => {
      if (item.id === id) {
        item.active = !item.active;
      }
    });
  } else {
    newArray.forEach((item) => {
      if (item.category === category) {
        if (item.id === id) {
          item["active"] = true;
        } else {
          item["active"] = false;
        }
      }
    });
  }
  return newArray;
};

const addToSubtotal = (newPizzaOptionsState) => {
  const newSubtotalItems = newPizzaOptionsState.filter((item) => {
    return item.active === true;
  });

  return newSubtotalItems;
};

const changeSizeSelection = (id) => {
  let mdSizeSelected = true;
  if (id === 2) {
    mdSizeSelected = false;
  }
  return mdSizeSelected;
};

const sumCartTotal = (cart) => {
  let newCartTotal = 0;
  cart.forEach((cartItem) => {
    cartItem.pizzaOptions.forEach((option) => {
      if (cartItem.mdSizeSelected) {
        newCartTotal += option.value1;
      } else {
        newCartTotal += option.value2;
      }
    });
  });
  return newCartTotal;
};

// reducer

const pizzas = (state = initialState, action) => {
  switch (action.type) {
    case CHOOSE_OPTION:
      const newPizzaOptionsState = setSelection(
        state.pizzaOptions,
        action.category,
        action.id
      );
      const newSubtotalItems = addToSubtotal(newPizzaOptionsState);

      if (action.category === "Size") {
        const newMdSizeSelected = changeSizeSelection(action.id);
        return {
          ...state,
          pizzaOptions: newPizzaOptionsState,
          subtotalItems: newSubtotalItems,
          mdSizeSelected: newMdSizeSelected,
        };
      }

      return {
        ...state,
        pizzaOptions: newPizzaOptionsState,
        subtotalItems: newSubtotalItems,
      };
    case RESET_BUILDER:
      const resetPizzaOptions = state.pizzaOptions.concat();
      resetPizzaOptions.forEach((option) => {
        option.active = false;
      });
      const resetSubtotalItems = [];
      return {
        ...state,
        pizzaOptions: resetPizzaOptions,
        subtotalItems: resetSubtotalItems,
      };
    case ADD_TO_CART:
      const editFlow = Boolean(action.id);
      let newCartId;
      if (editFlow) {
        newCartId = action.id;
      } else {
        if (state.cart.length === 0) {
          newCartId = 1;
        } else {
          newCartId = state.cart[state.cart.length - 1].cartId + 1;
        }
      }
      const newCartItem = {
        cartId: newCartId,
        mdSizeSelected: state.mdSizeSelected,
        pizzaOptions: state.subtotalItems,
      };
      const newCart = editFlow
        ? state.cart
            .filter((pizza) => pizza.cartId !== action.id)
            .concat(newCartItem)
        : state.cart.concat(newCartItem);
      const newSortedCart = newCart.sort((a, b) => a.cartId - b.cartId);
      const newCartTotal = sumCartTotal(newSortedCart);
      return {
        ...state,
        cart: newSortedCart,
        cartTotal: newCartTotal,
        displayCartTotal: convertToDisplayValue(newCartTotal),
      };
    case REMOVE_PIZZA:
      const newCartRemovePizza = state.cart.filter(
        (pizza) => pizza.cartId !== action.id
      );
      const newCartTotalRemovePizza = sumCartTotal(newCartRemovePizza);
      return {
        ...state,
        cart: newCartRemovePizza,
        cartTotal: newCartTotalRemovePizza,
        displayCartTotal: convertToDisplayValue(newCartTotalRemovePizza),
      };
    case EDIT_PIZZA:
      const pizzaToEdit = state.cart.filter(
        (pizza) => pizza.cartId === action.id
      )[0];
      const editSubtotalItems = pizzaToEdit.pizzaOptions;
      const editPizzaOptions = state.pizzaOptions.concat();
      editPizzaOptions.forEach((option) => {
        if (editSubtotalItems.includes(option)) {
          option.active = true;
        } else {
          option.active = false;
        }
      });
      const editMdSizeSelected = pizzaToEdit.mdSizeSelected;
      return {
        ...state,
        subtotalItems: editSubtotalItems,
        pizzaOptions: editPizzaOptions,
        mdSizeSelected: editMdSizeSelected,
      };
    case DUPLICATE_PIZZA:
      const pizzaToDuplicate = {
        ...state.cart.filter((pizza) => pizza.cartId === action.id)[0],
      };
      const newCartIdForDuplicate =
        state.cart[state.cart.length - 1].cartId + 1;
      pizzaToDuplicate.cartId = newCartIdForDuplicate;
      const newCartAfterDuplicate = state.cart.concat(pizzaToDuplicate);
      const newCartTotalAfterDuplicate = sumCartTotal(newCartAfterDuplicate);
      return {
        ...state,
        cart: newCartAfterDuplicate,
        cartTotal: newCartTotalAfterDuplicate,
        displayCartTotal: convertToDisplayValue(newCartTotalAfterDuplicate),
      };
    case SET_SHOW_LOADER:
      const newShowLoader = action.show;
      return { ...state, showLoader: newShowLoader };
    case HIDE_HOME_MODAL:
      return { ...state, showHomeModal: false };
    case RESET_DEMO:
      return { ...initialState, showHomeModal: false };
    case SET_SHOW_LEAVE_BUILDER_MODAL:
      const show = action.show;
      const path = action.path;
      return {
        ...state,
        showLeaveBuilder: show,
        afterLeaveBuilderPath: path,
      };
    default:
      return state;
  }
};

// Export statement

export {
  pizzas,
  chooseOption,
  resetBuilder,
  addToCart,
  removePizza,
  editPizza,
  duplicatePizza,
  setShowLoader,
  hideHomeModal,
  resetDemo,
  setShowLeaveBuilderModal,
};
