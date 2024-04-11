import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CircularRate from "../components/common/CircularRate";
import Container from "../components/common/Container";
import ImageHeader from "../components/common/ImageHeader";

import uiConfigs from "../configs/ui.configs";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { addFavorite, removeFavorite, setListFavorites } from "../redux/features/userSlice";

import MediaVideosSlide from "../components/common/Media/MediaVideosSlide";
import MediaReview from "../components/common/Media/MediaReview";
import genreApi from "../api/modules/genre.api";
import CastSlide from "../components/common/CastSlide";

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();

  const { user, listFavorites } = useSelector((state) => state.user);

  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await mediaApi.getDetail({ mediaId });
      dispatch(setGlobalLoading(false));
      if (response) {
        setMedia(response);
        const favorite = listFavorites?.find(fav => fav.movie.id === response.id);
        setIsFavorite(!!favorite);
      }
      if (err) toast.error(err.message);
    };

    const getGenres = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await genreApi.getList();

      if (response) {
        setGenres(response);
        getMedia();
      }
      if (err) {
        toast.error(err.message);
        setGlobalLoading(false);
      }
    };
    getGenres();
  }, [mediaType, mediaId, dispatch, listFavorites]);

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      movieId: media.id,
    };

    const { response, err } = await favoriteApi.add(body);

    setOnRequest(false);

    if (err) {
      toast.error(err.message);
      return;
    }

    if (response) {
      dispatch(addFavorite(response));
      setIsFavorite(true);
      toast.success("Add favorite success");
    }
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(fav => fav.movie.id === media.id);
    const { response, err } = await favoriteApi.remove({ favoriteId: favorite.favorite.id });

    setOnRequest(false);

    if (err) {
      toast.error(err.message);
      return;
    }

    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success("Remove favorite success");
    }
  };


  const handleButtonClick = async () => {
    await mediaApi.plustView({mediaId: media.id});
    if(media.mediaType === 'movie'){ 
      const path = `/${media.mediaType}/${media.id}/watch`;
      navigate(path);
    }else{
      const path = `/${media.mediaType}/${media.id}/1/watch`;
      navigate(path);
    }

  };
  return (
    media ? (
      <>
        <ImageHeader imgPath={media.mediaLinkPoster} />
        <Box sx={{
          color: "primary.contrastText",
          ...uiConfigs.style.mainContent
        }}>
          <Box sx={{
            marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" }
          }}>
            <Box sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" }
            }}>
              <Box sx={{
                width: { xs: "70%", sm: "50%", md: "40%" },
                margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" }
              }}>
                <Box sx={{
                  paddingTop: "140%",
                  ...uiConfigs.style.backgroundImage(media.mediaLinkPoster)
                }} />
              </Box>

              <Box sx={{
                width: { xs: "100%", md: "60%" },
                color: "text.primary"
              }}>
                <Stack spacing={5}>
                  <Typography
                    variant="h4"
                    fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                    fontWeight="700"
                    sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                  >
                    {`${media.mediaTitle}`}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularRate value={media.mediaRate} />
                    <Divider orientation="vertical" />
                    {[...media.genres].splice(0, 2).map((genreId, index) => (
                      <Chip
                        label={genres.find(e => e.id === genreId) && genres.find(e => e.id === genreId).genresTitle}
                        variant="filled"
                        color="primary"
                        key={index}
                      />
                    ))}
                  </Stack>

                  <Typography
                    variant="body1"
                    sx={{ ...uiConfigs.style.typoLines(5) }}
                  >
                    {media.mediaDecription}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <LoadingButton
                      variant="text"
                      sx={{
                        width: "max-content",
                        "& .MuiButon-starIcon": { marginRight: "0" }
                      }}
                      size="large"
                      startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                      loadingPosition="start"
                      loading={onRequest}
                      onClick={onFavoriteClick}
                    />
                    <Button
                      variant="contained"
                      sx={{ width: "max-content" }}
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      onClick={()=>handleButtonClick()}
                    >
                      watch now
                    </Button>
                  </Stack>
                  <Container header="Cast">
                    <CastSlide casts={media.performer} />
                  </Container>
                </Stack>
              </Box>
            </Box>
          </Box>

          <div ref={videoRef} style={{ paddingTop: "2rem" }}>
            <Container header="Trailer">
              <MediaVideosSlide video={media.mediaLinkTrailer} title={media.mediaType} />
            </Container>
          </div>

          <MediaReview  media={media} />
        </Box>
      </>
    ) : null
  );
};

export default MediaDetail;
