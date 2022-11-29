import { Box } from "@mui/material"
import CategoryHead from "./components/CategoryHead";
import CustomCard from "./components/Card";
import data from './data.js';
import NoEngagement from "./components/NoEngagement";



function App() {
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
              width: '2885px',
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
            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="All Tasks"
                numOfTasks={data?.length}
                backgroundColor="#dff7e4"
                borderTopColor="#93cb9d"
                otherBorders="#c7e8ce"
              />
              
              {
                data?.filter(singleData => singleData?.category === "all_tasks")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "all_tasks").map(singleData => (
                  <CustomCard
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>

            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="Emran"
                numOfTasks={data?.filter(singleData => singleData.category === "emran").length}
                backgroundColor="#daecf7"
                borderTopColor="#98bfd7"
                otherBorders="#c9deec"
              />
              {
                data?.filter(singleData => singleData?.category === "emran")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "emran").map(singleData => (
                  <CustomCard 
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>

            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="Baz"
                numOfTasks={data?.filter(singleData => singleData.category === "baz").length}
                backgroundColor="#f7edda"
                borderTopColor="#d2bc93"
                otherBorders="#e9deca"
              />
              {
                data?.filter(singleData => singleData?.category === "baz")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "baz").map(singleData => (
                  <CustomCard 
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>

            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="Hoang"
                numOfTasks={data?.filter(singleData => singleData.category === "hoang").length}
                backgroundColor="#dae0f7"
                borderTopColor="#9ba7d6"
                otherBorders="#c5cce7"
              />
              {
                data?.filter(singleData => singleData?.category === "hoang")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "hoang").map(singleData => (
                  <CustomCard 
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>

            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="Maddie"
                numOfTasks={data?.filter(singleData => singleData.category === "maddie").length}
                backgroundColor="#f7daef"
                borderTopColor="#d095c0"
                otherBorders="#eccce3"
              />
              {
                data?.filter(singleData => singleData?.category === "maddie")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "maddie").map(singleData => (
                  <CustomCard 
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>

            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="Michael"
                numOfTasks={data?.filter(singleData => singleData.category === "michael").length}
                backgroundColor="#daf5f7"
                borderTopColor="#99d1d3"
                otherBorders="#cfe9ea"
              />
              {
                data?.filter(singleData => singleData?.category === "michael")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "michael").map(singleData => (
                  <CustomCard 
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>

            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="Vignesh"
                numOfTasks={data?.filter(singleData => singleData.category === "vignesh").length}
                backgroundColor="#f7e2da"
                borderTopColor="#d6ad9e"
                otherBorders="#edd5cc"
              />
              {
                data?.filter(singleData => singleData?.category === "vignesh")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "vignesh").map(singleData => (
                  <CustomCard 
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>

            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="Waiting For Client"
                numOfTasks={data?.filter(singleData => singleData.category === "waiting").length}
                backgroundColor="#f7dae4"
                borderTopColor="#dca2b6"
                otherBorders="#eecbd7"
              />
              {
                data?.filter(singleData => singleData?.category === "waiting")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "waiting").map(singleData => (
                  <CustomCard 
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>

            <Box
              sx={{
                width: '325px',
                margin: '15px auto 30px',
                overflowY: "auto",
              }}
            >
              <CategoryHead
                name="Completed"
                numOfTasks={data?.filter(singleData => singleData.category === "completed").length}
                backgroundColor="#e7daf7"
                borderTopColor="#ad93cd"
                otherBorders="#d8c9eb"
              />
              {
                data?.filter(singleData => singleData?.category === "completed")?.length > 0 ?
                data?.filter((singleData) => singleData?.category === "completed").map(singleData => (
                  <CustomCard 
                    key={singleData?.id} 
                    projectName={singleData?.projectName}
                  />
                )) :
                <NoEngagement />
              }
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
