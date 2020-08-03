import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    EditButton,
    RichTextField,
    required, SimpleForm
} from 'react-admin';
import React from "react";

export const ShowTipoClientes = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField disabled label="ID" source="id"/>
            <TextField label ={"Nombre"} source={"nombre"} />
            <TextField multiline label={"Descripción"} source={"descripcion"} />
        </SimpleShowLayout>
    </Show>
);