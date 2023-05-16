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
  ],
};
