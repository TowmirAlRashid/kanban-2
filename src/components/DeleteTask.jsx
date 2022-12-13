import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import { Box, Typography } from '@mui/material';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function AlertDialogSlide({ open, setOpen, Name, projectId, taskId, projectName, ZOHO, cardsData, setCardsData }) {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleTaskDelete = async (deleteData) => {
    // delete the selected task
    setLoading(true)
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
      setLoading(false)
    }
    handleClose()
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            padding: "1rem 20px"
          }
        }}
      >
        <Box textAlign="center" color="red" mb={2} mt={3}>
          <WarningAmberIcon fontSize="large" />
        </Box>
        <Typography ml={3} mb={2} fontWeight="bold">Are you sure you want to delete this Task?</Typography>
        <Typography fontSize={20} ml={3} mb={1}>Task Name: <span style={{ fontWeight: "bold" }}>{Name}</span></Typography>
        <Typography fontSize={20} ml={3}>Project Name: <span style={{fontWeight: "bold"}}>{projectName}</span></Typography>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>Cancel</Button>
          <LoadingButton 
            variant='contained' 
            sx={{ ml: "1rem", backgroundColor: "red" }}
            loadingPosition="start"
            startIcon={<DeleteIcon />}
            loading={loading} 
            onClick={()=>{
                handleTaskDelete({Name, projectId, taskId})
            }}>Delete</LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}