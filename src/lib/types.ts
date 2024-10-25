

export type AbsenceType = {
  id: number
  startDate: string
  days: number
  absenceType: string
  employee: EmployeeType
  approved: boolean
}

export interface EmployeeType {
  firstName: string
  lastName: string
  id: string
}

export type FilterTypes = 'fullName' | 'absenceType' | 'startDate' | 'endDate'
