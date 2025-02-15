import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import MainLayout from '../layouts/Main';
import  routes  from './index';
import LoginPage from '../page/Login';


const generateRoutes = (items:any) => {
  return items.map((item:any) => {
    return <Route key={item.path} path={item.path} element={item.element} />;
  });
};
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/"
          element={<MainLayout />}
        >
          {generateRoutes(routes)}
          <Route path="/"  />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
