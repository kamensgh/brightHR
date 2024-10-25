import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Table from '../components/Table'

describe('Table Component', () => {
  const mockData = [
    {
      id: 1,
      employee: { firstName: 'Rahaf', lastName: 'Deckard', id: 3 },
      absenceType: 'SICKNESS',
      startDate: '2022-05-28T04:39:06.470Z',
      days: 5,
      approved: true,
    },
    {
      id: 2,
      employee: { firstName: 'Enya', lastName: 'Behm', id: 4 },
      absenceType: 'ANNUAL_LEAVE',
      startDate: '2022-02-08T08:02:47.543Z',
      days: 3,
      approved: false,
    },
  ]

  it('renders the right heading', () => {
    render(<Table data={mockData} />)

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Employees List')
  })

  it('renders table headings', () => {
    render(<Table data={mockData} />)

    expect(screen.getByText('Employee Name')).toBeInTheDocument()
    expect(screen.getByText('Start Date')).toBeInTheDocument()
    expect(screen.getByText('End Date')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Absence Type')).toBeInTheDocument()
  })

})
