import React from 'react';
import HeroSlide from '../components/common/HeroSlide';
import { Box } from '@mui/material';
import uiConfigs from "../configs/ui.configs";
import Container from "../components/common/Container";
import MediaSlide from "../components/common/Media/MediaSlide";

const HomePage = () => {
  return (
    <>
      <HeroSlide/>

      <Box marginTop="-4rem" sx={{ ...uiConfigs.style.mainContent }}>
        <Container header="Top movies">
          <MediaSlide type="movie"/>
        </Container>
        <Container header="Top tv">
          <MediaSlide type="tv"/>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;