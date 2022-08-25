import React, { createContext, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import * as SecureStore from "expo-secure-store";

export const AxiosContext = createContext();

export const AxiosProvider = (props) => {
  const [authState, setAuthState] = useContext(AuthContext);
  const authAxios = axios.create({
    baseURL: "http://172.30.235.197:8000/api/v1",
  });

  const publicAxios = axios.create({
    baseURL: "http://172.30.235.197:8000/api/v1",
  });

  authAxios.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authState.accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = (failedRequest) => {
    const data = {
      refreshToken: authState.refreshToken,
    };

    const options = {
      method: "POST",
      data,
      url: "http://172.30.235.197:8000/api/v1/user/refreshToken",
    };

    return axios(options)
      .then(async (tokenRefreshResponse) => {
        failedRequest.response.config.headers.Authorization =
          "Bearer " + tokenRefreshResponse.data.accessToken;
        setAuthState({
          ...authState,
          accessToken: tokenRefreshResponse.data.accessToken,
        });

        await SecureStore.setItemAsync(
          "tokens",
          JSON.stringify({
            accessToken: tokenRefreshResponse.data.accessToken,
            refreshToken: authState.refreshToken,
          })
        );
        return Promise.resolve();
      })
      .catch((e) => {
        setAuthState({
          accessToken: "",
          refreshToken: "",
          authenticated: false,
        });
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

  return (
    <AxiosContext.Provider value={{ authAxios, publicAxios }}>
      {props.children}
    </AxiosContext.Provider>
  );
};
