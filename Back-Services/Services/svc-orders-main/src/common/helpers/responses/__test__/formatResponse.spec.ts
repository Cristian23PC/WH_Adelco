import { HttpStatus } from '@nestjs/common';
import { formatResponse } from '@/common/helpers/responses/format-response.helper';
import { IResponse } from '@/common/helpers/responses/interfaces/response.interface';

describe('formatResponse()', () => {
  it('should return IResponse formatted data', () => {
    const response = {
      statusCode: HttpStatus.OK,
      message: undefined,
      payload: 'test'
    };
    expect(formatResponse<string>(HttpStatus.OK, 'test') as IResponse<string>).toStrictEqual(response);
  });
  it('should return message in response body', () => {
    const response = {
      statusCode: HttpStatus.OK,
      message: 'test'
    };
    expect(formatResponse<string>(HttpStatus.OK, 'test', true) as IResponse<string>).toStrictEqual(response.message);
  });
  it('should return count in response body', () => {
    const expected = {
      statusCode: HttpStatus.OK,
      message: 'test',
      count: 5
    };
    const response = formatResponse<string>(HttpStatus.OK, 'test', false, 'test', 5) as IResponse<string>;
    expect(response.count).toStrictEqual(expected.count);
  });
});
