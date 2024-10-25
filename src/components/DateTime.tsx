import { FC } from 'react'
import Moment from 'react-moment'

interface Props {
  date: string
  className?: string
}
export const DateTime: FC<Props> = ({ date, className }) => {
  // @ts-ignore
  return <Moment format="MMM DD, YYYY">{date}</Moment>
}
