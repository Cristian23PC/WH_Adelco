import { CommonDto } from '@/dto/common.dto';
import { LocalizedStringDto } from '@/dto/localizedString.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StateDto extends CommonDto {
  @ApiProperty({ description: 'Unique identifier of the State.' })
  id: string;

  @ApiProperty({ description: 'Current version of the State.' })
  version: number;

  @ApiProperty({ description: 'User-defined unique identifier of the State.' })
  key: string;

  @ApiProperty({ description: 'Indicates to which resource or object types the State is assigned to.' })
  type: any;

  @ApiProperty({ description: 'Name of the State.', type: LocalizedStringDto, required: false })
  name: LocalizedStringDto;

  @ApiProperty({ description: 'Description of the State.', type: LocalizedStringDto, required: false })
  description: LocalizedStringDto;

  @ApiProperty({ description: 'true for an initial State, the first State in a workflow.' })
  initial: boolean;

  @ApiProperty({ description: 'true for States that are an integral part of the Project.' })
  builtIn: boolean;

  @ApiProperty({ description: 'Roles the State can fulfill for Reviews and Line Items.', required: false, isArray: true })
  roles: any[];

  @ApiProperty({
    description:
      '* list of States of the same type that the current State can be transitioned to. \n * if empty, no transitions are allowed from the current State, defining the current State as final for this workflow. \n * if not set, the validation is turned off and the current State can be transitioned to any other State of the same type as the current State.',
    required: false,
    isArray: true
  })
  transitions: any[];

  @ApiProperty({ description: 'Present on resources created after 1 February 2019 except for events not tracked.', required: false })
  createdBy: string;

  @ApiProperty({ description: 'Present on resources created after 1 February 2019 except for events not tracked.', required: false })
  lastModifiedBy: string;
}

export class StateReferenceDto {
  @ApiProperty({ description: 'Unique identifier of the referenced State.' })
  id: string;

  @ApiProperty({ description: '"state" References a State.' })
  typeId: string;

  @ApiProperty({ description: 'Contains the representation of the expanded State.', type: StateDto, required: false })
  obj: StateDto;
}
