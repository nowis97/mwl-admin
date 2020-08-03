import React from "react";
import {cloneElement, useMemo} from "react";
import IconEvent from '@material-ui/icons/Event';
import {
    List, Datagrid, TextField,


} from "react-admin";


export const ListTipoCliente = props =>{
    return (
        <List {...props} title={"Tipos de clientes"}>
            <Datagrid>
                <TextField source={"id"}/>
                <TextField label={"Nombre"} source={"nombre"}/>
                <TextField label={"Descripción"} source={"descripcion"}/>
            </Datagrid>
        </List>
    );
}