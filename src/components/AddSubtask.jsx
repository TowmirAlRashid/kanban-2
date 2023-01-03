import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Autocomplete, Box, FormLabel, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';

import FileInput from './FileInput';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ 
  open, 
  handleClose, 
  taskName, 
  name, 
  handleAddTaskSubmit, 
  loading,
  Project_Name,
  Project_ID,
  Account_Manager,
  Task_ID
 }) {
  // console.log({projects})
  const [addCardLoading, setAddCardLoading] = useState(loading);
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  const [attachments, setAttachments] = useState([])

  const taskStatus = ["Open - To Do", "Analysis", "In Progress - Waiting for Developer", "Waiting on Client", "QA", "UAT", "Closed", "Backlog"]

  const billable = ["Yes", "No"]

  const assignedToOptions = ["Baz Destiny", "Ih shawn", "Emranul Hassan", "Hoang Tran Pham", "Maddie Hassan", "Michael Yana", "Boosted CRM", "Rowel Sabas"]

  const customDate = (date) => {
    const dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    let day = dateObj.getDate();
    return `${year}-${month + 1}-${day < 10 ? `0${day}` : day}`;
  }

  useEffect(() => {
    reset({
      "Assign_To": [name],
      "Name": "",
      "Task_Status": "",
      "Billable": "",
    })
    setAttachments([])
  }, [open]);

 

  const onsubmit = async (data) => {
    setAddCardLoading(true);
    await handleAddTaskSubmit({
      "Name": `${data.Name}`,
      "Assign_To": data.Assign_To,
      "Project_Name": {Project_Name, Project_ID},
      "Account_Manager": Account_Manager,
      "Due_Date": `${customDate(data.Due_Date)}`,
      "Task_Status": `${data.Task_Status}`,
      "Billable": `${data.Billable}`,
      "Task_ID": Task_ID,
      "Attachments": attachments
    })

    reset({
      "Assign_To": [name],
      "Name": "",
      "Task_Status": "",
      "Billable": "",
    })

    setAttachments([])
  
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
        <DialogTitle sx={{ mb: "0.5rem", mt: "1rem" }}>{`Create SubTask?`}</DialogTitle>
        <Typography
          sx={{
            ml: "1.7rem",
            fontSize: "1.3rem"
          }}
        >Parent Task: <strong>{`${taskName}`}</strong></Typography>
        
        <DialogContent>
          <Box 
            component="form" 
            onSubmit={handleSubmit(onsubmit)} 
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "15px"
              }}
            >
              <Box sx={{ 
                width: "47%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}>
                <FormLabel id='projectName' sx={{  color: "black" }}>Project Name</FormLabel>
                <Controller
                  name="Project_Name"
                  control={control}
                  defaultValue={Project_Name}
                  render={({ field }) => {
                    return (
                      <TextField
                        inputProps={{
                          style: {
                            padding: '5px 14px',
                            margin: '2px 8px'
                          }
                        }}
                        {...field}
                        defaultValue={Project_Name}
                        disabled
                      />
                    )
                  }}
                />
              </Box>

              <Box sx={{ 
                width: "47%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start", 
              }}>
                <FormLabel id='accountManager' sx={{ color: "black" }}>Account Manager</FormLabel>
                <Controller
                  name="Account_Manager"
                  control={control}
                  defaultValue={Account_Manager}
                  render={({ field }) => {
                    return (
                      <TextField
                        inputProps={{
                          style: {
                            padding: '5px 14px',
                            margin: '2px 8px'
                          }
                        }}
                        {...field}
                        value={Account_Manager}
                        disabled
                      />
                    )
                  }}
                />
              </Box>
            </Box>

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
                rules={{required: true}}
                defaultValue={[name] || []}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      multiple
                      id="size-small-outlined-multi"
                      size="small"
                      options={assignedToOptions}
                      getOptionLabel={(option) => option}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={(params) => (
                        <TextField {...params} error={errors["Assign_To"]} />
                      )}
                    />
                  )
                }}
              />
            </Box>

            <Controller
              control={control}
              name="Name"
              rules={{required: true}}
              render={({ field }) => (
                <>
                  <FormLabel id='name' sx={{ mb: "10px",color: "black" }}>SubTask Name</FormLabel>
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
                    error={errors["Name"]}
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
                  defaultValue={customDate(new Date())}
                  rules={{required: true}}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        onChange={(newValue) => field.onChange(dayjs(newValue).format('YYYY/MM/DD'))}
                        {...field}
                        renderInput={(params) => <TextField id="date" variant="outlined" type="date" sx={{
                              "& .MuiInputBase-root": {
                                height: "2.3rem !important",
                              },
                              
                            }} {...params} error={errors["Due_Date"]} />}
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
                  rules={{required: true}}
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
                            error={errors["Task_Status"]}
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
                  rules={{required: true}}
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
                            error={errors["Billable"]}
                          />
                        )}
                      />
                    )
                  }}
                />
              </Box>
            </Box>

            <Box>
              <FileInput
                name="file alt text"
                label="Upload Attachments"
                attachments={attachments}
                setAttachments={setAttachments}
              />
            </Box>

            {/* <Controller
              control={control}
              name="Description"
              render={({ field }) => (
                <>
                  <FormLabel id='description' sx={{ mb: "10px",color: "black" }}>Add Attachments</FormLabel>
                  <TextField 
                    id="description" 
                    variant="outlined" 
                    fullWidth
                    type="file"
                    {...field}
                  />
                </>
              )}
            /> */}

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
              <Button onClick={() => {
                reset({
                  "Assign_To": [name],
                  "Project_Name": null,
                  "Account_Manager": "",
                  "Name": "",
                  "Task_Status": "",
                  "Billable": "",
                  // "Description": ""
                })
                setAttachments([])
                handleClose()
              }} variant="outlined">Cancel</Button>
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