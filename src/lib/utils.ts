export const calculateEndDate = (startDate: string, days: number) => {
  const start = new Date(startDate) 
  const endDate = new Date(start) 
  endDate.setDate(start.getDate() + days) 

  return endDate.toISOString().split('T')[0]
}


export const formatAbsenceType = (type: string) => {
  return type
    .toLowerCase()
    .split('_') 
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
