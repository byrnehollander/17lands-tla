import Typography from '@mui/material/Typography';
import styled from 'styled-components';

export const TypographyShadow = styled(Typography)`
  text-shadow: 1px 2px 3px rgb(0 0 0 / 70%);
`

export const TypographyShadowNoMargin = styled(TypographyShadow)`
  margin-bottom: 0px !important;
`
