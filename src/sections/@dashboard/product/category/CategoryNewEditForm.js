import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import * as Yup from 'yup';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// axios
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

CategoryNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  category: PropTypes.object.isRequired,
};

export default function CategoryNewEditForm({ isEdit, category }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewCategorySchema = Yup.object().shape({
    categoryName: Yup.string().required('Category Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: category?.id || '',
      categoryName: category?.categoryName || '',
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category]
  );
  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  
  watch();

  useEffect(() => {
    if (isEdit && category) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, category]);
  const addCategory = async (data) => {
    const response = await axios.post('/category', { ...data }).then((response) => {
      enqueueSnackbar('Update success!' || response.statusText);
    });
    
  };

  const editCategory = async (data) => {
    const response = await axios.put('/category', { ...data });
    enqueueSnackbar('Update success!' || response.statusText);


    const onSubmit = async (data) => {
      try {
        addCategory(data);
        reset();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} alignItems="flex-end">
            <RHFTextField name="categoryName" label="Category Name" />

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    );
  }
}