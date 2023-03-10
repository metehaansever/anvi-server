import { ValidateProps } from '@/api-lib/constants';
import { findPosts, insertPost } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const posts = await findPosts(
    db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  res.json({ posts });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      title: ValidateProps.submission.title,
      desc: ValidateProps.submission.desc,
      name: ValidateProps.submission.name,
      email: ValidateProps.submission.email,
      affiliation: ValidateProps.submission.affiliation,
      web: ValidateProps.submission.web,
      workdir: ValidateProps.submission.workdir,
      setup: ValidateProps.submission.setup,
      run: ValidateProps.submission.run,
      is_public: ValidateProps.submission.is_public,
    },
    required: ['title', 'desc', 'name', 'email', 'workdir', 'setup', 'run'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();

    const post = await insertPost(db, {
      title: req.body.title,
      desc: req.body.desc,
      name: req.body.name,
      email: req.body.email,
      affiliation: req.body.affiliation,
      web: req.body.web,
      workdir: req.body.workdir,
      setup: req.body.setup,
      run: req.body.run,
      is_public: req.body.is_public,
      creatorId: req.user._id,
    });

    return res.json({ post });
  }
);

export default handler;
