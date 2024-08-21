import { Menu, MenuItem, Button } from '@mui/material';
import { useState } from 'react';

function GradientDropdown({ icon, text, menuItems, styles, ...rest }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        startIcon={icon || null}
        onClick={handleClick}
        sx={{
          borderRadius: 6,
          background: `var(--brand-mix, conic-gradient(
            from 180deg at 50% 50%,
            #b52bba 4.666563235223293deg,
            #a12cbc 23.647727966308594deg,
            #8c2ebe 44.85525995492935deg,
            #792fbf 72.45651304721832deg,
            #6c30c0 82.50000178813934deg,
            #4b32c3 127.99007892608643deg,
            #5831c2 160.968976020813deg,
            #6330c1 178.45529437065125deg,
            #742fc0 189.47770357131958deg,
            #8d2dbe 202.95226335525513deg,
            #a62cbc 230.65982580184937deg,
            #b92aba 251.35178089141846deg,
            #d029b8 276.4414644241333deg,
            #ec27b6 306.45145654678345deg,
            #c729b9 331.67617321014404deg
          ))`,
          boxShadow: '0px 0px 30px 0px rgba(236, 39, 182, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.75rem 2rem',
          '&:hover': {
            boxShadow: '0px 0px 50px 0px rgba(236, 39, 182, 0.6)',
          },
          ...styles,
        }}
        variant="contained"
        {...rest}
      >
        {text && text}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 6,
            boxShadow: '0px 0px 30px 0px rgba(236, 39, 182, 0.6)',
            background: `var(--brand-mix, conic-gradient(
              from 180deg at 50% 50%,
              #b52bba 4.666563235223293deg,
              #a12cbc 23.647727966308594deg,
              #8c2ebe 44.85525995492935deg,
              #792fbf 72.45651304721832deg,
              #6c30c0 82.50000178813934deg,
              #4b32c3 127.99007892608643deg,
              #5831c2 160.968976020813deg,
              #6330c1 178.45529437065125deg,
              #742fc0 189.47770357131958deg,
              #8d2dbe 202.95226335525513deg,
              #a62cbc 230.65982580184937deg,
              #b92aba 251.35178089141846deg,
              #d029b8 276.4414644241333deg,
              #ec27b6 306.45145654678345deg,
              #c729b9 331.67617321014404deg
            ))`,
          },
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose();
              if (item.onClick) item.onClick();
            }}
            sx={{
              borderRadius: 4,
              '&:hover': {
                background: `conic-gradient(
                  from 180deg at 50% 50%,
                  #ec27b6,
                  #d029b8,
                  #b92aba,
                  #a62cbc
                )`,
              },
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default GradientDropdown;
