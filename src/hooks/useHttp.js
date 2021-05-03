import axios from "axios";
import { useReducer, useCallback } from "react";

const BASE_URL = "https://cat-or-not-2d93d-default-rtdb.firebaseio.com";

const api = {
  postPhotos: "POSTPHOTOS",
  patchPhotos: "PATCHPHOTOS",
};

const getRequestFunction = apiType => {
  switch (apiType) {
    case api.postPhotos:
      async function postPhoto(photo) {
        const requestConfig = {
          method: "post",
          url: `${BASE_URL}/photos.json`,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            photo: photo,
          },
        };
        const response = await axios.request(requestConfig);
        if (response.statusText !== "OK") {
          throw new Error(response.statusText || "Could not validate photo.");
        }
        return null;
      }
      return postPhoto;
      break;
    case api.patchPhotos:
      async function patchPhotos(photos) {
        const requestConfig = {
          method: "patch",
          url: `${BASE_URL}/photos.json`,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            photo: photos,
          },
        };
        const response = await axios.request(requestConfig);
        if (response.statusText !== "OK") {
          throw new Error(response.statusText || "Could not validate photo.");
        }
        return null;
      }
      return patchPhotos;
      break;
  }
};

export const patchPhotos = getRequestFunction(api.patchPhotos);
export const postPhoto = getRequestFunction(api.postPhotos);

const actionTypes = {
  send: "SEND",
  success: "SUCCESS",
  error: "ERROR",
};
const httpReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.send:
      return {
        data: null,
        error: null,
        status: "pending",
      };
      break;
    case actionTypes.success:
      return {
        data: action.responseData,
        error: null,
        status: "completed",
      };
      break;
    case actionTypes.error:
      return {
        data: null,
        error: action.errorMessage,
        status: "completed",
      };
      break;
    default:
      return state;
      break;
  }
};

function useHttp(requestfunction, startWithPending = false) {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? "pending" : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async requestData => {
      dispatch({ type: actionTypes.send });
      try {
        const responseData = await requestfunction(requestData);
        dispatch({ type: actionTypes.success, responseData });
      } catch (error) {
        if (error.response) {
          dispatch({
            type: actionTypes.error,
            errorMessage:
              (error.response.headers, error.response.data) ||
              "Something went wrong!",
          });
        } else if (error.request) {
          dispatch({
            type: actionTypes.error,
            errorMessage: error.request || "Something went wrong!",
          });
        } else {
          dispatch({
            type: actionTypes.error,
            errorMessage: error.message || "Something went wrong!",
          });
        }
      }
    },
    [requestfunction]
  );
  return {
    sendRequest,
    ...httpState,
  };
}

export default useHttp;
