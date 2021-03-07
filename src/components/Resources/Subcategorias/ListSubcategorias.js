import React from "react";
import {List, Datagrid, TextField, Filter, TextInput} from 'react-admin';

const FiltersSubCategoria = props =>{
    return <Filter {...props}>
        <TextInput source={"i:nombre"} label={"Nombre"} alwaysOn/>
    </Filter>
}

export const ListSubcategorias = props => (
    <List {...props} filters={<FiltersSubCategoria/>}>
        <Datagrid rowClick="edit">
            <TextField source="nombre" />
            <TextField source="descripcion" />

        </Datagrid>
    </List>
);
