import {
    BusinessUnit,
    BusinessUnitDraft,
    BusinessUnitPagedQueryResponse,
    BusinessUnitUpdate,
    QueryParam,
  } from "@commercetools/platform-sdk";
  import { ByProjectKeyRequestBuilder } from "@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder";
  import { ByProjectKeyBusinessUnitsRequestBuilder } from "@commercetools/platform-sdk/dist/declarations/src/generated/client/business-units/by-project-key-business-units-request-builder";
  
  export class BusinessUnitsRepository {
    byProjectKeyBusinessUnitsRequestBuilder: ByProjectKeyBusinessUnitsRequestBuilder;
  
    constructor(byProjectKeyRequestBuilder: ByProjectKeyRequestBuilder) {
      this.byProjectKeyBusinessUnitsRequestBuilder =
        byProjectKeyRequestBuilder.businessUnits();
    }

    async find(methodArgs?: {
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
    }): Promise<BusinessUnitPagedQueryResponse> {
      return (
        await this.byProjectKeyBusinessUnitsRequestBuilder.get(methodArgs).execute()
      ).body;
    }

    async getById(ID: string, methodArgs?: {
      queryArgs?: {
        expand?: string | string[];
        [key: string]: QueryParam;
      };
      headers?: {
        [key: string]: string | string[];
      };
    }): Promise<BusinessUnit> {
      return (
        await this.byProjectKeyBusinessUnitsRequestBuilder.withId({ ID }).get(methodArgs).execute()
      ).body;
    }

    async updateById(ID: string, methodArgs: {
      queryArgs?: {
          expand?: string | string[];
          [key: string]: QueryParam;
      };
      body: BusinessUnitUpdate;
      headers?: {
          [key: string]: string | string[];
      };
  }): Promise<BusinessUnit> {
      return (
        await this.byProjectKeyBusinessUnitsRequestBuilder.withId({ ID }).post(methodArgs).execute()
      ).body;
    }

    async create(methodArgs: {
      body: BusinessUnitDraft;
      headers?: {
          [key: string]: string | string[];
      };
    }): Promise<BusinessUnit> {
      return (
        await this.byProjectKeyBusinessUnitsRequestBuilder.post(methodArgs).execute()
      ).body;
    }
  }