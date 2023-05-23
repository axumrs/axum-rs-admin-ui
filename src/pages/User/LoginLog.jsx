import { ProCard, ProDescriptions, ProTable } from "@ant-design/pro-components";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import fetcher from "../../fetcher";
import { AuthContext } from "../../contexts/AuthContext";
import DataTimeFormat from "../../components/DataTimeFormat";

export default function UserLoginLog() {
  const { email, user_id } = useParams();
  const { getAuth } = useContext(AuthContext);

  const onlineColumns = [
    {
      title: "在线#",
      dataIndex: "online_id",
    },
    {
      title: "登录#",
      dataIndex: "login_id",
    },
    {
      title: "设备",
      dataIndex: ["uai", "device"],
    },
    {
      title: "操作系统",
      dataIndex: ["uai", "os"],
    },
    {
      title: "浏览器",
      dataIndex: ["uai", "browser"],
    },
    {
      title: "IP",
      dataIndex: "ip",
    },
  ];
  const logColums = [
    {
      title: "#",
      dataIndex: "id",
    },
    {
      title: "设备",
      dataIndex: "device",
    },
    {
      title: "操作系统",
      dataIndex: "os",
    },
    {
      title: "浏览器",
      dataIndex: "browser",
    },
    {
      title: "IP",
      dataIndex: "ip",
    },
    {
      title: "登录时间",
      dataIndex: "dateline",
      hideInSearch: true,
      render: (_, { dateline }) => <DataTimeFormat>{dateline}</DataTimeFormat>,
    },

    {
      title: "用户代理",
      dataIndex: "user_agent",
      ellipsis: true,
    },
  ];
  const onlineHandler = async () => {
    const { data: result } = await fetcher.get(`/user/online/${email}`, {
      headers: {
        Authorization: `Bearer ${getAuth().token}`,
      },
    });

    console.log({
      data: result?.data,
      success: result?.code === 0,
    });

    return {
      data: result?.data,
      success: result?.code === 0,
    };
  };
  const logHandler = async (params) => {
    console.log(params);
    const { data: result } = await fetcher.get(`/user/login_log/${user_id}`, {
      params: {
        page_size: params.pageSize,
        page: params.current - 1,
        ...params,
      },
      headers: {
        Authorization: `Bearer ${getAuth().token}`,
      },
    });

    return {
      data: result?.data?.data,
      success: result?.code === 0,
      total: result?.data?.total,
    };
  };
  return (
    <>
      <ProCard bordered title="在线设备">
        <ProTable
          request={onlineHandler}
          pagination={false}
          search={false}
          columns={onlineColumns}
        />
      </ProCard>

      <ProCard title="登录记录" style={{ marginTop: "1rem" }} bordered>
        <ProTable
          pagination={{ pageSize: 30 }}
          search={false}
          columns={logColums}
          request={logHandler}
        />
      </ProCard>
    </>
  );
}
