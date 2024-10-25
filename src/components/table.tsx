'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { DateTime } from './DateTime'
import { calculateEndDate, formatAbsenceType } from '@/lib/utils'
import { AbsenceType, FilterTypes } from '@/lib/types'

const Table = ({ data }: { data: AbsenceType[] }) => {
  const [absences, setAbsences] = useState([])
  const [pastData, setPastData] = useState<AbsenceType[]>([])
  const [showModal, setShowModal] = useState(false)
  const [Loading, setLoading] = useState(true)
  const [sortDirection, setSortDirection] = useState<{
    fullName: string
    absenceType: string
    startDate: string
    endDate: string
  }>({
    fullName: 'asc',
    absenceType: 'asc',
    startDate: 'asc',
    endDate: 'asc',
  })

  useEffect(() => {
    fetchAbsencesWithConflict(data)
  }, [data])

  const fetchAbsencesWithConflict = useCallback(async (data: AbsenceType[]) => {
    setLoading(true)
    try {
      // For each absence, fetch conflict status
      const absencesWithConflicts = await Promise.all(
        data.map(async (absence) => {
          const conflictResponse = await fetch(
            `https://front-end-kata.brighthr.workers.dev/api/conflict/${absence.id}`
          )
          const conflictData = await conflictResponse.json()
          return { ...absence, hasConflict: conflictData.conflicts }
        })
      )

      // Restructure data for easy sorting
      const grouped = absencesWithConflicts?.reduce((acc: any, person: any) => {
        const fullName = `${person.employee.firstName} ${person.employee.lastName}`
        const existingGroup = acc.find(
          (group: any) => group.fullName === fullName
        )

        const absenceDetails = {
          approved: person.approved,
          absenceType: person.absenceType,
          startDate: person.startDate,
          hasConflict: person.hasConflict,
          endDate: calculateEndDate(person.startDate, person.days),
        }

        if (existingGroup) {
          Object.assign(existingGroup, absenceDetails)
          existingGroup.absences.push(person)
        } else {
          acc.push({
            fullName,
            ...absenceDetails,
            absences: [person],
          })
        }

        return acc
      }, [])

      setAbsences(grouped)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }, [])

  const handleClick = (data: AbsenceType[]) => {
    setPastData(data)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setPastData([])
    setShowModal(false)
  }

  //Sort data based on key provided
  const sortData = (key: FilterTypes) => {
    let sortedData: any = []
    let direction = sortDirection[key] === 'asc' ? 'desc' : 'asc'

    if (key === 'fullName') {
      sortedData = absences.sort((a: any, b: any) =>
        direction === 'asc'
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName)
      )
    } else if (key === 'absenceType') {
      sortedData = absences.sort((a: any, b: any) =>
        direction === 'asc'
          ? a.absenceType.localeCompare(b.absenceType)
          : b.absenceType.localeCompare(a.absenceType)
      )
    } else if (key === 'startDate') {
      sortedData = absences.sort((a: any, b: any) =>
        direction === 'asc'
          ? (new Date(a.startDate) as any) - (new Date(b.startDate) as any)
          : (new Date(b.startDate) as any) - (new Date(a.startDate) as any)
      )
    } else if (key === 'endDate') {
      sortedData = absences.sort((a: any, b: any) =>
        direction === 'asc'
          ? (new Date(a.endDate) as any) - (new Date(b.endDate) as any)
          : (new Date(b.endDate) as any) - (new Date(a.endDate) as any)
      )
    }

    setAbsences(sortedData)
    setSortDirection((prevState) => ({
      ...prevState,
      [key]: direction,
    }))
  }

  return (
    <>
      <div className="w-[800px] mx-auto">
        <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
          <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Employees List
                </h3>
              </div>
            </div>
          </div>
          <div className="p-0 overflow-scroll">
            <table className="w-full mt-4 text-left table-auto min-w-max">
              <thead>
                <tr>
                  <th
                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100"
                    onClick={() => sortData('fullName')}
                  >
                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                      Employee Name
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        />
                      </svg>
                    </p>
                  </th>
                  <th
                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100"
                    onClick={() => sortData('startDate')}
                  >
                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                      Start Date
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        />
                      </svg>
                    </p>
                  </th>
                  <th
                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100"
                    onClick={() => sortData('endDate')}
                  >
                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                      End Date
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        />
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Status
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        />
                      </svg>
                    </p>
                  </th>
                  <th
                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100"
                    onClick={() => sortData('absenceType')}
                  >
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                      Absence Type
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        />
                      </svg>
                    </p>
                  </th>
                  <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                    <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500"></p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Loading ? (
                  <tr className="text-center">
                    <td colSpan={6} className="p-4">
                      Loading data...
                    </td>
                  </tr>
                ) : absences.length ? (
                  absences?.map((absence: any) => (
                    <tr
                      key={absence.fullName + '' + absence.id}
                      className="cursor-pointer"
                      onClick={() => handleClick(absence.absences)}
                    >
                      <td className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-slate-700">
                              {absence.fullName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="text-sm text-slate-500">
                          <DateTime date={absence.startDate} />
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="text-sm text-slate-500">
                          <DateTime date={absence.endDate} />
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <div className="w-max">
                          {absence.approved ? (
                            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                              <span className="">approved</span>
                            </div>
                          ) : (
                            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-slate-100 text-slate-500">
                              <span className="">pending approval</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="text-sm font-semibold text-slate-700">
                          {formatAbsenceType(absence.absenceType)}
                        </p>
                      </td>
                      <td className="p-4 border-b border-slate-200">
                        <p className="text-sm font-semibold text-slate-700">
                          {absence.hasConflict ? (
                            <span className="text-red-500">Conflict</span>
                          ) : (
                            <span className="text-slate-500">No Conflict</span>
                          )}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={6} className="p-4">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal ? (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
          <div className="max-h-full overflow-y-auto sm:rounded-xl bg-white">
            <div className="w-full">
              <div className="m-8">
                <div className="mb-8">
                  <p className="text-black font-bold text-xl">All Absense</p>
                </div>
                <div>
                  <div className="p-0 overflow-scroll">
                    <table className="w-full mt-4 text-left table-auto min-w-max">
                      <thead>
                        <tr>
                          <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                              Employee Name
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </p>
                          </th>
                          <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                              Start Date
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </p>
                          </th>
                          <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                              End Date
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </p>
                          </th>
                          <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                              Status
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </p>
                          </th>
                          <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                              Absence Type
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                aria-hidden="true"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                              </svg>
                            </p>
                          </th>
                          <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500"></p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastData?.map((absence: any) => (
                          <tr key={absence.id}>
                            <td className="p-4 border-b border-slate-200">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <p className="text-sm font-semibold text-slate-700">
                                    {absence.employee.firstName +
                                      ' ' +
                                      absence.employee.lastName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <p className="text-sm text-slate-500">
                                <DateTime date={absence.startDate} />
                              </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <p className="text-sm text-slate-500">
                                <DateTime
                                  date={calculateEndDate(
                                    absence.startDate,
                                    absence.days
                                  )}
                                />
                              </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <div className="w-max">
                                {absence.approved ? (
                                  <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                                    <span className="">approved</span>
                                  </div>
                                ) : (
                                  <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-slate-100 text-slate-500">
                                    <span className="">pending approval</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <p className="text-sm font-semibold text-slate-700">
                                {formatAbsenceType(absence.absenceType)}
                              </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                              <p className="text-sm font-semibold text-slate-700">
                                {absence.hasConflict ? (
                                  <span className="text-red-500">Conflict</span>
                                ) : (
                                  <span className="text-slate-500">
                                    No Conflict
                                  </span>
                                )}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={handleModalClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        null
      )}
    </>
  )
}

export default Table
