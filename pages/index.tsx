import NextLink from 'next/link';
import React, {useContext, HTMLAttributes, HTMLProps , useState, useEffect} from 'react'
import { Box, Typography, Stack} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AdminLayout } from '../components/layouts'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns';
import { IEquipmentService  } from '../interfaces';
import axios from 'axios';
import { UiContext, AuthContext } from '../context';

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

const EquipmentsPage = () =>  {
  //const rerender = React.useReducer(() => ({}), {})[1]
  

  const columns = React.useMemo<ColumnDef<IEquipmentService>[]>(
    () => [
      {
        header: 'Identificacion',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'ownId',
            header: () => 'ID',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'serialNumber',
            header: () => 'Serie',
            footer: props => props.column.id,
          },

        ],
      },
      {
        header: 'Informacion',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'equip',
            header: () => 'Equipo',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'brand',
            header: 'Marca',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'model',
            header: 'Modelo',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'service',
            header: () => <span>Sector</span>,
            footer: props => props.column.id,
          },
        ],
      },
      {
        header: 'Acciones',
        columns: [
          {
            accessorKey: 'perfomance',
            header: () => 'Perfomance',
            
            footer: (props) => props.column.id,
            Cell: (props) => {
              return (
                <p style={{ color: props.value === "11/2022" ? "green" : "red" }}>
                  {props.value}
                </p>
              );
            }
          },
          {
            accessorKey: 'duePerfomance',
            header: 'Proxima Asistencia',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'electricalSecurity',
            header: 'Seeguridad Electrica',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'dueElectricalSecurity',
            header: 'Proxima Asistencia',
            footer: props => props.column.id,
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


  const { user } = useContext(AuthContext);
  //console.log(data[0])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/equipmentsService', {
          params: {
            //location: 'CONSULTORIOS', // Agrega el sector del usuario como parámetro
            // Agrega otros parámetros de filtro aquí si es necesario, como la ubicación del equipo
          },
        });

        const formattedData = response.data.map(equipment => {
          // Parse date strings into Date objects
          const parsedEquipment = {
            ...equipment,
            perfomance: equipment.perfomance ? format(new Date(equipment.perfomance), 'MM/yyyy') : null,
            duePerfomance: equipment.duePerfomance ? format(new Date(equipment.duePerfomance), 'MM/yyyy') : null,
            electricalSecurity: equipment.electricalSecurity ? format(new Date(equipment.electricalSecurity), 'MM/yyyy') : null,
            dueElectricalSecurity: equipment.dueElectricalSecurity ? format(new Date(equipment.dueElectricalSecurity), 'MM/yyyy') : null,
          };
        
          return parsedEquipment;
        });

      setData(formattedData); 
      } catch (err) {
        setError(err); 
      }
    };

    fetchData();
  }, []);

  
  console.log(data[0])

  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      
    },
    paginateExpandedRows: false,
    initialState: {
      pagination: {
          pageSize: 10,
      },


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
                      <Box>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <Box>
                            <Filter column={header.column} table={table} />
                          </Box>
                        ) : null}
                      </Box>
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
      
      <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  spacing={2}
>
      <Stack direction="row" >
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
        </Stack>
        <span className="flex items-center gap-1">
          <div>Page:<strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong></div>
        </span>
        

        
        </Stack>
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

  return typeof firstValue === 'Date' ? (
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
      placeholder={`Buscar`}
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