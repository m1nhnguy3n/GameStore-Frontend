import * as React from 'react';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { TextField } from '@mui/material';
import StripeInput from '../../../../components/StripeInput';


export const StripeTextField = (props) => {
  const {
    helperText,
    InputLabelProps,
    InputProps = {},
    inputProps,
    error,
    labelErrorMessage,
    stripeElement,
    ...other
  } = props;

  return (
    <TextField
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      error={error}
      InputProps={{
        inputProps: {
          component: stripeElement,
          ...inputProps,
          ...InputProps.inputProps,
        },
        inputComponent: StripeInput,
        ...InputProps,
      }}
      helperText={error ? labelErrorMessage : helperText}
      {...other}
    />
  );
};

export function StripeTextFieldNumber(props) {
  return <StripeTextField label="Credit Card Number" stripeElement={CardNumberElement} {...props} />;
}

export function StripeTextFieldExpiry(props) {
  return <StripeTextField label="Expires" stripeElement={CardExpiryElement} {...props} />;
}

export function StripeTextFieldCVC(props) {
  return <StripeTextField label="CVC Code" stripeElement={CardCvcElement} {...props} />;
}
