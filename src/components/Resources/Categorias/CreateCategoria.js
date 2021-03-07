import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    required,
    ReferenceArrayInput,
    SelectArrayInput,
    ChipField

}
    from 'react-admin';

 const CreateCategoria = props =>{
    return (
        <Create title={"Crear categoria"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput label ={"Nombre"} source={"nombre"} validate ={required("Campo requerido")} />
                <TextInput multiline label={"Descripción"} source={"descripcion"} validate={required("Campo requerido")}/>
                <ReferenceArrayInput source={"id"} reference="subcategorias" label={"Subcategorias"}>
                    <SelectArrayInput optionValue={"id"} optionText={"nombre"} validate={required("Campo requerido")}>
                        <ChipField  source="nombre" />
                    </SelectArrayInput>
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    );
}

export default CreateCategoria;