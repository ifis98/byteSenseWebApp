import {styled, TextField} from "@mui/material";

const CustomTextField = styled(TextField)({
    '& label': {
        color: 'white',
    },
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInputBase-root.Mui-disabled': {
        backgroundColor: '#242424',   // background when disabled
    },
    '& .MuiInputBase-input.Mui-disabled': {
        color: '#888888',             // pre-filled value (input text) color when disabled
        WebkitTextFillColor: '#888888', // ensures color applies in some browsers like Safari
    },
    '& .MuiInputLabel-root.Mui-disabled': {
        color: '#b0b0b0',             // label color when disabled
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
        borderColor: '#aaaaaa',       // border color when disabled
    },
    input: {
        color: 'white',
    },
    textarea:{
        color: 'white',
    }
});

export default CustomTextField;
