import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

// stripe
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
// @mui
import { Button, Paper, Popover, Stack, TextField, Typography } from '@mui/material';
// redux
import { onNextStep } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// api
import { attachCardApi, chargeApi } from '../../../../api/stripe';
import { createInvoiceApi } from '../../../../api/user';

// hooks
import useAuth from '../../../../hooks/useAuth';

// 
import { StripeTextFieldCVC, StripeTextFieldExpiry, StripeTextFieldNumber } from './commonTextFields';

// ----------------------------------------------------------------------


export default function PaymentNewCardForm() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const { checkout } = useSelector((state) => state.product);

  const { total, cart } = checkout;

  const [isOpen, setIsOpen] = useState(null);

  const [state, setState] = useState({
    cardNumberComplete: false,
    expiredComplete: false,
    cvcComplete: false,
    cardNumberError: null,
    expiredError: null,
    cvcError: null,
  });

  const onElementChange =
    (field, errorField) =>
    ({ complete, error = { message: null } }) => {
      setState({ ...state, [field]: complete, [errorField]: error.message });
    };

  const getPaymentMethodId = async () => {
    const cardNumber = elements.getElement(CardNumberElement);

    if (!stripe || !elements || !cardNumber) {
      return;
    }

    const stripeResponse = await stripe?.createPaymentMethod({
      type: 'card',
      card: cardNumber,
    });

    const { error, paymentMethod } = stripeResponse;

    if (error || !paymentMethod) {
      return;
    }

    return paymentMethod.id;
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const paymentAndCreateInvoice = async () => {
    // const paymentStatus = await attachCardAndCharge();
    // if (paymentStatus) {
    //   handleNextStep();
    // }
      await createInvoice();

  }
  
  const createInvoice = async () => {

    const invoice = {
      total,
      cart,
      userId: user.id,
    }

    await createInvoiceApi(invoice);
  }

  const Charge = async () => {
    const paymentMethodId = await getPaymentMethodId();

    let paymentSuccess = false

    if (!paymentMethodId) {
      return;
    }

    const chargeResponse = await chargeApi(paymentMethodId, user.stripeCustomerId, total).then(() => {
      enqueueSnackbar('Payment Success');
    paymentSuccess = true;

    }).catch(() => {
      enqueueSnackbar('Payment Success', {variant: 'error'});
    });

    console.log(chargeResponse)

    if (chargeResponse.data.status !== 'succeeded') {
      const secret = chargeResponse.data.client_secret;

      await stripe?.confirmCardPayment(secret);
    }

    return paymentSuccess;
  };


  const { cardNumberError, expiredError, cvcError } = state;

  return (
    <>
      <Paper
        sx={{
          p: 2.5,
          mb: 2.5,
          bgcolor: 'background.neutral',
        }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle1">Payment</Typography>

          <StripeTextFieldNumber
            error={Boolean(cardNumberError)}
            labelErrorMessage={cardNumberError}
            onChange={onElementChange('cardNumberComplete', 'cardNumberError')}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <StripeTextFieldExpiry
              error={Boolean(expiredError)}
              labelErrorMessage={expiredError}
              onChange={onElementChange('expiredComplete', 'expiredError')}
            />
            <StripeTextFieldCVC
              error={Boolean(cvcError)}
              labelErrorMessage={cvcError}
              onChange={onElementChange('cvcComplete', 'cvcError')}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button fullWidth variant="contained" onClick={paymentAndCreateInvoice}>
              Payment
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Popover
        open={Boolean(isOpen)}
        anchorEl={isOpen}
        onClose={() => setIsOpen(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        PaperProps={{
          sx: {
            p: 1,
            maxWidth: 200,
          },
        }}
      >
        <Typography variant="body2" align="center">
          Three-digit number on the back of your VISA card
        </Typography>
      </Popover>
    </>
  );
}
