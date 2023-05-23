import {
  ProForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
} from "@ant-design/pro-components";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import fetcher from "../../fetcher";
import { message } from "antd";

export default function UserAdd() {
  const navigate = useNavigate();
  const { getAuth } = useContext(AuthContext);

  const subjectHandler = async (values) => {
    const { types, sub_exp } = values;
    if (types === "Subscriber" && !sub_exp) {
      message.error("请设置过期时间");
      return;
    }
    let subExp = sub_exp;
    if (!subExp) {
      subExp = "1970-01-01 00:00:00";
    }
    const { data: res } = await fetcher.post(
      "/user",
      { ...values, sub_exp: subExp },
      {
        headers: {
          Authorization: `Bearer ${getAuth().token}`,
        },
      }
    );
    if (res.code == 0) {
      navigate("/user/list");
    }
  };
  return (
    <>
      <ProForm
        initialValues={{
          status: "Actived",
          types: "Normal",
          points: 0,
          allow_device_num: 1,
          jwt_exp: 0,
        }}
        onFinish={subjectHandler}
      >
        <ProFormText
          name="email"
          label="用户邮箱"
          placeholder="请输入用户邮箱"
          rules={[
            { required: true, message: "请输入用户邮箱" },
            { max: 255, message: "邮箱超过长度" },
          ]}
        />
        <ProFormText
          name="nickname"
          label="用户昵称"
          placeholder="请输入用户昵称"
          rules={[
            { required: true, message: "请输入用户昵称" },
            { max: 30, message: "昵称超过长度" },
          ]}
        />
        <ProFormText.Password
          name="password"
          label="用户密码"
          placeholder="请输入用户密码"
          rules={[
            { required: true, message: "请输入用户密码" },
            { min: 6, message: "密码不能少于6个字符" },
          ]}
        />
        <ProFormDigit
          name="points"
          label="用户点数"
          placeholder="请输入用户点数"
          rules={[
            { required: true, message: "请输入用户点数" },
            // { min: 0, message: "点数不能小于0" },
          ]}
        />
        <ProFormRadio.Group
          name="status"
          label="用户状态"
          options={[
            { label: "待激活", value: "Pending" },
            { label: "正常", value: "Actived" },
            { label: "被冻结", value: "Freezed" },
          ]}
          rules={[{ required: true, message: "请设置用户状态" }]}
        />
        <ProFormRadio.Group
          name="types"
          label="用户类型"
          options={[
            { label: "普通用户", value: "Normal" },
            { label: "订阅用户", value: "Subscriber" },
          ]}
          rules={[{ required: true, message: "请设置用户状态" }]}
        />
        <ProFormDateTimePicker name="sub_exp" label="订阅到期时间" />
        <ProFormDigit
          min={1}
          max={3}
          name="allow_device_num"
          label="允许登录的设备数"
          placeholder="请输入用户允许登录的设备数"
          rules={[{ required: true, message: "请输入用户允许登录的设备数" }]}
        />
        <ProFormDigit
          min={0}
          max={120}
          name="jwt_exp"
          label="JWT时长"
          placeholder="请输入用户JWT时长，0为使用全局配置"
          rules={[{ required: true, message: "请输入用户JWT时长" }]}
        />
      </ProForm>
    </>
  );
}
