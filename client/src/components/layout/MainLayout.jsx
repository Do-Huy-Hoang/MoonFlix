import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../common/Page_Layout/Footer";
import GlobalLoading from "../common/Page_Layout/GlobalLoading";
import AuthModal from "../common/Auth/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import userApi from "../../api/modules/user.api";
import favoriteApi from "../../api/modules/favorite.api";
import { setListFavorites, setUser } from "../../redux/features/userSlice";
import Header from "../common/Page_Layout/Header";

const MainLayout = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userApi.getInfo();

      if (response) dispatch(setUser(response));
      if (err) dispatch(setUser(null));
    };

    authUser();
  }, [dispatch]);

  useEffect(() => {
    const getFavorites = async () => {
      const { response, err } = await favoriteApi.getList();

      if (response) dispatch(setListFavorites(response));
      if (err) toast.error(err.message);
    };

    if (user) getFavorites();
    if (!user) dispatch(setListFavorites([]));
  }, [user, dispatch]);

  return (
    <>
      {/* global loading */}
      <GlobalLoading />
      {/* global loading */}

      {/* login modal */}
      <AuthModal />
      {/* login modal */}

      <Box display="flex" minHeight="100vh">
        {/* header */}
        <Header />
        {/* header */}

        {/* main */}
        <Box
          component="main"
          flexGrow={1}
          overflow="hidden"
          minHeight="100vh"
        >
          <Outlet />
        </Box>
        {/* main */}
      </Box>

      {/* footer */}
      <Footer />
      {/* footer */}
    </>
  );
};

export default MainLayout;