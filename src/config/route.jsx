import AdminIndex from "../pages/Admin";
import AdminAdd from "../pages/Admin/Add";
import AdminEdit from "../pages/Admin/Edit";
import Home from "../pages/Home";
import SubjectIndex from "../pages/Subject";
import SubjectAdd from "../pages/Subject/Add";
import SubjectEdit from "../pages/Subject/Edit";
import TagIndex from "../pages/Tag";
import TagAdd from "../pages/Tag/Add";
import TagEdit from "../pages/Tag/Edit";
import TopicIndex from "../pages/Topic";
import TopicAdd from "../pages/Topic/Add";
import TopicEdit from "../pages/Topic/Edit";
import UserIndex from "../pages/User";
import UserAdd from "../pages/User/Add";
import UserEdit from "../pages/User/Edit";
import UserLoginLog from "../pages/User/LoginLog";

export default [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/subject",
    children: [
      {
        path: "list",
        element: <SubjectIndex />,
      },
      {
        path: "add",
        element: <SubjectAdd />,
      },
      {
        path: "edit/:id",
        element: <SubjectEdit />,
      },
    ],
  },
  {
    path: "/topic",
    children: [
      {
        path: "list",
        element: <TopicIndex />,
      },
      {
        path: "add",
        element: <TopicAdd />,
      },
      {
        path: "edit/:id",
        element: <TopicEdit />,
      },
    ],
  },
  {
    path: "/tag",
    children: [
      {
        path: "list",
        element: <TagIndex />,
      },
      {
        path: "add",
        element: <TagAdd />,
      },
      {
        path: "edit/:id",
        element: <TagEdit />,
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "list",
        element: <AdminIndex />,
      },
      {
        path: "add",
        element: <AdminAdd />,
      },
      {
        path: "edit/:id",
        element: <AdminEdit />,
      },
    ],
  },
  {
    path: "/user",
    children: [
      {
        path: "list",
        element: <UserIndex />,
      },
      {
        path: "add",
        element: <UserAdd />,
      },
      {
        path: "edit/:id",
        element: <UserEdit />,
      },
      {
        path: "login_log/:email/:user_id",
        element: <UserLoginLog />,
      },
    ],
  },
];
