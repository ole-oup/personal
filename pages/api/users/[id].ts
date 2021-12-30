import type { NextApiHandler } from 'next';
import db from '../../../src/db';
import { unresolved } from '../../../src/lib/util';
import { withSessionApi } from '../../../src/lib/withSession';
import { error, httpMethodError, success } from '../../../src/server/response';

const userHandler: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  const singleUser = async () => {
    const user = await db.users.findOne({ where: { id } });

    success(res, user);
  };

  try {
    switch (method?.toUpperCase()) {
      case 'GET':
        singleUser();
        break;
      default:
        httpMethodError(res, method, ['GET']);
    }
  } catch (err) {
    error(res, err);
  }
};

export default withSessionApi(userHandler);

export const config = unresolved;
