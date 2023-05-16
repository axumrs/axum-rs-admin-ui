import { ProForm, ProFormText } from "@ant-design/pro-components";
import React from "react";
import { useNavigate } from "react-router-dom";
import fetcher from "../../fetcher";

export default function TagAdd() {
  const navigate = useNavigate();
  const sumbitHandler = async (values) => {
    const { data: res } = await fetcher.post("/tag", values);
    if (res.code == 0) {
      navigate("/tag/list");
    }
  };
  return (
    <>
      <ProForm onFinish={sumbitHandler}>
        <ProFormText
          name="name"
          label="标签名称"
          placeholder="请输入标签名称"
          rules={[
            { required: true, message: "请输入标签名称" },
            { max: 100, message: "标签名称超过长度" },
          ]}
        />
      </ProForm>
    </>
  );
}
