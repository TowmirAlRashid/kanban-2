import { Box } from '@mui/material'
import React from 'react'
import CustomCard from './Card'
import CategoryHead from './CategoryHead'
// import NoEngagement from './NoEngagement'

const NotAssignedColumn = ({ 
    columnTitle, 
    numberOfTasks, 
    backgroundColor, 
    borderTopColor, 
    otherBorders, 
    handleAddTaskSubmit, 
    status, 
    cardsData, 
    projects, 
    handleTaskDelete, 
    handleEditTask,
    filterProjects,
    loading, 
    setLoading,
    setCardsData,
    filterStatus
}) => {

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
            loading={loading} 
            setLoading={setLoading}
        />
              
        {
                cardsData?.filter((singleData) => singleData?.Assign_To?.includes("null"))
                .filter(singleData => {
                    if(filterProjects.length > 0){
                        return filterProjects?.includes(singleData?.Project_Name)
                    } else {
                        return singleData;
                    }
                })
                .filter(singleData => {
                    if(filterStatus.length > 0){
                        return filterStatus?.includes(singleData?.Task_Status)
                    } else {
                        return singleData;
                    }
                })
                .map(singleData => (
                    <CustomCard
                        key={singleData?.id} 
                        singleData={singleData}
                        handleTaskDelete={handleTaskDelete}
                        name={columnTitle}
                        handleEditTask={handleEditTask}
                        projects={projects}
                        loading={loading} 
                        setLoading={setLoading}
                        cardsData={cardsData}
                        setCardsData={setCardsData}
                    />
                ))
        }
    </Box>
  )
}

export default NotAssignedColumn