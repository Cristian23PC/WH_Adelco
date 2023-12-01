import { BusinessUnit, BusinessUnitUpdate, QueryParam } from "@commercetools/platform-sdk";
import { BusinessUnitsRepository } from "./business-units";

const mockByProjectKeyBusinessUnitsRequestBuilder = {
  withId: jest.fn().mockReturnThis(),
  withKey: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  execute: jest.fn(() => Promise.resolve({ body: { id: "id" } })),
};

const mockByProjectKeyRequestBuilder = {
  businessUnits: jest.fn(() => mockByProjectKeyBusinessUnitsRequestBuilder),
};

describe("BusinessUnitsRepository", () => {
  let businessUnitsRepository: BusinessUnitsRepository;

  beforeAll(() => {
    businessUnitsRepository = new BusinessUnitsRepository(<any>mockByProjectKeyRequestBuilder);
  });

  describe("find", () => {
    let methodArgs: {
      queryArgs?: {
        expand?: string | string[];
        sort?: string | string[];
        limit?: number;
        offset?: number;
        withTotal?: boolean;
        where?: string | string[];
        [key: string]: QueryParam;
      };
      headers?: {
        [key: string]: string | string[];
      };
    };
    let expectedResponse: any;
    let response: any;

    beforeAll(() => {
      methodArgs = {};
      expectedResponse = { id: "id" };
    });

    beforeEach(async () => {
      response = await businessUnitsRepository.find(methodArgs);
    });

    test("should call byProjectKeyBusinessUnitsRequestBuilder.get", () => {
      expect(mockByProjectKeyBusinessUnitsRequestBuilder.get).toHaveBeenCalledWith(
        methodArgs
      );
    });

    test("should call byProjectKeyBusinessUnitsRequestBuilder.execute", () => {
      expect(
        mockByProjectKeyBusinessUnitsRequestBuilder.execute
      ).toHaveBeenCalledWith();
    });

    test("should return expected response", async () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe("getById", () => {
    let methodArgs: {
      queryArgs?: {
        expand?: string | string[];
        [key: string]: QueryParam;
      };
      headers?: {
        [key: string]: string | string[];
      };
    };
    let expectedResponse: any;
    let response: BusinessUnit;
    let requestId: string;

    beforeAll(() => {
      requestId = 'id';
      methodArgs = {};
      expectedResponse = { id: "id" };
    });

    beforeEach(async () => {
      response = await businessUnitsRepository.getById(requestId, methodArgs);
    });

    test("should call byProjectKeyBusinessUnitsRequestBuilder.withId", () => {
      expect(mockByProjectKeyBusinessUnitsRequestBuilder.withId).toHaveBeenCalledWith({
        ID: requestId
      });
    });

    test("should call byProjectKeyBusinessUnitsRequestBuilder.get", () => {
      expect(mockByProjectKeyBusinessUnitsRequestBuilder.get).toHaveBeenCalledWith(
        methodArgs
      );
    });

    test("should call byProjectKeyBusinessUnitsRequestBuilder.execute", () => {
      expect(
        mockByProjectKeyBusinessUnitsRequestBuilder.execute
      ).toHaveBeenCalledWith();
    });

    test("should return expected response", async () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe("updateById", () => {
    let methodArgs: {
      queryArgs?: {
          expand?: string | string[];
          [key: string]: QueryParam;
      };
      body: BusinessUnitUpdate;
      headers?: {
          [key: string]: string | string[];
      };
    };
    let expectedResponse: any;
    let response: BusinessUnit;
    let requestId: string;

    beforeAll(() => {
      requestId = 'id';
      methodArgs = {
        body: {
          version: 1,
          actions: []
        }
      };
      expectedResponse = { id: "id" };
    });

    beforeEach(async () => {
      response = await businessUnitsRepository.updateById(requestId, methodArgs);
    });

    test("should call byProjectKeyBusinessUnitsRequestBuilder.withId", () => {
      expect(mockByProjectKeyBusinessUnitsRequestBuilder.withId).toHaveBeenCalledWith({
        ID: requestId
      });
    });

    test("should call byProjectKeyBusinessUnitsRequestBuilder.post", () => {
      expect(mockByProjectKeyBusinessUnitsRequestBuilder.post).toHaveBeenCalledWith(
        methodArgs
      );
    });

    test("should call byProjectKeyBusinessUnitsRequestBuilder.execute", () => {
      expect(
        mockByProjectKeyBusinessUnitsRequestBuilder.execute
      ).toHaveBeenCalledWith();
    });

    test("should return expected response", async () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe("create", () => {
    let methodArgs: {
      queryArgs?: {
        expand?: string | string[];
        [key: string]: QueryParam;
      };
      body: any;
      headers?: {
        [key: string]: string | string[];
      };
    };
    let expectedResponse: any;
    let response: any;

    beforeAll(() => {
      methodArgs = { body: {} };
      expectedResponse = { id: "id" };
    });

    beforeEach(async() => {
      response = await businessUnitsRepository.create(methodArgs);
    });

    test("should call mockByProjectKeyBusinessUnitsRequestBuilder.post", () => {
      expect(
        mockByProjectKeyBusinessUnitsRequestBuilder.post
      ).toHaveBeenCalledWith(methodArgs);
    });

    test("should call mockByProjectKeyBusinessUnitsRequestBuilder.execute", () => {

      expect(
        mockByProjectKeyBusinessUnitsRequestBuilder.execute
      ).toHaveBeenCalledWith();
    });

    test("should return expected response", async () => {
      expect(response).toEqual(expectedResponse);
    });
  });
});