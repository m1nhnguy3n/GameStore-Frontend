import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
// form
import { Controller, useFormContext, useForm } from 'react-hook-form';
// @mui
import {
  Button,
  Collapse,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Box,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import { RHFSelect } from '../../components/hook-form';

//
import PaymentNewCardForm from './PaymentNewCardForm';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  {
    value: 'paypal',
    title: 'Pay with Paypal',
    icons: ['https://minimal-assets-api.vercel.app/assets/icons/ic_paypal.svg'],
  },
  {
    value: 'credit_card',
    title: 'Credit / Debit Card',
    icons: [
      'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
      'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
    ],
  },
];
const CARD_OPTIONS = [
  {
    value: 'visa1',
    label: '**** **** **** 1212 - Jimmy Holland',
  },
  {
    value: 'visa2',
    label: '**** **** **** 2424 - Shawn Stokes',
  },
  {
    value: 'mastercard',
    label: '**** **** **** 4545 - Cole Armstrong',
  },
];

const OptionStyle = styled(Paper)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2),
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

// ----------------------------------------------------------------------

export default function PaymentMethods() {
  const [show, setShow] = useState(false);

  const [method, setMethod] = useState('paypal');

  const stripePromise = loadStripe('pk_test_nqH70Fb8FmabuVsU5kp4gpYf00XGNeVxyf');
  const { getValues } = useForm();


const { control } = useFormContext();

  const isDesktop = useResponsive('up', 'sm');
  
  const paymentMethod = getValues();


  const handleCollapseIn = () => {
    if (paymentMethod !== 'paypal') {
      setShow(!show);
    }
  };

  const handleCollapseOut = () => {
    setShow(false);
  };

  const handleChangeMethod = (event) => {
    if (paymentMethod === 'paypal') {
      setShow(false);
    }
    setMethod(event.target.value);
  };

  return (
    <Card sx={{ my: 3}}>
      <CardHeader title="Payment options" />
      <CardContent>
        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup row {...field}>
                <Stack spacing={2}>
                  {PAYMENT_OPTIONS.map((method) => {
                    const { value, title, icons, description } = method;

                    const hasChildren = value === 'credit_card';

                    const selected = field.value && method === value;

                    return (
                      <OptionStyle
                        key={title}
                        sx={{
                          ...(selected && {
                            boxShadow: (theme) => theme.customShadows.z20,
                          }),
                          ...(hasChildren && { flexWrap: 'wrap' }),
                        }}
                      >
                        <FormControlLabel
                          value={value}
                          control={<Radio checkedIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />} />}
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="subtitle2">{title}</Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {description}
                              </Typography>
                            </Box>
                          }
                          sx={{ flexGrow: 1, py: 3 }}
                        />

                        {isDesktop && (
                          <Stack direction="row" spacing={1} flexShrink={0}>
                            {icons.map((icon) => (
                              <Image key={icon} alt="logo card" src={icon} />
                            ))}
                          </Stack>
                        )}

                        {hasChildren && (
                          <Collapse in={field.value === 'credit_card'} sx={{ width: 1 }}>
                            {/* <FormControlLabel value={value} label="Cards"> */}
                            {/* <TextField select fullWidth label="Cards" SelectProps={{ native: true }}>
                              {CARD_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </TextField>
                            </FormControlLabel> */}

                            <RHFSelect name="paymentId" label="Card">
                              {CARD_OPTIONS.map((option) => (
                                <option key={option.value} value={option.label}>
                                  {option.label}
                                </option>
                              ))}
                            </RHFSelect>

                            <Button
                              size="small"
                              startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                              sx={{ my: 3 }}
                              onClick={handleCollapseIn}
                            >
                              Add new card
                            </Button>
                            <Collapse in={show}>
                              <PaymentNewCardForm onCancel={handleCollapseOut} />
                            </Collapse>
                          </Collapse>
                        )}
                      </OptionStyle>
                    );
                  })}
                </Stack>
              </RadioGroup>

              {!!error && (
                <FormHelperText error sx={{ pt: 1, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}
