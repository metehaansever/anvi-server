import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findPostById(db, id) {
  const posts = await db
    .collection('posts')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
  if (!posts[0]) return null;
  return posts[0];
}

export async function findPosts(db, before, by, limit = 10) {
  return db
    .collection('posts')
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
}

export async function insertPost(
  db,
  {
    title,
    desc,
    name,
    email,
    affiliation,
    workdir,
    setup,
    run,
    is_public,
    creatorId,
  }
) {
  const post = {
    title,
    desc,
    name,
    email,
    affiliation,
    workdir,
    setup,
    run,
    is_public,
    creatorId,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('posts').insertOne(post);
  post._id = insertedId;
  return post;
}
