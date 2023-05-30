import { ProTable } from "@ant-design/pro-components";
import { Tag, Button, Popconfirm, message } from "antd";

import React, { useContext, useRef } from "react";

import fetcher from "../../fetcher";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function OrderIndex() {
  const actionRef = useRef();
  const { getAuth } = useContext(AuthContext);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "订单号",
      dataIndex: "order_num",
    },
    {
      title: "确认码",
      dataIndex: "code",
    },
    {
      title: "价格",
      dataIndex: "price",
      render: (_, { price }) => <>{price / 100}</>,
      hideInSearch: true,
    },
    {
      title: "用户",
      dataIndex: "user_id",
      render: (_, { email, nickname }) => (
        <>
          {email}({nickname})
        </>
      ),
      hideInSearch: true,
    },

    {
      title: "状态",
      dataIndex: "status",
      render: (_, { status }) =>
        status === "Finished" ? (
          <Tag color="cyan">完成</Tag>
        ) : (
          <Tag color="gold">待支付</Tag>
        ),
      valueType: "select",
      fieldProps: {
        options: [
          {
            label: "待支付",
            value: "Pending",
          },
          {
            label: "完成",
            value: "Finished",
          },
        ],
      },
    },
    {
      title: "下单时间",
      dataIndex: "dateline",
      render: (_, { dateline }) => <>{dateline}</>,
      hideInSearch: true,
    },
    {
      title: "支付ID",
      dataIndex: "pay_id",
      hideInSearch: true,
    },
    {
      title: "删除",
      dataIndex: "is_del",
      render: (_, { is_del }) =>
        is_del ? (
          <Tag color="error">已删除</Tag>
        ) : (
          <Tag color="green">未删除</Tag>
        ),
      valueType: "select",
      fieldProps: {
        options: [
          {
            label: "未删除",
            value: false,
          },
          {
            label: "已删除",
            value: true,
          },
        ],
      },
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      render: (_, { id, is_del, user_id }) => [
        <Button size="small" type="primary" ghost>
          <Link to={`/order/detail/${id}/${user_id}`}>详 情</Link>
        </Button>,
        is_del ? (
          <Popconfirm
            key={`restore-${id}`}
            title="确认操作"
            description={`确定要恢复吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              fetcher
                .patch(
                  `/order/${id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getAuth().token}`,
                    },
                  }
                )
                .then(({ data }) => {
                  actionRef.current.reload();
                  message.success(` 恢复成功`);
                });
            }}
          >
            <Button size="small" type="default">
              恢复
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            key={`del-${id}`}
            title="确认操作"
            description={`确定要删除吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              fetcher
                .delete(`/order/${id}`, {
                  headers: {
                    Authorization: `Bearer ${getAuth().token}`,
                  },
                })
                .then(({ data }) => {
                  actionRef.current.reload();
                  message.success(` 删除成功`);
                });
            }}
          >
            <Button size="small" type="primary" ghost danger>
              删除
            </Button>
          </Popconfirm>
        ),
      ],
    },
  ];

  const fetchData = async (params) => {
    console.log(params);
    const { data: result } = await fetcher.get("/order", {
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
    <ProTable
      rowKey="id"
      request={fetchData}
      columns={columns}
      pagination={{ pageSize: 30 }}
      actionRef={actionRef}
    />
  );
}
