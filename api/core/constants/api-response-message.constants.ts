export class ApiResponseMessageConstants {
  public static FORBIDDEN: string = 'Forbidden';
  public static UNAUTHORIZED: string = 'Unauthorized';
  public static BAD_REQUEST: string = 'Bad request';

  public static EntityNotFound = (name: string) => {
    return `${name} not found`;
  }

  public static EntityAlreadyExists = (name: string) => {
    return `${name} already exists`;
  }

  public static EntitySuccessfullyCreated = (name: string) => {
    return `${name} has been successfully created`;
  }

  public static EntitySuccessfullyUpdated = (name: string) => {
    return `${name} has been successfully updated`;
  }
}
