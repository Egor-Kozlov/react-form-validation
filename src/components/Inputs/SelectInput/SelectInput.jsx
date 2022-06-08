import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './SelectInput.css';
import RedStar from '../../RedStar/RedStar';

const SelectInput = ({ label, optionList, disabled, required, value, onChange, name, onBlurFunc, errorMessage, validation }) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        if (!disabled) {
            setOpen(true);
        }
    };

    return (
        <div className='select-container'>
            <label
                className={`input-label ${!disabled && `input-label--active`}`}
                onClick={handleOpen}
            >
                {label} {required && <RedStar disabled={disabled} />}
            </label>
            <FormControl disabled={disabled} sx={{ m: 1, minWidth: 280 }} size="small">
                <Select
                    error={errorMessage ? true : false}
                    name={name}
                    labelId="network-name"
                    id="network-name"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlurFunc ? (event) => {
                        onBlurFunc(event, validation, required)
                    } : null}
                >
                    <MenuItem value="">
                        <em>Please, select</em>
                    </MenuItem>
                    {optionList.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
    );
}

export default React.memo(SelectInput);