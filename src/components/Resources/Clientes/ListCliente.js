import React from "react";
import {List,Datagrid,TextField} from "react-admin";

export const ListCliente = props =>{
    return (
        <List title={"Clientes"} {...props}>
            <Datagrid>
                <TextField source={"nombre"}/>
                <TextField source={"usuario_instagram"}/>
                <TextField source={"celular"}/>
                <TextField source={"email"}/>
                <TextField source={"tipo_cliente"}/>
            </Datagrid>
        </List>
    );
}