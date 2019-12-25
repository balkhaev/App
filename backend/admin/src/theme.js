import { createMuiTheme } from '@material-ui/core/styles';

import cyan from '@material-ui/core/colors/cyan';
import red from '@material-ui/core/colors/red';

export default createMuiTheme({
  palette: {
    type: 'dark',
    secondary: red,
    primary: cyan,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});
