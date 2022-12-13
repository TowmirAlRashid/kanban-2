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

const ZOHO = window.ZOHO;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function App() {
  const [initialized, setInitialized] = useState(false); //initializing widget

  const [cardsData, setCardsData] = useState([]);

  const [projects, setProjects] = useState([]);

  const [expand, setExpand] = useState(false);
  const [filterProjects, setFilterProjects] = useState([]);
  const [filterPersons, setFilterPersons] = useState([]);

const [loading, setLoading] = useState(false) // loading button state

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      console.log(data);
      setInitialized(true);
    });

    ZOHO.embeddedApp.init();
  }, []);

  useEffect(() => {
    if (initialized) {
      ZOHO.CRM.API.getAllRecords({
        Entity: "ZP_Tasks",
        sort_order: "desc",
        per_page: 200,
        page: 1,
      }).then(function (data) {
        setCardsData(
          data.data?.filter((singleData) => singleData.Assign_To !== null)
        );
        setProjects(
          data.data?.filter((singleData) => singleData.Project_Name !== null)
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

    // Send data to Standalone Function
    // Billable_log_in_Minutes
    const func_name = "bcrm_zp_widget_integration";
    var req_data = {
      arguments: JSON.stringify({
        Task_Name: data.Name,
        Description: data.Description,
        Assign_To: data.Assign_To,
        Project_Name: data.Project_Name,
        Account_Manager: data.Account_Manager,
        Due_Date: data.Due_Date,
        Task_Status: data.Task_Status,
        Billable: data.Billable,
      }),
    };

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
      if (tasks[0].name === recordData.Name) {
        setCardsData([
          ...cardsData,
          {
            ...recordData,
          },
        ]);

        setLoading(false)
      }
      console.log({ crmStandaloneResp });
    } catch (error) {
      console.log({ crmStandaloneResp: error });
    }
  };

  const handleEditTask = async (data) => {
    const { Project_Name, ...rest } = data;
    var recordData = {
      Project_Name: Project_Name.Project_Name,
      ...rest,
    };

    // Send data to Standalone Function
    // Billable_log_in_Minutes
    const func_name = "bcrm_zp_widget_integration";
    var req_data = {
      arguments: JSON.stringify({
        Task_Name: data.Name,
        Task_Id: data.Task_ID,
        Description: data.Description,
        Assign_To: data.Assign_To,
        Project_Name: data.Project_Name,
        Account_Manager: data.Account_Manager,
        Due_Date: data.Due_Date,
        Task_Status: data.Task_Status,
        Billable: data.Billable,
      }),
    };
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
      console.log(tasks[0].name, recordData.Name);
      if (tasks[0].name === recordData.Name) {
        setCardsData(
          cardsData.map((card) => {
            if (card.id === recordData.id) {
              return {
                ...recordData,
              };
            }
            return card;
          })
        );
        setLoading(false)
      }

      console.log({ updateTask, req_data });
    } catch (error) {
      console.log({ updateTask: error });
    }
  };

  const handleTaskDelete = async (deleteData) => {
    // delete the selected task
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

  return (
    <div>
      <Box // parent div to hold the app
        sx={{
          width: "auto",
          height: "100vh",
          overflowX: "auto",
          backgroundColor: "#edf0f4",
        }}
      >
        <Box
          sx={{
            width: "94%",
            margin: "10px auto",
            padding: "20px 20px 0",
            display: `${expand ? "flex" : "none"}`,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "500",
            }}
          >
            Boosted CRM Tasks Board
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Typography>Sort By</Typography>

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

            <Autocomplete
              multiple
              id="filterByPerson"
              options={
                data.filter(
                  (elem) => elem.status !== "Tasks Not Assigned")
                  .map(elem => elem.status)
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
                setFilterProjects((prev) => {
                  return Array.from(new Set([
                    ...prev,
                    ...v
                  ]))
                })
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "92%",
            margin: "10px auto",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
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

        <Box // div that holds the card modules
          sx={{
            width: "94%",
            height: "100%",
            margin: "10px auto",
            padding: "20px 20px 20px",
          }}
        >
          <Box // div that holds the category modules
            sx={{
              width: `calc(${data.length * 345 + 100}px)`,
              height: "98vh",
              backgroundColor: "#edf0f4",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              gap: "1rem",
              overflowX: "scroll",
              paddingRight: "2rem",
            }}
          >
            <CustomColumn 
              columnTitle={data[0].columnTitle}
              backgroundColor={data[0].backgroundColor}
              borderTopColor={data[0].borderTopColor}
              otherBorders={data[0].otherBorders}
              numberOfTasks={
                cardsData?.filter((card) =>
                  card.Assign_To.includes(data[0].status)
                ).length
              }
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
            />

            {
              data?.filter((elem) => elem.status !== "Tasks Not Assigned") 
            ?.filter(column => {
              if(filterPersons.length > 0){
                console.log(filterPersons.length)
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
                    cardsData?.filter((card) =>
                      card.Assign_To.includes(column.status)
                    ).length
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
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
