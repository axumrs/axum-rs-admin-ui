import { ProDescriptions } from "@ant-design/pro-components";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import fetcher from "../../fetcher";
import { AuthContext } from "../../contexts/AuthContext";
import { Tag } from "antd";

export default function PurchasedServiceDetail() {
  const { id } = useParams();
  const { getAuth } = useContext(AuthContext);
  /*{
	"0": {
		"subject_id": 5,
		"subject_name": "使用axum打造你的商城",
		"subject_slug": "mall",
		"subject_summary": "本专题将带你从零开始实现一个B2C商城（类似某东的轻量版）",
		"subject_is_del": false,
		"subject_cover": "",
		"subject_status": "Writing",
		"subject_price": 15000,
		"email": "foo@bar.com",
		"nickname": "FooBar",
		"id": 8,
		"order_id": 31,
		"user_id": 2,
		"service_id": 5,
		"service_type": "Subject",
		"server_num": 1,
		"dateline": "2023-05-30T11:55:11+08:00",
		"status": "Finished",
		"order_num": "CHQN77O3LCJ4UA0F9F7G"
	}
}*/
  const fetchData = async () => {
    const res = await fetcher.get(`/purchased_service/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuth().token}`,
      },
    });
    const { data } = res;
    console.log(data);

    return {
      data: { ...data.data },
      success: data.code === 0,
    };
  };
  return (
    <>
      <ProDescriptions column={2} request={fetchData}>
        <ProDescriptions.Item
          label="类型"
          dataIndex="service_type"
          render={(_, { service_type }) =>
            service_type === "Subscriber" ? "订阅" : "专题"
          }
        />
        <ProDescriptions.Item
          label="服务"
          key="service_name"
          dataIndex="id"
          render={(_, { service_type, subject_name }) =>
            service_type === "Subscriber" ? "成为订阅用户(30天)" : subject_name
          }
        />
        <ProDescriptions.Item
          label="用户"
          dataIndex="user_id"
          render={(_, { email, nickname }) => (
            <>
              {email} ({nickname})
            </>
          )}
        />
        <ProDescriptions.Item label="订单号" dataIndex="order_num" />
        <ProDescriptions.Item
          label="状态"
          dataIndex="status"
          render={(_, { status }) =>
            status === "Finished" ? (
              <Tag color="success">已完成</Tag>
            ) : (
              <Tag color="cyan">待支付</Tag>
            )
          }
        />
        <ProDescriptions.Item label="数量" dataIndex="server_num" />
        <ProDescriptions.Item
          label="时间"
          dataIndex="dateline"
          valueType="dateTime"
        />
      </ProDescriptions>
    </>
  );
}
