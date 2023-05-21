import {
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import React, { useContext } from "react";
import fetcher from "../../fetcher";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function TopicAdd() {
  const navigate = useNavigate();
  const { getAuth } = useContext(AuthContext);

  const sumbitHandler = async (values) => {
    // console.log(values);
    const { data: res } = await fetcher.post("/topic", values, {
      headers: {
        Authorization: `Bearer ${getAuth().token}`,
      },
    });
    if (res.code === 0) {
      navigate("/topic/list");
    }
  };
  const fetchSubjectList = async () => {
    const { data: res } = await fetcher.get(
      "/subject",
      {
        params: { page: 0, page_size: 1000, is_del: false },
      },
      {
        headers: {
          Authorization: `Bearer ${getAuth().token}`,
        },
      }
    );

    const {
      data: { data },
    } = res;

    return data.map((row) => ({ label: row.name, value: row.id }));
  };
  const fetchTagList = async () => {
    const { data: res } = await fetcher.get(
      "/tag",
      {
        params: { page: 0, page_size: 1000, is_del: false },
      },
      {
        headers: {
          Authorization: `Bearer ${getAuth().token}`,
        },
      }
    );

    const {
      data: { data },
    } = res;

    return data.map((row) => ({ label: row.name, value: row.name }));
  };
  return (
    <>
      <ProForm
        initialValues={{
          cover: "",
          try_readable: false,
          author: "AXUM中文网",
          src: "axum.rs",
        }}
        onFinish={sumbitHandler}
      >
        <ProFormText
          name="title"
          label="文章标题"
          placeholder="请输入文章标题"
          rules={[
            { required: true, message: "请输入文章标题" },
            { max: 255, message: "文章标题超过长度" },
          ]}
        />
        <ProFormText
          name="slug"
          label="文章slug"
          placeholder="请输入文章slug"
          rules={[
            { required: true, message: "请输入文章slug" },
            { max: 100, message: "文章slug超过长度" },
          ]}
        />
        <ProFormSelect
          name="subject_id"
          label="所属专题"
          placeholder="请选择专题"
          rules={[{ required: true, message: "请选择所属专题" }]}
          request={fetchSubjectList}
        />
        <ProFormTextArea
          name="summary"
          label="文章说明"
          placeholder="请输入文章说明"
          rules={[
            { required: true, message: "请输入文章说明" },
            { max: 255, message: "文章说明超过长度" },
          ]}
        />
        <ProFormText
          name="cover"
          label="文章封面"
          placeholder="请输入文章封面URL"
          rules={[{ max: 100, message: "文章封面超过长度" }]}
        />
        <ProFormText
          name="author"
          label="文章作者"
          placeholder="请输入文章作者"
          rules={[
            { required: true, message: "请输入文章作者" },
            { max: 50, message: "文章作者超过长度" },
          ]}
        />
        <ProFormText
          name="src"
          label="文章来源"
          placeholder="请输入文章来源"
          rules={[
            { required: true, message: "请输入文章来源" },
            { max: 50, message: "文章来源超过长度" },
          ]}
        />
        <ProFormTextArea
          name="md"
          label="文章内容"
          placeholder="请输入文章内容"
          fieldProps={{ rows: 20 }}
          rules={[{ required: true, message: "请输入文章内容" }]}
        />
        <ProFormSelect
          name="tags"
          label="标签"
          placeholder="请设置标签"
          mode="tags"
          fieldProps={{ tokenSeparators: [",", " "] }}
          rules={[{ required: true, message: "请设置标签" }]}
          request={fetchTagList}
        />
        <ProFormRadio.Group
          name="try_readable"
          label="允许试读？"
          options={[
            { label: "禁止", value: false },
            { label: "允许", value: true },
          ]}
          rules={[{ required: true, message: "请设置是否允许试读" }]}
        />
      </ProForm>
    </>
  );
}
