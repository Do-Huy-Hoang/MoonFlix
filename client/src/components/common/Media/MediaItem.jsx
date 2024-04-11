import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import uiConfigs from "../../../configs/ui.configs";
import { routesGen } from "../../../routes/routes";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircularRate from "../CircularRate";
import { useSelector } from "react-redux";
import favoriteUtils from "../../../utils/favorite.utils";
import VisibilityIcon from '@mui/icons-material/Visibility';

const MediaItem = ({ media }) => {
  const { listFavorites } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [releaseYear, setReleaseYear] = useState(null);
  const [rate, setRate] = useState(null);
  useEffect(() => {
    setTitle(media.mediaTitle);
    setPosterPath(media.mediaLinkPoster);
    setReleaseYear(media.mediaYear);
    setRate(media.mediaRate);
  }, [media]);

  return (
    <Link to={routesGen.mediaDetail(media.mediaType,media.id)}>
      <Box
        sx={{
          ...uiConfigs.style.backgroundImage(posterPath),
          paddingTop: "160%",
          "&:hover .media-info": { opacity: 1, bottom: 0 },
          "&:hover .media-back-drop, &:hover .media-play-btn": { opacity: 1 },
          color: "primary.contrastText"
        }}
      >
        {favoriteUtils.check({ listFavorites, mediaId: media.id }) && (
          <FavoriteIcon
            color="primary"
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              fontSize: "2rem"
            }}
          />
        )}
        <Box
          className="media-back-drop"
          sx={{
            opacity: { xs: 1, md: 0 },
            transition: "all 0.3s ease",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
          }}
        />
        <Button
          className="media-play-btn"
          variant="contained"
          startIcon={<PlayArrowIcon />}
          sx={{
            display: { xs: "none", md: "flex" },
            opacity: 0,
            transition: "all 0.3s ease",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            "& .MuiButton-startIcon": { marginRight: "-4px" }
          }}
        />
        <Box
          className="media-info"
          sx={{
            transition: "all 0.3s ease",
            opacity: { xs: 1, md: 0 },
            position: "absolute",
            bottom: { xs: 0, md: "-20px" },
            width: "100%",
            height: "max-content",
            boxSizing: "border-box",
            padding: { xs: "10px", md: "2rem 1rem" }
          }}
        >
          <Stack spacing={{ xs: 1, md: 2 }}>
            {rate && <CircularRate value={rate} />}

            <Typography>{releaseYear}</Typography>

            <Typography
              variant="body1"
              fontWeight="700"
              sx={{
                fontSize: "1rem",
                ...uiConfigs.style.typoLines(1, "left")
              }}
            >
              {title}
            </Typography>
            <div style={{ fontSize: '12px', fontStyle: 'italic', color: 'gray' }}>
              <Typography
                variant="span"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '3px !important',
                  marginTop: '5px !important'
                }}
              >
                <VisibilityIcon fontSize="small" /> {/* Set icon size */}
                <span style={{ marginLeft: '3px' }}>{media.mediaOfViewmediaRate}</span> {/* Add inner span for text */}
              </Typography>
            </div>
          </Stack>
        </Box>
      </Box>
    </Link>
  );
};

export default MediaItem;
