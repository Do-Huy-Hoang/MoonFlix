import { Box, Toolbar, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PersonMediaGrid from "../components/common/PersonMediaGrid";
import uiConfigs from "../configs/ui.configs";
import Container from "../components/common/Container";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import performerMovieApi from "../api/modules/perfomerMovie.api";

const PersonDetail = () => {
  const { personId,permoId } = useParams();
  const [person, setPerson] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    const getPerson = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await performerMovieApi.detail( personId, permoId);
      dispatch(setGlobalLoading(false));

      if (err) toast.error(err.message);
      if (response) {
        setPerson(response)
      };
    };

    getPerson();
  }, [personId]);

  return (
    <>
      <Toolbar />
      {person && (
        <>
          <Box sx={{ ...uiConfigs.style.mainContent }}>
            <Box sx={{
              position: "relative",
              display: "flex",
              flexDirection: { xs: "column", md: "row" }
            }}>
              <Box sx={{
                width: { xs: "50%", md: "20%" }
              }}>
                <Box sx={{
                  paddingTop: "160%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "darkgrey",
                  backgroundImage: `url('data:image/jpeg;base64,${person?.performer?.perAvatar}')`
                }} />
              </Box>
              <Box sx={{
                width: { xs: "100%", md: "80%" },
                padding: { xs: "1rem 0", md: "1rem 2rem" }
              }}>
                <Stack spacing={2}>
                  <Typography variant="h5" fontWeight="700">
                    {`${person.performer?.perName} (${person.performer?.perYear})`}
                  </Typography>
                  <Typography sx={{ ...uiConfigs.style.typoLines(10) }}>
                    {person?.perMoDescription}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default PersonDetail;