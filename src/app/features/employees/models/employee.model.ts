export interface EmployeeDetails {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
  department: string;
  designation: string;
}

export interface EmployeeUpdateDto {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
}

export interface EmployeeAddDto {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
  departmentId: number;
  designationId: number;
}
