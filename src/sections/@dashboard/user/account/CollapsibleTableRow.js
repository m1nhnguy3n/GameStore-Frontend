import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
// utils
import { fDateTimeSuffix, fDateTime } from '../../../../utils/formatTime';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

CollapsibleTableRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    invoiceDetail: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        orderId: PropTypes.number.isRequired,
        productOptionId: PropTypes.number.isRequired,
        productOption: PropTypes.object.isRequired,
        productId: PropTypes.number.isRequired,
        product: PropTypes.object.isRequired,
        price: PropTypes.number.isRequired,
        code: PropTypes.array.isRequired,
      })
    ).isRequired,
    orderDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default function CollapsibleTableRow(props) {
  const { row } = props;

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="right">{fDateTime(row.orderDate)}</TableCell>
        <TableCell align="right">{row.total}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="center">
          <IconButton size="small" color={open ? 'primary' : 'default'} onClick={() => setOpen(!open)}>
            <Iconify icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper sx={{ px: 1, py: 2, borderRadius: 1.5, boxShadow: (theme) => theme.customShadows.z8 }}>
              <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
                Detail
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Order Id</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Option</TableCell>
                    <TableCell align="center">Code</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.invoiceDetail.map((historyRow) => (
                    <TableRow key={historyRow.orderId}>
                      <TableCell component="th" scope="row">
                        {historyRow.orderId}
                      </TableCell>
                      <TableCell>{historyRow.product.productName}</TableCell>
                      <TableCell>{historyRow.productOption.optionName}</TableCell>
                      <TableCell align="center">
                        {historyRow.code.map((reedem) => (
                          <Typography key={reedem}>{reedem}</Typography>
                        ))}
                      </TableCell>
                      <TableCell align="center"> {historyRow.amount}</TableCell>
                      <TableCell align="right">{historyRow.price}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * historyRow.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
