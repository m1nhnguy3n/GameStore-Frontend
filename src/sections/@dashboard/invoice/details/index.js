import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    InvoiceDetail: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        product: PropTypes.object.isRequired,
        price: PropTypes.number.isRequired,
        code: PropTypes.array.isRequired,
      })
    ),
    createdAt: PropTypes.string.isRequired,
  }),
};

export default function InvoiceDetails({ invoice }) {
  const theme = useTheme();

  if (!invoice) {
    return null;
  }

  const { id, createdAt, InvoiceDetail, status, total } = invoice;

  console.log(InvoiceDetail);
  
  return (
    <>
      {/* <InvoiceToolbar invoice={invoice} /> */}

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image
              disabledEffect
              visibleByDefault
              alt="logo"
              src="/logo/joystick-wireless.svg"
              sx={{ maxWidth: 120 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (status === 'paid' && 'success') ||
                  (status === 'unpaid' && 'warning') ||
                  (status === 'overdue' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {status}
              </Label>

              <Typography variant="h6">{`INV-${id}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              date create
            </Typography>
            <Typography variant="body2">{fDate(createdAt)}</Typography>
          </Grid>
        </Grid>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Qty</TableCell>
                  <TableCell align="right">Unit price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {InvoiceDetail.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row.product.productName}</Typography>
                        {row.code.map((cdkey, index) => (
                          <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {cdkey}
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell align="right">{fCurrency(row.price)}</TableCell>
                    <TableCell align="right">{fCurrency(row.price * row.amount)}</TableCell>
                  </TableRow>
                ))}

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell align="right" width={140}>
                    <Typography variant="h6">{fCurrency(total)}</Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <Divider sx={{ mt: 5 }} />
        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>
            <Typography variant="body2">
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Have a Question?</Typography>
            <Typography variant="body2">minhnngcd191326@fpt.edu.vn</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
