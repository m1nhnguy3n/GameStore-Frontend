import PropTypes from 'prop-types';
import { useState } from 'react';

// stripe
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
// @mui
import { Button, Paper, Popover, Stack, TextField, Typography } from '@mui/material';
// redux
import { onNextStep } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// utils
import axios from '../../../../utils/axios';
// components

import useAuth from '../../../../hooks/useAuth';
import { StripeTextFieldCVC, StripeTextFieldExpiry, StripeTextFieldNumber } from './commonTextFields';

// ----------------------------------------------------------------------

PaymentNewCardForm.propTypes = {
  onCancel: PropTypes.func,
};

export default function PaymentNewCardForm({ onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { checkout } = useSelector((state) => state.product);

  const { total } = checkout;

  const [isOpen, setIsOpen] = useState(null);

  const [state, setState] = useState({
    cardNumberComplete: false,
    expiredComplete: false,
    cvcComplete: false,
    cardNumberError: null,
    expiredError: null,
    cvcError: null,
  });

  console.log(state);

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

  const attachCardAndCharge = async () => {
    const paymentMethodId = await getPaymentMethodId();

    if (!paymentMethodId) {
      return;
    }

    const response = await axios.post('/stripe/attach-card', {
      paymentMethodId,
      stripeCustomerId: user.stripeCustomerId,
    });

    const clientSecret = await response.data.client_secret;

    // eslint-disable-next-line no-unused-expressions
    stripe?.confirmCardSetup(clientSecret);

    if (response) {
      const paymentIntent = await axios.post('/stripe/charge', {
        paymentMethodId,
        stripeCustomerId: user.stripeCustomerId,
        total,
      });

      if (paymentIntent.data.status !== 'succeeded') {
        const secret = paymentIntent.data.client_secret;

        await stripe?.confirmCardPayment(secret);

        // enqueueSnackbar('Payment succeeded!');
      }
      handleNextStep();

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
    }
    // return onCancel;
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
          <Typography variant="subtitle1">Add new card</Typography>
          <TextField fullWidth label="Name on card" />

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
            <Button fullWidth onClick={onCancel}>
              Cancel
            </Button>

            <Button fullWidth variant="contained" onClick={attachCardAndCharge}>
              Save and Checkout
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
