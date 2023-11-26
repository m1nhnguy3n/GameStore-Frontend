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

CdkeyNewEditForm.propTypes = {
  productId: PropTypes.number
};

export default function CdkeyNewEditForm({ productId }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewCdkeySchema = Yup.object().shape({
    code: Yup.string().required('Code is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewCdkeySchema),
  });
  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  const addCdkey = async (data) => {
    let code = [];

    code = data.code.split('\n');

    const cdkey = {}
    cdkey.productId = productId;
    cdkey.code = code;

    const response = await axios.post('/code', { ...cdkey }).then((response) => {
      enqueueSnackbar('Update success!' || response.statusText);
    });
  };

  const editCdkey = async (data) => {
    const response = await axios.put('/category', { ...data });
    enqueueSnackbar('Update success!' || response.statusText);
  };
  const onSubmit = async (data) => {
    try {
      addCdkey(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="code" label="CD key" multiline />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
