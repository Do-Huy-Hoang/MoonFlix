import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import uiConfigs from "../../configs/ui.configs";
import { routesGen } from "../../routes/routes";
import performerMovieApi from "../../api/modules/perfomerMovie.api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const CastSlide = ({ casts }) => {
  const [actor, setActor] = useState(false);
  const getAction = async () => {
    if (casts.length > 0) {
      const { response, err } = await performerMovieApi.getList(casts);
      if (err) toast.error(err.message);
      if (response) {
        setActor(response);
      }
    }
  };
  useEffect(() => {
    getAction();
  }, []);
  const handlePerMoId = (id) => {
      const checkPerMoId = actor?.performerMovies.filter(item=>item.performer === id);
      return checkPerMoId[0].id;
  }
  return (
    <Box sx={{
      "& .swiper-slide": {
        width: { xs: "50%", md: "25%", lg: "20.5%" },
        color: "primary.contrastText"
      }
    }}>
      <Swiper
        spaceBetween={10}
        slidesPerView={"auto"}
        grabCursor={true}
        style={{ width: "100%", height: "max-content" }}
      >
        {actor?.performers?.length > 0 ?
          actor.performers.map((actor, index) => (
            <SwiperSlide key={index}>
              <Link to={routesGen.person(actor.id,handlePerMoId(actor.id))}>
                <Box sx={{
                  paddingTop: "120%",
                  color: "text.primary",
                  ...uiConfigs.style.backgroundImageCast(actor.perAvatar)
                }}>
                  <Box sx={{
                    position: "absolute",
                    width: "100%",
                    height: "max-content",
                    bottom: 0,
                    padding: "10px",
                    backgroundColor: "rgba(0,0,0,0.6)"
                  }}>
                    <Typography sx={{ ...uiConfigs.style.typoLines(1, "left") }}>
                      {actor.perName}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </SwiperSlide>
          )) : ''
        }
      </Swiper>
    </Box>
  );
};

export default CastSlide;