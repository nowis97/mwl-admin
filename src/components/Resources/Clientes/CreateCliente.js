import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    ReferenceInput,
    required,
    NumberInput,
    SelectInput,
    minLength,
    maxLength,
    number,
    email
}
    from 'react-admin';

export const validateCliente = [required("Campo requerido"),minLength(3,"Debe tener tres caracteres o más")];
export const validateCelular = [required("Campo requerido"),minLength(8,"Debe tener ocho digitos o más"),
    maxLength(9,"Debe tener menos de nueve digitos"),number("Solo numeros")];

export const validateEmail = [email("Ingrese un email valido")]

export const CreateCliente = props =>{
    return (
        <Create title={"Crear nuevo cliente"} {...props}>
            <SimpleForm>
                <TextInput label ={"Nombre"} source={"nombre"} validate ={validateCliente} />
                <TextInput label={"Usuario de Instagram"} source={"usuarioInstagram"} validate={validateCliente}/>
                <TextInput label={"Celular"} source ={"celular"} validate = {validateCelular} type={"number"}/>
                <TextInput label={"E-mail"} source={"email"} type={"email"} validate={validateEmail}/>
                {/*
                <ReferenceInput label = "Tipo de cliente" source={"tipo_cliente"} reference={"tipo-clientes"}>
                    <SelectInput optionValue={"nombre"} optionText={"nombre"}/>
                </ReferenceInput>
                */}
                {<SelectInput source="tipoCliente" choices={[
                    { id: 'Normal', name: 'Normal' },
                    { id: 'Oroduccion', name: 'Produccion' },
                    { id: 'Comercial', name: 'Comercial' },
                    {id: "Corporativo",name:'Corporativo'}
                ]} />}


            </SimpleForm>
        </Create>
    );
}