
import { Box } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {Pagination} from 'react-bootstrap';
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import mediaApi from "../api/modules/media.api";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";

import MediaVideosSlide from "../components/common/Media/MediaVideosSlide";

const WatchMovie = () => {
  const { mediaType, mediaId, number } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState();
  const dispatch = useDispatch();

  const videoRef = useRef(null);

  
  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = (number === undefined ? await mediaApi.getDetail({ mediaId }): await mediaApi.getFirm({ mediaId, episode:number }));
    
      dispatch(setGlobalLoading(false));
      if (response) {
        setMedia(response);
      }
  
      if (err) toast.error(err.message);
    };

    
    getMedia();
  }, [mediaType, mediaId, dispatch, number]);
  
  const hanldeChangeEpisode =  (number) => {
    const path = `/${media.type}/${media.id}/${number}/watch`;
      navigate(path);
  }

  let items = [];
  for (let i = 1; i <= media?.episodes; i++) {
    items.push(
      <Pagination.Item key={i} active={i === parseInt(number)} onClick={()=>hanldeChangeEpisode(i)}>
        {i}
      </Pagination.Item>,
    );
  }
  return (
    media ? (
      <>
        <Box sx={{
          color: "primary.contrastText",
          ...uiConfigs.style.mainContent
        }}>
          {/* media videos */}
          <div ref={videoRef} style={{ paddingTop: "2rem" }}>
            <Container header={media.title === undefined ? media.mediaTitle : media.title}>
              <MediaVideosSlide video={media.mediaLinkEnbale} title={media.mediaType} />
              {media.type === 'tv' ?
                <Pagination>{items}</Pagination>:''
              }       
            </Container>
          </div>
        </Box>
      </>
    ) : null
  );
};

export default WatchMovie;