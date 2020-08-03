import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    required,

}
    from 'react-admin';

export const CreateTipoClientes = props =>{
    return (
        <Create title={"Crear tipo de cliente"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput label ={"Nombre"} source={"nombre"} validate ={required("Campo requerido")} />
                <TextInput multiline label={"Descripción"} source={"descripcion"} validate={required("Campo requerido")}/>
            </SimpleForm>
        </Create>
    );
}