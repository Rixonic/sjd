
import React, {useContext, HTMLAttributes, HTMLProps , useState, useEffect} from 'react'
import {
  Row,
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

import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Typography, Stack} from '@mui/material'
import IconButton from '@mui/material/IconButton';

interface ReactTableProps<T extends object> {
 data: T[];
 columns: ColumnDef<T>[];
 renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement;
}

export const TheTable = <T extends object>({ data, columns,renderSubComponent }: ReactTableProps<T>) => {
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
    //renderSubComponent,

},
  onExpandedChange: setExpanded,
  //getSubRows: row => row.associatedEquip,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  //renderSubComponent,
  //debugTable: true,
 });

 return (   
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
            {renderSubComponent ? (
              <tr key={row.id + '-expanded'}>
                <td colSpan={columns.length}>
                  {renderSubComponent({ row })}
                </td>
              </tr>
            ) : null}
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
        </Stack> 
 );
};