import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';

type ConfirmationDialogProps = {
  open: boolean;
  handleCancel: () => void;
  handleDelete: () => void;
};

function DeleteConfirmationDialog(props: ConfirmationDialogProps) {
  const { open, handleCancel, handleDelete } = props;
  return (
    <Dialog maxWidth='xs' open={open}>
      <DialogTitle>Are you sure to delete this record?</DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleDelete}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
