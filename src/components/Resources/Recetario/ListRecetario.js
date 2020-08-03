import React from "react";
import {
    List, Datagrid, TextField,

} from "react-admin";


 const ListRecetario = props =>{
    return (
        <List {...props} title={"Tipos de clientes"}>
            <Datagrid rowClick={"edit"}>
                <TextField label={"ID"} source={"id"}/>
                <TextField label={"Nombre de la receta"} source={"nombre"}/>
            </Datagrid>
        </List>
    );
}

export default ListRecetario;