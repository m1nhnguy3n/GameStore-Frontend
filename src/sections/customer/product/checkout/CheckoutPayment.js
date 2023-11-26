import { useEffect, useState, useMemo } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// stripe
import { useElements, useStripe } from '@stripe/react-stripe-js';
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
import { getListCards } from '../../../../redux/slices/user';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import CheckoutSummary from './CheckoutSummary';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  // {
  //   value: 'paypal',
  //   title: 'Pay with Paypal',
  //   description: 'You will be redirected to PayPal website to complete your purchase securely.',
  //   icons: ['/icons/ic_paypal.svg'],
  // },
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

CheckoutPayment.propTypes = {
  cards: PropTypes.array,
};

export default function CheckoutPayment({cards}) {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);


  const { total, discount, subtotal } = checkout;


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

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  watch()

  const onSubmit = async () => {
    try {
      handleNextStep();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutPaymentMethods paymentOptions={PAYMENT_OPTIONS} />
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
        </Grid>
      </Grid>
    </FormProvider>
  );
}
