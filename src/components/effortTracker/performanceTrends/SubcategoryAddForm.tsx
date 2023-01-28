import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { addSubcategories } from 'db/repositories/user';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setBackdrop } from 'modules/backdrop';
import { setSnackbar } from 'modules/snackbar';
import { getSelectedUser, getUser, setSelectedUser, setUser } from 'modules/user';
import React, { useState } from 'react';
import { SubcategoryData } from 'types';
import emojiData from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface SubcategoryAddFormProps {
  open: boolean;
  handleClose: () => void;
  selectedCategory: string;
}

function SubcategoryAddForm({
  open,
  handleClose,
  selectedCategory,
}: SubcategoryAddFormProps) {
  const [values, setValues] = useState<SubcategoryData>({
    name: '',
    icon: '',
    unit: '',
  });
  const user = useAppSelector(getUser);
  const selectedUser = useAppSelector(getSelectedUser);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isSmallWidth = useMediaQuery(theme.breakpoints.down('md'));
  const [showEmojis, setShowEmojis] = useState(false);

  const handleAdd = async () => {
    if (!values.icon) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Please select an icon for subcategory.',
          severity: 'error',
        })
      );
      return;
    }

    if (!user) {
      return;
    }

    const categoryIdx = user.categories.findIndex(
      (category) => category.category === selectedCategory
    );
    if (categoryIdx < 0) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Category is not selected to add new subcategory.',
          severity: 'error',
        })
      );
      return;
    }

    if (
      user.categories[categoryIdx].subcategories?.find(
        (subcategory) => subcategory.name === values.name
      )
    ) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Subcategory already exists.',
          severity: 'error',
        })
      );
      return;
    }

    // add subcategory to user.
    try {
      dispatch(setBackdrop(true));
      const newCategories = user.categories.map((category, i) => {
        if (categoryIdx === i) {
          const subcategories = category.subcategories
            ? [...category.subcategories, values]
            : [values];
          return {
            ...category,
            subcategories: subcategories,
          };
        }
        return category;
      });
      await addSubcategories(user.uid, newCategories);
      dispatch(setUser({ ...user, categories: newCategories }));
      if (user?.uid === selectedUser?.uid) {
        dispatch(
          setSelectedUser({
            ...user,
            categories: newCategories,
          })
        );
      }
      handleClose();
    } catch (e) {
      dispatch(
        setSnackbar({
          open: true,
          message: `Failed to add subcategory by error: ${e}`,
          severity: 'error',
        })
      );
    } finally {
      dispatch(setBackdrop(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]:
        e.target.name === 'goal' ? +e.target.value : e.target.value,
    });
  };

  const addEmoji = (emoji: any) => {
    setValues({ ...values, icon: emoji.native });
    setShowEmojis(false);
  };

  return (
    <Dialog open={open} fullScreen={isSmallWidth}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Subcategory Add Form
      </DialogTitle>
      <DialogContent>
        <Stack direction='column' justifyContent='center' alignItems='center'>
          {/* TextField -> icon button with avatar */}

          <IconButton onClick={() => setShowEmojis(!showEmojis)}>
            <Avatar sx={{ width: 60, height: 60 }}>
              <Typography variant='h3'>{values.icon}</Typography>
            </Avatar>
          </IconButton>
          <Typography>Subcategory Icon</Typography>
          {showEmojis && <Picker data={emojiData} onEmojiSelect={addEmoji} />}
          <TextField
            margin='dense'
            name='name'
            label='name'
            fullWidth
            variant='standard'
            value={values.name}
            required
            onChange={handleChange}
          />
          <TextField
            margin='dense'
            name='unit'
            label='Unit'
            fullWidth
            value={values.unit}
            variant='standard'
            required
            onChange={handleChange}
          />
          <TextField
            margin='dense'
            name='goal'
            label='Goal'
            type='number'
            fullWidth
            value={values.goal ? values.goal : ''}
            variant='standard'
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='contained'>
          Cancel
        </Button>
        <Button onClick={handleAdd} variant='contained'>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SubcategoryAddForm;
