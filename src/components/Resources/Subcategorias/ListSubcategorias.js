import React from "react";
import {List, Datagrid, TextField} from 'react-admin';
export const ListSubcategorias = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="nombre" />
            <TextField source="descripcion" />


        </Datagrid>
    </List>
);