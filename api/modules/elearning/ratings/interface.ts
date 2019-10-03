import { Document } from 'mongoose';
import { IsAuditable, HasTenant } from '../../../core/interfaces';

export interface IRating extends Document, IsAuditable, HasTenant {
  rateSession: number;
  commentSession: string;
  uploadBy: string;
  uploadDate: Date;
}

export interface IFindRatingDetail {
  _id: string;
  rateSession: number;
  commentSession: string;
  uploadBy: any;
  uploadDate: Date;
}

export interface IFindRatingsResult {
  total: number;
  data: IFindRatingDetail[];
  stars?: any;
}

export interface ICreateRatingInput { 
  rateSession: number;
  commentSession: string;
  uploadBy: string;
  uploadDate: Date;
  tutor: string;
}

export interface IUpdateRatingInput {
  _id: string;
  rateSession?: number;
  commentSession?: string;
  uploadBy?: string;
}

export interface IFindByUserIdInput {
  userId: string;
  pageSize: number;
  pageNumber: number;
}