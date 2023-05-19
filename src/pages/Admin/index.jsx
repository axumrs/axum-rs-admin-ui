import React, { useRef } from "react";
import { Tag, Button, Popconfirm, message } from "antd";
import { ProTable } from "@ant-design/pro-components";
import fetcher from "../../fetcher";
import { Link } from "react-router-dom";

export default function AdminIndex() {
  const actionRef = useRef();
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "用户名",
      dataIndex: "username",
      hideInSearch: true,
    },
    {
      title: "删除",
      dataIndex: "is_del",
      hideInSearch: true,
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
      render: (_, { id, is_del }) => [
        <Button key={`edit-${id}`} size="small" type="primary" ghost>
          <Link to={`/admin/edit/${id}`}>修 改</Link>
        </Button>,
        is_del ? (
          <Popconfirm
            key={`restore-${id}`}
            title="确认操作"
            description={`确定要恢复吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              fetcher.patch(`/admin/${id}`).then(({ data }) => {
                actionRef.current.reload();
                message.success(`恢复成功`);
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
              fetcher.delete(`/admin/${id}`).then(({ data }) => {
                actionRef.current.reload();
                message.success(`删除成功`);
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
    const { data: result } = await fetcher.get("/admin", {
      params: {
        page_size: params.pageSize,
        page: params.current - 1,
        ...params,
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
      columns={columns}
      actionRef={actionRef}
      request={fetchData}
      search={false}
      pagination={{ pageSize: 30 }}
    />
  );
}
