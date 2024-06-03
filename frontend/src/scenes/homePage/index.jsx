import React from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from '@/scenes/navbar';
import UserWidget from '@/scenes/widgets/UserWidget';

export const HomePage = () => {
  return (
    <Box>
      <Navbar />
    </Box>
  )
}

export default HomePage;