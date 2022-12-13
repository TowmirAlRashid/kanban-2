import { Box } from '@mui/material'
import React from 'react'
import CustomCard from './Card'
import CategoryHead from './CategoryHead'
import NoEngagement from './NoEngagement'

const CustomColumn = ({ 
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
    setLoading
}) => {

    // console.log({filterProjects})
    
    // const filteredCardData = cardsData.filter(indvCardData => {
    //     let valid = true;
    //     if(filterProjects.length > 0){
    //         const filteredProjects = filterProjects?.filter(indvProject => indvProject.Project_ID === indvCardData.Project_ID)
    //         if(filteredProjects.length === 0){
    //             valid = false;
    //         }
    //     }
        
        
    //     return valid;
    // })
    // console.log({filteredCardData})

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
                cardsData?.filter((singleData) => singleData?.Assign_To?.includes(status))
                .filter(singleData => {
                    if(filterProjects.length > 0){
                        return filterProjects?.includes(singleData?.Project_Name)
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
                    />
                ))
        }

        {
            // (cardsData?.filter(singleData => singleData?.Assign_To?.includes(status)).length === 0 || cardsData?.filter((singleData) => filterProjects.includes(singleData.Project_Name)).length === 0) && <NoEngagement />
        }

        {
            // filterProjects?.length > 0 && cardsData?.filter(singleData => singleData?.Assign_To?.includes(status)).length === 0 && <NoEngagement />
        }

        {
            // filterProjects?.length > 0 && cardsData?.filter(singleData => singleData?.Assign_To?.includes(status)).length > 0 && !filterProjects?.includes(status) && <NoEngagement />
        }

        {
            // (cardsData?.filter((singleData) => singleData?.Assign_To?.includes(status)).length > 0) && (cardsData?.filter((singleData) => filterProjects.includes(singleData.Project_Name)).length === 0) && <NoEngagement />
        }

        {
            // cardsData?.filter(singleData => filterProjects?.includes(singleData?.Project_Name)).length === 0 && <NoEngagement />
            // console.log(cardsData)
        }

        {
            // console.log("filterProjects", cardsData?.filter((singleData) => filterProjects.includes(singleData.Project_Name)).length)
        }
    </Box>
  )
}

export default CustomColumn