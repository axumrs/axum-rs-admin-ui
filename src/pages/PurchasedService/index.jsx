import { ProTable } from "@ant-design/pro-components";
import React, { useContext, useRef } from "react";
import fetcher from "../../fetcher";
import { AuthContext } from "../../contexts/AuthContext";
import { Button, Tag } from "antd";
import { Link } from "react-router-dom";
import DateTimeFormat from "../../dtf";

export default function PurchasedServiceIndex() {
  const actionRef = useRef();
  const { getAuth } = useContext(AuthContext);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "类型",
      dataIndex: "service_type",
      render: (_, { service_type }) =>
        service_type === "Subscriber" ? "订阅" : "专题",
    },
    {
      title: "订单号",
      dataIndex: "order_num",
    },
    {
      title: "用户",
      dataIndex: "user_id",
      render: (_, { email, nickname }) => (
        <>
          {email}({nickname})
        </>
      ),
    },
    {
      title: "服务名称",
      key: "service_name",
      render: (_, { service_type, subject_name }) =>
        service_type === "Subscriber" ? "成为订阅用户(30天)" : subject_name,
    },
    {
      title: "数量",
      dataIndex: "server_num",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (_, { status }) =>
        status === "Finished" ? (
          <Tag color="success">已完成</Tag>
        ) : (
          <Tag color="cyan">待支付</Tag>
        ),
    },
    {
      title: "购买时间",
      dataIndex: "dateline",
      render: (_, { dateline }) => DateTimeFormat(dateline),
    },

    {
      title: "操作",
      key: "option",
      valueType: "option",
      render: (_, { id }) => [
        <Button key={`detail-${id}`} size="small" type="primary" ghost>
          <Link to={`/purchased_service/detail/${id}`}>详 情</Link>
        </Button>,
      ],
    },
  ];

  const fetchData = async (params) => {
    console.log(params);
    const { data: result } = await fetcher.get("/purchased_service", {
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
      <ProTable
        columns={columns}
        actionRef={actionRef}
        request={fetchData}
        pagination={{ pageSize: 30 }}
        search={false}
      />
    </>
  );
}
