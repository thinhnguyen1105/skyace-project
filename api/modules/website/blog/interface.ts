import { Document } from 'mongoose';
import { HasCreationAuditInfo, HasModificationAuditInfo, HasActive, PageableQuery, SortableQuery, PageableResult } from '../../../core/interfaces';

export interface IBlog extends Document, HasActive, HasCreationAuditInfo, HasModificationAuditInfo {
  title: string;
  subtitle: string;
  author: string;
  tags: string[];
  content: string;
  imageSrc: string;
  viewCount: number;
  postRating: number;
  friendlyUrl: string;
  isDraft: boolean;
}

export interface IFindPostResult extends PageableResult<IFindBlogDetail> {}

export interface IFindBlogDetail extends HasActive {
  title: string;
  subtitle: string;
  author: string;
  tags: string[];
  content: string;
  imageSrc: string;
  viewCount: number;
  postRating: number;
  _id: string;
  friendlyUrl: string;
  isDraft: boolean;
}

export interface IUpdateBlogDetail extends HasModificationAuditInfo {
  _id: string;
  title?: string;
  subtitle?: string;
  author?: string;
  tags?: string[];
  content?: string;
  imageSrc?: string;
  viewCount?: number;
  postRating?: number;
  friendlyUrl?: string;
  isDraft?: boolean;
}

export interface ICreateBlogInput extends HasActive {
  title: string;
  subtitle: string;
  author: string;
  tags: string[];
  content: string;
  imageSrc: string;
  friendlyUrl?: string;
  isDraft: boolean;
}

export interface IFindBlogDetail extends HasActive {
  title: string;
  subtitle: string;
  author: string;
  tags: string[];
  content: string;
  imageSrc: string;
  viewCount: number;
  postRating: number;
  _id: string;
  isActive: boolean;
  friendlyUrl: string;
  isDraft: boolean;
}

export interface IFindBlogQuery extends PageableQuery, SortableQuery {
  searchInput: string;
}

export interface IUpdateBlogSuccessPayload {
  blogInfo: IFindBlogDetail;
}