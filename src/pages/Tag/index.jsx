import { ProTable } from "@ant-design/pro-components";
import { Tag, Button, Popconfirm, message } from "antd";
import React, { useContext, useRef } from "react";
import fetcher from "../../fetcher";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function TagIndex() {
  const actionRef = useRef();
  const { getAuth } = useContext(AuthContext);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "名称",
      dataIndex: "name",
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
      render: (_, { id, name, is_del }) => [
        <Button key={`edit-${id}`} size="small" type="primary" ghost>
          <Link to={`/tag/edit/${id}`}>修 改</Link>
        </Button>,
        is_del ? (
          <Popconfirm
            key={`restore-${id}`}
            title="确认操作"
            description={`确定要恢复「${name}」标签吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              fetcher
                .patch(
                  `/tag/${id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getAuth().token}`,
                    },
                  }
                )
                .then(({ data }) => {
                  actionRef.current.reload();
                  message.success(`标签 ${name} 恢复成功`);
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
            description={`确定要删除「${name}」标签吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              fetcher
                .delete(`/tag/${id}`, {
                  headers: {
                    Authorization: `Bearer ${getAuth().token}`,
                  },
                })
                .then(({ data }) => {
                  actionRef.current.reload();
                  message.success(`标签 ${name} 删除成功`);
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
    const { data: result } = await fetcher.get("/tag", {
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
      columns={columns}
      actionRef={actionRef}
      request={fetchData}
      pagination={{ pageSize: 30 }}
    />
  );
}
