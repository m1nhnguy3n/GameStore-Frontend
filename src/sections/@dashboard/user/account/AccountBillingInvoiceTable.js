// @mui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// components
import Scrollbar from '../../../../components/Scrollbar';
//
import CollapsibleTableRow from './CollapsibleTableRow';

// ----------------------------------------------------------------------

export function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

const TABLE_DATA = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

const ORDER_HISTORY = [
  {
    id: 1,
    orderDate: '2023-05-23T15:00:08.825Z',
    userId: 1,
    total: 33,
    status: 'Paid',
    invoiceDetail: [
      {
        orderId: 1,
        productOptionId: 1,
        productOption: {
          optionName: 'Basic',
        },
        productId: 1,
        product: {
          productName: 'Sekiro',
        },
        amount: 2,
        price: 12,
        code: ['aaa', 'bbb'],
      },
      {
        orderId: 1,
        productOptionId: 1,
        productOption: {
          optionName: 'Basic',
        },
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
    orderDate: '2023-05-23T15:00:08.825Z',
    userId: 1,
    total: 33,
    status: 'Paid',
    invoiceDetail: [
      {
        orderId: 1,
        productOptionId: 1,
        productOption: {
          optionName: 'Basic',
        },
        productId: 1,
        product: {
          productName: 'Sekiro',
        },
        amount: 2,
        price: 12,
        code: ['aaa', 'bbb'],
      },
      {
        orderId: 1,
        productOptionId: 1,
        productOption: {
          optionName: 'Basic',
        },
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
  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800, mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice</TableCell>

              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Total Price&nbsp;($)</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {ORDER_HISTORY.map((row) => (
              <CollapsibleTableRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}
