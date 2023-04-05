import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Autocomplete, Box, FormLabel, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import FileInput from "./FileInput";

import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateTask({
  openTask,
  handleEditClose,
  handleEditTask,
  projects,
  singleData,
  loading,
}) {
  const [updateLoader, setUpdateLoader] = useState(loading);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(singleData);

  const [attachments, setAttachments] = useState([]);

  const getProjects = (arrayOfProjects) => {
    const arrayOfProjectNames = arrayOfProjects
      .filter((singleData) => singleData.Project_ID !== null)
      .map((singleData) => {
        return {
          Project_Name: singleData.Project_Name,
          Project_ID: singleData.Project_ID,
        };
      });
    const uniqueArrayOfProjectNames = Array.from(
      new Set(arrayOfProjectNames.map((project) => project.Project_ID))
    ).map((id) => {
      return arrayOfProjectNames.find((project) => project.Project_ID === id);
    });
    return uniqueArrayOfProjectNames;
  };

  const accountManagers = [
    "Maddie Hassan",
    "Hoang Tran Pham",
    "Michael Yana",
    "Baz Destiny",
  ];

  const taskStatus = [
    "Open - To Do",
    "Analysis",
    "In Progress - Waiting for Developer",
    "Waiting on Client",
    "QA",
    "UAT",
    "Closed",
    "Backlog",
  ];

  const billable = ["Yes", "No"];

  const assignedToOptions = [
    "Baz Destiny",
    "Ih shawn",
    "Emranul Hassan",
    "Hoang Tran Pham",
    "Maddie Hassan",
    "Michael Yana",
    "Boosted CRM",
    "Rowel Sabas",
  ];

  const customDate = (date) => {
    const dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    let day = dateObj.getDate();
    return `${year}-${month + 1}-${day < 10 ? `0${day}` : day}`;
  };

  // console.log("attach", attachments)

  const onsubmit = async (data) => {
    setUpdateLoader(true);

    await handleEditTask({
      id: singleData.id,
      Task_ID: singleData.Task_ID,
      Name: `${data.Name}`,
      // "Description": `${data.Description}`,
      Assign_To: data.Assign_To,
      Project_Name: singleData.Project_Name,
      Account_Manager: `${data.Account_Manager}`,
      Due_Date: `${customDate(data.Due_Date)}`,
      Task_Status: `${data.Task_Status}`,
      Billable: `${data.Billable}`,
      Is_Subtask: singleData.Is_Subtask,
      Attachments: attachments,
    });
    setAttachments([]);

    setUpdateLoader(false);
    handleEditClose();
  };

  //  console.log({"allValues": getValues(), singleData})
  return (
    <div>
      {/* {JSON.stringify(singleData)} */}
      <Dialog
        open={openTask}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleEditClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiPaper-root": {
            padding: "1rem 20px",
          },
        }}
      >
        <DialogTitle
          sx={{ mb: "0.5rem", mt: "1rem" }}
        >{`Edit This Task?`}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onsubmit)}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                mb: "1rem",
              }}
            >
              <FormLabel id="assignTo" sx={{ mb: "10px", color: "black" }}>
                Assign To?
              </FormLabel>
              <Controller
                name="Assign_To"
                control={control}
                defaultValue={singleData?.Assign_To || []}
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      multiple
                      id="size-small-outlined-multi"
                      size="small"
                      disabled
                      options={assignedToOptions}
                      getOptionLabel={(option) => option}
                      onChange={(_, data) => field.onChange(data)}
                      renderInput={(params) => (
                        <TextField {...params} error={errors["Assign_To"]} />
                      )}
                    />
                  );
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
              {/* Project Name */}
              <Box sx={{ width: "47%" }}>
                <FormLabel id="projectName" sx={{ mb: "10px", color: "black" }}>
                  Project Name
                </FormLabel>
                <Controller
                  name="Project_Name"
                  control={control}
                  defaultValue={{
                    Project_Name: singleData?.Project_Name,
                    Project_ID: singleData?.Project_ID,
                  }}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disabled
                        disablePortal
                        options={getProjects(projects)}
                        getOptionLabel={(option) =>
                          option.Project_Name ? option.Project_Name : ""
                        }
                        onChange={(_, data) => {
                          field.onChange({
                            Project_Name: data?.Project_Name,
                            Project_ID: data?.Project_ID,
                          });
                          // console.log(data)
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "0 65px 0 0",
                            marginBottom: "1rem",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            inputProps={{
                              style: {
                                padding: "5px 14px",
                                margin: "2px 8px",
                              },
                            }}
                            {...params}
                            error={errors["Project_Name"]}
                          />
                        )}
                      />
                    );
                  }}
                />
              </Box>

              {/* account manager */}
              <Box sx={{ width: "47%" }}>
                <FormLabel id="projectName" sx={{ mb: "10px", color: "black" }}>
                  Account Manager
                </FormLabel>
                <Controller
                  name="Account_Manager"
                  control={control}
                  defaultValue={singleData.Account_Manager}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={accountManagers}
                        getOptionLabel={(option) => option}
                        onChange={(_, data) => {
                          field.onChange(data);
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "0 65px 0 0",
                            marginBottom: "1rem",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            inputProps={{
                              style: {
                                padding: "5px 14px",
                                margin: "2px 8px",
                              },
                            }}
                            {...params}
                          />
                        )}
                      />
                    );
                  }}
                />
              </Box>
            </Box>

            <Controller
              control={control}
              name="Name"
              defaultValue={singleData.Name}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                    Task Name
                  </FormLabel>
                  <TextField
                    inputProps={{
                      style: {
                        padding: "5px 14px",
                        margin: "2px 8px",
                      },
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
                mb: "1rem",
              }}
            >
              {/* Due Date */}
              <Box
                sx={{
                  width: "30%",
                }}
              >
                <FormLabel id="date" sx={{ mb: "10px", color: "black" }}>
                  Due Date
                </FormLabel>
                <Controller
                  defaultValue={singleData.Due_Date}
                  name="Due_Date"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        onChange={(newValue) =>
                          field.onChange(dayjs(newValue).format("YYYY/MM/DD"))
                        }
                        {...field}
                        renderInput={(params) => (
                          <TextField
                            id="date"
                            variant="outlined"
                            type="date"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "2.3rem !important",
                              },
                            }}
                            {...params}
                            error={errors["Due_Date"]}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Box>

              {/* Task Status */}
              <Box sx={{ width: "30%", mt: "14px" }}>
                <FormLabel id="taskStatus" sx={{ mb: "10px", color: "black" }}>
                  Task Status
                </FormLabel>
                <Controller
                  name="Task_Status"
                  control={control}
                  defaultValue={singleData?.Task_Status}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={taskStatus}
                        getOptionLabel={(option) => option}
                        onChange={(_, data) => {
                          field.onChange(data);
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "0 65px 0 0",
                            marginBottom: "1rem",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            inputProps={{
                              style: {
                                padding: "5px 14px",
                                margin: "2px 8px",
                              },
                            }}
                            {...params}
                            error={errors["Task_Status"]}
                          />
                        )}
                      />
                    );
                  }}
                />
              </Box>

              {/* billable/not billable */}
              <Box sx={{ width: "30%", mt: "14px" }}>
                <FormLabel id="billable" sx={{ mb: "10px", color: "black" }}>
                  Is the Task Billable?
                </FormLabel>
                <Controller
                  name="Billable"
                  control={control}
                  defaultValue={singleData?.Billable}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        {...field}
                        disablePortal
                        options={billable}
                        getOptionLabel={(option) => option}
                        onChange={(_, data) => {
                          field.onChange(data);
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "0 65px 0 0",
                            marginBottom: "1rem",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            inputProps={{
                              style: {
                                padding: "5px 14px",
                                margin: "2px 8px",
                              },
                            }}
                            {...params}
                            error={errors["Billable"]}
                          />
                        )}
                      />
                    );
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

            {/* <Controller     // task description
              control={control}
              name="Description"
              defaultValue={singleData.Description}
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
            /> */}

            <Box
              sx={{
                m: "1rem 0",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Button
                onClick={() => {
                  reset({
                    Assign_To: singleData.Assign_To,
                    Project_Name: singleData.Project_Name,
                    Account_Manager: singleData.Account_Manager,
                    Name: singleData.Name,
                    Task_Status: singleData.Task_Status,
                    Billable: singleData.Billable,
                  });
                  setAttachments([]);
                  handleEditClose();
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                type="button"
                loadingPosition="start"
                startIcon={<SaveIcon />}
                loading={updateLoader}
                onClick={handleSubmit(onsubmit)}
              >
                Update
              </LoadingButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
