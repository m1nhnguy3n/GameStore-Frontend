// @mui
import { Card, CardHeader, Grid, Stack } from '@mui/material';
//
import AccountBillingInvoiceTable from './AccountBillingInvoiceTable';

// ----------------------------------------------------------------------

export default function AccountBilling() {

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Invoice History" />
            <AccountBillingInvoiceTable />
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
}
