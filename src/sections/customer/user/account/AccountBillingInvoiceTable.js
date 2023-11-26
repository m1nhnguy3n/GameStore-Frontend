import { useEffect } from 'react';

// @mui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// redux
import { getListInvoices } from '../../../../redux/slices/user';
import { useDispatch, useSelector } from '../../../../redux/store';

// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Scrollbar from '../../../../components/Scrollbar';
//
import CollapsibleTableRow from './CollapsibleTableRow';

// ----------------------------------------------------------------------

const ORDER_HISTORY = [
  {
    id: 1,
    createdAt: '2023-05-23T15:00:08.825Z',
    userId: 1,
    user: {
      firstName: 'm',
    },
    total: 33,
    status: 'Paid',
    invoiceDetail: [
      {
        productOptionId: 1,
        productId: 1,
        product: {
          productName: 'Sekiro',
        },
        amount: 2,
        price: 12,
        code: ['aaa', 'bbb'],
      },
      {
        productId: 1,
        product: {
          productName: 'Sekiro',
        },
        amount: 2,
        price: 12,
        code: ['aaa', 'bbb'],
      },
    ],
  },
  {
    id: 2,
    createdAt: '2023-05-23T15:00:08.825Z',
    userId: 1,
    total: 33,
    status: 'Paid',
    invoiceDetail: [
      {
        productId: 1,
        product: {
          productName: 'Sekiro',
        },
        amount: 2,
        price: 12,
        code: ['aaa', 'bbb'],
      },
      {
        productId: 1,
        product: {
          productName: 'Sekiro',
        },
        amount: 2,
        price: 12,
        code: ['aaa', 'bbb'],
      },
    ],
  },
];

export default function AccountBillingInvoiceTable() {
  const { invoices } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { user } = useAuth();


  useEffect(() => {
    dispatch(getListInvoices(user.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800, mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice</TableCell>

              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Total Price&nbsp;($)</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((row) => (
              <CollapsibleTableRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}
