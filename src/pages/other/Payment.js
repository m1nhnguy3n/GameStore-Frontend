import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import { FormProvider } from '../../components/hook-form';

// sections
import { PaymentMethods, PaymentSummary } from '../../sections/payment';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

const RESPONSE_API = {
  object: 'list',
  data: [
    {
      id: 'pm_1NjQeRJ24P9gOewzaRlx5Kdz',
      object: 'payment_method',
      billing_details: {
        address: {
          city: null,
          country: null,
          line1: null,
          line2: null,
          postal_code: null,
          state: null,
        },
        email: null,
        name: null,
        phone: null,
      },
      card: {
        brand: 'visa',
        checks: {
          address_line1_check: null,
          address_postal_code_check: null,
          cvc_check: 'pass',
        },
        country: 'US',
        exp_month: 12,
        exp_year: 2023,
        fingerprint: 'awImC0aKlWv1j4Rg',
        funding: 'credit',
        generated_from: null,
        last4: '4242',
        networks: {
          available: ['visa'],
          preferred: null,
        },
        three_d_secure_usage: {
          supported: true,
        },
        wallet: null,
      },
      created: 1693072320,
      customer: 'cus_Nwqtl4NDaIXi3C',
      livemode: false,
      metadata: {},
      type: 'card',
    },
  ],
  has_more: false,
  url: '/v1/payment_methods',
};

// ----------------------------------------------------------------------

export default function Payment() {
  const isDesktop = useResponsive('up', 'md');
  const stripePromise = loadStripe('pk_test_nqH70Fb8FmabuVsU5kp4gpYf00XGNeVxyf');
  const { enqueueSnackbar } = useSnackbar();

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required!'),
  });
  const defaultValues = {
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const attachCardAndCharge = async () => {};

  const getListCreditCards = async () => {
    // const response = await axios.post('/list-cards', {
    //   stripeCustomerId: user.stripeCustomerId,
    // });
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const listCards = RESPONSE_API.data.map((paymentMethod) => {
        return {
          id: paymentMethod.id,
          cardNumber: `**** **** **** ${paymentMethod.card.last4}`,
          brand: paymentMethod.card.brand,
        };
      });
      console.log(listCards);
      console.log(data);
      enqueueSnackbar('Payment succeeded!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Payment">
      <RootStyle>
        <Container>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" align="center" paragraph>
              Let's finish powering you up!
            </Typography>
            <Typography align="center" sx={{ color: 'text.secondary' }}>
              Professional plan is right for you.
            </Typography>
          </Box>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={isDesktop ? 3 : 5}>
              <Grid item xs={12} md={10}>
                {/* <Box
                  sx={{
                    display: 'grid',
                    gap: 5,
                    p: { md: 5 },
                    borderRadius: 2,
                    border: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }),
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                  }}
                > */}
                {/* <PaymentBillingAddress /> */}
                <Elements stripe={stripePromise}>
                  <PaymentMethods />
                </Elements>
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  onClick={attachCardAndCharge}
                >
                  Complete Order
                </LoadingButton>
                {/* </Box> */}
              </Grid>
              <Grid item xs={12} md={4}>
                <PaymentSummary />
              </Grid>
            </Grid>
          </FormProvider>
        </Container>
      </RootStyle>
    </Page>
  );
}
