import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import reviewApi from "../api/modules/review.api";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { routesGen } from "../routes/routes";

const ReviewItem = ({ review }) => {
  const navigate = useNavigate();
  const [onRequest, setOnRequest] = useState(false);
  const handleButtonClick = (media) => {
    const path = `/${media.mediaType}/${media.id}`;
    navigate(path);
  };

  return (
    <Box sx={{
      position: "relative",
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      padding: 1,
      opacity: onRequest ? 0.6 : 1,
      "&:hover": { backgroundColor: "background.paper" }
    }}>
      <Box sx={{ width: { xs: 0, md: "10%" } }}>
        <Link
          to={routesGen.mediaDetail(review.mediaType, review.movie.id)}
          style={{ color: "unset", textDecoration: "none" }}
        >
          <Box sx={{
            paddingTop: "160%",
            ...uiConfigs.style.backgroundImage(review.movie.mediaLinkPoster)
          }} />
        </Link>
      </Box>

      <Box sx={{
        width: { xs: "100%", md: "80%" },
        padding: { xs: 0, md: "0 2rem" }
      }}>
        <Stack spacing={1}>
          <Link
            to={routesGen.mediaDetail(review.mediaType, review.mediaid)}
            style={{ color: "unset", textDecoration: "none" }}
          >
            <Typography
              variant="h6"
              sx={{ ...uiConfigs.style.typoLines(1, "left") }}
            >
              {review.mediaTitle}
            </Typography>
          </Link>
          <Typography variant="caption">
            {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Typography>
          <Typography>{review.content}</Typography>
        </Stack>
      </Box>

      <LoadingButton
        variant="contained"
        sx={{
          position: { xs: "relative", md: "absolute" },
          right: { xs: 0, md: "10px" },
          marginTop: { xs: 2, md: 0 },
          width: "max-content"
        }}
        endIcon={<ArrowForwardIosIcon />}
        loading={onRequest}
        onClick={()=>handleButtonClick(review.movie)}
      >
        Go
      </LoadingButton>
    </Box>
  );
};

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();

  const skip = 2;

  useEffect(() => {
    const getReviews = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await reviewApi.getListOfUser();
      dispatch(setGlobalLoading(false));

      if (err) toast.error(err.message);
      if (response) {
        setCount(response.length);
        setReviews([...response]);
        setFilteredReviews([...response].splice(0, skip));
      }
    };

    getReviews();
  }, []);

  const onLoadMore = () => {
    setFilteredReviews([...filteredReviews, ...[...reviews].splice(page * skip, skip)]);
    setPage(page + 1);
  };


  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Your reviews (${count})`}>
        <Stack spacing={2}>
          {filteredReviews.map((item,index) => (
            <Box key={index}>
              <ReviewItem review={item} />
              <Divider sx={{
                display: { xs: "block", md: "none" }
              }} />
            </Box>
          ))}
          {filteredReviews.length < reviews.length && (
            <Button onClick={onLoadMore}>load more</Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ReviewList;

