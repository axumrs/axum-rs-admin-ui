import { ProTable } from "@ant-design/pro-components";
import { Tag, Button, Popconfirm, message } from "antd";

import React, { useContext, useRef } from "react";

import fetcher from "../../fetcher";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import DataTimeFormat from "../../components/DataTimeFormat";

export default function UserIndex() {
  const actionRef = useRef();
  const { getAuth } = useContext(AuthContext);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "昵称",
      dataIndex: "nickname",
    },
    {
      title: "等级",
      dataIndex: "level",
    },
    {
      title: "积分",
      dataIndex: "points",
      hideInSearch: true,
    },

    {
      title: "状态",
      dataIndex: "status",
      render: (_, { status }) =>
        status === "Pending" ? (
          <Tag color="cyan">待激活</Tag>
        ) : status === "Actived" ? (
          <Tag color="gold">正常</Tag>
        ) : (
          <Tag color="error">已冻结</Tag>
        ),
      valueType: "select",
      fieldProps: {
        options: [
          {
            label: "待激活",
            value: "Pending",
          },
          {
            label: "正常",
            value: "Actived",
          },
          {
            label: "已冻结",
            value: "Freezed",
          },
        ],
      },
    },
    {
      title: "类型",
      dataIndex: "types",
      render: (_, { types }) =>
        types === "Subscriber" ? (
          <Tag color="cyan">订阅用户</Tag>
        ) : (
          <Tag color="default">普通用户</Tag>
        ),
      valueType: "select",
      fieldProps: {
        options: [
          {
            label: "普通用户",
            value: "Normal",
          },
          {
            label: "订阅用户",
            value: "Subscriber",
          },
        ],
      },
    },
    {
      title: "注册时间",
      dataIndex: "dateline",
      hideInSearch: true,
      render: (_, { dateline }) => <DataTimeFormat>{dateline}</DataTimeFormat>,
    },
    {
      title: "订阅到期时间",
      dataIndex: "sub_exp",
      hideInSearch: true,
      render: (_, { types, sub_exp }) =>
        types === "Subscriber" ? (
          <>
            <DataTimeFormat>{sub_exp}</DataTimeFormat>
          </>
        ) : (
          <>-</>
        ),
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
      render: (_, { id, is_del, status }) => [
        <Button key={`edit-${id}`} size="small" type="primary" ghost>
          <Link to={`/user/edit/${id}`}>修 改</Link>
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
                  `/user/${id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getAuth().token}`,
                    },
                  }
                )
                .then(({ data }) => {
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
              fetcher
                .delete(`/user/${id}`, {
                  headers: {
                    Authorization: `Bearer ${getAuth().token}`,
                  },
                })
                .then(({ data }) => {
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
        status === "Actived" ? (
          <>
            <Popconfirm
              key={`pending-${id}`}
              title="确认操作"
              description={`确定要取消激活吗？`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                fetcher
                  .put(
                    `/user/pending/${id}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getAuth().token}`,
                      },
                    }
                  )
                  .then(({ data }) => {
                    actionRef.current.reload();
                    message.success(`取消激活成功`);
                  });
              }}
            >
              <Button size="small" type="default">
                取消激活
              </Button>
            </Popconfirm>
            <Popconfirm
              key={`freeze-${id}`}
              title="确认操作"
              description={`确定要冻结吗？`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                fetcher
                  .put(
                    `/user/freeze/${id}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getAuth().token}`,
                      },
                    }
                  )
                  .then(({ data }) => {
                    actionRef.current.reload();
                    message.success(`冻结成功`);
                  });
              }}
            >
              <Button size="small" type="default">
                冻结
              </Button>
            </Popconfirm>
          </>
        ) : status === "Pending" ? (
          <>
            <Popconfirm
              key={`active-${id}`}
              title="确认操作"
              description={`确定要激活吗？`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                fetcher
                  .put(
                    `/user/active/${id}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getAuth().token}`,
                      },
                    }
                  )
                  .then(({ data }) => {
                    actionRef.current.reload();
                    message.success(`激活成功`);
                  });
              }}
            >
              <Button size="small" type="default">
                激活
              </Button>
            </Popconfirm>
            <Popconfirm
              key={`freeze-${id}`}
              title="确认操作"
              description={`确定要冻结吗？`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                fetcher
                  .put(
                    `/user/freeze/${id}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getAuth().token}`,
                      },
                    }
                  )
                  .then(({ data }) => {
                    actionRef.current.reload();
                    message.success(`冻结成功`);
                  });
              }}
            >
              <Button size="small" type="default">
                冻结
              </Button>
            </Popconfirm>
          </>
        ) : (
          <>
            <Popconfirm
              key={`active-${id}`}
              title="确认操作"
              description={`确定要解冻吗？`}
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                fetcher
                  .put(
                    `/user/active/${id}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getAuth().token}`,
                      },
                    }
                  )
                  .then(({ data }) => {
                    actionRef.current.reload();
                    message.success(`解冻成功`);
                  });
              }}
            >
              <Button size="small" type="default">
                解冻
              </Button>
            </Popconfirm>
          </>
        ),
      ],
    },
  ];

  const fetchData = async (params) => {
    console.log(params);
    const { data: result } = await fetcher.get("/user", {
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
