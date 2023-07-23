import { FC } from 'react'
import { Grid } from '@mui/material'
import { IEquipment } from '../../interfaces'
import { EquipmentCard } from '.'

interface Props {
    equipments: IEquipment[];
}

export const EquipmentList: FC<Props> = ({ equipments }) => {

  return (
    <Grid container spacing={4}>
        {
            equipments.map( equipment => (
                <EquipmentCard 
                    key={ equipment.equip }
                    equipment={ equipment }
                />
            ))
        }
    </Grid>
  )
}
