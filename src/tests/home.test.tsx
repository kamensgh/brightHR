import { render, screen, waitFor } from '@testing-library/react'
import Home, { getData } from '../app/page'
import { AbsenceType } from '@/lib/types'
import '@testing-library/jest-dom'

//@ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
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
      ]),
  })
)

describe('getData function', () => {
  it('fetches data from API and returns JSON', async () => {
    const data = await getData()
    expect(data).toEqual([
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
    ])
  })
})

