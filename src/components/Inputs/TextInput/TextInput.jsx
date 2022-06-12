import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import "./TextInput.css";
import RedStar from "../../RedStar/RedStar";
import FormHelperText from '@mui/material/FormHelperText';

const TextInput = ({ label, disable, required, value, onChange, name, errorMessage, onBlurFunc, validation }) => {

    const [fieldIsEmpty, setfieldIsEmpty] = useState(true)

    return (
        <FormControl disabled={disable} >
            <div className={'input-container'}>
                {label && (
                    <label className={`input-label ${!disable && `input-label--active`}`} htmlFor={label}>
                        {label} {required && <RedStar disabled={disable} />}
                    </label>
                )}
                <OutlinedInput
                    error={errorMessage ? true : false}
                    name={name}
                    value={value}
                    onChange={(event) => onChange(event)}
                    size="small"
                    margin="dense"
                    id={label}
                    className={'input-field'}
                    onBlur={onBlurFunc ? (event) => {
                        onBlurFunc(event, validation, required)
                    } : null}
                />
                {errorMessage && <FormHelperText className="error-message-container"><span className="error-message">{errorMessage}</span></FormHelperText>}
            </div>
        </FormControl>
    );
};

export default React.memo(TextInput);
