import { message } from "antd";
import axios from "axios";

const fetcher = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/admin`,
  timeout: import.meta.env.VITE_FETCHER_TIMEOUT,
});

fetcher.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";
fetcher.defaults.headers.common["X-Product"] = "axum.rs";

// const authStr = window.localStorage.getItem("auth");

// if (authStr) {
//   const auth = JSON.parse(authStr);
//   const { token, token_type } = auth;
//   fetcher.defaults.headers.common["Authorization"] = `${token_type} ${token}`;
// }

fetcher.interceptors.response.use(
  (res) => {
    const { data } = res;
    if (data.code !== 0) {
      if (data.code === 9527) {
        message.error(`鉴权失败，请重新登录：${data.msg}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return;
      }
      message.error(data.msg);
    }
    return res;
  },
  (err) => {
    message.error("请求失败，请检查你的网络");
    console.log(err);
    return Promise.reject(err);
  }
);

export default fetcher;
