import { message } from "antd";
import axios from "axios";

const fetcher = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/admin`,
  timeout: import.meta.env.VITE_FETCHER_TIMEOUT,
});

fetcher.defaults.headers.common["Content-Type"] =
  "application/json;charset=utf-8";
fetcher.defaults.headers.common["X-Product"] = "axum.rs";

fetcher.interceptors.response.use(
  (res) => {
    const { data } = res;
    if (data.code !== 0) {
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
