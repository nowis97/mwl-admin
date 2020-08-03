import React from "react";
import {List,Datagrid,TextField} from "react-admin";

export const CategoriaInventarioList = props =>{
    return (
        <List title={"Listar categorias"} {...props}>
            <Datagrid rowClick={"edit"}>
                <TextField source={"nombre"} label={"Nombre"}/>
                <TextField source={"descripcion"} label={"Descripcion"}/>

            </Datagrid>
        </List>
    );
}