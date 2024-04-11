import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import mediaApi from "../../../api/modules/media.api";
import AutoSwiper from "../AutoSwiper";
import { toast } from "react-toastify";
import MediaItem from "./MediaItem";

const MediaSlide = (props) => {
  const [medias, setMedias] = useState([]);

  const getMedias = async () => {
    const { response, err } = await mediaApi.getList();
    if (response) {
        if(props.type !== null && props.type !== undefined){
          setMedias(response.filter(item => item.mediaType == props.type))
        }
    };
    if (err) {
      toast.error(err.message)
    };
  };
  useEffect(() => {
    getMedias();
  }, []);
  return (
    <AutoSwiper >
      {medias?.map((media, index) => (
        <SwiperSlide  key={index}>
          <MediaItem media={media}  />
        </SwiperSlide>
      ))}
    </AutoSwiper>
  );
};

export default MediaSlide;