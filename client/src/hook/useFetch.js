import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const useMakeRequest = () => {
  const { currentUser } = useContext(AuthContext);
  const makeRequest = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
    },
  });

  return makeRequest;
};
export default useMakeRequest;
