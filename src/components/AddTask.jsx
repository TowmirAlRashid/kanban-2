import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Autocomplete, Box, FormLabel, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, handleClose, name, handleAddTaskSubmit, projects, loading }) {
  // console.log({loading})
  const [addCardLoading, setAddCardLoading] = useState(loading);
  // useEffect(()=> {
  //   setLoading(addCardLoading)
  // }, [addCardLoading])
  const { control, handleSubmit, reset } = useForm();

  const [selected, setSelected] = useState([name])
  

  const getProjects = (arrayOfProjects) => {
    const arrayOfProjectNames = arrayOfProjects.filter(singleData => singleData.Project_ID !== null).map(singleData => {
      return {
        Project_Name: singleData.Project_Name,
        Project_ID: singleData.Project_ID
      }
    })
    const uniqueArrayOfProjectNames = Array.from(new Set(arrayOfProjectNames.map(project => project.Project_ID)))
    .map(id => {
      return arrayOfProjectNames.find(project => project.Project_ID === id)
    })
    return uniqueArrayOfProjectNames;
  }

  const accountManagers = ["Maddie", "Hoang", "Michael", "Baz"]

  const taskStatus = ["Open - To Do", "Analysis", "In Progress - Waiting for Developer", "Waiting on Client", "QA", "UAT", "Closed", "Backlog"]

  const billable = ["Yes", "No"]

  const assignedToOptions = ["Baz", "Binal", "Emranul", "Hoang", "Maddie", "Michael", "Mark", "Rowel"]

  const customDate = (date) => {
    const dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    let day = dateObj.getDate();
    return `${year}-${month + 1}-${day < 10 ? `0${day}` : day}`;
  }

  const handleChange = (value) => {
    setSelected(value)
  }

 

  const onsubmit = async (data) => {
    setAddCardLoading(true);
    await handleAddTaskSubmit({
      "Name": `${data.Name}`,
      "Description": `${data.Description}`,
      "Assign_To": selected,
      "Project_Name": data.Project_Name,
      "Account_Manager": `${data.Account_Manager}`,
      "Due_Date": `${customDate(data.Due_Date)}`,
      "Task_Status": `${data.Task_Status}`,
      "Billable": `${data.Billable}`,
    })

    reset({
      "Assign_To": [name],
      "Project_Name": {},
      "Account_Manager": "",
      "Name": "",
      "Task_Status": "",
      "Billable": "",
      "Description": ""
    })

  
    setAddCardLoading(false);
      handleClose()
    
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiPaper-root": {
            padding: "1rem 20px"
          }
        }}
      >
        <DialogTitle sx={{ mb: "0.5rem", mt: "1rem" }}>{`Create New Task for ${name}?`}</DialogTitle>
        <DialogContent>
          <Box 
            component="form" 
            onSubmit={handleSubmit(onsubmit)} 
          >
            <Box 
              sx={{ 
                width: "100%" ,
                display: "flex",
                flexDirection: "column",
                mb: "1rem",

              }}
            >
              <FormLabel id='assignTo' sx={{ mb: "10px", color: "black" }}>Assign To?</FormLabel>
              <Controller
                name="Assign_To"
                control={control}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      multiple
                      id="size-small-outlined-multi"
                      size="small"
                      options={assignedToOptions}
                      getOptionLabel={(option) => option}
                      defaultValue={selected}
                      onChange={(e,v)=>handleChange(v)}
                      renderInput={(params) => (
                        <TextField {...params}  />
                      )}
                    />
                  )
                }}
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ width: "47%" }}>
                <FormLabel id='projectName' sx={{ mb: "10px", color: "black" }}>Project Name</FormLabel>
                <Controller
                  name="Project_Name"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={getProjects(projects)}
                        getOptionLabel={(option) => option.Project_Name}
                        onChange={(_, data) => {
                          field.onChange({ Project_Name: data?.Project_Name, Project_ID: data?.Project_ID })
                          console.log(data)
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "0 65px 0 0",
                            marginBottom: "1rem"
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            inputProps={{
                              style: {
                                padding: '5px 14px',
                                margin: '2px 8px'
                              }
                            }}
                            {...params}
                          />
                        )}
                      />
                    )
                  }}
                />
              </Box>

              <Box sx={{ width: "47%" }}>
                <FormLabel id='projectName' sx={{ mb: "10px", color: "black" }}>Account Manager</FormLabel>
                <Controller
                  name="Account_Manager"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={accountManagers}
                        getOptionLabel={(option) => option}
                        onChange={(_, data) => {
                          field.onChange(data)
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "0 65px 0 0",
                            marginBottom: "1rem"
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            inputProps={{
                              style: {
                                padding: '5px 14px',
                                margin: '2px 8px'
                              }
                            }}
                            {...params}
                          />
                        )}
                      />
                    )
                  }}
                />
              </Box>
            </Box>

            <Controller
              control={control}
              name="Name"
              render={({ field }) => (
                <>
                  <FormLabel id='name' sx={{ mb: "10px",color: "black" }}>Task Name</FormLabel>
                  <TextField
                    inputProps={{
                      style: {
                        padding: '5px 14px',
                        margin: '2px 8px'
                      }
                    }}
                    id="name"
                    variant="outlined"
                    fullWidth
                    {...field}
                    sx={{ mb: "1rem" }}
                  />
                </>
              )}
            />

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "1rem"
              }}
            >
              <Box sx={{
                width: "30%"
              }}>
                <FormLabel id="date" sx={{ mb: "10px", color: "black" }}>Due Date</FormLabel>
                <Controller 
                  name="Due_Date"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        onChange={(newValue) => field.onChange(dayjs(newValue).format('YYYY/MM/DD'))}
                        {...field}
                        renderInput={(params) => <TextField id="date" variant="outlined" type="date" sx={{
                              "& .MuiInputBase-root": {
                                height: "2.3rem !important",
                              },
                              
                            }} {...params} required />}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Box>

              <Box sx={{ width: "30%", mt: "14px" }}>
                <FormLabel id='taskStatus' sx={{ mb: "10px", color: "black" }}>Task Status</FormLabel>
                <Controller
                  name="Task_Status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={taskStatus}
                        getOptionLabel={(option) => option}
                        onChange={(_, data) => {
                          field.onChange(data)
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "0 65px 0 0",
                            marginBottom: "1rem"
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            inputProps={{
                              style: {
                                padding: '5px 14px',
                                margin: '2px 8px'
                              }
                            }}
                            {...params}
                          />
                        )}
                      />
                    )
                  }}
                />
              </Box>

              <Box sx={{ width: "30%", mt: "14px" }}>
                <FormLabel id='billable' sx={{ mb: "10px", color: "black" }}>Is the Task Billable?</FormLabel>
                <Controller
                  name="Billable"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={billable}
                        getOptionLabel={(option) => option}
                        onChange={(_, data) => {
                          field.onChange(data)
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "0 65px 0 0",
                            marginBottom: "1rem"
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            inputProps={{
                              style: {
                                padding: '5px 14px',
                                margin: '2px 8px'
                              }
                            }}
                            {...params}
                          />
                        )}
                      />
                    )
                  }}
                />
              </Box>
            </Box>

            <Controller
              control={control}
              name="Description"
              render={({ field }) => (
                <>
                  <FormLabel id='description' sx={{ mb: "10px",color: "black" }}>Task Description</FormLabel>
                  <TextField 
                    id="description" 
                    variant="outlined" 
                    fullWidth
                    multiline
                    {...field}
                  />
                </>
              )}
            />

            <Box
              sx={{
                m: "1rem 0",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              <Button onClick={handleClose} variant="outlined">Cancel</Button>
              <LoadingButton 
                variant='contained' 
                type='button' 
                loadingPosition="start"
                startIcon={<AddIcon />}
                loading={addCardLoading}
                onClick={handleSubmit(onsubmit)}
              >
                Add Task
              </LoadingButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}