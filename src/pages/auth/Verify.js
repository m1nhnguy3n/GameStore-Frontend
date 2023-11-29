import { useSnackbar } from 'notistack';

import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// api
import { verifyEmailApi } from '../../api/auth';
// components
import Page from '../../components/Page';
// sections
import useQuery from '../../hooks/useQuery';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Verify() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const query = useQuery();

  const handleToken = async () => {
    const token = query.get('token');
    if (token) {
      await verifyEmailApi(token)
        .then(() => {
          enqueueSnackbar('Verify success!');
        })
        .catch((response) => {
          enqueueSnackbar(response.message || 'Verify failed! Please check email again', { variant: 'error' });
        });
    } else {
      enqueueSnackbar('Verify failed! Please check email again', { variant: 'error' });
    }

    navigate(PATH_DASHBOARD.root, { replace: true });
  };

  return (
    <Page title="Verify" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            {/* <Button
              size="small"
              component={RouterLink}
              to={PATH_AUTH.login}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />}
              sx={{ mb: 3 }}
            >
              Back
            </Button> */}

            <Typography variant="h3" paragraph>
              Verify your Account
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Click below button to verify your Account</Typography>

            <Box sx={{ mt: 5, mb: 3 }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleToken}
              >
                Verify
              </LoadingButton>
            </Box>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
