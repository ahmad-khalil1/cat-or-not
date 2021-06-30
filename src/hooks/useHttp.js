import axios from "axios";
import { useReducer, useCallback } from "react";

/// API base URL
const BASE_URL = "https://cat-or-not-2d93d-default-rtdb.firebaseio.com";

/// API Methods
export const postPhoto = async photo => {
  let formData = new FormData();
  formData.append("photo", photo, photo.file.name);

  // prepare request Configeration
  const requestConfig = {
    method: "post",
    url: `${BASE_URL}/photos`,
    headers: {
      "content-type": "multipart/form-data",
      "": "",
    },
    data: {
      formData,
    },
  };
  const response = await axios.request(requestConfig);
  console.log(response);
  if (response.statusText !== "OK") {
    throw new Error(response.statusText || "Could not validate photo.");
  }
  return null;
};

//define action types as enum to eliminate typos
const actionTypes = {
  send: "SEND",
  success: "SUCCESS",
  error: "ERROR",
};
//test
//test
//test3

// reducer method
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

function useHttp(requestfn, startWithPending = false) {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? "pending" : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async requestData => {
      dispatch({ type: actionTypes.send });
      try {
        const responseData = await postPhoto(requestData);
        console.log(responseData);
        dispatch({ type: actionTypes.success, responseData });
      } catch (error) {
        // hamdling errors Types
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
    [requestfn]
  );
  return {
    sendRequest,
    ...httpState,
  };
}

export default useHttp;
