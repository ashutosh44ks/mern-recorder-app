import axios from "axios";
import jwt_decode from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:3001/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshToken = async () => {
  const refreshToken = JSON.parse(localStorage.getItem("mern-record-user")).refreshToken;
  try {
    const { data } = await axios.post(
      `http://localhost:3001/api/auth/refresh_token`,
      {
        token: refreshToken,
      }
    );
    localStorage.setItem("mern-record-user", JSON.stringify(data));
  } catch (e) {
    console.log(e);
    localStorage.removeItem("mern-record-user");
  }
};

api.interceptors.request.use(
  async function (config) {
    if (!localStorage.getItem("mern-record-user")) return config;
    const { exp } = jwt_decode(
      JSON.parse(localStorage.getItem("mern-record-user")).accessToken
    );
    if (exp < Date.now() / 1000) await refreshToken();
    Object.assign(config.headers, {
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("mern-record-user")).accessToken,
    });
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
