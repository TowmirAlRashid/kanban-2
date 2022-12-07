import { Box, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'

import AddCard from "./AddTask"


import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CategoryHead = ({ name, numOfTasks, backgroundColor, borderTopColor, otherBorders, handleAddTaskSubmit, projects }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: "96%",
                    margin: "0 auto 0.25rem"
                }}
            >
                <Typography fontSize="1rem">{name}</Typography>

                <IconButton
                    onClick={handleClickOpen}
                >
                    <AddCircleOutlineIcon />
                </IconButton>
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

        <AddCard 
            open={open}
            handleClose={handleClose}
            name={name}
            handleAddTaskSubmit={handleAddTaskSubmit}
            projects={projects}
        />
    </>
  )
}

export default CategoryHead;