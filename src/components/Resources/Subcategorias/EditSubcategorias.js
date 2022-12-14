import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    required,


}
    from 'react-admin';

const EditSubcategoria = props =>{
    return (
        <Edit title={"Editar subcategoria"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput label={"ID"} source={"id"}/>
                <TextInput label ={"Nombre"} source={"nombre"} validate ={required("Campo requerido")} />
                <TextInput multiline label={"Descripción"} source={"descripcion"} validate={required("Campo requerido")}/>

            </SimpleForm>
        </Edit>
    );
}

export default EditSubcategoria;
