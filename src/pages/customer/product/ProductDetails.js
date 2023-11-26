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

const PRODUCT_DESCRIPTION = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'ic:round-verified',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'eva:clock-fill',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'ic:round-verified-user',
  },
];

const PRODUCT_DATA = {
  id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
  cover: 'https://minimal-assets-api.vercel.app/assets/images/products/product_1.jpg',
  images: [
    'https://minimal-assets-api.vercel.app/assets/images/products/product_1.jpg',
    'https://minimal-assets-api.vercel.app/assets/images/products/product_2.jpg',
    'https://minimal-assets-api.vercel.app/assets/images/products/product_3.jpg',
    'https://minimal-assets-api.vercel.app/assets/images/products/product_4.jpg',
    'https://minimal-assets-api.vercel.app/assets/images/products/product_5.jpg',
    'https://minimal-assets-api.vercel.app/assets/images/products/product_6.jpg',
    'https://minimal-assets-api.vercel.app/assets/images/products/product_7.jpg',
    'https://minimal-assets-api.vercel.app/assets/images/products/product_8.jpg',
  ],
  name: 'Nike Air Force 1 NDESTRUKT',
  code: '38BEE270',
  sku: 'WW75K5210YW/SV',
  tags: ['Dangal', 'The Sting', '2001: A Space Odyssey', "Singin' in the Rain"],
  price: 16.19,
  priceSale: 16.19,
  totalRating: 2.5,
  totalReview: 5094,
  ratings: [
    {
      name: '1 Star',
      starCount: 3698,
      reviewCount: 7585,
    },
    {
      name: '2 Star',
      starCount: 8317,
      reviewCount: 3306,
    },
    {
      name: '3 Star',
      starCount: 2361,
      reviewCount: 6033,
    },
    {
      name: '4 Star',
      starCount: 6989,
      reviewCount: 5717,
    },
    {
      name: '5 Star',
      starCount: 2184,
      reviewCount: 4394,
    },
  ],
  reviews: [
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      name: 'Jayvion Simon',
      avatarUrl: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_1.jpg',
      comment: 'Assumenda nam repudiandae rerum fugiat vel maxime.',
      rating: 2.5,
      isPurchased: true,
      helpful: 1201,
      postedAt: '2023-03-17T15:17:52.800Z',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      name: 'Lucian Obrien',
      avatarUrl: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_2.jpg',
      comment: 'Quis veniam aut saepe aliquid nulla.',
      rating: 2,
      isPurchased: true,
      helpful: 5999,
      postedAt: '2023-03-16T14:17:52.808Z',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
      name: 'Deja Brady',
      avatarUrl: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_3.jpg',
      comment: 'Reprehenderit ut voluptas sapiente ratione nostrum est.',
      rating: 4.9,
      isPurchased: true,
      helpful: 413,
      postedAt: '2023-03-15T13:17:52.808Z',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      name: 'Harrison Stein',
      avatarUrl: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_4.jpg',
      comment: 'Error ut sit vel molestias velit.',
      rating: 2,
      isPurchased: false,
      helpful: 12,
      postedAt: '2023-03-14T12:17:52.808Z',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
      name: 'Reece Chung',
      avatarUrl: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_5.jpg',
      comment: 'Quo quia sit nihil nemo doloremque et.',
      rating: 4,
      isPurchased: false,
      helpful: 4981,
      postedAt: '2023-03-13T11:17:52.808Z',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
      name: 'Lainey Davidson',
      avatarUrl: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_6.jpg',
      comment: 'Autem doloribus harum vero laborum.',
      rating: 5,
      isPurchased: true,
      helpful: 2011,
      postedAt: '2023-03-12T10:17:52.808Z',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
      name: 'Cristopher Cardenas',
      avatarUrl: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_7.jpg',
      comment: 'Tempora officiis consequuntur architecto nostrum autem nam adipisci.',
      rating: 4.9,
      isPurchased: false,
      helpful: 3531,
      postedAt: '2023-03-11T09:17:52.808Z',
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
      name: 'Melanie Noble',
      avatarUrl: 'https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_8.jpg',
      comment: 'Voluptas sunt magni adipisci praesentium saepe.',
      rating: 5,
      isPurchased: false,
      helpful: 853,
      postedAt: '2023-03-10T08:17:52.808Z',
    },
  ],
  status: 'sale',
  inventoryType: 'low_stock',
  sizes: ['6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'],
  available: 93,
  description:
    '\n<p><strong><small> SPECIFICATION</small></strong></p>\n<p>Leather panels. Laces. Rounded toe. Rubber sole.\n<br /><br />\n<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>\n<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>\n',
  sold: 74,
  createdAt: '2023-03-17T15:17:52.809Z',
  category: 'Shose',
  gender: 'Kids',
  colors: ['#00AB55', '#000000'],
};

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

            <Grid container sx={{ my: 8 }}>
              {PRODUCT_DESCRIPTION.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                    <IconWrapperStyle>
                      <Iconify icon={item.icon} width={36} height={36} />
                    </IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Card>
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
