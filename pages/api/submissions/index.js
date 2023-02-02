import { ValidateProps } from '@/api-lib/constants';
import { findSubmissions, insertSubmission } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const submissions = await findSubmissions(
    db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 1) : undefined
  );

  res.json({ submissions });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.submission.content,
    },
    required: ['content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();

    const submissions = await insertSubmission(db, {
      content: req.body.content,
      creatorId: req.user._id,
    });

    return res.json({ submissions });
  }
);

export default handler;
