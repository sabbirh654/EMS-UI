import { EmployeeAddDto, EmployeeUpdateDto } from './models/employee.model';

export function EmployeeUpdateMapper(employeeDetails: any): EmployeeUpdateDto {
  return {
    name: employeeDetails.name,
    email: employeeDetails.email,
    phoneNumber: employeeDetails.phone,
    address: employeeDetails.address,
    birthDate: employeeDetails.date,
  };
}

export function EmployeeAddMapper(employeeDetails: any): EmployeeAddDto {
  return {
    name: employeeDetails.name,
    email: employeeDetails.email,
    phoneNumber: employeeDetails.phone,
    address: employeeDetails.address,
    birthDate: employeeDetails.date,
    departmentId: employeeDetails.department,
    designationId: employeeDetails.designation,
  };
}
