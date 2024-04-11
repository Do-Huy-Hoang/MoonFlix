import { ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import themeConfigs from "./configs/theme.configs";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import routes from "./routes/routes";
import PageWrapper from "./components/common/Page_Layout/PageWrapper";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import "swiper/css/pagination";
import AdminIndex from "./pages/admin/admin_index";
import './fontawesome.js'

const App = () => {
  const { themeMode } = useSelector((state) => state.themeMode);
  const { user } = useSelector((state) => state.user);
  return (

    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme={themeMode}
      />
      <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>

      </ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}><MainLayout /></ThemeProvider>
          }>
            {routes.map((route, index) => (
              route.index ? (
                <Route
                  index
                  key={index}
                  element={
                  <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>
                    <CssBaseline />
                    {route.state ? (
                      <PageWrapper state={route.state}>{route.element}</PageWrapper>
                    ) : route.element}
                  </ThemeProvider>}
                />
              ) : (
                <Route
                  path={route.path}
                  key={index}
                  element={
                    <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>
                      <CssBaseline />
                      {route.state ? (
                        <PageWrapper state={route.state}>{route.element}</PageWrapper>
                      ) : route.element}
                    </ThemeProvider>}
                />
              )
            ))}
          </Route>
          {user && user.isAdmin === true &&  <Route path="/admin" element={<AdminIndex />} />} 
        </Routes>
      </BrowserRouter>
    </>

  );
};

export default App;
