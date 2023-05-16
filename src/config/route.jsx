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
];
