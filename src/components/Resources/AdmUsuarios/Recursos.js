import React from "react";
import {Create, Datagrid, Edit, List, required, SimpleForm, TextField, TextInput,} from 'react-admin'

export const RecursosList = props => {
    return (
        <List title={"Recursos"}  {...props}>
            <Datagrid rowClick={"edit"}>
                <TextField source={"id"} label={"ID"}/>
                <TextField source={"nombre"} label={"Nombre del recurso"}/>

            </Datagrid>

        </List>
    )
}

export const RecursosCreate = props => {
    return (
        <Create title={"Crear recurso"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput source={"nombre"} label={"Nombre del recurso"} validate={[required()]}/>
            </SimpleForm>

        </Create>
    )
}

export const RecursosEdit = props => {
    return (

        <Edit title={"Editar recurso"} {...props}>
            <SimpleForm>
                <TextInput source={"nombre"} label={"Nombre del recurso"} validate={[required()]}/>
            </SimpleForm>
        </Edit>

    )
}
