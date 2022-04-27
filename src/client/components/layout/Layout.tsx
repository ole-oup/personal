import { Container } from '@mui/material';
import { CProps } from '../../../../types/client';
import { ParsedUser } from '../../../../types/server';
import CenteredSpinner from '../common/CenteredSpinner';
import NoAccess from '../common/NoAccess';
import Navbar from './Navbar';

interface Props extends CProps {
  session?: ParsedUser;
  loading?: boolean;
  blockAccess?: boolean;
}

/**
 * Navbar und Container mit Laden-Spinner, Nachricht über fehlende Berechtigungen oder content.
 */
function Layout({ session, loading, blockAccess, children }: Props) {
  return (
    <>
      <Navbar session={session} />
      <Container component="main" maxWidth="lg">
        {loading ? <CenteredSpinner /> : blockAccess ? <NoAccess /> : children}
      </Container>
    </>
  );
}

export default Layout;
