import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { ILocation } from '../../interfaces';


interface Props {
    selectedLocation?: ILocation;
    locations: ILocation[];

    // Method
    onSelectedSize: (location: ILocation ) => void;
}


export const SizeSelector: FC<Props> = ({selectedLocation, locations, onSelectedSize }) => {
  return (
    <Box>
        {
            locations.map( location => (
                <Button
                    key={ location }
                    size='small'
                    color={ selectedLocation === location ? 'primary' : 'info' }
                    onClick={ () => onSelectedSize( location ) }
                >
                    { location }
                </Button>
            ))
        }
    </Box>
  )
}