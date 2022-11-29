import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const CustomCard = ({ projectName }) => {
  return (
    <Card sx={{ width: '100%', margin: '10px auto', height: "5rem", cursor: "pointer",  }}>
        <CardContent>
          <Typography component="div" fontWeight="bold">
            {projectName}
          </Typography>
        </CardContent>
    </Card>
  );
}

export default CustomCard;