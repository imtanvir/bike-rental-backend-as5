export interface TResponse<T> {
  statusCode: number;
  success: boolean;
  token?: string;
  message: string;
  data: T;
}
export type TErrorSource = {
  path: string | number;
  message: string;
}[];
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource;
};
