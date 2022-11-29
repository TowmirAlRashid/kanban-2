import { Box, Typography } from '@mui/material'
import React from 'react'

const CategoryHead = ({ name, numOfTasks, backgroundColor, borderTopColor, otherBorders }) => {
  return (
    <Box
        sx={{
            width: '100%',
            borderRadius: '5px',
            backgroundColor: `${backgroundColor}`,
            padding: '8px 12px',
            margin: '10px auto',
            borderTop: `4px solid ${borderTopColor}`,
            borderLeft: `1px solid ${otherBorders}`, 
            borderRight: `1px solid ${otherBorders}`, 
            borderBottom: `1px solid ${otherBorders}`,
            position: "sticky",
            top: "0"
        }}
        className="module_category_header"
    >
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: "96%",
                margin: "0 auto 0.25rem"
            }}
        >
            <Typography fontSize="1rem">{name}</Typography>
        </Box>

        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: "96%",
                margin: "0 auto"
            }}
        >
            <Typography fontSize="0.8rem">{`${numOfTasks}`} Team Tasks</Typography>
        </Box>
    </Box>
  )
}

export default CategoryHead;