    import * as React from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    SelectInput, required
}
    from 'react-admin';
    import {validateCelular, validateCliente, validateEmail} from "./CreateCliente";

export const EditCliente = props =>{
    return (
        <Edit title={"Editar clientes"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput label={"ID"} source={"id"} disabled/>
                <TextInput label ={"Nombre"} source={"nombre"} validate ={validateCliente} />
                <TextInput label={"Usuario de Instagram"} source={"usuarioInstagram"}/>
                <NumberInput label={"Celular"} source ={"celular"} validate = {validateCelular}/>
                <TextInput label={"E-mail"} source={"email"} type={"email"} validate={validateEmail}/>
                {/*<ReferenceInput label="Tipo de Cliente" source="id" reference="tipo-clientes" validate={[required()]}>
                    <SelectInput optionText="nombre" />
                </ReferenceInput>*/}
                {<SelectInput source="tipoCliente" validate={required()} choices={[
                    { id: 'Normal', name: 'Normal' },
                    { id: 'Oroduccion', name: 'Produccion' },
                    { id: 'Comercial', name: 'Comercial' },
                    {id: "Corporativo",name:'Corporativo'}
                ]} />}
            </SimpleForm>
        </Edit>
    );
}
