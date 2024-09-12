import { alpha, makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  title: {
    display:'none',
    flexGrow:1,
    color: 'green',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontWeight:'bold',
      color: 'green !important',
    },
  },
  button: {
    margin: theme.spacing(0, 1),
    color: 'green !important',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
  },
  search: {
    position: 'relative',
    display:'flex',
    borderRadius: '20px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
  },
  searchIcon: {
    padding: theme.spacing(0, 2), height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, transition: theme.transitions.create('width'), width: '100%', [theme.breakpoints.up('md')]: { width: '20ch' },
  },
  toolbar: {
    display: 'flex', justifyContent: 'space-between', backgroundColor:'#3c3c3c',
    backgroundColor: 'black',
  },
}));
