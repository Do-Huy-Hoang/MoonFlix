import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { SwiperSlide } from "swiper/react";
import NavigationSwiper from "../NavigationSwiper";

const MediaVideo = ({ video, title }) => {
  const iframeRef = useRef();
  useEffect(() => {
    const height = iframeRef.current.offsetWidth * 9 / 16 + "px";
    iframeRef.current.setAttribute("height", height);
  }, [video]);

  return (
    <Box sx={{ height: "max-content" }}>
      <iframe
        src={video}
        ref={iframeRef}
        width="100%"
        title={title}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ border: 0, objectFit: 'fill' }}
      ></iframe>
    </Box>
  );
};

const MediaVideosSlide = ({ video, title }) => {
  return (
    <NavigationSwiper>
      <SwiperSlide >
        <MediaVideo video={video} title={title} />
      </SwiperSlide>
    </NavigationSwiper>
  );
};

export default MediaVideosSlide;