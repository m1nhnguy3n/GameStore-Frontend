import { Link as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { AppBar, Box, Button, Container, Toolbar, Link } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// hooks
import useAuth from '../../hooks/useAuth';
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';

// utils
import cssStyles from '../../utils/cssStyles';
// config
import { HEADER } from '../../config';
// routes
import { PATH_AUTH, PATH_PAGE } from '../../routes/paths';
// components
import Logo from '../../components/Logo';
//
import AccountPopover from '../dashboard/header/AccountPopover';
import navConfig from './MenuConfig';
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('md')]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export default function MainHeader() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  const theme = useTheme();

  const { pathname } = useLocation();

  const { user } = useAuth();

  const isDesktop = useResponsive('up', 'md');

  const isHome = pathname === '/';
  const linkTo = PATH_AUTH.login;


  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
          }),
        }}
      >
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo />
          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}

          {!user ? (
            <Link to={linkTo} color="inherit" component={RouterLink}>
              <Button variant="contained" target="_blank" rel="noopener"
                // src="/icons/illustration_dashboard.png"
              >
                Login Now
              </Button>
            </Link>
          ) : (
            <AccountPopover />
          )}

          {!isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
