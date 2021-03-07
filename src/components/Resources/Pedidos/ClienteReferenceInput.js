import React, { useState, useCallback } from 'react';
import { useFormState } from 'react-final-form';
import {ReferenceInput, AutocompleteInput, required} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import ClienteQuickCreateButton from "./ClienteQuickCreateButton";
import {filterToQuery} from "../../helpers/filterstoqueries";

const useStyles = makeStyles({
    root: {
        display: '-webkit-box',
        alignItems: 'center'
    },


});

const spySubscription = { values: true };

const ClienteReferenceInput = props => {
    const classes = useStyles();
    const [version, setVersion] = useState(0);
    const { values } = useFormState({ subscription: spySubscription });
    const handleChange = useCallback(() => setVersion(version + 1), [version]);

    return (
        <div className={classes.root}>
            <ReferenceInput key={version} {...props} filterToQuery={searchText => filterToQuery(searchText,'nombre')}>
                <AutocompleteInput optionText={"nombre"} validate={required()}/>
            </ReferenceInput>
            <ClienteQuickCreateButton onChange={handleChange} />
        </div>
    );
};

export default ClienteReferenceInput;
