import {
  ProCard,
  ProDescriptions,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Tag, Image, Popover, Input, Popconfirm } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import fetcher from "../../fetcher";
import { AuthContext } from "../../contexts/AuthContext";

export default function OrderDetail() {
  const { id, user_id } = useParams();
  const { getAuth } = useContext(AuthContext);
  const [snap, setSnap] = useState([]);
  const [payApply, setPayApply] = useState({});

  const payApplyActionRef = useRef();
  const snapActionRef = useRef();
  const [showConfirmPayApply, setShowConfirmPayApply] = useState(false);

  useEffect(() => {
    snapActionRef.current.reload();
  }, [snap]);

  const fetchOrder = async () => {
    const res = await fetcher.get(`/order/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuth().token}`,
      },
    });
    const { data } = res;
    const { snap } = data.data;
    setSnap(JSON.parse(snap));
    return {
      data: { ...data.data },
      success: data.code === 0,
    };
  };
  const fetchPayApply = async () => {
    const res = await fetcher.get(`/pay_apply/${id}/${user_id}`, {
      headers: {
        Authorization: `Bearer ${getAuth().token}`,
      },
    });
    const { data } = res;
    console.log(data);
    const paData = { ...data.data };
    setPayApply({ ...paData });
    return {
      data: paData,
      success: data.code === 0,
    };
  };

  const submit = (type, reason) => {
    return () => {
      if (!window.confirm("确定操作？")) {
        return;
      }
      fetcher
        .post(
          `/pay_apply/${type}`,
          { id: payApply?.id, reason },
          {
            headers: {
              Authorization: `Bearer ${getAuth().token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          payApplyActionRef.current.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    };
  };

  return (
    <>
      <ProDescriptions
        column={2}
        title="订单摘要"
        bordered
        request={fetchOrder}
      >
        <ProDescriptions.Item
          label="订单号"
          dataIndex="order_num"
        ></ProDescriptions.Item>
        <ProDescriptions.Item
          label="金额"
          dataIndex="price"
          render={(_, { price }) => price / 100}
        ></ProDescriptions.Item>
        <ProDescriptions.Item
          label="识别码"
          dataIndex="code"
        ></ProDescriptions.Item>
        <ProDescriptions.Item
          label="下单时间"
          dataIndex="dateline"
          valueType="dateTime"
        ></ProDescriptions.Item>
        <ProDescriptions.Item
          label="用户"
          dataIndex="user_id"
          render={(_, { email, nickname }) => (
            <>
              {email}({nickname})
            </>
          )}
        ></ProDescriptions.Item>
        <ProDescriptions.Item
          label="状态"
          dataIndex="status"
          render={(_, { status }) =>
            status === "Finished" ? (
              <Tag color="cyan">完成</Tag>
            ) : (
              <Tag color="gold">待支付</Tag>
            )
          }
        ></ProDescriptions.Item>
      </ProDescriptions>

      <>
        <ProDescriptions
          bordered
          column={2}
          title="支付证明"
          style={{ marginTop: "4rem", marginBottom: "4rem" }}
          request={fetchPayApply}
          actionRef={payApplyActionRef}
        >
          {payApply && payApply?.id ? (
            <>
              <ProDescriptions.Item
                label="支付方式"
                dataIndex="types"
              ></ProDescriptions.Item>
              <ProDescriptions.Item
                label="交易ID"
                dataIndex="tx_id"
              ></ProDescriptions.Item>
              <ProDescriptions.Item
                label="支付金额"
                dataIndex="price"
                render={(_, { price, currency, types }) =>
                  `${
                    types === "TronLink" ? price / 100000 : price / 100
                  } ${currency}`
                }
              ></ProDescriptions.Item>
              <ProDescriptions.Item
                label="支付时间"
                dataIndex="dateline"
                valueType="dateTime"
              ></ProDescriptions.Item>
              <ProDescriptions.Item
                label="状态"
                dataIndex="status"
                render={(_, { status }) =>
                  status === "Finished" ? (
                    <Tag color="cyan">完成</Tag>
                  ) : status === "Reject" ? (
                    <Tag color="error">拒绝</Tag>
                  ) : (
                    <Tag color="gold">待支付</Tag>
                  )
                }
              ></ProDescriptions.Item>
              <ProDescriptions.Item
                label="截图"
                dataIndex="img"
                render={(_, { img }) => <Image src={img} />}
              ></ProDescriptions.Item>
              <ProDescriptions.Item
                label="意见"
                dataIndex="reason"
              ></ProDescriptions.Item>
              {payApply?.status === "Pending" && (
                <>
                  <ProDescriptions.Item
                    valueType="option"
                    render={() => [
                      <ConfirmPayApply
                        type="reject"
                        callback={(reason) => submit("reject", reason)()}
                      />,
                      <ConfirmPayApply
                        type="accpet"
                        callback={(reason) => submit("accept", reason)()}
                      />,
                    ]}
                  ></ProDescriptions.Item>
                </>
              )}
            </>
          ) : (
            <>
              <ProDescriptions.Item key="no-pay-apply" label="没有支付证明">
                用户没有提交支付证明
              </ProDescriptions.Item>
            </>
          )}
        </ProDescriptions>
      </>

      {/* <div>{JSON.stringify(snap)}</div> */}
      <ProTable
        request={async () => {
          return { data: [...snap], success: true };
        }}
        actionRef={snapActionRef}
        columns={[
          {
            title: "类型",
            dataIndex: "type",
          },
          {
            title: "服务",
            dataIndex: "service",
          },
          {
            title: "价格",
            dataIndex: "price",
          },
          {
            title: "数量",
            dataIndex: "number",
          },
          {
            title: "金额",
            key: "amount",
            render: (_, { price, number }) => price * number,
          },
        ]}
        search={false}
      />
    </>
  );
}

function ConfirmPayApply({ type, callback }) {
  const [reason, setReason] = useState("");
  const btn =
    type === "reject" ? (
      <Button key="reject" type="default" ghost danger>
        拒绝
      </Button>
    ) : (
      <Button key="submit" type="primary" ghost>
        通过
      </Button>
    );
  return (
    <Popconfirm
      description={
        <Input.TextArea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      }
      title="输入操作理由"
      onCancel={() => {
        setReason("");
      }}
      onConfirm={() => {
        callback(reason);
        setReason("");
      }}
    >
      {btn}
    </Popconfirm>
  );
}
