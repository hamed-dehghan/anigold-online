import MainLayout from "../layouts/Main";
import Users from "../page/Users";

const routes= [
    {
      path: "/",
      element: '#',
      breadcrumb: "پیشخوان",
    },
    {
      path: "/users",
      element: <Users />,
      layout: <MainLayout />,
      breadcrumb: ' مشاهده کاربران',
      // auth: "user",
      lastRoute: false
    },

]


export default routes;