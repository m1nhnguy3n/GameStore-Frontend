import PropTypes from 'prop-types';
import { useEffect } from 'react';
// form

// @mui
import { Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
// redux
import { getCategories, getPlatforms } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// @types
import { NAVBAR } from '../../../../config';
// utils
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { RHFMultiCheckbox, RHFRadioGroup } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];

export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  isOpen: PropTypes.bool,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default function ShopFilterSidebar({ isOpen, onResetAll, onOpen, onClose }) {
  const dispatch = useDispatch();

  const { categories, platforms } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getPlatforms());
  }, [dispatch]);

  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon={'ic:round-filter-list'} />} onClick={onOpen}>
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: { width: NAVBAR.BASE_WIDTH },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Platform</Typography>
              <RHFMultiCheckbox
                name="platform"
                options={platforms.map((item) => item.platformName)}
                sx={{ width: 1 }}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Category</Typography>
              <RHFRadioGroup name="category" options={categories.map((item) => item.categoryName)} row={false} />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Price</Typography>
              <RHFRadioGroup
                name="priceRange"
                options={FILTER_PRICE_OPTIONS.map((item) => item.value)}
                getOptionLabel={FILTER_PRICE_OPTIONS.map((item) => item.label)}
              />
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={onResetAll}
            startIcon={<Iconify icon={'ic:round-clear-all'} />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
