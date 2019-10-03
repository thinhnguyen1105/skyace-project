import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import { IBlog } from './interface';

const BlogSchema = new mongoose.Schema(addAuditSchema(addActiveSchema({
  title: String,
  subtitle: String,
  author: String,
  tags: Array,
  content: String,
  imageSrc: String,
  viewCount: Number,
  postRating: Number,
  postCreatedAt: {
    type: Date,
    default: new Date(),
  },
  friendlyUrl: String,
  isDraft: {
    type: Boolean,
    default: false,
  }
})), {timestamps: true});

const BlogModel = mongoose.model<IBlog>('Blog', BlogSchema);
export default BlogModel;