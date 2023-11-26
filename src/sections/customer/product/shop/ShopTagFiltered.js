import PropTypes from 'prop-types';
// @mui
import { Button, Chip, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.divider}`,
}));

const LabelStyle = styled((props) => <Typography component="span" variant="subtitle2" {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderRight: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

function labelPriceRange(range) {
  if (range === 'below') {
    return 'Below $25';
  }
  if (range === 'between') {
    return 'Between $25 - $75';
  }
  return 'Above $75';
}

ShopTagFiltered.propTypes = {
  filters: PropTypes.object,
  isShowReset: PropTypes.bool,
  onRemoveCategory: PropTypes.func,
  onRemovePlatform: PropTypes.func,
  onRemovePrice: PropTypes.func,
  onResetAll: PropTypes.func,
};

export default function ShopTagFiltered({
  filters,
  isShowReset,
  onRemoveCategory,
  onRemovePlatform,
  onRemovePrice,
  onResetAll,
}) {
  const { category, platform, priceRange } = filters;

  return (
    <RootStyle>
      {platform.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Platform:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {platform.map((_platform) => (
              <Chip
                key={_platform}
                label={_platform}
                size="small"
                onDelete={() => onRemovePlatform(_platform)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}
      {category !== 'All' && (
        <WrapperStyle>
          <LabelStyle>Category:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={category} onDelete={onRemoveCategory} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {priceRange && (
        <WrapperStyle>
          <LabelStyle>Price:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={labelPriceRange(priceRange)} onDelete={onRemovePrice} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {isShowReset && (
        <Button color="error" size="small" onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
          Clear All
        </Button>
      )}
    </RootStyle>
  );
}
