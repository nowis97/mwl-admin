import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    required
}
    from 'react-admin';

const CategoriaInventarioEdit = props =>{
    return (
        <Edit title={"Editar categoria"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput label={"ID"} source={"id"} disabled/>
                <TextInput label ={"Nombre"} source={"nombre"} validate ={required("Campo requerido")} />
                <TextInput multiline label={"Descripción"} source={"descripcion"} validate={required("Campo requerido")}/>
            </SimpleForm>
        </Edit>
    );
}

export default CategoriaInventarioEdit;
