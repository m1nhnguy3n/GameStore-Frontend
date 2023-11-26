import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

InvoiceTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterName: PropTypes.func,
  onFilterStartDate: PropTypes.func,
};

export default function InvoiceTableToolbar({
  filterStartDate,
  filterName,
  onFilterName,
  onFilterStartDate,
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
    
      <DatePicker
        label="Start date"
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search client or invoice number..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
