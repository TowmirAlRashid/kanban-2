import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function AlertDialogSlide({ open, setOpen, handleTaskDelete, taskId, Name }) {
  

  const handleClose = () => {
    setOpen(false);
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
        <DialogTitle>{"Do you want to Delete this Task?"}</DialogTitle>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>Cancel</Button>
          <Button 
            variant='contained' 
            sx={{ ml: "1rem" }} 
            onClick={()=>{
                handleTaskDelete({taskId, Name})
                handleClose()
            }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}