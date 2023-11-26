// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
// sections
import { HomeHero } from '../sections/home';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="Welcome to Game Store">
      <RootStyle>
        <HomeHero />
      </RootStyle>
    </Page>
  );
}
