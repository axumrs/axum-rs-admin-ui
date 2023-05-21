import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";

import React, { useContext } from "react";
import fetcher from "../../fetcher";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function SubjectEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAuth } = useContext(AuthContext);

  const findSubject = async () => {
    const { data: res } = await fetcher.get(`/subject/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuth().token}`,
      },
    });
    const { data } = res;
    return { ...data, price: data.price / 100 };
  };
  const sumbitHandler = async (values) => {
    console.log(values);
    const { data: res } = await fetcher.put(
      `/subject`,
      {
        ...values,
        id: parseInt(id, 10),
      },
      {
        headers: {
          Authorization: `Bearer ${getAuth().token}`,
        },
      }
    );
    if (res.code == 0) {
      navigate("/subject/list");
    }
  };
  return (
    <ProForm onFinish={sumbitHandler} request={findSubject}>
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
