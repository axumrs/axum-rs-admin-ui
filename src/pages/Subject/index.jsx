import { ProTable } from "@ant-design/pro-components";
import { Tag, Button, Popconfirm } from "antd";

import React from "react";

import fetcher from "../../fetcher";
import { Link } from "react-router-dom";

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
    title: "slug",
    dataIndex: "slug",
  },
  {
    title: "价格",
    dataIndex: "price",
    render: (_, { price }) => (price > 0 ? <>{price / 100}</> : <>免费</>),
    hideInSearch: true,
  },
  {
    title: "状态",
    dataIndex: "status",
    render: (_, { status }) =>
      status === "Finished" ? (
        <Tag color="cyan">完结</Tag>
      ) : (
        <Tag color="gold">连载</Tag>
      ),
    valueType: "select",
    fieldProps: {
      options: [
        {
          label: "连载",
          value: "Writing",
        },
        {
          label: "完结",
          value: "Finished",
        },
      ],
    },
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
    render: (_, { id, name }) => [
      <Button key={`edit-${id}`} size="small" type="primary" ghost>
        <Link to={`/subject/edit/${id}`}>修 改</Link>
      </Button>,
      <Popconfirm
        key={`del-${id}`}
        title="确认操作"
        description={`确定要删除「${name}」专题吗？`}
        okText="确定"
        cancelText="取消"
        onConfirm={() => {}}
      >
        <Button size="small" type="primary" ghost danger>
          删除
        </Button>
      </Popconfirm>,
    ],
  },
];

export default function SubjectIndex() {
  const fetchData = async (params) => {
    console.log(params);
    const { data: result } = await fetcher.get("/subject", {
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
      rowKey="id"
      request={fetchData}
      columns={columns}
      pagination={{ pageSize: 30 }}
    />
  );
}
