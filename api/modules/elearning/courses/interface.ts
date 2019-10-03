import { Document } from 'mongoose';
import { HasCreationAuditInfo, HasActive, IsAuditable, HasModificationAuditInfo } from '../../../core/interfaces';

export interface ICourse extends Document, IsAuditable, HasActive {
  country: string;
  level: string;
  grade: string;
  subject: string;
  session: number;
  hourPerSession: number;
  tenant_id: string;
  isDeleted: any;
  academicStart?: string;
  academicEnd?: string;
  isConverted?: boolean;
}

export interface ICreateCourseInput extends HasCreationAuditInfo, HasActive {
  country: string;
  tenant_id: string;
  level: string;
  grade: string;
  subject: string;
  session: number;
  hourPerSession: number;
  isDeleted: boolean;
  academicStart?: string;
  academicEnd?: string;
  isConverted?: boolean;
}

export interface IUpdateCourseInput extends HasModificationAuditInfo {
  _id: string;
  tenant_id: string;
  country?: string;
  level?: string;
  grade?: string;
  subject?: string;
  session?: number;
  hourPerSession?: number;
  isDeleted: boolean;
  academicStart?: string;
  academicEnd?: string;
}

export interface IDeleteCourseInput {
  _id: string;
}

export interface IGetAllCourses {
}

export interface IGetAllSubjects {
}
export interface IGetCourseDetail {
  _id: string;
  tenant_id: string;
  country: string;
  level: string;
  grade: string;
  subject: string;
  session: number;
  hourPerSession: number;
  isDeleted: any;
  academicStart?: string;
  academicEnd?: string;
}

export interface ISearchAllFieldInput {
  keyword: string;
}

export interface IGetAllCountries { }