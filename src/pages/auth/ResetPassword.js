import { useSnackbar } from 'notistack';

import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';
import Page from '../../components/Page';

// sections
import useQuery from '../../hooks/useQuery';
// api
import { resetPasswordApi } from '../../api/auth';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
}));
// ----------------------------------------------------------------------

export default function ResetPassword() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const query = useQuery();

  const updatePassword = (data) => {
    const tokenFromQuery = query.get('token');
    if (tokenFromQuery) {
      resetPasswordApi(data, tokenFromQuery).then(() => {
      enqueueSnackbar('Reset password success!');
      }).catch(() => {
      enqueueSnackbar('Reset password failed!', { variant: 'error' });

      });
    } else {
      enqueueSnackbar('Verify failed! Please check email again', { variant: 'error' });
    }

    navigate(PATH_AUTH.login, { replace: true });
  };

  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log(data);
      updatePassword(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Verify" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Typography variant="h3" paragraph>
              Reset your Password
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter New Password To Reset Your Password</Typography>

            <Box sx={{ mt: 5, mb: 3 }}>
              <Card sx={{ p: 3 }}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={3} alignItems="flex-end">
                    <RHFTextField name="newPassword" type="password" label="New Password" />

                    <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" />

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Reset Password
                    </LoadingButton>
                  </Stack>
                </FormProvider>
              </Card>
            </Box>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
