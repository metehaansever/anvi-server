import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findSubmissionById(db, id) {
  const submissions = await db
    .collection('submissions')
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
  if (!submissions[0]) return null;
  return submissions[0];
}

export async function findSubmissions(db, before, by, limit = 10) {
  return db
    .collection('submissions')
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

export async function insertSubmission(db, { content, creatorId }) {
  const submission = {
    content,
    creatorId,
    createdAt: new Date(),
  };
  const { insertedId } = await db
    .collection('submissions')
    .insertOne(submission);
  submission._id = insertedId;
  return submission;
}
