import React from "react";
import {List, Datagrid, TextField, Filter, TextInput} from "react-admin";


const FiltersInventario = props =>{
    return <Filter {...props}>
        <TextInput source={"i:nombre"} label={"Nombre"} alwaysOn/>
    </Filter>
}

export const CategoriaInventarioList = props =>{
    return (
        <List title={"Listar categorias"} {...props} filters={<FiltersInventario/>}>
            <Datagrid rowClick={"edit"}>
                <TextField source={"nombre"} label={"Nombre"}/>
                <TextField source={"descripcion"} label={"Descripcion"}/>

            </Datagrid>
        </List>
    );
}
