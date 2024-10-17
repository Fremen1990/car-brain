import moment from 'moment'

/**
 * Formats a given date to a readable format (DD-MM-YYYY) using moment
 * @param dateStr - The date string or Date object to format
 * @returns A formatted date string in the format of YYYY-MM-DD
 */
export const formatDate = (dateStr: string | Date): string => {
	return moment(dateStr).format('DD-MM-YYYY')
}
