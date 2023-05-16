import { ProForm, ProFormText } from "@ant-design/pro-components";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetcher from "../../fetcher";

export default function TagEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const sumbitHandler = async (values) => {
    const { data: res } = await fetcher.put("/tag", {
      ...values,
      id: parseInt(id, 10),
    });
    if (res.code == 0) {
      navigate("/tag/list");
    }
  };
  const findTag = async () => {
    const { data: res } = await fetcher.get(`/tag/${id}`);
    const { data } = res;
    return data;
  };
  return (
    <>
      <ProForm onFinish={sumbitHandler} request={findTag}>
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
