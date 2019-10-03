import * as Joi from 'joi';
import * as blogRepository from './repository';
import { IFindPostResult, IUpdateBlogDetail, ICreateBlogInput, IFindBlogDetail, IFindBlogQuery } from './interface';
import friendlyUrl from '../../../core/helpers/get-friendly-url';

const findPostByTitle = async (query: IFindBlogQuery): Promise<IFindPostResult> => {
  if (!query) {
    throw new Error('Input not found!');
  }
  return await blogRepository.findPostByTitle(query);
};

const findPostByDate = async (dateRangeInput: string[]): Promise<IFindPostResult> => {
  if (!dateRangeInput) {
    throw new Error('Input not found!');
  }
  return await blogRepository.findPostByDate(dateRangeInput);
};

const getAllPostTitle = async (): Promise<Array<string>> => {
  return await blogRepository.getAllPostTitle();
};

const getActivePost = async (query: IFindBlogQuery): Promise<IFindPostResult> => {
  return await blogRepository.getActivePost(query);
};

const activate = async (postId: string): Promise<void> => {
  if (!postId) {
    throw new Error('Blog ID is empty!');
  }
  return await blogRepository.activate(postId);
};

const deactivate = async (postId: string): Promise<void> => {
  if (!postId) {
    throw new Error('Blog ID is empty!');
  }
  return await blogRepository.deactivate(postId);
};

const edit = async (body: IUpdateBlogDetail): Promise<IFindBlogDetail> => {
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    title: Joi.string(),
    subtitle: Joi.string(),
    author: Joi.string(),
    tags: Joi.array(),
    content: Joi.string(),
    imageSrc: Joi.string(),
    viewCount: Joi.number(),
    postRating: Joi.number(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  if (!body._id) {
    throw new Error('ID not found!');
  }
  const existedPost = await blogRepository.getPostById(body._id);
  if (!existedPost) {
    throw new Error('Blog not found!');
  } else if (existedPost.title === body.title) {
    throw new Error('Title has been used!');
  } else if (existedPost.subtitle === body.subtitle) {
    throw new Error('Subtitle has been used!');
  } else if (existedPost.content === body.content) {
    throw new Error('Content has been used!');
  } else if (body.title) {
    if (existedPost.friendlyUrl === friendlyUrl(body.title)) {
      throw new Error('Existed friendly url.');
    }
  }

  return await blogRepository.edit(body.title ? {...body, friendlyUrl: friendlyUrl(body.title)} : body);
};

const create = async (blog: ICreateBlogInput): Promise<IFindBlogDetail> => {
  const validationRule = Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    author: Joi.string().required(),
    content: Joi.string().required(),
    imageSrc: Joi.string().required(),
    viewCount: Joi.number().required(),
    postRating: Joi.number().required(),
  });
  const { error } = Joi.validate(blog, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  const existedPost = await blogRepository.findExistedPost(blog);
  if (existedPost) {
    if (existedPost.title === blog.title) {
      throw new Error('Title has been used!');
    } else if (existedPost.subtitle === blog.subtitle) {
      throw new Error('Subtitle has been used!');
    } else if (existedPost.content === blog.content) {
      throw new Error('Content has been used!');
    } else if (existedPost.friendlyUrl === friendlyUrl(blog.title)) {
      throw new Error('Existed friendly url.');
    }
  }
  return await blogRepository.create({...blog, friendlyUrl: friendlyUrl(blog.title)});
};

const deletePost = async (postId: string): Promise<void> => {
  if (!postId) {
    throw new Error('Blog ID is empty');
  }
  await blogRepository.deletePost(postId);
};

const getLastestPost = async (): Promise<IFindPostResult> => {
  return await blogRepository.getLastestPost();
};

const getPostById = async (postId: string): Promise<IFindBlogDetail> => {
  if (!postId) {
    throw new Error('Post ID is empty.');
  }
  return await blogRepository.getPostById(postId);
};

// tslint:disable-next-line:no-shadowed-variable
const getPostByFriendlyUrl = async (friendlyUrl: string): Promise<IFindBlogDetail> => {
  if (!friendlyUrl) {
    throw new Error('friendlyUrl is empty');
  }
  return await blogRepository.getPostByFriendlyUrl(friendlyUrl);
};
export default {
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
  getPostByFriendlyUrl
};