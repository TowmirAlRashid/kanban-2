import { Box } from '@mui/material'
import React from 'react'
import CustomCard from './Card'
import CategoryHead from './CategoryHead'
import NoEngagement from './NoEngagement'

const CustomColumn = ({ columnTitle, numberOfTasks, backgroundColor, borderTopColor, otherBorders, handleAddTaskSubmit, status, cardsData, projects, handleTaskDelete, handleEditTask }) => {
  return (
    <Box
        sx={{
            width: '345px',
            margin: '0 auto 30px',
            overflowY: "auto",
        }}
    >
        <CategoryHead
            name={columnTitle}
            numOfTasks={numberOfTasks}
            backgroundColor={backgroundColor}
            borderTopColor={borderTopColor}
            otherBorders={otherBorders}
            handleAddTaskSubmit={handleAddTaskSubmit}
            projects={projects}
        />
              
        {
            cardsData?.filter(singleData => singleData?.Assign_To?.includes(status))?.length > 0 ?
            cardsData?.filter((singleData) => singleData?.Assign_To?.includes(status)).map(singleData => (
                <CustomCard
                    key={singleData?.Name} 
                    singleData={singleData}
                    handleTaskDelete={handleTaskDelete}
                    name={columnTitle}
                    handleEditTask={handleEditTask}
                    projects={projects}
                />
            )) :
            <NoEngagement />
        }
    </Box>
  )
}

export default CustomColumn