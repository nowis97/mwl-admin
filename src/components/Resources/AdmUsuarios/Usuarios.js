import React from "react";
import {
    AutocompleteArrayInput,
    ChipField,
    Create,
    Datagrid,
    Edit,
    List,
    minLength,
    PasswordInput,
    ReferenceArrayField,
    ReferenceField,
    ReferenceInput,
    required,
    SimpleForm,
    SingleFieldList,
    TextField,
    TextInput
} from 'react-admin'

export const UsuariosList = props => {
    return (
        <List title={"Adm. Usuarios"}  {...props}>
            <Datagrid rowClick={"edit"}>
                <TextField source={"username"} label={"Nombre de usuario"}/>
                <TextField source={"email"} label={"Email"}/>
                <ReferenceArrayField label="Roles" reference="roles" source="rolesIds">
                    <SingleFieldList>
                        <ChipField source="nombre"/>
                    </SingleFieldList>
                </ReferenceArrayField>
            </Datagrid>

        </List>
    )
}

export const UsuariosCreate = props => {
    return (
        <Create title={"Crear usuario"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput source={"username"} label={"Nombre de usuario"} validate={[required()]}/>
                <TextInput source={"email"} type={"email"} label={"Email"} validate={[required()]}/>
                <PasswordInput source={"password"} label={"Contraseña"} validate={[required(), minLength(8)]}/>
                <ReferenceInput reference={"roles"} source={"rolesIds"} label={"Roles"} validate={required()}>
                    <AutocompleteArrayInput optionText={"nombre"}/>
                </ReferenceInput>
            </SimpleForm>

        </Create>
    )
}

export const UsuariosEdit = props => {
    return (

        <Edit title={"Editar usuario"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput source={"username"} label={"Nombre de usuario"} validate={[required()]}/>
                <TextInput source={"email"} type={"email"} label={"Email"} validate={[required()]}/>
                <PasswordInput source={"password"} label={"Contraseña"} validate={[required(), minLength(8)]}/>
                <ReferenceInput reference={"roles"} source={"rolesIds"} label={"Roles"} validate={required()}>
                    <AutocompleteArrayInput optionText={"nombre"}/>
                </ReferenceInput>
            </SimpleForm>
        </Edit>

    )
}
