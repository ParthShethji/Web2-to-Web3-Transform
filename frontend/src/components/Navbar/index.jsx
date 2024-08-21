import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { sepolia, polygonAmoy } from "thirdweb/chains";


export const client = createThirdwebClient({ clientId: "179874cf01f3ef6b1e707e5d2e07590e" });


function Navbar() {
  return (
    <Box
      sx={{
        borderBottom: '1px solid #2e3c51',
        background: 'black',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '4rem',
        px: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        component={Link}
        to="/"
      >
        <img
          src="img.svg"
          alt="text"
          style={{
            display: 'block',
            width: '180px',
          }} 
         />
      </Box>



      <Box display="flex" alignItems="center" justifyContent="center" >
        <img src="./creditIcon.svg" alt="Credit Icon" />
        <Typography variant="body" px={1} marginRight={5}>
          100 Credits
        </Typography>
        <ConnectButton client={client} chain={polygonAmoy}/>

      </Box>
    </Box>
  );
}

export default Navbar;