import { COMPARE_MODE, MOVE_COMPARE } from './map.actions';

const initialState = {
  compareMode: true,
  compareRatio: 0.5,
  dimensions: {
    width: -1,
    height: -1
  },
  bounds: {
    x1: -180,
    y1: -90,
    x2: 180,
    y2: 90
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case COMPARE_MODE:
      return state;

    case MOVE_COMPARE:
      return { ...state, compareRatio: action.ratio };

    default:
      return state;
  }
};

export default reducer;
