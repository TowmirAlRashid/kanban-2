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
    filterStatus,
    kanbanLoading,
    setKanbanLoading
}) => {

    const order = ["High", "Medium", "Low", "None", null]

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
                .sort((card1, card2) => order.indexOf(card1.Priority) - order.indexOf(card2.Priority))
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
                        setKanbanLoading={setKanbanLoading}
                        kanbanLoading={kanbanLoading}
                    />
                ))
        }
    </Box>
  )
}

export default NotAssignedColumn