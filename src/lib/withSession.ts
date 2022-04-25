import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { sessionConfig } from '../../config';
import { NextApiHandlerWithDB, ParsedUser } from '../../types/server';
import { error } from '../server/response';
import { redirectUrl } from '../utils/shared';

declare module 'iron-session' {
  interface IronSessionData {
    user?: ParsedUser;
  }
}

// ssr handler mit redirect
const sessionPropHandler: (
  context: GetServerSidePropsContext
) => GetServerSidePropsResult<{ user: ParsedUser }> = ({ req }) => {
  const { user } = req.session;

  if (user?.username === undefined) {
    const url = redirectUrl(req.url ?? '/');
    const encodeRedirect = `/login?redirect=${encodeURIComponent(url)}`;
    const destination = url !== '/' ? encodeRedirect : '/login';

    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};

/**
 * Session als Prop, ohne Authentifizierung redirect.
 * Kompatibel mit `InferGetServerSidePropsType`
 * @example
 * export const getServerSideProps = withSessionSsr();
 * const Manage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => { ... };
 * export default Manage;
 */
export const withSessionSsr = () =>
  withIronSessionSsr(sessionPropHandler, sessionConfig);

/**
 * Middleware die auf login prüft (session existiert).
 * Gibt `req` auch das Session-Objekt.
 * Bei Erfolg wird session erneuert.
 * Außerdem wird die DB in `res.db` mitgegeben und ggf initialisiert.
 * @example
 * const routeHandler: NextApiHandler = async (req, res) => { const { session } = req; ... };
 * export default withSessionApi(routeHandler);
 */
export const withSessionApi = (
  handler: NextApiHandlerWithDB,
  noAuth?: boolean
) => {
  const authHandler: NextApiHandlerWithDB = async (req, res) => {
    if (!noAuth) {
      const { session } = req;
      // nicht authentifiziert
      if (session.user === undefined) {
        error(res, 'Authentifizierung erforderlich', 403);
        return;
      }

      // wenn authentifiziert, Session erneuern
      await session.save();
    }
    // weiter wie next()
    handler(req, res);
  };

  return withIronSessionApiRoute(authHandler, sessionConfig);
};
