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
  const [solutionUserDetails, setSolutionUserDetails] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const solutionColor = palette.success.main; // Use the success color for the solution
  const unansweredColor = palette.warning.main; // Use the warning color for unanswered posts
  const inputBackgroundColor = palette.neutral.light; // Background color for the input comment

  const patchLike = async () => {
    const response = await fetch(`https://soctutors.onrender.com/posts/${postId}/like`, {
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

    const response = await fetch(`https://soctutors.onrender.com/posts/${postId}/comment`, {
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

  const handleMarkSolution = async (commentId) => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/solution`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
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

    const fetchSolutionUserDetails = async () => {
      if (solution) {
        const comment = comments.find((c) => c._id === solution);
        if (comment) {
          const response = await fetch(`http://localhost:3001/users/${comment.userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setSolutionUserDetails({
            userName: `${data.firstName} ${data.lastName}`,
            userPicturePath: data.userPicturePath,
          });
        }
      }
    };

    fetchCommentUserDetails();
    fetchSolutionUserDetails();
  }, [comments, solution, token]);

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
      {answered ? (
        solutionUserDetails && (
          <Box display="flex" alignItems="center" mt="1rem">
            <Typography color={main} sx={{ mr: "1rem" }}>
              Answered by
            </Typography>
            <Avatar
              src={`http://localhost:3001/assets/${solutionUserDetails.userPicturePath}`}
              alt={solutionUserDetails.userName}
              sx={{ width: 24, height: 24 }}
            />
            <Typography color={main} sx={{ ml: "0.5rem" }}>
              {solutionUserDetails.userName}
            </Typography>
          </Box>
        )
      ) : (
        <Typography color={unansweredColor} sx={{ mt: "1rem" }}>
          Unanswered
        </Typography>
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
                  backgroundColor: inputBackgroundColor,
                  color: palette.text.primary, // Use theme text color
                  borderRadius: "2rem",
                  padding: "1rem",
                  resize: "none",
                  border: "none",
                  fontSize: "0.875rem",
                  fontFamily: '"Rubik", "sans-serif"',
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
            <Box key={`${comment._id}-${i}`} mt="0.5rem" pl="1rem" position="relative">
              <Box display="flex" flexDirection="column">
                {loggedInUserId === postUserId && !answered && (
                  <Button
                    onClick={() => handleMarkSolution(comment._id)}
                    sx={{
                      alignSelf: "flex-start",
                      color: main,
                      backgroundColor: inputBackgroundColor, // Matching background color
                      borderRadius: "1rem",
                      fontSize: "0.625rem", // Smaller font size
                      padding: "0.25rem 0.5rem", // Smaller padding
                      boxShadow: "none", // Remove shadow
                      mb: "0.5rem", // Margin-bottom to separate from comment text
                    }}
                  >
                    Mark as Solution
                  </Button>
                )}
                {comment._id === solution && (
                  <Typography
                    sx={{
                      color: solutionColor,
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      mb: "0.25rem",
                    }}
                  >
                    Solution
                  </Typography>
                )}
                <Box display="flex" alignItems="flex-start">
                  <Avatar
                    src={`http://localhost:3001/assets/${comment.userPicturePath}`}
                    alt={comment.userName}
                    sx={{ width: 24, height: 24, mr: "0.5rem" }}
                  />
                  <Box display="flex" flexDirection="column">
                    <Typography
                      sx={{
                        color: main,
                        overflowWrap: "break-word", // Ensure text wraps
                        wordBreak: "break-word", // Break long words
                        maxWidth: "calc(100%)", // Adjust based on layout
                      }}
                    >
                      <strong>{comment.userName}</strong>: {comment.comment}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {i < commentUserDetails.length - 1 && <Divider sx={{ mt: "0.75rem", mb: "0.75rem" }} />} {/* Ensure only single divider */}
            </Box>
          ))}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
