import { ProForm, ProFormText } from "@ant-design/pro-components";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import fetcher from "../../fetcher";
import { AuthContext } from "../../contexts/AuthContext";

export default function TagAdd() {
  const navigate = useNavigate();
  const { getAuth } = useContext(AuthContext);

  const sumbitHandler = async (values) => {
    const { data: res } = await fetcher.post("/tag", values, {
      headers: {
        Authorization: `Bearer ${getAuth().token}`,
      },
    });
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
