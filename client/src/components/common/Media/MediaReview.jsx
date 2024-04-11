import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import Container from "../Container";
import reviewApi from "../../../api/modules/review.api";
import TextAvatar from "../TextAvatar";
import { setGlobalLoading } from "../../../redux/features/globalLoadingSlice";

const ReviewItem = ({ review, onRemoved }) => {
  const { user } = useSelector((state) => state.user);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [onRequest, setOnRequest] = useState(false);

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    setReplyContent('');
  };

  const handleRemoveReview = async () => {
    if (onRequest) {
      return;
    }
    setOnRequest(true);

    if (review.replies.length === 0) {
      const { response, err } = await reviewApi.remove({ reviewId: review.id });

      if (err) {
        toast.error(err.message);
      } else if (response) {
        onRemoved(review.id);
        toast.success('Review removed successfully.');
      }
    } else {
      toast.error('Cannot remove review with replies.');
    }

    setOnRequest(false);
  };

  const handleAddReply = async () => {
    if (onRequest) {
      return;
    }
    setOnRequest(true);

    const { response, err } = await reviewApi.addReply({ reviewId: review.id, content: replyContent , movie: review.movie});

    if (err) {
      toast.error(err.message);
    } else if (response) {
      review.replies.push(response);
      setReplyContent('');
      setShowReplyForm(false);
      toast.success('Reply added successfully.');
    }

    setOnRequest(false);
  };

  const handleRemoveReply = async (replyId) => {
    if (onRequest) {
      return;
    }
    setOnRequest(true);

    const { response, err } = await reviewApi.removeReply({ reviewId: review.id, replyId });

    if (err) {
      toast.error(err.message);
    } else if (response) {
      review.replies = review.replies.filter(reply => reply.id !== replyId);
      toast.success('Reply removed successfully.');
    }

    setOnRequest(false);
  };

  return (
    <Box sx={{
      padding: 2,
      borderRadius: "5px",
      position: "relative",
      opacity: onRequest ? 0.6 : 1,
      "&:hover": { backgroundColor: "background.paper" }
    }}>
      <Stack direction="row" spacing={2}>
        <TextAvatar text={review.user_name} />
        <Stack spacing={2} flexGrow={1}>
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight="700">
              {review.user_name}
            </Typography>
            <Typography variant="caption">
              {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
            </Typography>
          </Stack>
          <Typography variant="body1" textAlign="justify">
            {review.content}
          </Typography>

          {review.replies.map(reply => (
            <Box key={reply.id} sx={{ paddingLeft: '20px', borderLeft: '1px solid grey', marginTop: '10px' }}>
              <Typography variant="body2" fontWeight="500">{reply.user_name}</Typography>
              <Typography variant="body2">{reply.content}</Typography>
              {user && user.id === reply.user && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleRemoveReply(reply.id)}
                  disabled={onRequest}
                  sx={{ marginLeft: '5px', marginTop: '5px' }}
                >
                  <DeleteIcon/> Remove
                </Button>
              )}
            </Box>
          ))}

          {!showReplyForm && user && (
            <Button onClick={handleReply} size="small">Reply</Button>
          )}

          {user && user.id === review.user && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleRemoveReview}
              disabled={onRequest || review.replies.length > 0}
              sx={{ marginLeft: '5px', marginTop: '5px' }}
            >
              <DeleteIcon/> Remove
            </Button>
          )}

          {showReplyForm && user && (
            <Box marginTop={2}>
              <TextField
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                multiline
                rows={4}
                fullWidth
                placeholder="Write your reply"
                variant="outlined"
              />
              <Stack spacing={1} direction="row" marginTop={1}>
                <Button onClick={handleCancelReply}>Cancel</Button>
                <LoadingButton
                  variant="contained"
                  size="small"
                  startIcon={<SendOutlinedIcon />}
                  loadingPosition="start"
                  loading={onRequest}
                  onClick={handleAddReply}
                >
                  Reply
                </LoadingButton>
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

const MediaReview = ({ media }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [listReviews, setListReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [onRequest, setOnRequest] = useState(false);
  const [content, setContent] = useState("");
  const [reviewCount, setReviewCount] = useState(0);

  const skip = 4;

  useEffect(() => {
    const getReview = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await reviewApi.getList(media.id);

      if (response) {
        setListReviews([...response]);
        setFilteredReviews([...response].splice(0, skip));
        setReviewCount(response.length);
      }
      if (err) {
        toast.error(err.message);
        setGlobalLoading(false);
        console.log(err);
      }
    };
    getReview();
  }, [media, dispatch]);

  const onAddReview = async () => {
    if (onRequest) {
      return;
    }
    setOnRequest(true);

    const body = {
      content,
      movie: media.id,
    };

    const { response, err } = await reviewApi.add(body);

    setOnRequest(false);

    if (err) {
      toast.error(err.message);
    }
    if (response) {
      toast.success("Post review success");
      setFilteredReviews([...filteredReviews, response]);
      setReviewCount(reviewCount + 1);
      setContent("");
    }
  };

  const onLoadMore = () => {
    setFilteredReviews([...filteredReviews, ...[...listReviews].splice(page * skip, skip)]);
    setPage(page + 1);
  };

  return (
    <>
      <Container header={`Reviews (${reviewCount})`}>
        <Stack spacing={4} marginBottom={2}>
          {filteredReviews.map((item) => (
            item.user ? <Box key={item.id}>
              <ReviewItem review={item} />
              <Divider sx={{
                display: { xs: "block", md: "none" }
              }} />
            </Box> : null
          ))}
          {filteredReviews.length < listReviews.length && (
            <Button onClick={onLoadMore}>load more</Button>
          )}
        </Stack>
        {user && (
          <>
            <Divider />
            <Stack direction="row" spacing={2}>
              <TextAvatar text={user.displayName} />
              <Stack spacing={2} flexGrow={1}>
                <Typography variant="h6" fontWeight="700">
                  {user.displayName}
                </Typography>
                <TextField
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Write your review"
                  variant="outlined"
                />
                <LoadingButton
                  variant="contained"
                  size="large"
                  sx={{ width: "max-content" }}
                  startIcon={<SendOutlinedIcon />}
                  loadingPosition="start"
                  loading={onRequest}
                  onClick={onAddReview}
                >
                  post
                </LoadingButton>
              </Stack>
            </Stack>
          </>
        )}
      </Container>
    </>
  );
};

export default MediaReview;
