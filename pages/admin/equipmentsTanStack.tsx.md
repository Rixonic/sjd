import React, { HTMLAttributes, HTMLProps , useState, useEffect} from 'react'
//import ReactDOM from 'react-dom/client'
import { AdminLayout } from '../../components/layouts'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import { IEquipment  } from '../../interfaces';
import axios from 'axios';
//import '../../styles/index.css'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';

import {
  Column,
  Table,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
//import { makeData, Person } from './makeData'

const EquipmentsPage = () =>  {
  //const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo<ColumnDef<IEquipment>[]>(
    () => [
      {
        header: 'Name',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'equip',
            header: ({ table }) => (
              <>
                <IconButton
                  {...{
                    onClick: table.getToggleAllRowsExpandedHandler(),
                  }}
                >
                  {table.getIsAllRowsExpanded() ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>{' '}
                ID
              </>
            ),
            cell: ({ row, getValue }) => (
              <div
                style={{
                  // Since rows are flattened by default,
                  // we can use the row.depth property
                  // and paddingLeft to visually indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                }}
              >
                <>
                  {row.getCanExpand() ? (
                    <IconButton
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: { cursor: 'pointer' },
                      }}
                    >
                      {row.getIsExpanded() ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  ) : (
                    ''
                  )}
                  {getValue()}
                </>
              </div>
            ),
            footer: props => props.column.id,
          },
          {
            accessorFn: row => row.ecri,
            id: 'ecri',
            cell: info => info.getValue(),
            header: () => <span>ECRI</span>,
            footer: props => props.column.id,
          },
        ],
      },
      {
        header: 'Info',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'equipmentId',
            header: () => 'Equipo',
            footer: props => props.column.id,
          },
          {
            header: 'More Info',
            columns: [
              {
                accessorKey: 'sector',
                header: () => <span>Visits</span>,
                footer: props => props.column.id,
              },
              {
                accessorKey: 'location',
                header: 'Status',
                footer: props => props.column.id,
              },

            ],
          },
        ],
      },
    ],
    []
  )

  //const [data, setData] = useSWR<IEquipment[]>('/api/admin/equipments');
  //const [data, setData] = React.useState(() => makeData(100, 5, 3))
  //const refreshData = () => setData(() => makeData(100, 5, 3))
  //const { data, error } = useSWR<IEquipment[]>('/api/admin/equipments');
  const [data, setData] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/equipments');
        setData(response.data); // Update the state with fetched data
      } catch (err) {
        setError(err); // Set error state if request fails
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []);

  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.associatedEquip,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    //debugTable: true,
  })

  return (

    <AdminLayout 
        title={`Equipamiento `} 
        subTitle={'Listado de equipamiento'}
        icon={ <CategoryOutlined /> }
    >
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <IconButton
          onClick={() => {table.setPageIndex(0);}}
          disabled={!table.getCanPreviousPage()}
        >
          <FirstPageIcon />
        </IconButton>
          <IconButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <NavigateBeforeIcon />
        </IconButton>
          <IconButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <NavigateNextIcon />
        </IconButton>
        <IconButton
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <LastPageIcon />
        </IconButton>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>

    </div>
        
    </AdminLayout>


  )
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <TextField
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        size="small"
      />
      <TextField
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        size="small"
      />
    </div>
  ) : (
    <TextField
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      size="small"
    />
  )
}
/*
function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}
*/

export default EquipmentsPage;