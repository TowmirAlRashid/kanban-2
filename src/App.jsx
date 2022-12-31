import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";

import data from "./data";
import { useEffect, useState } from "react";
import CustomColumn from "./components/CustomColumn";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotAssignedColumn from "./components/NotAssignedColumn";

const ZOHO = window.ZOHO;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function App() {
  const [initialized, setInitialized] = useState(false); //initializing widget

  const [cardsData, setCardsData] = useState([]);

  const [projects, setProjects] = useState([]);

  const [expand, setExpand] = useState(false);

  const [filterProjects, setFilterProjects] = useState([]);
  const [filterPersons, setFilterPersons] = useState([ ]);
  const [filterStatus, setFilterStatus] = useState([])

const [loading, setLoading] = useState(false) // loading button state

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      setInitialized(true);
    });

    ZOHO.embeddedApp.init();
  }, []);

  useEffect(() => {
    if (initialized) {

      const conn_name = "zoho_crm_conn";
      let req_data = {
        parameters: {
          select_query:
            "select Account_Manager, Assign_To, Billable, Billable_log_in_Minutes, Due_Date, Project_ID, Project_Name, Task_ID, Task_List_ID, Task_Status, Name from ZP_Tasks where ((Task_Status != 'Closed' and Task_Status != 'Backlog') and Name not in ('Creds', 'Cred', 'Creds') )",
        },
        method: "POST",
        url: "https://www.zohoapis.com/crm/v3/coql",
        param_type: 2,
      };
      ZOHO.CRM.CONNECTION.invoke(conn_name, req_data).then(function (data) {
        console.log({data})
        setCardsData(
          data?.details?.statusMessage?.data?.filter((singleData) => singleData.Assign_To !== null)
        );
        console.log(cardsData)
      });


      const projects_conn_name = "zoho_project_conn";
      let req_data_for_projects = {
        method: "GET",
        url: "https://projectsapi.zoho.com/restapi/portal/boostedcrm/projects/",
      };
      ZOHO.CRM.CONNECTION.invoke(projects_conn_name, req_data_for_projects).then(function (data) {
        console.log(data)
        setProjects(
          data?.details?.statusMessage?.projects?.map((singleData) => {
            return {
              Project_Name: singleData.name,
              Project_ID: singleData.id_string
            }
          })
        );
      });
    }
  }, [initialized]);


  const handleAddTaskSubmit = async (data) => {
    const { Project_Name, ...rest } = data;
    var recordData = {
      Project_Name: Project_Name.Project_Name,
      ...rest,
    };

    console.log(recordData)

    // Send data to Standalone Function
    // Billable_log_in_Minutes
    const func_name = "bcrm_zp_widget_integration";
    if(data?.Assign_To.includes("Tasks Not Assigned")){
      var req_data = {
        arguments: JSON.stringify({
          Task_Name: data.Name,
          // Assign_To: data.Assign_To,
          Project_Name: data.Project_Name,
          Account_Manager: data.Account_Manager,
          Due_Date: data.Due_Date,
          Task_Status: data.Task_Status,
          Billable: data.Billable,
        }),
      };
    } else {
      req_data = {
        arguments: JSON.stringify({
          Task_Name: data.Name,
          Assign_To: data.Assign_To,
          Project_Name: data.Project_Name,
          Account_Manager: data.Account_Manager,
          Due_Date: data.Due_Date,
          Task_Status: data.Task_Status,
          Billable: data.Billable,
        }),
      };
    }

    try {
      const crmStandaloneResp = await ZOHO.CRM.FUNCTIONS.execute(
        func_name,
        req_data
      );
      const {
        return_map: { data },
      } = crmStandaloneResp;
      if (data?.error) {
        return "";
      }
      const { tasks } = data;

      const getUrlInArray = tasks[0]?.link?.web?.url.split("/");  // gets the url in splitted array from the standalone response
      const projectId = getUrlInArray?.[5]
      const taskListId = getUrlInArray?.[6]
      const taskId = getUrlInArray?.[7]

      if (tasks[0].name === recordData.Name) {
        if(recordData?.Assign_To?.includes("Tasks Not Assigned")){
          // console.log(recordData?.Assign_To?.includes("Tasks Not Assigned"), "tasks not assigned")
          setCardsData([
            ...cardsData,
            {
              ...recordData,
              Project_ID: projectId,
              Task_List_ID: taskListId,
              Task_ID: taskId,
              Assign_To: ["null"]
            },
          ]);
        } else {
          setCardsData([
            ...cardsData,
            {
              ...recordData,
              Project_ID: projectId,
              Task_List_ID: taskListId,
              Task_ID: taskId
            },
          ]);
        }

        setLoading(false)
      }
      console.log({ crmStandaloneResp });
    } catch (error) {
      console.log({ crmStandaloneResp: error });
    }
  };

  const handleEditTask = async (data) => {
    const { Project_Name, ...rest } = data;
    // console.log(data)
    var recordData = {
      Project_Name: Project_Name.Project_Name,
      ...rest,
    };

    // Send data to Standalone Function
    // Billable_log_in_Minutes
    const func_name = "bcrm_zp_widget_integration";
    if(data?.Assign_To.includes("null")){
      if(data?.Assign_To.includes("null") && data?.Assign_To.length === 1) {
        var req_data = {
          arguments: JSON.stringify({
            Task_Name: data.Name,
            Task_Id: data.Task_ID,
            // Assign_To: data.Assign_To,
            Project_Name: data.Project_Name,
            Account_Manager: data.Account_Manager,
            Due_Date: data.Due_Date,
            Task_Status: data.Task_Status,
            Billable: data.Billable,
          }),
        };
      } else {
        req_data = {
          arguments: JSON.stringify({
            Task_Name: data.Name,
            Task_Id: data.Task_ID,
            Assign_To: data.Assign_To,
            Project_Name: data.Project_Name,
            Account_Manager: data.Account_Manager,
            Due_Date: data.Due_Date,
            Task_Status: data.Task_Status,
            Billable: data.Billable,
          }),
        };
      }
    } else {
      req_data = {
        arguments: JSON.stringify({
          Task_Name: data.Name,
          Task_Id: data.Task_ID,
          Assign_To: data.Assign_To,
          Project_Name: data.Project_Name,
          Account_Manager: data.Account_Manager,
          Due_Date: data.Due_Date,
          Task_Status: data.Task_Status,
          Billable: data.Billable,
        }),
      };
    }
    // const crmStandaloneResp = await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
    // console.log("Response from Standalone ", crmStandaloneResp)

    try {
      console.log({ UPdate_req_data: req_data });
      const updateTask = await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data);
      const {
        return_map: { data },
      } = updateTask;
      if (data?.error) {
        return "";
      }
      const { tasks } = data;

      const getUrlInArray = tasks[0]?.link?.web?.url.split("/");  // gets the url in splitted array from the standalone response
      const projectId = getUrlInArray?.[5]
      const taskListId = getUrlInArray?.[6]
      // console.log("getUrlInArray", getUrlInArray);

      console.log(tasks[0].name, recordData.Name);
      if (tasks[0].name === recordData.Name) {
        if(!recordData?.Assign_To?.includes("null")) {
          if(recordData.Task_Status === "Closed"){
            // console.log("index", cardsData.indexOf(recordData.id))
            const targetTask = (task) => {
              return task.id === recordData.id
            }

            const index = cardsData.indexOf(cardsData.find(targetTask));
            if(index > -1){
              setCardsData(cardsData?.filter((card) => card.id !== recordData.id))
            }
          } else {
            setCardsData(
              cardsData.map((card) => {
                if (card.id === recordData.id) {
                  return {
                    ...recordData,
                    Project_ID: projectId,
                    Task_List_ID: taskListId,
                  };
                }
                return card;
              })
            );
          }
        } else {
          if(recordData.Task_Status === "Closed"){
            const targetTask = (task) => {
              return task.id === recordData.id
            }

            const index = cardsData.indexOf(cardsData.find(targetTask));
            if(index > -1){
              setCardsData(cardsData?.filter((card) => card.id !== recordData.id))
            }
          } else {
            setCardsData(
              cardsData.map((card) => {
                if (card.id === recordData.id) {
                  return {
                    ...recordData,
                    Project_ID: projectId,
                    Task_List_ID: taskListId,
                  };
                }
                return card;
              })
            );
          }
        }
        
        setLoading(false)
      }

      console.log({ updateTask, req_data });
    } catch (error) {
      console.log({ updateTask: error });
    }
  };

  const handleTaskDelete = async (deleteData) => {    // delete the targeted task
    let { Name, projectId, taskId } = deleteData;

    const func_name = "bcrm_zp_widget_delete_task";
    var req_data = {
      arguments: JSON.stringify({
        Task_Id: taskId,
        Project_ID: projectId,
      }),
    };
    try {
      const crmStandaloneDeleteResp = await ZOHO.CRM.FUNCTIONS.execute(
        func_name,
        req_data
      );
      const {
        return_map: { data },
      } = crmStandaloneDeleteResp;
      if (data?.error) {
        return "";
      }
      if(data.response === "Task Deleted Successfully"){
        setCardsData(cardsData?.filter((card) => card.Name !== Name));
        setLoading(false)
      }
      // Task Deleted Successfully
      console.log("crmStandaloneDeleteResp", crmStandaloneDeleteResp);
    } catch (error) {
      console.log({crmStandaloneDeleteResp: error});
    }
  };

  const getProjectNames = (arrayOfProjects) => {
    const arrayOfProjectNames = arrayOfProjects
      .filter((singleData) => singleData.Project_ID !== null)
      .map((singleData) => singleData.Project_Name);
    const uniqueArrayOfProjectNames = Array.from(new Set(arrayOfProjectNames));
    // console.log(uniqueArrayOfProjectNames);
    return uniqueArrayOfProjectNames;
  };

  const statusOptions = ["Open - To Do", "Analysis", "In Progress - Waiting for Developer", "Waiting on Client", "QA", "UAT"]



  return (
    <div>
      <Box // parent div to hold the app
        sx={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#edf0f4",
        }}
      >
        <Box
          sx={{
            width: "99%",
            pt: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: "row"
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "500",
              ml: "1.5rem"
            }}
          >
            Boosted CRM Tasks Board
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              gap: "1rem"
            }}
          >
            <Box
              sx={{
                display: `${expand ? "flex" : "none"}`,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Typography>Sort By</Typography>

              {/* filter by projects */}
              <Autocomplete
                multiple
                id="filterByProject"
                options={getProjectNames(projects)}
                limitTags={1}
                size="small"
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                )}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter By Project" />
                )}
                onChange={(e, v) => {
                  setFilterProjects(v)
                }}
              />

              {/* filter by persons */}
              <Autocomplete
                multiple
                id="filterByPerson"
                value={filterPersons}
                options={
                  data?.filter(elem => elem.status !== "Tasks Not Assigned")
                    .map(elem => {
                      return elem.status;
                    })
                }
                disableCloseOnSelect
                limitTags={1}
                size="small"
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                )}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter By Person" />
                )}
                onChange={(e, v) => {
                  setFilterPersons(v)
                }}
              />

              {/* filter by status */}
              <Autocomplete
                multiple
                id="filterByStatus"
                options={statusOptions}
                disableCloseOnSelect
                limitTags={1}
                size="small"
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                )}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter By Status" />
                )}
                onChange={(e, v) => {
                  setFilterStatus(v)
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: "1rem"
              }}
            >
              <Button
                variant="contained"
                endIcon={expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setExpand(!expand)}
              >
                Filter Options
              </Button>
            </Box>
          </Box>
        </Box>

        <Box // div that holds the card modules
          sx={{
            width: "auto",
            overflowX: "auto",
            ml: "5rem",
            height: `${expand ? "84vh" : "91vh"}`,
            margin: "10px auto 0",
            padding: "20px 20px 0px",
            backgroundColor: "#edf0f4",
          }}
        >
          <Box // div that holds the category modules
            sx={{ //data.length * 345 + 100
              width: `calc(${filterPersons.length > 0 ? (filterPersons.length + 1) * 345 + 100 : data.length * 345 + 100}px)`,
              height: "100%",
              backgroundColor: "#edf0f4",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: "1rem",
              // overflowX: "scroll",
              paddingRight: "2rem",
              paddingleft: "2rem",
            }}
          >
            <NotAssignedColumn
              key={data[0].id}
              columnTitle={data[0].columnTitle}
              numberOfTasks={
                cardsData?.filter((card) => card?.Assign_To?.includes("null")).length
              }
              backgroundColor={data[0].backgroundColor}
              borderTopColor={data[0].borderTopColor}
              otherBorders={data[0].otherBorders}
              handleAddTaskSubmit={handleAddTaskSubmit}
              status={data[0].status}
              cardsData={cardsData}
              setCardsData={setCardsData}
              projects={projects}
              handleTaskDelete={handleTaskDelete}
              handleEditTask={handleEditTask}
              filterProjects={filterProjects}
              loading={loading} 
              setLoading={setLoading}
              filterStatus={filterStatus}
            />

            {
              data?.filter(column => column.status !== "Tasks Not Assigned")
              ?.filter(column => {
                if(filterPersons.length > 0){
                  console.log(filterPersons)
                  return filterPersons?.includes(column.columnTitle)
                } else {
                  return column;
                }
              })
              ?.map((column) => {
                return (
                  <CustomColumn
                    key={column.id}
                    columnTitle={column.columnTitle}
                    numberOfTasks={
                      cardsData?.filter((card) => card?.Assign_To?.includes(column.status)).length
                    }
                    backgroundColor={column.backgroundColor}
                    borderTopColor={column.borderTopColor}
                    otherBorders={column.otherBorders}
                    handleAddTaskSubmit={handleAddTaskSubmit}
                    status={column.status}
                    cardsData={cardsData}
                    setCardsData={setCardsData}
                    projects={projects}
                    handleTaskDelete={handleTaskDelete}
                    handleEditTask={handleEditTask}
                    filterProjects={filterProjects}
                    loading={loading} 
                    setLoading={setLoading}
                    filterStatus={filterStatus}
                  />
                );
              })
            }
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
