import { sentenceCase } from 'change-case';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Box, Button, Divider, IconButton, Rating, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// utils
import { fCurrency, fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import { FormProvider } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.shape({
    available: PropTypes.number,
    image: PropTypes.string,
    id: PropTypes.number,
    stockStatus: PropTypes.object,
    productName: PropTypes.string,
    price: PropTypes.number,
    totalReview: PropTypes.number,
    totalRating: PropTypes.number,
  }),
};

export default function ProductDetailsSummary({ cart, product, onAddCart, onGotoStep, ...other }) {
  const theme = useTheme();

  const navigate = useNavigate();

  const { id, productName, price, image, stockStatus, available, totalReview, totalRating } = product;
  const { statusName } = stockStatus;

  const alreadyProduct = cart.map((item) => item.id).includes(id);

  const isMaxQuantity = cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    productName,
    image,
    price,
    available,
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { watch, setValue, handleSubmit } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      if (!alreadyProduct) {
        onAddCart({
          ...data,
          subtotal: data.price * data.quantity,
        });
      }
      onGotoStep(0);
      navigate(PATH_PAGE.product.checkout);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = async () => {
    try {
      onAddCart({
        ...values,
        subtotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyle {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={statusName === 'in_stock' ? 'success' : 'error'}
          sx={{ textTransform: 'uppercase' }}
        >
          {sentenceCase(statusName || '')}
        </Label>

        <Typography variant="h5" paragraph sx={{ mt: 2 }}>
          {productName}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Rating value={totalRating} precision={0.1} readOnly />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ({fShortenNumber(totalReview)}
            &nbsp;reviews)
          </Typography>
        </Stack>

        <Typography variant="h4" sx={{ mb: 3 }}>
          &nbsp;{fCurrency(price)}
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3, my: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Quantity
          </Typography>

          <div>
            <Incrementer
              name="quantity"
              quantity={values.quantity}
              available={available}
              onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
              onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
            />
            <Typography variant="caption" component="div" sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}>
              Available: {available}
            </Typography>
          </div>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
          <Button
            fullWidth
            disabled={isMaxQuantity}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
            onClick={handleAddCart}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add to Cart
          </Button>

          <Button disabled={isMaxQuantity} fullWidth size="large" type="submit" variant="contained">
            Buy Now
          </Button>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrementQuantity: PropTypes.func,
  onDecrementQuantity: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrementQuantity, onDecrementQuantity }) {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032',
      }}
    >
      <IconButton size="small" color="inherit" disabled={quantity <= 1} onClick={onDecrementQuantity}>
        <Iconify icon={'eva:minus-fill'} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>

      <IconButton size="small" color="inherit" disabled={quantity >= available} onClick={onIncrementQuantity}>
        <Iconify icon={'eva:plus-fill'} width={14} height={14} />
      </IconButton>
    </Box>
  );
}
