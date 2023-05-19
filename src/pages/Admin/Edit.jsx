import { ProForm, ProFormText } from "@ant-design/pro-components";
import React from "react";
import fetcher from "../../fetcher";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sumbitHandler = async (values) => {
    const { data: res } = await fetcher.put("/admin", {
      ...values,
      id: parseInt(id, 10),
    });
    if (res.code == 0) {
      navigate("/admin/list");
    }
  };
  const findAdmin = async () => {
    const { data: res } = await fetcher.get(`/admin/${id}`);
    const { data } = res;
    return { ...data, password: "" };
  };
  return (
    <>
      <ProForm onFinish={sumbitHandler} request={findAdmin}>
        <ProFormText
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          rules={[
            { required: true, message: "请输入用户名" },
            { max: 50, message: "标签名称超过长度" },
          ]}
        />
        <ProFormText.Password
          name="password"
          label="密码"
          placeholder="请输入密码"
          rules={[{ min: 6, message: "密码至少需要6个字符" }]}
        />
      </ProForm>
    </>
  );
}
