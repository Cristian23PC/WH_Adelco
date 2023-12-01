import { BadRequestException, Body, Controller, ForbiddenException, Get, Headers, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiBody, ApiBadRequestResponse, ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { BusinessUnitsService } from './business-units.service';
import { ConfigService } from '@nestjs/config';
import { FilterGetAllBusinessUnits, UpdateRequestDto } from './dto/business-units.dto';
import { BusinessUnitList, BusinessUnit as BusinessUnitModel, ConvertedBusinessUnit } from './models';
import { AuthorizationHeaders } from '@/common/decorator/headers.decorator';
import { CreateDivisionRequestDto } from './dto/division.dto';
import { THeaders } from '@/common/types';
import { TransformHeaderGuard } from '@/common/guards/transformHeader.guard';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { PaymentMethodsResponseDto } from './dto/BusinessUnitPaymentsMethods.dto';
import { plainToClass } from 'class-transformer';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';
import { EnumSwaggerTags } from '@/swagger/enum';

@Controller('business-unit')
@ApiTags(EnumSwaggerTags.BUSINESS_UNIT)
export class BusinessUnitsController {
  private readonly headerName = this.configService.get<string>('businessUnits.userHeaderId');
  private readonly userHeaderRoles = this.configService.get<string>('businessUnits.userHeaderRoles');

  constructor(
    private readonly businessUnitService: BusinessUnitsService,
    private readonly configService: ConfigService,
    private readonly paymentMethodsService: PaymentsMethodsService
  ) {}

  @ApiOkResponse({
    description: 'List of payment methods',
    type: PaymentMethodsResponseDto
  })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'ID of the user'
  })
  @ApiNotFoundResponse({ description: 'Business Unit not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiOperation({
    operationId: 'getEnabledPaymentMethods',
    deprecated: true,
    description: 'GET enabled payment methods. Deprecated, use Carts-MS /business-unit/:id/active-cart/payment-methods instead '
  })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get('/:id/active-cart/payment-methods')
  async getEnabledPaymentMethods(@Headers() headers: object, @Param('id') buId: string): Promise<PaymentMethodsResponseDto> {
    if (!headers[`${this.headerName}`]) {
      throw new BadRequestException('User ID missing');
    }
    return plainToClass(PaymentMethodsResponseDto, this.paymentMethodsService.getEnabledPaymentMethods(buId));
  }

  @ApiOkResponse({
    description: 'Created Division',
    type: BusinessUnitModel
  })
  @AuthorizationHeaders(true)
  @ApiNotFoundResponse({
    description: 'Customer is not associated to this Business Unit',
    status: 404
  })
  @UseGuards(TransformHeaderGuard)
  @Post('/:parentBusinessUnitId/divisions')
  async createDivision(
    @Headers() headers: THeaders,
    @Param('parentBusinessUnitId') parentBusinessUnitId: string,
    @Body() body: CreateDivisionRequestDto
  ): Promise<ConvertedBusinessUnit> {
    const username = headers[userHeaderId];
    const userRoles: string[] = headers[userHeaderRoles];
    if (!username) {
      throw new BadRequestException('Customer ID missing');
    }
    if (!userRoles) {
      throw new BadRequestException('User roles missing');
    }

    return await this.businessUnitService.createDivision(parentBusinessUnitId, body, { username, userRoles });
  }

  @ApiOkResponse({
    description: 'Updated Business Unit',
    type: BusinessUnitModel,
    isArray: false
  })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'ID of the user'
  })
  @ApiNotFoundResponse({
    description: 'Customer is not associated to this Business Unit',
    status: 404
  })
  @ApiOperation({ operationId: 'update', description: 'Update Business Unit' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiBody({ type: [UpdateRequestDto] })
  @Put(':id')
  async update(@Headers() headers: object, @Param('id') id: string, @Body() body: UpdateRequestDto): Promise<ConvertedBusinessUnit> {
    if (!headers[`${this.headerName}`]) {
      throw new BadRequestException('User ID missing');
    }
    return await this.businessUnitService.update(id, body, headers[`${this.headerName}`]);
  }

  @ApiOkResponse({
    description: 'Get Business Unit by ID',
    type: BusinessUnitModel,
    isArray: false
  })
  @ApiNotFoundResponse({
    description: 'Business Unit not found',
    status: 404
  })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiOperation({ operationId: 'getById', description: 'GET Business Unit by ID' })
  @Get(':id')
  async getById(@Param('id') id: string): Promise<ConvertedBusinessUnit> {
    return await this.businessUnitService.getConvertedById(id);
  }

  @AuthorizationHeaders()
  @ApiOkResponse({
    description: 'Business Units matches rut',
    isArray: true
  })
  @ApiBadRequestResponse({
    description: 'User roles missing'
  })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiOperation({ operationId: 'by-rut', description: 'GET Business Unit by rut' })
  @ApiParam({ name: 'rut', type: 'string', required: true })
  @Get('by-rut/:rut')
  async byRut(@Headers() headers: object, @Param('rut') rut: string): Promise<ConvertedBusinessUnit[]> {
    const userHeaderRoles: string[] = headers[`${this.userHeaderRoles}`];
    if (!userHeaderRoles) {
      throw new BadRequestException('User roles missing');
    }
    if (!userHeaderRoles.includes('__INTERNAL__')) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return await this.businessUnitService.findConvertedByRut(rut);
  }

  @ApiOkResponse({
    description: 'Get All Business Units',
    type: BusinessUnitList,
    isArray: true
  })
  @ApiNotFoundResponse({
    description: 'Get All Business Unit not found',
    status: 404
  })
  @ApiOperation({ operationId: 'getAll', description: 'Get All Business Units' })
  @Get()
  async getAllBusinessUnits(
    @Query()
    filterGetAllBusinessUnits: FilterGetAllBusinessUnits
  ): Promise<BusinessUnitList[]> {
    return await this.businessUnitService.getAllBusinessUnits(filterGetAllBusinessUnits);
  }
}
