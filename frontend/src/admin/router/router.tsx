
import {  Route, Routes } from "react-router";
import { authRoutes, publicRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login/login";
import {ToastContainer, Zoom} from 'react-toastify'

const ALLRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/"  element={<Login/>} />
       
        <Route element={<Feature />}>
         
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>

        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
      </Routes>
      <ToastContainer autoClose={1000} transition={Zoom}   />
    </>
  );
};

export default ALLRoutes;
