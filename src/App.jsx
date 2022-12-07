import { Box } from "@mui/material"

import data from "./data";

// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEffect, useState } from "react";
import CustomColumn from "./components/CustomColumn";

const ZOHO = window.ZOHO;


function App() {
  const [initialized, setInitialized] = useState(false) //initializing widget

  const [cardsData, setCardsData] = useState([]);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad",function(data)
    {
      console.log(data)
      setInitialized(true)
    })

    ZOHO.embeddedApp.init();
  }, [])


  useEffect(() => {
    if(initialized){
      ZOHO.CRM.API.getAllRecords({Entity:"ZP_Tasks",sort_order:"desc",per_page:200,page:1})
      .then(function(data){
        setCardsData(data.data?.filter(singleData => singleData.Assign_To !== null))
        setProjects(
          data.data?.filter(singleData => singleData.Project_Name !== null)
        )
      })
    }
  }, [initialized])


  const handleAddTaskSubmit = async (data) => {     // add a new task
    const {Project_Name, ...rest} = data;
    var recordData = {
      "Project_Name": Project_Name.Project_Name, ...rest
    }

    console.log(recordData)

    ZOHO.CRM.API.insertRecord({Entity:"ZP_Tasks",APIData:recordData,Trigger:[""]}).then(function(data){
      console.log(data);
      if (data?.data?.[0]?.code === 'SUCCESS'){
        setCardsData([
          ...cardsData,
          {
            ...recordData
          }
        ])
      }
    });
    // Send data to Standalone Function
    // Billable_log_in_Minutes
    const func_name = "bcrm_zp_widget_integration";
    var req_data ={
      "arguments": JSON.stringify(data)
    };
    const crmStandaloneResp = await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
    console.log("Response from Sandalone ", crmStandaloneResp)
  }


  const handleEditTask = async (data) => {  // edit and update the task
    const {Project_Name, ...rest} = data;
    var recordData = {
      "Project_Name": Project_Name.Project_Name, ...rest
    }

    console.log(recordData)

    var config={
      Entity:"ZP_Tasks",
      APIData:{
        ...recordData
      },
      Trigger:[""]
    }
    ZOHO.CRM.API.updateRecord(config)
    .then(function(data){
      if (data?.data?.[0]?.code === 'SUCCESS'){
        setCardsData(cardsData.map(card => {
          if(card.id === recordData.id){
            return {
              ...recordData
            }
          }

          return card;
        }))
      }
    })
  }


  const handleTaskDelete = (data) => {              // delete the selected task
    let { taskId, Name } = data;

    ZOHO.CRM.API.deleteRecord({Entity:"ZP_Tasks",RecordID: taskId})
    .then(function(data){
        if(data?.data?.[0]?.code === "SUCCESS"){
          setCardsData(cardsData?.filter(card => card.Name !== Name))
        }
    })
  }


  

  return (
    <div className="App">
      <Box                                            // parent div to hold the app
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundColor: "#edf0f4"
        }}
      >
        <Box                                          // div that holds the card modules
          sx={{
            width: '94%',
            height : '100%',
            margin: '0 auto',
            padding: "20px",
          }}
        >
          <Box                                      // div that holds the category modules
            sx={{
              width: `calc(${data.length * 345 + 100}px)`,
              height: '98vh',
              backgroundColor: "#edf0f4",
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              gap: "1rem",
              overflowX: "scroll",
              paddingRight: "2rem"
            }}
          >
            {
              data?.map(column => {
                return (
                  <CustomColumn
                    key={column.id}
                    columnTitle={column.columnTitle}
                    numberOfTasks={cardsData?.filter(card => card.Assigned_to === column.status).length}
                    backgroundColor={column.backgroundColor}
                    borderTopColor={column.borderTopColor}
                    otherBorders={column.otherBorders}
                    handleAddTaskSubmit={handleAddTaskSubmit}
                    status={column.status}
                    cardsData={cardsData}
                    projects={projects}
                    handleTaskDelete={handleTaskDelete}
                    handleEditTask={handleEditTask}
                  />
                )
              })
            }
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
