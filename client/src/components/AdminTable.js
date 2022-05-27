import { ColumnFilter } from './ColumnFilter'
import React, { Fragment, useMemo, useState, useEffect } from 'react'
import { useTable, useSortBy, useGlobalFilter, usePagination, useExpanded } from 'react-table'
import MOCK_DATA from './MOCK_DATA.json'
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalFilter from './GlobalFilter.js'
import styled from 'styled-components'

const Styles = styled.div`
    table {
        margin-top: 1rem;
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }
    
    table td, table th {
        border: 1px solid #ddd;
        padding: 8px;
    }
    
    table tr:nth-child(even){background-color: #f2f2f2;}
    
    table tr:hover {background-color: #ddd;}
    
    table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #0f3ea3;
        color: white;
    }
`

function AdminSubRow({ subcolumns: userColumns, data}) {

    const subcolumns = useMemo(
        () => [   
            {
                Header: 'Web Presence',
                columns: [
                    {
                        Header: 'LinkedIn',
                        accessor: 'websiteone',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Github',
                        accessor: 'websitetwo',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Portfolio',
                        accessor: 'websitethree',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Email',
                        accessor: 'email',
                        Filter: ColumnFilter
                    },
                ],
            },
            {
                Header: 'Education',
                columns: [
                    {
                        Header: 'Degree Type',
                        accessor: 'degree',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Start Date',
                        accessor: 'startdate',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'End Date',
                        accessor: 'enddate',
                        Filter: ColumnFilter
                    }, 
                ],
            },
            {
                Header: 'Experience',
                columns: [
                    {
                        Header: 'Resume',
                        accessor: 'resumelink',
                        Filter: ColumnFilter
                    },
                ],
            },
        ], 
        []
    )

    const [loadingCells, setLoadingCells] = useState(true);
    const [cells, setCells] = useState([]);

    useEffect(() => {
        async function getApplicantDetails() {
            try {
                const response = await fetch("http://localhost:5000/applicants/", {
                    method: "GET",
                    headers: { token: localStorage.token },
                });
                const data = await response.json();
                console.log(data);
                setCells(data);
                setLoadingCells(false);
            } catch (error) {
                console.log(error.message);
                }   
            };
        if (loadingCells){
            getApplicantDetails();
        }
	}, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        visibleColumns,
        state,
      } = useTable({ 
          columns: subcolumns,
          data,
        },
        useExpanded, 
      )

    return (
        <table {...getTableProps()}>
        <thead>
          {// Loop over the header rows
          headerGroups.map(headerGroup => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {// Loop over the headers in each row
              headerGroup.headers.map(column => (
                // Apply the header cell props
                <th {...column.getHeaderProps()}>
                  {// Render the header
                  column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {// Loop over the table rows
          rows.map(row => {
            // Prepare the row for display
            prepareRow(row)
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {// Loop over the rows cells
                row.cells.map(cell => {
                  // Apply the cell props
                  return (
                    <td {...cell.getCellProps()}>
                      {// Render the cell contents
                      cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      )

}

function Table({ columns: userColumns, data, renderRowSubComponent }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      visibleColumns,
      setGlobalFilter,
      state,
      page,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      pageOptions, 
    } = useTable({ 
        columns: userColumns,
        data,
      },
      useGlobalFilter,
      useSortBy,
      useExpanded, 
      usePagination,
    )
      
    const { globalFilter } = state
    const { pageIndex } = state
    return (
        <Fragment>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <div>
                                    {column.canFilter ? column.render('Filter') : null}
                                </div>
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? ' descending' : ' ascending') : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <React.Fragment {...row.getRowProps()}>
                  <tr>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                  </tr>
                  {row.isExpanded ? (
                    <tr>
                      <td colSpan={visibleColumns.length}>
                        {renderRowSubComponent({ row, visibleColumns })}
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
        <br />
        <div>
            <span>
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
            </span>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
        </div>
        </Fragment>
    )
}

function AdminTable(){

    const columns = useMemo(
        () => [   
            // {
            //     Header: 'Expand',
            //     id: 'expander',
            //     Cell: ({ row }) => (
            //         <span {...row.getToggleRowExpandedProps()}>
            //         {row.isExpanded ? '👇' : '👉'}
            //         </span>
            //     ),
            //     Filter:ColumnFilter
            // },
            {
                Header: 'Personal Information',
                columns: [
                    // {
                    //     Header: 'ID',
                    //     accessor: 'personid',
                    //     Filter: ColumnFilter
                    // },
                    {
                        Header: 'First Name',
                        accessor: 'firstname',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Last Name',
                        accessor: 'lastname',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Preferred Name',
                        accessor: 'preferredname',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Email',
                        accessor: 'email',
                        Filter: ColumnFilter
                    },
                ],
            },
            {
                Header: 'Education',
                columns: [
                    {
                        Header: 'University',
                        accessor: 'instname',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Major',
                        accessor: 'major',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Start Date',
                        accessor: 'startdate',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'End Date (or anticipated)',
                        accessor: 'enddate',
                        Filter: ColumnFilter
                    },      
                ],
            },
            {
                Header: 'Experience',
                columns: [
                    {
                        Header: 'Resume',
                        accessor: 'resumelink',
                        Filter: ColumnFilter
                    },
                ],
            },
            {
                Header: ' Skills',
                columns: [
                    {
                        Header: 'Listed Skills',
                        accessor: 'skillname',
                        Filter: ColumnFilter
                    },
                ],
            },
            {
                Header: 'Web Presence',
                columns: [
                    {
                        Header: 'LinkedIn',
                        accessor: 'websiteone',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Github',
                        accessor: 'websitetwo',
                        Filter: ColumnFilter
                    },
                    {
                        Header: 'Portfolio',
                        accessor: 'websitethree',
                        Filter: ColumnFilter
                    },
                ],
            },
        ], 
        []
    )

    const [loadingCells, setLoadingCells] = useState(true);
    const [cells, setCells] = useState([]);

    useEffect(() => {
        async function getApplicants() {
            try {
                const response = await fetch("http://localhost:5000/applicants/", {
                    method: "GET",
                    headers: { token: localStorage.token },
                });
                const data = await response.json();
                // console.log(data);
                setCells(data);
                setLoadingCells(false);
            } catch (error) {
                console.log(error.message);
                }   
            };
        if (loadingCells){
            getApplicants();
        }
	}, []);

    const renderRowSubComponent = cells => {
        return (
        //   <div style={{ padding: "20px" }}>
        <div>
            <br />
            <br />
            <AdminSubRow
              data={cells}
              columns={columns}
            />
          </div>
        );
      }

    

        return (
            <>
            { loadingCells ? (
                <p>Loading, Please Wait....</p>
            ) : (
            <Styles>
            {cells && <Table
                data={cells}
                columns={columns}
                renderRowSubComponent={renderRowSubComponent}
            />}
            </Styles>
            )}
            </>   
        );
}

export default AdminTable;