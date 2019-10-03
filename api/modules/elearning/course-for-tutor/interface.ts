import { Document } from 'mongoose';
import { HasActive, IsAuditable, HasModificationAuditInfo } from '../../../core/interfaces';

export interface ICourseForTutor extends Document, IsAuditable, HasActive {
  // For populated fields after queries
  course: any;
  tutor: any;
  tuitions?: any;
  groupTuition?: any;
  hourlyRate: number;
  tenant_id: string;
  isDeleted: any;
  isGroup: boolean;
}

export interface ICreateCourseForTutorInput {
  course?: string;
  tutor: string;
  groupTuition?: string;
  hourlyRate: number;
  tenant_id: string;
  isGroup?: boolean;
}

export interface IUpdateCourseForTutorInput extends HasModificationAuditInfo {
  _id: string;
  hourlyRate: number;
  tutor: string;
  course: string;
  tenant_id: string;
}

export interface IGetCourseForTutorDetail {
  _id: string;
  tenant_id: string;
  course?: string;
  tutor: string;
  tuitions: any;
  groupTuition: any;
  hourlyRate: number;
}

export interface IGetAllCourseForTutor { }
