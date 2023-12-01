import { EHttpStatus } from './http-status.enum';

describe('EHttpStatus', () => {
  test('Enum values match HTTP codes', () => {
    expect(EHttpStatus.Success).toBe(200);
    expect(EHttpStatus.Created).toBe(201);
    expect(EHttpStatus.Accepted).toBe(202);
    expect(EHttpStatus.NoContent).toBe(204);
    expect(EHttpStatus.ResetContent).toBe(205);
    expect(EHttpStatus.PartialContent).toBe(206);
    expect(EHttpStatus.MultiStatus).toBe(207);
    expect(EHttpStatus.InvalidRequest).toBe(400);
    expect(EHttpStatus.Unauthorized).toBe(401);
    expect(EHttpStatus.Forbidden).toBe(403);
    expect(EHttpStatus.NotFound).toBe(404);
    expect(EHttpStatus.MethodNotAllowed).toBe(405);
    expect(EHttpStatus.NotAcceptable).toBe(406);
    expect(EHttpStatus.RequestTimeout).toBe(408);
    expect(EHttpStatus.TooManyRequests).toBe(429);
    expect(EHttpStatus.RequestHeaderFieldsTooLarge).toBe(431);
    expect(EHttpStatus.UnavailableForLegalReasons).toBe(451);
    expect(EHttpStatus.InternalServerError).toBe(500);
    expect(EHttpStatus.NotImplemented).toBe(501);
    expect(EHttpStatus.BadGateway).toBe(502);
    expect(EHttpStatus.ServiceUnavailable).toBe(503);
    expect(EHttpStatus.GatewayTimeout).toBe(504);
    expect(EHttpStatus.RunTimeError).toBe(500);
  });
});
