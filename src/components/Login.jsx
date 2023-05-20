import { LoginForm, ProCard, ProFormText } from "@ant-design/pro-components";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import fetcher from "../fetcher";
import { Form, message } from "antd";
// import { Turnstile } from "@marsidev/react-turnstile";

export default function Login() {
  const { setAuth } = useContext(AuthContext);
  const [captchaResponse, setCaptchaResponse] = useState("");
  const captchaRef = useRef();
  const loginHandler = async (values) => {
    if (!captchaResponse) {
      message.error("请完成人机验证");
      return;
    }
    const { data } = await fetcher.post("/../auth/admin/login", {
      ...values,
      response: captchaResponse,
    });
    console.log(data);
    setCaptchaResponse("");
    captchaRef.current.resetCaptcha();
    // setAuth({ auth: "fff" });
  };
  return (
    <>
      <ProCard>
        <LoginForm title="AXUM.RS" subTitle="xxx" onFinish={loginHandler}>
          <ProFormText
            name="username"
            fieldProps={{ size: "large", prefix: <UserOutlined /> }}
            placeholder="输入你的用户名"
            rules={[
              { required: true, message: "请输入用户名" },
              { max: 50, message: "用户名过长" },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: "large", prefix: <LockOutlined /> }}
            placeholder="输入你的密码"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码过短" },
            ]}
          />
          <Form.Item style={{ marginBottom: "1.5rem" }}>
            <HCaptcha
              sitekey={`${import.meta.env.VITE_HCAPTCHA_SITEKEY}`}
              onVerify={(token, ekey) => {
                setCaptchaResponse(token);
              }}
              ref={captchaRef}
            />
          </Form.Item>
        </LoginForm>
      </ProCard>
    </>
  );
}
