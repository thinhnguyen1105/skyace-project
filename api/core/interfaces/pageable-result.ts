// tslint:disable-next-line:interface-name
export interface PageableResult<T> {
  readonly data: T[];
  readonly total: number;
}
