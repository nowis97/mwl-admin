import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    required,


}
    from 'react-admin';

const CategoriaInventarioCreate = props =>{
    return (
        <Create title={"Crear categoria"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput label ={"Nombre"} source={"nombre"} validate ={required("Campo requerido")} />
                <TextInput multiline label={"Descripción"} source={"descripcion"} validate={required("Campo requerido")}/>
            </SimpleForm>
        </Create>
    );
}

export default CategoriaInventarioCreate;