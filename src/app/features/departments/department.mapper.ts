import { AddUpdateDepartmentDto } from './models/department.model';

export function DepartmentAddUpdateMapper(
  department: any
): AddUpdateDepartmentDto {
  return {
    name: department.name,
  };
}
