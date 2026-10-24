import { PartialType } from '@nestjs/mapped-types';
import { CreateBasdDto } from './create-basd.dto';

export class UpdateBasdDto extends PartialType(CreateBasdDto) {}
