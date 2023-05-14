import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";

import React from "react";
import fetcher from "../../fetcher";
import { useNavigate } from "react-router-dom";

export default function SubjectAdd() {
  const navigate = useNavigate();
  const sumbitHandler = async (values) => {
    const res = await (await fetcher.post("/subject", values)).data;
    if (res.code == 0) {
      navigate("/subject/list");
    }
  };
  return (
    <ProForm
      initialValues={{ price: 0, cover: "", status: "Writing" }}
      onFinish={sumbitHandler}
    >
      <ProFormText
        name="name"
        label="专题名称"
        placeholder="请输入专题名称"
        rules={[
          { required: true, message: "请输入专题名称" },
          { max: 100, message: "专题名称超过长度" },
        ]}
      />
      <ProFormText
        name="slug"
        label="专题slug"
        placeholder="请输入专题slug"
        rules={[
          { required: true, message: "请输入专题slug" },
          { max: 100, message: "专题slug超过长度" },
        ]}
      />
      <ProFormTextArea
        name="summary"
        label="专题说明"
        placeholder="请输入专题说明"
        rules={[
          { required: true, message: "请输入专题说明" },
          { max: 255, message: "专题说明超过长度" },
        ]}
      />
      <ProFormText
        name="cover"
        label="专题封面"
        placeholder="请输入专题封面URL"
        rules={[{ max: 100, message: "专题封面超过长度" }]}
      />
      <ProFormDigit
        name="price"
        label="价格"
        placeholder="设置专题价格"
        rules={[{ required: true, message: "请设置专题价格" }]}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        options={[
          { label: "连载中", value: "Writing" },
          { label: "完结", value: "Finished" },
        ]}
      />
    </ProForm>
  );
}
