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
import compareAsc from 'date-fns/compareAsc'
import { isAfter, isBefore, isSameDay } from "date-fns"
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';

/*
Ejemplos de cosas que si funcionaron

          {
            accessorKey: 'equip',
            header: () => 'Equipo',
            cell: ({ row }) => (
              <td className={  row.original.equip == "TENSIOMETRO" ? 'bold' : null }>
              {row.original.equip }
            </td>
            ),
            footer: props => props.column.id,
          },

*/
 
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
  CellContext,

} from '@tanstack/react-table';

const currentDate = new Date();
console.log(currentDate)

const EquipmentsPage = () =>  {  

  const columns = React.useMemo<ColumnDef<IEquipmentService>[]>(
    () => [
      {
        header: 'Identificacion',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'ownId',
            header: () => 'ID',
            size: 40,
            footer: props => props.column.id,
            meta: {
              align: 'center'
            },
            
          },
          {
            accessorKey: 'serialNumber',
            header: () => 'Serie',
            size: 200,
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
            size: 200,
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
            meta: {
              align: 'center'
            },
          },
          {
            accessorKey: 'duePerfomance',
            header: 'Proxima Asistencia',
            cell: ({ row }) => {
              const dueDate = new Date(row.original.duePerfomance);
              const daysDifference = Math.floor(
                (dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              let className = '';
              if (daysDifference <= -60 && row.original.duePerfomance) {
                className = 'red';
              } else if (daysDifference >= -60 && daysDifference <= 60) {
                className = 'yellow';
              } else if (daysDifference >= 60) {
                className = 'green';
              }
          
              return (
                <span className={className}>
                  {row.original.duePerfomance ? format(dueDate, 'MM/yyyy') : null}
                </span>
              );
            },
            meta: {
              align: 'center'
            },
            footer: props => props.column.id,
          },
          {
            accessorKey: 'electricalSecurity',
            header: 'Seguridad Electrica',
            meta: {
              align: 'center'
            },
            footer: props => props.column.id,
          },
          {
            accessorKey: 'dueElectricalSecurity',
            header: 'Proxima Asistencia',
            cell: ({ row }) => {
              const dueDate = new Date(row.original.dueElectricalSecurity);
              const daysDifference = Math.floor(
                (dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              let className = '';
              if (daysDifference <= -60 && row.original.dueElectricalSecurity) {
                className = 'red';
              } else if (daysDifference >= -60 && daysDifference <= 60) {
                className = 'yellow';
              } else if (daysDifference >= 60) {
                className = 'green';
              }
          
              return (
                <span className={className}>
                  {row.original.dueElectricalSecurity ? format(dueDate, 'MM/yyyy') : null}
                </span>
              );
            },
            meta: {
              align: 'center'
            },
            footer: props => props.column.id,
          },
          
        ],
      },
    ],
    []
  )

  const [data, setData] = useState([]);

  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const userSector = user?.email.toUpperCase()
  console.log();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/equipmentsService', {
          params: {
            service: user.role === 'admin'? null: user.email.toUpperCase(), 
          },
        });

        const formattedData = response.data.map(equipment => {

          const parsedEquipment = {
            ...equipment,
            perfomance: equipment.perfomance ? format(new Date(equipment.perfomance), 'MM/yyyy') : null,
            duePerfomance: equipment.duePerfomance ? new Date(equipment.duePerfomance) : null,
            electricalSecurity: equipment.electricalSecurity ? format(new Date(equipment.electricalSecurity), 'MM/yyyy') : null,
            dueElectricalSecurity: equipment.dueElectricalSecurity ? new Date(equipment.dueElectricalSecurity) : null,
          };
        
          return parsedEquipment;
        });

      setData(formattedData); 
      } catch (err) {
        setError(err); 
      }
    };
    if (userSector){
    fetchData();
  }
  }, [userSector]);

  

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
                  <th key={header.id} {...{
                    key: header.id,
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                  }}>
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
                    <td key={cell.id} 
                    className={(cell.column.columnDef.meta as any)?.className}
                    align ={(cell.column.columnDef.meta as any)?.align}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                        
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
        <Stack  alignItems="center"> <Typography >Los mantenimientos y chequeos tienen una tolerancia de 60 dias</Typography></Stack>
        
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

export default EquipmentsPage;