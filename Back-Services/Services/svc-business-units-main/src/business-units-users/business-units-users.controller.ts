import { BadRequestException, Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import {
  CompleteRegistrationRequestDto,
  PreRegistrationRequestDto,
  RepRegistrationRequestDto,
  ResetPasswordRequestDto,
  UserAndRutValidationRequestDto,
  UserAndRutValidationResponseDto,
  ValidateVerificationCodeDto,
  VerificationCodeRequestDto
} from './dto/business-units-users.dto';
import { BusinessUnitsUsersService } from './business-units-users.service';
import { KeycloakUserCreationResponse } from '@/keycloak/interfaces/keycloak.interface';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusinessUnitsUsers, IUserBusinessUnits, UserBusinessUnits } from './models';

import { AuthorizationHeaders } from '@/common/decorator/headers.decorator';
import { ConfigService } from '@nestjs/config';
import { UserAndRutValidationResponse } from './business-units-users.interface';
import { ConvertedBusinessUnit } from '@/business-units/models';
import { EnumSwaggerTags } from '@/swagger/enum';

@Controller('users')
@ApiTags(EnumSwaggerTags.BUSINESS_UNIT_USERS)
export class BusinessUnitsUsersController {
  constructor(private businessUnitsUsersService: BusinessUnitsUsersService, private readonly configService: ConfigService) {}

  private userHeaderRoles = this.configService.get<string>('business-unit-users.userHeaderRoles');
  private userHeaderId = this.configService.get<string>('business-unit-users.userHeaderId');

  @ApiOkResponse({
    description: 'User Business Units',
    type: UserBusinessUnits,
    isArray: false
  })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'ID of the user'
  })
  @Get('me/business-units')
  async getBusinessUnitsForUser(@Headers() headers: object): Promise<IUserBusinessUnits> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }
    return this.businessUnitsUsersService.findBusinessUnitsForUser(headers[`${this.userHeaderId}`]);
  }

  @ApiOkResponse({ status: 201, type: BusinessUnitsUsers, description: 'Keycloak user successfully created' })
  @ApiOperation({ operationId: 'preRegistration', description: 'Pre registration of Business Unit' })
  @Post('pre-registration')
  async preRegistration(@Body() preRegistrationRequest: PreRegistrationRequestDto): Promise<KeycloakUserCreationResponse> {
    // TODO: send the message to a topic.
    return await this.businessUnitsUsersService.preRegistration(preRegistrationRequest);
  }

  @ApiOkResponse({
    description: 'Business Unit created',
    isArray: false
  })
  @ApiOperation({ operationId: 'completeRegistration', description: 'Complete registration of Business Unit' })
  @Post('registration')
  async completeRegistration(@Body() body: CompleteRegistrationRequestDto): Promise<ConvertedBusinessUnit> {
    return await this.businessUnitsUsersService.completeRegistration(body);
  }

  @AuthorizationHeaders()
  @ApiOkResponse({
    description: 'Business Unit created',
    isArray: false
  })
  @ApiOperation({ operationId: 'repRegistration', description: 'Sales Representative registration' })
  @Post('rep-registration')
  async repRegistration(@Headers() headers: object, @Body() body: RepRegistrationRequestDto): Promise<ConvertedBusinessUnit> {
    if (!headers[`${this.userHeaderRoles}`]) {
      throw new BadRequestException('User roles missing');
    }

    return await this.businessUnitsUsersService.repRegistration(body, headers[`${this.userHeaderRoles}`]);
  }

  @ApiOkResponse({ status: 200, type: UserAndRutValidationResponseDto, description: 'User & RUT successfully validated' })
  @HttpCode(200)
  @ApiOperation({ operationId: 'validateUserAndRut', description: 'Validate user and RUT' })
  @Post('validation')
  async validateUserAndRut(@Body() body: UserAndRutValidationRequestDto): Promise<UserAndRutValidationResponse> {
    return await this.businessUnitsUsersService.validateUserAndRut(body);
  }

  @ApiOkResponse({ status: 202, description: 'A new verification code has been generated and successfully sent by mail.' })
  @HttpCode(202)
  @ApiOperation({ operationId: 'requestVerificationCode', description: 'Verificate code' })
  @Post('verification-code-request')
  async requestVerificationCode(@Body() body: VerificationCodeRequestDto): Promise<void> {
    return await this.businessUnitsUsersService.requestVerificationCode(body);
  }

  @ApiOkResponse({ status: 202, description: 'Password is reset and user is marked as mail verified' })
  @HttpCode(202)
  @ApiOperation({ operationId: 'resetPassword', description: 'Reset password of User' })
  @Post('pass-reset-request')
  async resetPassword(@Body() body: ResetPasswordRequestDto): Promise<void> {
    return await this.businessUnitsUsersService.resetPassword(body);
  }

  @ApiOkResponse({ status: 202, description: 'Verification code validation done' })
  @HttpCode(202)
  @ApiOperation({ operationId: 'validateVerificationCode', description: 'Validate verification code' })
  @Post('validate-verification-code-request')
  async validateVerificationCode(@Body() body: ValidateVerificationCodeDto): Promise<void> {
    return await this.businessUnitsUsersService.validateVerificationCode(body);
  }
}
