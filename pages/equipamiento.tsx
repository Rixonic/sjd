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

import {access}  from '../utils/access';
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
import { TheTable } from '../components/table';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getDosimeterByLocation } from '../database/dbDosimeters';
import { getUserData } from '../database/dbUsers';

const currentDate = new Date();

const EquipmentsPage = (props) =>  {  
  const userData = props.userData
  const columns :ColumnDef<IEquipmentService>[]=[

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
            size: 170,
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
            size: 400,
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
            size: 120,
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
            size: 100,
            footer: (props) => props.column.id,
            meta: {
              align: 'center'
            },
          },
          {
            accessorKey: 'duePerfomance',
            header: 'Proxima Asistencia',
            size: 100,
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
            size: 100,
            meta: {
              align: 'center'
            },
            footer: props => props.column.id,
          },
          {
            accessorKey: 'dueElectricalSecurity',
            header: 'Proxima Asistencia',
            size: 100,
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
    ]
  

  const [data, setData] = useState([]);

  const [error, setError] = useState(null);
  
  
  

  const [filteredEquips, setFilteredEquips] = useState<IEquipmentService[]>([]);
  const { user } = useContext(AuthContext);
  const userIndex = access.findIndex((data) => data.user === user?.email);
  const userLocation = userIndex !== -1 ? access[userIndex].locations : "";
  const userSector = user?.email.toUpperCase()
  console.log();
  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/equipmentsService', {

        });
        
        const formattedData = response.data.map(equipment => {

          const parsedEquipment = {
            ...equipment,
            perfomance: equipment.perfomance ? format(new Date(equipment.perfomance), 'MM/yyyy') : null,
            duePerfomance: equipment.duePerfomance ? new Date(equipment.duePerfomance) : null,
            electricalSecurity: equipment.electricalSecurity ? format(new Date(equipment.electricalSecurity), 'MM/yyyy') : null,
            dueElectricalSecurity: equipment.dueElectricalSecurity ? new Date(equipment.dueElectricalSecurity) : null,
          };
          //
          
          
          return parsedEquipment;
        });
        
        const filtered = formattedData.filter((equip) => userData.locations.includes(equip.service.toLowerCase())).sort((a, b) => a.ownId - b.ownId);
        console.log(filtered)
        setFilteredEquips(filtered);
      setData(formattedData); 
      } catch (err) {
        setError(err); 
      }
    };
  
    fetchData();
  
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
<TheTable data={filteredEquips} columns={columns}/>
        
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


export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {

  const session = await getSession({ req });
  const userData = await getUserData(session.user.email);

  delete userData._id;
 
  return {
    props: {
      userData
    },
  };
};


export default EquipmentsPage;