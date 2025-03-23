const initialState = {
    coData: [],
  };
  
  const coReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_CO_DATA":
        return { ...state, coData: action.payload };
      default:
        return state;
    }
  };
  
  export default coReducer;
  