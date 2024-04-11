import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import mediaApi from "../api/modules/media.api";
import MediaGrid from "../components/common/Media/MediaGrid";
import uiConfigs from "../configs/ui.configs";

const mediaTypes = ["movie", "tv", "people"];
let timer;
const timeout = 500;

const MediaSearch = () => {
  const [query, setQuery] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);

  const search = useCallback(
    async () => {
      setOnSearch(true);

      const { response, err } = await mediaApi.search({
        mediaType,
        query,
      });

      setOnSearch(false);

      if (err) toast.error(err.message);
      if (response) {
        setMedias([...response]);
      }
    },
    [mediaType, query],
  );

  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([]);
    } else search();
  }, [search, query, mediaType]);

  useEffect(() => {
    setMedias([]);
  }, [mediaType]);

  const onCategoryChange = (selectedCategory) => setMediaType(selectedCategory);

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer);

    timer = setTimeout(() => {
      setQuery(newQuery);
    }, timeout);
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack spacing={2}>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            {mediaTypes.map((item, index) => (
              <Button
                size="large"
                key={index}
                variant={mediaType === item ? "contained" : "text"}
                sx={{
                  color: mediaType === item ? "primary.contrastText" : "text.primary"
                }}
                onClick={() => onCategoryChange(item)}
              >
                {item}
              </Button>
            ))}
          </Stack>
          <TextField
            color="success"
            placeholder="Search MoonFlix"
            sx={{ width: "100%" }}
            autoFocus
            onChange={onQueryChange}
          />

          <MediaGrid medias={medias} mediaType={mediaType} />
        </Stack>
      </Box>
    </>
  );
};

export default MediaSearch;