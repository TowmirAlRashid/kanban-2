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

export default function AlertDialogSlide({ open, setOpen, Name, projectId, taskId, projectName, handleTaskDelete, loading }) {
  const [deleteLoader, setDeleteLoader] = useState(loading)
  const handleClose = () => {
    setOpen(false);
  };

  const handleTaskDeleteClick = async () => {
    setDeleteLoader(true)

    await handleTaskDelete({Name, projectId, taskId})

    setDeleteLoader(false)

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
            loading={deleteLoader} 
            onClick={()=>{
              handleTaskDeleteClick()
            }}>Delete</LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}