export class PTPAPIError extends Error {
  public statusCode?: number;
  public response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'PTPAPIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}
