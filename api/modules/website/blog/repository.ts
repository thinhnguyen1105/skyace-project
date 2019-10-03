import BlogModel from './mongoose';
import { IFindPostResult, IUpdateBlogDetail, ICreateBlogInput, IFindBlogDetail, IFindBlogQuery } from './interface';
import { ObjectID } from 'mongodb';

const findPostByTitle = async (query: IFindBlogQuery): Promise<IFindPostResult> => {
  try {
    const totalPromise = await BlogModel
      .find(
        query.searchInput ? { title: { $regex: `${query.searchInput}`, $options: 'i' } } : {}
      )
      .countDocuments()
      .exec();

    const data = await BlogModel
      .find(
        query.searchInput ? { title: { $regex: `${query.searchInput}`, $options: 'i' } } : {}
      )
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .exec();
    return {
      data,
      total: totalPromise
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findPostByDate = async (dateRangeInput: string[]): Promise<IFindPostResult> => {
  try {
    if (dateRangeInput[0] && dateRangeInput[1]) {
      const data = await BlogModel
        .find({
          postCreatedAt: {
            $gte: dateRangeInput[0],
            $lt: dateRangeInput[1]
          }
        }).exec();
      return {
        data,
        total: 1
      };
    } else {
      return {} as any;
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findExistedPost = async (blog: ICreateBlogInput): Promise<IFindBlogDetail> => {
  try {
    const data = await BlogModel
      .findOne({
        $or: [
          { title: blog.title },
          { subtitle: blog.subtitle },
          { content: blog.content },
        ],
      });
    return data as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getAllPostTitle = async (): Promise<Array<string>> => {
  try {
    const listTitle: [string] = [''];
    const data = await BlogModel
      .find(
        {},
        {
          title: 1,
          _id: 0,
        },
      )
      .exec();
    data.map(item => listTitle.push(item.title));
    return listTitle;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getActivePost = async (query: IFindBlogQuery): Promise<IFindPostResult> => {
  try {
    const totalPromise = await BlogModel
      .find({
        $and: [
          query.searchInput ? { title: { $regex: `${query.searchInput}`, $options: 'i' } } : {},
          { isActive: true, isDraft: { $ne: true } }
        ],
      })
      .countDocuments()
      .exec();

    const data = await BlogModel
      .find({
        $and: [
          query.searchInput ? { title: { $regex: `${query.searchInput}`, $options: 'i' } } : {},
          { isActive: true, isDraft: { $ne: true } }
        ],
      })
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .exec();
    return {
      data,
      total: totalPromise
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const activate = async (postId: string): Promise<void> => {
  try {
    await BlogModel
      .findByIdAndUpdate(postId, {
        $set: {
          isActive: true,
        },
      })
      .exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deactivate = async (postId: string): Promise<void> => {
  try {
    await BlogModel
      .findByIdAndUpdate(postId, {
        $set: {
          isActive: false,
        },
      })
      .exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const edit = async (body: IUpdateBlogDetail): Promise<IFindBlogDetail> => {
  try {
    return await BlogModel
      .findOneAndUpdate({ _id: body._id }, { $set: body }, { new: true })
      .exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const create = async (blog: ICreateBlogInput): Promise<IFindBlogDetail> => {
  try {
    const newpost = new BlogModel({
      ...blog,
    });

    return await newpost.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deletePost = async (postId: string): Promise<void> => {
  try {
    await BlogModel
      .findByIdAndRemove(new ObjectID(postId))
      .exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};
const getLastestPost = async (): Promise<IFindPostResult> => {
  try {
    const data = await BlogModel
      .find(
        { isActive: true }
      )
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .exec();

    return {
      data,
      total: 5
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getPostById = async (postId: string): Promise<IFindBlogDetail> => {
  try {

    const data = await BlogModel
      .findOne(
        {
          _id: postId,
        }
      )
      .exec();
    return data!;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getPostByFriendlyUrl = async (friendlyUrl: string): Promise<IFindBlogDetail> => {
  try {

    const data = await BlogModel
      .findOne(
        {
          friendlyUrl: friendlyUrl,
        }
      )
      .exec();
    if ((data && (data as any).isActive === false || (data as any).isDraft === true)) {
      throw new Error('Blog is deactivated');
    } else {
      return data!;
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

export {
  findPostByTitle,
  findPostByDate,
  getAllPostTitle,
  getActivePost,
  activate,
  deactivate,
  edit,
  create,
  deletePost,
  getLastestPost,
  getPostById,
  findExistedPost,
  getPostByFriendlyUrl
};