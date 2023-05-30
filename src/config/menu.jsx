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
      name: "专题管理",
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
    {
      path: "/topic",
      name: "文章管理",
      icon: <DashboardFilled />,
      routes: [
        {
          path: "list",
          name: "文章列表",
          icon: <DashboardFilled />,
        },
        {
          path: "add",
          name: "添加文章",
          icon: <DashboardFilled />,
        },
      ],
    },
    {
      path: "/tag",
      name: "标签管理",
      icon: <DashboardFilled />,
      routes: [
        {
          path: "list",
          name: "标签列表",
          icon: <DashboardFilled />,
        },
        {
          path: "add",
          name: "添加标签",
          icon: <DashboardFilled />,
        },
      ],
    },
    {
      path: "/admin",
      name: "管理员",
      icon: <DashboardFilled />,
      routes: [
        {
          path: "list",
          name: "管理员列表",
          icon: <DashboardFilled />,
        },
        {
          path: "add",
          name: "添加管理员",
          icon: <DashboardFilled />,
        },
      ],
    },
    {
      path: "/user",
      name: "用户管理",
      icon: <DashboardFilled />,
      routes: [
        {
          path: "list",
          name: "用户列表",
          icon: <DashboardFilled />,
        },
        {
          path: "add",
          name: "添加用户",
          icon: <DashboardFilled />,
        },
      ],
    },
    {
      path: "/order",
      name: "订单管理",
      icon: <DashboardFilled />,
      routes: [
        {
          path: "list",
          name: "订单列表",
          icon: <DashboardFilled />,
        },
      ],
    },
    {
      path: "/purchased_service",
      name: "已购服务",
      icon: <DashboardFilled />,
      routes: [
        {
          path: "list",
          name: "所有列表",
          icon: <DashboardFilled />,
        },
      ],
    },
  ],
};
