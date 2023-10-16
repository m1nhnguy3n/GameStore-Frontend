import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, CardActionArea } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { productName, image, price } = product;
  const linkTo = PATH_PAGE.product.view(paramCase(productName));

  return (
    <Card>
      <CardActionArea>
        <Link to={linkTo} color="inherit" component={RouterLink} underline="none">
          <Box sx={{ position: 'relative' }}>
            <Image alt={productName} src={image} loading="lazy" ratio="1/1" />
          </Box>

          <Stack spacing={2} sx={{ p: 3 }}>
            <Typography variant="subtitle2" noWrap>
              {productName}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={0.5}>
                <Typography variant="subtitle1">{fCurrency(price)}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Link>
      </CardActionArea>
    </Card>
  );
}
