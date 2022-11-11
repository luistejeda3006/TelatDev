import {useState} from 'react';

export default (initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const handleInputChange = (value, boxName) => {
        setValues({
            ...values,
            [boxName]: value,
        });
    }

    const handleSetState = (properties) => {
        setValues(properties)
    }

    const handleSubmitForm = () => {
        setValues(initialState);
    }

    return {handleInputChange, values, handleSubmitForm, handleSetState};
}