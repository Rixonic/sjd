import NextLink from 'next/link';
import React, {useContext, HTMLAttributes, HTMLProps , useState, useEffect} from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import { AdminLayout } from '../components/layouts'
import IconButton from '@mui/material/IconButton';
import { format } from 'date-fns';
import { IDosimeter, ITicket  } from '../interfaces';
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


} from '@tanstack/react-table';
import { TheTable } from '../components/table';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getTicketsByLocation } from '../database/dbTickets';
import { getUserData } from '../database/dbUsers';
import { Ticket } from '../models';
import { getDosimeterByLocation } from '../database/dbDosimeters';

const EquipmentsPage = ( props ) =>  {  
  const dosimeters = props.dosimeter
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


  const columns :ColumnDef<IDosimeter>[]=[
      
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
            accessorKey: 'location',
            header: 'Sector',
            footer: props => props.column.id,
          },
        ],
      },
      {
        header: 'Periodo',
        footer: props => props.column.id,
        columns: [
          {
            accessorKey: 'month',
            header: 'Mes',
            size: 75,
            meta: {
              align: 'center'
            },
            footer: props => props.column.id,
          },
          {
            accessorKey: 'year',
            header: 'Año',
            size: 75,
            meta: {
              align: 'center'
            },
            footer: props => props.column.id,
          },
        ],
      },
      {
        header: 'Descargar',
        columns: [
          {
            id: '_id',
            size: 75,
            meta: {
              align: 'center'
            },
            cell: ({ row }) => (
                <IconButton
                  onClick={() => onDownloadImage(row.original.document)}
                >
                  <DownloadIcon/>
                </IconButton>
            ),
            footer: props => props.column.id,
          },
        ],
      },
    ]


  const [data, setData] = useState([]);
  //const { data } = useSWR<IDosimeter[]>('/api/admin/dosimeter'); 

  const { user } = useContext(AuthContext);
  const userSector = user?.email.toUpperCase()
  console.log();
  
  
  console.log(data[0])

  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const rows = data?.map( ticket => ({   //
    //id    : ticket.ticketId,
    /*
    email : (ticket.user as IUser).email,
    name  : (ticket.user as IUser).name,
    total : ticket.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,*/
    //createdAt: ticket.createdAt,
}));
  return (

    <AdminLayout 
        title={`Dosimetria `} 
        subTitle={''}
        icon={ <CategoryOutlined /> }
    >
      <TheTable           
        data={dosimeters} 
        columns={columns} 
        />

   
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


export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {

  const session = await getSession({ req });
  const userData = await getUserData(session.user.email);
  const dosimeter = await getDosimeterByLocation(userData.locations);
  const dosimeterParse = JSON.stringify(dosimeter)
  delete userData._id;
  console.log(dosimeter)
  return {
    props: {
      dosimeter
    },
  };
};

export default EquipmentsPage;
