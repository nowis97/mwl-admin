import React from "react";
import {
    List, Datagrid, TextField,TextInput,Filter

} from "react-admin";

const FiltersRecetario = props =>{
    return <Filter {...props}>
        <TextInput source={"i:nombre"} label={"Nombre de la receta"} alwaysOn/>
    </Filter>
}

 const ListRecetario = props =>{
    return (
        <List {...props} title={"Tipos de clientes"} filters={<FiltersRecetario/>}>
            <Datagrid rowClick={"edit"}>
                <TextField label={"ID"} source={"id"}/>
                <TextField label={"Nombre de la receta"} source={"nombre"}/>
            </Datagrid>
        </List>
    );
}

export default ListRecetario;
