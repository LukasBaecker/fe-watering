export const SET_GARDEN = "SET_GARDEN";

export const setGarden = (garden) => {
  return {
    type: "SET_GARDEN",
    payload: { garden: garden },
  };
};
