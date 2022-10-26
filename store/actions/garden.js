export const SET_GARDEN = "SET_GARDEN";

export const setGarden = (garden) => {
  return {
    type: "SET_GARDEN",
    payload: { garden: garden },
  };
};
export const setJoinReq = (joinReqs) => {
  return {
    type: "SET_JOINREQ",
    payload: { joinReqs: joinReqs },
  };
};
