import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, Typography, useTheme, IconButton, Avatar, TextareaAutosize, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  answered,
  solution,
  difficulty,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentUserDetails, setCommentUserDetails] = useState([]);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment("");
    }
  };

  useEffect(() => {
    const fetchCommentUserDetails = async () => {
      const userDetails = await Promise.all(
        comments.map(async (comment) => {
          const response = await fetch(`http://localhost:3001/users/${comment.userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          return {
            ...comment,
            userName: `${data.firstName} ${data.lastName}`,
            userPicturePath: data.userPicturePath,
          };
        })
      );
      setCommentUserDetails(userDetails);
    };

    fetchCommentUserDetails();
  }, [comments, token]);

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography
        color={main}
        sx={{
          mt: "1rem",
          overflowWrap: "break-word", // Ensure text wraps
          wordBreak: "break-word", // Break long words
          maxWidth: "100%", // Ensure text does not overflow
        }}
      >
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <form onSubmit={handleCommentSubmit}>
            <FlexBetween gap="1.5rem" mb="1rem">
              <TextareaAutosize
                minRows={1}
                maxRows={10}
                placeholder="Add a comment..."
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
                style={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem",
                  resize: "none",
                  border: "none",
                  fontSize: "0.875rem",
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  outline: "none",
                  boxShadow: "none",
                }}
              />
              <Button
                type="submit"
                disabled={!newComment}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                  padding: "0.55rem 1.5rem",
                }}
              >
                Comment
              </Button>
            </FlexBetween>
          </form>
          {commentUserDetails.map((comment, i) => (
            <Box key={`${comment.userId}-${i}`}>
              <Divider />
              <Box display="flex" alignItems="center" m="0.5rem 0" pl="1rem">
                <Avatar
                  src={`http://localhost:3001/assets/${comment.userPicturePath}`}
                  alt={comment.userName}
                  sx={{ width: 24, height: 24, mr: "0.5rem" }}
                />
                <Typography
                  sx={{
                    color: main,
                    overflowWrap: "break-word", // Ensure text wraps
                    wordBreak: "break-word", // Break long words
                    maxWidth: "calc(100% - 50px)" // Adjust based on layout
                  }}
                >
                  <strong>{comment.userName}</strong>: {comment.comment}
                </Typography>
              </Box>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
