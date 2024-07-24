import EmojiEventsOutlined from "@mui/icons-material/EmojiEventsOutlined";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopUsersWidget = () => {
  const [topUsers, setTopUsers] = useState([]);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getTopUsers = async () => {
    const response = await fetch(`http://localhost:3001/users/top3`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTopUsers(data);
  };

  useEffect(() => {
    getTopUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getTrophyColor = (index) => {
    switch (index) {
      case 0:
        return '#bfae3c';
      case 1:
        return '#a0a0a0';
      case 2:
        return '#cd7f32'; // Bronze color
      default:
        return main; // Default color
    }
  };

  return (
    <WidgetWrapper>
      <Typography         
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}>
        Top Teachers
      </Typography>
      {topUsers.map((user, index) => (
        <Box key={user._id}>
          <FlexBetween gap="1rem" pb="1rem" onClick={() => navigate(`/profile/${user._id}`)}>
            <FlexBetween gap="1rem">
              <UserImage image={user.userPicturePath} />
              <Box>
                <Typography
                  variant="h5"
                  color={main}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.primary.light,
                      cursor: "pointer",
                    },
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography color={medium}>Level {user.level}</Typography>
              </Box>
            </FlexBetween>
            <EmojiEventsOutlined
              sx={{
                color: getTrophyColor(index),
                fontSize: '2rem',
                border: `2px solid ${getTrophyColor(index)}`, // Outline color
                borderRadius: '50%',
                padding: '4px',
              }}
            />
          </FlexBetween>
          {index < topUsers.length - 1 && <Divider />}
        </Box>
      ))}
    </WidgetWrapper>
  );
};

export default TopUsersWidget;
