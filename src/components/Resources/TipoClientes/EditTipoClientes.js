import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    required,

}
    from 'react-admin';
import Toolbar from "@material-ui/core/Toolbar";


export const EditTipoClientes = props =>{
    return (
        <Edit {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput label ={"Nombre"} source={"nombre"} validate ={required("Campo requerido")} />
                <TextInput multiline label={"Descripción"} source={"descripcion"} validate={required("Campo requerido")}/>
            </SimpleForm>
        </Edit>
    );
}