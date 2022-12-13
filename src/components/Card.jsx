import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, Chip, Divider, IconButton } from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

import DeleteTask from "./DeleteTask"
import UpdateTask from "./UpdateTask"

const CustomCard = ({ singleData, handleTaskDelete, name, handleEditTask, projects }) => {
  // console.log(singleData)
  const { Project_Name, Account_Manager, Name, Task_Status, Billable_log_in_Minutes, Due_Date, Billable, id, Project_ID, Task_ID } = singleData;

  const [hover, setHover] = useState(false)

  const handleMouseOver = () => {
    setHover(true)
  }

  const handleMouseOut = () => {
    setHover(false)
  }

  const countHr = (minutes) => {
    if(minutes === null || minutes === undefined) {
      return "0 Hr"
    }
    if(minutes === 0) {
      return "0 Hr"
    }
    let timeString = "";
    timeString += (`${Math.floor(minutes / 60)}:${minutes % 60 === 0 ? "00" : minutes % 60 < 10 ? `0${minutes % 60}` : minutes % 60} Hrs`)
    
    return timeString;
  }


  //delete record
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };


  // update record
  const [openTask, setOpenTask] = useState(false);

  const handleClickEditOpen = () => {
    setOpenTask(true);
  };

  const handleEditClose = () => {
    setOpenTask(false);
  };

  return (
    <>
      <Card 
        sx={{ 
          width: '100%', 
          margin: '10px auto',  
          cursor: "pointer" ,
          borderLeft: `${
            Task_Status === "Open - To Do" ? "4px solid #98d681" 
            : Task_Status === "Analysis" ? "4px solid #f6c1ff" 
            : Task_Status === "In Progress - Waiting for Developer" ? "4px solid #25b52a" 
            : Task_Status === "Waiting on Client" ? "4px solid #5cb3fd" 
            : Task_Status === "QA" ? "4px solid #ffda62" 
            : Task_Status === "UAT" ? "4px solid #5d4ffb" 
            : Task_Status === "Closed" ? "4px solid #eb4d4d" 
            : "4px solid #dbdbdb"}`,
          borderRadius: "4px",
        }}

        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
          <Box
            sx={{
              width: "98%",
              margin: "8px auto 4px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "0.6rem",
              padding: "8px 16px"
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color:  "rgba(0, 0, 0, 0.6)",
                  lineHeight: "20px"
                }}
              >
                {Project_Name}
              </Typography>

              <Chip
                label={`${Account_Manager}`} 
                sx={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color:  "rgba(0, 0, 0, 0.87)",
                  lineHeight: "16px"
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "600",
                color:  "rgba(0, 0, 0, 0.87)",
                lineHeight: "20px"
              }}
            >
              {Name}
            </Typography>
          </Box>

          <Divider sx={{ width: "100%" }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 16px 16px"
            }}
          >
            <Box
              sx={{
                width: "98%",
                margin: "8px auto 4px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: "1rem"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: "4px"
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#757575",
                    lineHeight: "16px"
                  }}
                >
                  Log Time
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: "14px" }} />
                  <Typography fontSize="14px">
                    {countHr(Billable_log_in_Minutes)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  gap: "4px"
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#EF5350",
                    lineHeight: "16px"
                  }}
                >
                  Due Date
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                >
                  <EventNoteIcon sx={{ fontSize: "14px" }} />
                  <Typography fontSize="14px">
                    {Due_Date}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "1rem"
                }}
              >
                <Chip 
                  label={Task_Status === "In Progress - Waiting for Developer" ? "In Progress" : Task_Status === "Waiting on Client" ? "Waiting" : Task_Status === "Open - To Do" ? "Open" : Task_Status} 
                  variant="outlined" 
                  sx={{
                    border: "none",
                    backgroundColor: `${
                      Task_Status === "Open - To Do" ? "#98d681" 
                      : Task_Status === "Analysis" ? "#f6c1ff" 
                      : Task_Status === "In Progress - Waiting for Developer" ? "#25b52a" 
                      : Task_Status === "Waiting on Client" ? "#5cb3fd" 
                      : Task_Status === "QA" ? "#ffda62"
                      : Task_Status === "UAT" ? "#5d4ffb" 
                      : Task_Status === "Closed" ? "#eb4d4d" 
                      : "#dbdbdb"}`,
                    color: `${Task_Status === "Open - To Do" || Task_Status === "Analysis" || Task_Status === "QA" || Task_Status === "Backlog" ? "Black" : "white"}`,
                  }}
                />

                <Box
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    borderRadius: "16px",
                    height: "32px",
                    p: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.2rem"
                    }}
                  >
                    <CreditCardIcon 
                      sx={{  
                        color: `${Billable === "Yes" ? "#9C27B0" : "rgba(0, 0, 0, 0.87)"}`, 
                      }} 
                    />
                    <Typography 
                      sx={{ 
                        fontSize: "0.8125rem",
                        color: `${Billable === "Yes" ? "#9C27B0" : "rgba(0, 0, 0, 0.87)"}`,
                      }}
                    >
                      {Billable === "Yes" ? "Billable" : (Billable === null || Billable === "No") ? "Not Billable" : ""}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: `${hover === true ? "flex" : "none"}`,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <Box>
                  <IconButton
                    sx={{
                      padding: "4px"
                    }}
                    onClick={handleClickEditOpen}
                  >
                    <EditIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton
                    sx={{
                      padding: "4px"
                    }}
                    onClick={handleClickOpen}
                  >
                    <DeleteIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
      </Card>

      <DeleteTask 
        open={open}
        setOpen={setOpen}
        handleTaskDelete={handleTaskDelete}
        recordId={id}
        Name={Name}
        projectId={Project_ID}
        taskId={Task_ID}
        projectName={Project_Name}
      />

      <UpdateTask 
        openTask={openTask}
        handleEditClose={handleEditClose}
        handleEditTask={handleEditTask}
        projects={projects}
        singleData={singleData}
      />
    </>
  );
}

export default CustomCard;