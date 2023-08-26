import NextLink from 'next/link';
import React, {useContext, HTMLAttributes, HTMLProps , useState, useEffect} from 'react'
import { Box, Typography, Stack, Grid} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
import { format } from 'date-fns';
import { IDosimeter  } from '../../interfaces';
import axios from 'axios';
import { UiContext, AuthContext } from '../../context';

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


} from '@tanstack/react-table';

const EquipmentsPage = () =>  {  
  const onDownloadImage = (image: string) => {
    fetch(image)
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            const defaultFileName = 'dosimetria.pdf';
            link.setAttribute('download', defaultFileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        });
};


  const columns = React.useMemo<ColumnDef<IDosimeter>[]>(
    () => [
      
      {
        header: 'Informacion',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'headquarter',
            header: () => 'Sede',
            size:200,
            footer: props => props.column.id,
          },
          {
            accessorKey: 'service',
            header: 'Servicio',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'month',
            header: 'Mes',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'year',
            header: 'Año',
            footer: props => props.column.id,
          },
        ],
      },
      {
        header: 'Descargar',
        columns: [
          {
            id: '_id',
            cell: ({ row }) => (
              <Stack direction="row">
                
                <IconButton
               
                                onClick={() => onDownloadImage(row.original.document)}
                            >
                              <DownloadIcon/>
                            </IconButton>
              </Stack>
            ),
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
        const response = await axios.get('/api/admin/dosimeters', {
          params: {
            service: user.role === 'admin'? null: user.email.toUpperCase(), 
          },
        });

        const formattedData = response.data.map(equipment => {

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
    if (userSector){
    fetchData();
  }
  }, [userSector]);

  
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
        title={`Dosimetria `} 
        subTitle={''}
        icon={ <CategoryOutlined /> }
    >
      <Stack
  direction="column"
  justifyContent="space-between"
  alignItems="center"
  spacing={2}
>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th  key={header.id} {...{
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
  spacing={30}
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
        <Button
        startIcon={ <AddOutlined /> }
        color="secondary"
        href="/admin/dosimeters/new"
      >
        Agregar 
      </Button>
        

        
        </Stack>
        
        </Stack>
        
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


}

export default EquipmentsPage;
