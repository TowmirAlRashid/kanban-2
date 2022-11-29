import { Box, Typography } from '@mui/material'
import React from 'react'

const NoEngagement = () => {
  return (
    <Box                                            // div to show when no engagements are available
        sx={{
            width: '100%',
            height: '75vh',
            backgroundColor: '#e5e9ee',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: "4px"
        }}
        >
        <Typography>
            No Team Tasks Found.
        </Typography>
    </Box>
  )
}

export default NoEngagement