import { AddUpdateDesignationDto } from './models/designation.model';

export function DesignationAddUpdateMapper(
  designation: any
): AddUpdateDesignationDto {
  return {
    name: designation.name,
  };
}
