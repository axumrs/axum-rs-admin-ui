import { DashboardFilled } from "@ant-design/icons";
export default {
  path: "/",
  routes: [
    {
      path: "/",
      name: "控制面板",
      icon: <DashboardFilled />,
    },
    {
      path: "/subject",
      name: "专题",
      icon: <DashboardFilled />,
      routes: [
        {
          path: "list",
          name: "专题列表",
          icon: <DashboardFilled />,
        },
        {
          path: "add",
          name: "添加专题",
          icon: <DashboardFilled />,
        },
      ],
    },
  ],
};
