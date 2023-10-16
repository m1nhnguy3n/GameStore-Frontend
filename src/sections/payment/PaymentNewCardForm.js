import * as React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { Button, Paper, Popover, Stack, TextField, Typography } from '@mui/material';

// components

import { StripeTextFieldNumber, StripeTextFieldExpiry, StripeTextFieldCVC } from './commonTextFields';

// ----------------------------------------------------------------------

PaymentNewCardForm.propTypes = {
  onCancel: PropTypes.func,
};

export default function PaymentNewCardForm({ onCancel }) {
  const [isOpen, setIsOpen] = useState(null);

  const [state, setState] = React.useState({
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
          <TextField fullWidth size="small" label="Name on card" />

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

            <Button fullWidth variant="contained" onClick={onCancel}>
              Create
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
