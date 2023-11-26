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

// api
import { addPlatformApi, editPlatformApi } from '../../../../api/platform';

// ----------------------------------------------------------------------

PlatformNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  platform: PropTypes.object.isRequired,
};

export default function PlatformNewEditForm({ isEdit, platform }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewPlatformSchema = Yup.object().shape({
    platformName: Yup.string().required('Platform Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: platform?.id || '',
      platformName: platform?.platformName || '',
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [platform]
  );
  const methods = useForm({
    resolver: yupResolver(NewPlatformSchema),
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
    if (isEdit && platform) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, platform]);

  const addPlatform = async (data) => {
    const response = await addPlatformApi(data).then((response) => {
      enqueueSnackbar('Create success!' || response.statusText);
    });
  };

  const editPlatform = async (data) => {
    const response = await editPlatformApi(data);
    enqueueSnackbar('Update success!' || response.statusText);
  }
    const onSubmit = async (data) => {
      try {
        addPlatform(data);
        reset();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Card sx={{ p: 3 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} alignItems="flex-end">
            <RHFTextField name="platformName" label="Platform Name" />

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save Changes
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    );
  
}