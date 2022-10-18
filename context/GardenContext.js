import React, { useState, createContext } from "react";
/**Context to save all relevant garden data of the current user,
 * including the information about the current selected garden
 * and a list of all the gardens the user is member of.
 * should be cleared, when user is logging out
 */
export const GardenContext = createContext();

export const GardenProvider = (props) => {
  const [gardenState, setGardenState] = useState({
    id: "",
    name: "",
    description: "",
    contact: {},
    //plants: {},
    calenders: [],
  });
  return (
    <GardenContext.Provider value={[gardenState, setGardenState]}>
      {props.children}
    </GardenContext.Provider>
  );
};
