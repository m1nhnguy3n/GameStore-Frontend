import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Card, Container, Divider, Grid, Tab, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// redux
import { addCart, getProduct, onGotoStep } from '../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
import Markdown from '../../../components/Markdown';
import Page from '../../../components/Page';
import { SkeletonProduct } from '../../../components/skeleton';
// sections
import Image from '../../../components/Image';
import CartWidget from '../../../sections/customer/product/CartWidget';
import { ProductDetailsReview, ProductDetailsSummary } from '../../../sections/customer/product/product-details';
// ----------------------------------------------------------------------


const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

export default function ProductDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const { name = '' } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProduct(name));
  }, [dispatch, name]);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  return (
    <Page title="Product Details">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 15, mb: 10, position: 'relative' }}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            {
              name: 'Shop',
              href: PATH_PAGE.product.shop,
            },
            { name: sentenceCase(name) },
          ]}
        />

        <CartWidget />

        {product && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <Box sx={{ p: 1 }}>
                    <Box sx={{ zIndex: 0, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                      <Image alt="large image" src={product.image} ratio="1/1" sx={{ cursor: 'zoom-in' }} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ProductDetailsSummary
                    product={product}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  />
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ my: 8 }}>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Description" />
                    <Tab
                      disableRipple
                      value="2"
                      label="Review"
                      sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                    />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={product.description} />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <ProductDetailsReview product={product} />
                </TabPanel>
              </TabContext>
            </Card>
          </>
        )}

        {!product && <SkeletonProduct />}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}
