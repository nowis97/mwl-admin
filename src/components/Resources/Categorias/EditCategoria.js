import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    required, SelectArrayInput, ChipField, ReferenceArrayInput,

}
    from 'react-admin';


const EditCategoria = props =>{
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source={"id"} label={"ID"} disabled />
                <TextInput label ={"Nombre"} source={"nombre"} validate ={required("Campo requerido")} />
                <TextInput multiline label={"Descripción"} source={"descripcion"} validate={required("Campo requerido")}/>
                <ReferenceArrayInput source={"subcategorias"} reference="subcategorias" label={"Subcategorias"}>
                    <SelectArrayInput optionText={"nombre"}>
                        <ChipField  source="nombre" />
                    </SelectArrayInput>
                </ReferenceArrayInput>
            </SimpleForm>
        </Edit>
    );
}

export default EditCategoria;