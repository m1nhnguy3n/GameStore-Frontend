import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Checkbox, Link, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// utils
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
// components
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

InvoiceTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function InvoiceTableRow({ row, selected, onSelectRow, onViewRow, onDeleteRow }) {
  const theme = useTheme();

  const { id, createdAt, status, total, user } = row;

  const { firstName, lastName } = user;

  const name = `${firstName} ${lastName}`;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} color={createAvatar(name).color} sx={{ mr: 2 }}>
          {createAvatar(name).name}
        </Avatar>

        <Stack>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>

          <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
            {id}
          </Link>
        </Stack>
      </TableCell>

      <TableCell align="left">{fDate(createdAt)}</TableCell>

      <TableCell align="center">{fCurrency(total)}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === 'paid' && 'success') ||
            (status === 'unpaid' && 'warning') ||
            (status === 'overdue' && 'error') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                View
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
