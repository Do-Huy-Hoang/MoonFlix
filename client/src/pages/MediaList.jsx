import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack } from "@mui/material"; // Removed Typography import
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import mediaApi from "../api/modules/media.api";
import uiConfigs from "../configs/ui.configs";
import HeroSlide from "../components/common/HeroSlide";
import MediaGrid from "../components/common/Media/MediaGrid";
import { setAppState } from "../redux/features/appStateSlice";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { toast } from "react-toastify";


const MediaList = () => {
  const { mediaType } = useParams();
  const [medias, setMedias] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAppState(mediaType));
    window.scrollTo(0, 0);
  }, [mediaType, dispatch]);

  const getMedias = async () => {
    dispatch(setGlobalLoading(true));
    setMediaLoading(true);

    const { response, err } = await mediaApi.getList();

    setMediaLoading(false);
    dispatch(setGlobalLoading(false));

    if (err) toast.error(err.message);
    if (response) {
      const filter = response.filter(item=> item.mediaType == mediaType);
      setMedias(filter);
    }
  };

  useEffect(() => {
    getMedias();
  }, [mediaType, dispatch]);


  return (
    <>
      <HeroSlide mediaType={mediaType} />
      <Box sx={{ ...uiConfigs.style.mainContent }}>    
        <MediaGrid
          medias={medias}
          mediaType={mediaType}
        />
        <LoadingButton
          sx={{ marginTop: 8 }}
          fullWidth
          color="primary"
          loading={mediaLoading}
          onClick={getMedias} // Call getMedias directly
        >
          load more
        </LoadingButton>
      </Box>
    </>
  );
};

export default MediaList;
