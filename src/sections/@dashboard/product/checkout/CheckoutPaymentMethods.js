import PropTypes from 'prop-types';
import { useState } from 'react';

// form
import { Controller, useForm, useFormContext } from 'react-hook-form';
// @mui
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import Iconify from '../../../../components/Iconify';
import Image from '../../../../components/Image';
import { RHFSelect } from '../../../../components/hook-form';

//
import PaymentNewCardForm from './PaymentNewCardForm';

// ----------------------------------------------------------------------

const OptionStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

// ----------------------------------------------------------------------

CheckoutPaymentMethods.propTypes = {
  paymentOptions: PropTypes.array,
  cardOptions: PropTypes.array,
};

export default function CheckoutPaymentMethods({ paymentOptions, cardOptions }) {
  const [show, setShow] = useState(false);

  const { getValues } = useForm();

  // const [method, setMethod] = useState('paypal');
  const paymentMethod = getValues();

  const { control } = useFormContext();

  const isDesktop = useResponsive('up', 'sm');

  if (paymentMethod === 'paypal') {
    setShow(false);
  }

  const handleCollapseIn = () => {
    if (paymentMethod !== 'paypal') {
      setShow(!show);
    }
  };

  const handleCollapseOut = () => {
    setShow(false);
  };

  return (
    <Card sx={{ my: 3 }}>
      <CardHeader title="Payment options" />
      <CardContent>
        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup row {...field}>
                <Stack spacing={2}>
                  {paymentOptions.map((method) => {
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
                            <RHFSelect name="paymentId" label="Card">
                              {cardOptions.map((option) => (
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
