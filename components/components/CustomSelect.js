import {InputLabel, Select, styled} from "@mui/material";

export const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white', // default border
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white', // hover border
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white', // focus border
    },
    '& .MuiSelect-select': {
        color: 'white', // selected text color
        backgroundColor: '#242424', // background
    },
    '&.Mui-disabled .MuiSelect-select': {
        color: 'white',
        backgroundColor: '#242424',
        WebkitTextFillColor: '#242424', // for Safari
    },
    '& .MuiSelect-icon': {
        color: '#1976d2', // dropdown icon color
    },
    '&.Mui-disabled .MuiSelect-icon': {
        color: '#aaa',
    },
}));

export const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
    color: 'white',
    '&.Mui-focused': {
        color: 'white',
    },
    '&.Mui-disabled': {
        color: 'grey',
    },
}));
