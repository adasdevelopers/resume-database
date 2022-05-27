import { ColumnFilter } from './ColumnFilter'
export const COLUMNS = [
    {
        Header: 'ID',
        accessor: 'id',
        Filter: ColumnFilter
    },
    {
        Header: 'First Name',
        accessor: 'first_name',
        Filter: ColumnFilter
    },
    {
        Header: 'Last Name',
        accessor: 'last_name',
        Filter: ColumnFilter
    },
    {
        Header: 'EMail',
        accessor: 'email',
        Filter: ColumnFilter
    },
    {
        Header: 'University',
        accessor: 'University',
        Filter: ColumnFilter
    },
    {
        Header: 'Resume',
        accessor: 'Resume',
        Filter: ColumnFilter
    },
    {
        Header: 'Expand',
        Filter: ColumnFilter
    }
]

export const GROUP_COLUMNS = [
    {
        Header: 'Personal Information',
        columns: [

        ]
    },
    {
        Header: 'Education',
        columns: [

        ]
    },
    {
        Header: 'Experience',
        columns: [

        ]
    },
    {
        Header: 'Skills',
        columns: [

        ]
    }
]

export default COLUMNS;