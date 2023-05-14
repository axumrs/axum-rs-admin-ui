import Home from "../pages/Home";
import SubjectIndex from "../pages/Subject";
import SubjectAdd from "../pages/Subject/Add";
import SubjectEdit from "../pages/Subject/Edit";

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
];
