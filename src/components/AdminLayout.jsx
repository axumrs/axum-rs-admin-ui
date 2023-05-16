import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components";
import React from "react";
import { Link, useRoutes } from "react-router-dom";

import menu from "../config/menu";
import routeTable from "../config/route";

export default function AdminLayout() {
  const routes = useRoutes(routeTable);
  return (
    <ProLayout
      title="AXUM.RS 后台"
      logo="https://file.axum.rs/asset/logo.png"
      menuHeaderRender={(logo, title, props) => (
        <Link to="/">
          {logo}
          {!props?.collapsed && title}
        </Link>
      )}
      menuItemRender={(options, element) => (
        <Link to={options?.path}>{element}</Link>
      )}
      route={menu}
      breadcrumbRender={false}
      // waterMarkProps={{ content: "AXUM.RS" }}
    >
      <PageContainer>
        <ProCard>{routes}</ProCard>
      </PageContainer>
    </ProLayout>
  );
}
