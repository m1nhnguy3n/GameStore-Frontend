import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// stripe
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Grid } from '@mui/material';
// redux
import { onBackStep, onGotoStep, onNextStep } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';

// utils
import axios from '../../../../utils/axios';
//
import useAuth from '../../../../hooks/useAuth';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import CheckoutSummary from './CheckoutSummary';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  {
    value: 'paypal',
    title: 'Pay with Paypal',
    description: 'You will be redirected to PayPal website to complete your purchase securely.',
    icons: ['/icons/ic_paypal.svg'],
  },
  {
    value: 'credit_card',
    title: 'Credit / Debit Card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
    icons: ['/icons/ic_mastercard.svg', '/icons/ic_visa.svg'],
  },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

const RESPONSE_API= {
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

export default function CheckoutPayment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { checkout } = useSelector((state) => state.product);

  const { total, discount, subtotal, cart } = checkout;

  const getListCreditCards = async () => {
    const response = await axios.post('/list-cards', {
      stripeCustomerId: user.stripeCustomerId,
    });

    const listCards = response.data.data.map((paymentMethod) => {
      return {
        id: paymentMethod.id,
          cardNumber: `**** **** **** ${paymentMethod.last4}`,
            brand: paymentMethod.brand,
      };
    });
    return listCards;
  }

  const chargeWithCardSaved = async (paymentMethodId) => {
    console.log(paymentMethodId);

    if (!paymentMethodId) {
      return;
    }

    const response = await axios.post('/credit-cards', {
      paymentMethodId,
    });

    const clientSecret = response.client_secret;

    stripe?.confirmCardSetup(clientSecret);

    const paymentIntent = await axios.post(`/charge`, {
      paymentMethodId,
      total,
    });

    if (paymentIntent.status !== 'succeeded') {
      const secret = paymentIntent.client_secret;

      await stripe?.confirmCardPayment(secret);
    }

    // switch (paymentIntent.status) {
    //   case 'succeeded':
    //     enqueueSnackbar('Payment succeeded!');

    //     // setMessage('Payment succeeded!');
    //     break;
    //   case 'processing':
    //     // setMessage('Your payment is processing.');
    //     break;
    //   case 'requires_payment_method':
    //     // setMessage('Your payment was not successful, please try again.');
    //     break;
    //   default:
    //     // setMessage('Something went wrong.');
    //     break;
    // }
  };

  // const handleCartBeforeSubmit = (cart) => {
  //   const { } = cart;
  //     const newCart = 

  //   // return 
  // }

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

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

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log(data)
      chargeWithCardSaved(data.paymentMethodId);
      handleNextStep();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutPaymentMethods cardOptions={CARDS_OPTIONS} paymentOptions={PAYMENT_OPTIONS} />
          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary
            enableEdit
            total={total}
            subtotal={subtotal}
            discount={discount}
            onEdit={() => handleGotoStep(0)}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            // onClick={chargeWithCardSaved}
          >
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
