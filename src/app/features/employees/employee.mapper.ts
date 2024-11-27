import { EmployeeDetails, EmployeeUpdateDto } from "./models/employee.model";

export function EmployeeUpdateMapper(employeeDetails: any): EmployeeUpdateDto {
    return {
        name: employeeDetails.name,
        email: employeeDetails.email,
        phoneNumber: employeeDetails.phone,
        address: employeeDetails.address,
        birthDate: employeeDetails.date
    }
}