import { LoginForm, ProCard, ProFormText } from "@ant-design/pro-components";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { setAuth } = useContext(AuthContext);
  const loginHandler = () => {
    setAuth({ auth: "fff" });
  };
  return (
    <>
      <ProCard>
        <LoginForm title="AXUM.RS" subTitle="xxx" onFinish={loginHandler}>
          <ProFormText
            name="username"
            fieldProps={{ size: "large", prefix: <UserOutlined /> }}
            placeholder="输入你的用户名"
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: "large", prefix: <LockOutlined /> }}
            placeholder="输入你的密码"
          />
        </LoginForm>
      </ProCard>
    </>
  );
}
