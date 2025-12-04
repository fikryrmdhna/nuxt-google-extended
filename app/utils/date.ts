import { format, getUnixTime, isValid, parse } from 'date-fns'
import { id } from 'date-fns/locale'

export function generateUnixTimestamp() {
  return getUnixTime(new Date())
}

export const date = {
  toStringDate(date: Date | string) {
    // conver date to format DD MMMM YYYY
    if (!date) return ''
    let formattedDate: Date
    if (typeof date === 'string') {
      formattedDate = new Date(date)
    }
    else {
      formattedDate = date
    }

    const formatter = new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    })

    return formatter.format(formattedDate)
  },
}

interface DateObj {
  month: number
  year: number
}

export function formatTrimUTC(date: string) {
  let dateString = date
  if (dateString.includes('+0000 UTC')) {
    dateString = dateString.replace(' +0000 UTC', '').trim()
  }
  if (dateString.includes('+0700')) {
    dateString = dateString.replace(' +0700 WIB', '').trim()
  }
  if (dateString.includes('+0707')) {
    dateString = dateString.replace(' +0707 LMT', '').trim()
  }
  return dateString
}

export function convertToYYYYMM(dateObj: DateObj) {
  const month = dateObj.month < 10 ? `0${dateObj.month}` : dateObj.month
  return `${dateObj.year}-${month}`
}

export function onPublishedDate(date: string) {
  if (date) {
    const trimmedDate = formatTrimUTC(date)
    const parsedDate = trimmedDate.length > 10
      ? parse(trimmedDate, 'yyyy-MM-dd HH:mm:ss', new Date())
      : parse(trimmedDate, 'yyyy-MM-dd', new Date())

    if (!isValid(parsedDate)) {
      return 'Invalid Date'
    }
    return format(parsedDate, 'd MMMM yyyy | HH.mm', { locale: id })
  }
  return null
}

export function onPublishedDateWithTime(date: string) {
  if (date) {
    const dateDefault = formatTrimUTC(date)
    return format(dateDefault, 'd MMM yyyy \'Pukul\' HH:mm', { locale: id })
  }
  return null
}

export function onPublishedHour(date: string) {
  if (date) {
    const dateDefault = formatTrimUTC(date)
    return format(dateDefault, 'HH.mm', { locale: id })
  }
  return null
}

export function onFormatToHourMinutes(date: string) {
  if (date) {
    const dateDefault = formatTrimUTC(date)
    const dateObject = new Date(dateDefault)
    const hours = String(dateObject.getHours()).padStart(2, '0')
    const minutes = String(dateObject.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  return null
}

export function onPublishedDateWithoutTime(date: string) {
  if (date) {
    const trimmedDate = formatTrimUTC(date)
    const parsedDate = trimmedDate.length > 10
      ? parse(trimmedDate, 'yyyy-MM-dd HH:mm:ss', new Date())
      : parse(trimmedDate, 'yyyy-MM-dd', new Date())

    if (!isValid(parsedDate)) {
      return 'Invalid Date'
    }
    return format(parsedDate, 'd MMMM yyyy', { locale: id })
  }
  return null
}

export function onFormatDate(date: string) {
  if (date) {
    const dateDefault = formatTrimUTC(date)
    const dateObj = new Date(dateDefault)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }
  return null
}

export function onFormatDateComma(date: string) {
  if (date) {
    const dateDefault = formatTrimUTC(date)
    return format(dateDefault, 'dd MMM, yyyy', { locale: id })
  }
  return null
}

export function onFormatDateYearMonth(date: string) {
  if (date) {
    const dateDefault = formatTrimUTC(date)
    return format(dateDefault, 'yyyy-MM', { locale: id })
  }
  return null
}

export function convertToMinutes(timeStr: string) {
  const [hour, minute]: any = timeStr.split(':').map(Number)
  return hour * 60 + minute
}

export function toFormattedDateTime(dateStr: string) {
  const dateObj = new Date(dateStr)
  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    locale: id,
  }
  const formattedDate = dateObj.toLocaleString('id-ID', options)
  return formattedDate.replace(',', ' Pukul')
}

export function dateWithTimeZone(dateStr: string | undefined) {
  if (!dateStr) {
    console.warn('Invalid date string provided:', dateStr)
    return null
  }

  const date = `${dateStr.replace(' ', 'T')}+07:00`

  return date
}

export function toFormatDate(dateStr: string) {
  const [month, year]: (string | number)[] = dateStr.split(' ').map((val, i) => {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    if (i === 0) return monthNames.findIndex(name => name === val) + 1
    else return val
  })
  const date = new Date(`${year}-${month}-01 00:00:00`)
  return format(date, 'yyyy-MM-dd', { locale: id })
}

export function toFullStringDate(dateStr: string | undefined) {
  if (!dateStr) {
    return null
  }

  const date = new Date(dateStr)

  if (Number.isNaN(date.getTime())) {
    console.warn('Invalid date value for:', dateStr)
    return null
  }

  return format(date, 'EEEE, dd MMMM yyyy HH:mm \'WIB\'', { locale: id })
}

export function onFormatDateWithoutComma(date: string) {
  if (date) {
    const dateDefault = formatTrimUTC(date)
    return format(dateDefault, 'dd MMM yyyy', { locale: id })
  }
  return null
}
