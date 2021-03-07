import React from "react";
import {
    ArrayField,
    ArrayInput,
    AutocompleteInput,
    Create,
    Datagrid,
    Edit,
    List,
    ReferenceField,
    ReferenceInput,
    required,
    SelectArrayInput,
    SimpleForm,
    SimpleFormIterator,
    SingleFieldList,
    TextField,
    TextInput
} from 'react-admin'
import SimpleChipField from "../../helpers/SimpleChipField";
import {filterToQuery} from "../../helpers/filterstoqueries";

export const RolesList = props => {
    return (
        <List title={"Roles de usuario"}  {...props}>
            <Datagrid rowClick={"edit"}>
                <TextField source={"nombre"} label={"Nombre del rol"}/>

                <ArrayField label={"Permisos de los recursos"} source="permisosRecursos">
                    <Datagrid>
                        <ReferenceField label={"Nombre"} reference={"recursos"} source={"recurso"}>
                            <TextField source={"nombre"}/>
                        </ReferenceField>
                        <ArrayField source={"permisos"} label={"Permisos"}>
                            <SingleFieldList>
                                <SimpleChipField/>
                            </SingleFieldList>
                        </ArrayField>
                    </Datagrid>
                </ArrayField>


            </Datagrid>

        </List>
    )
}

export const RolesCreate = props => {
    return (
        <Create title={"Crear rol"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput source={"nombre"} label={"Nombre del rol"} validate={[required()]}/>


                <ArrayInput source={"permisosRecursos"} label={"Permisos de los recursos"}>
                    <SimpleFormIterator>
                        <ReferenceInput source={"recurso"} reference={"recursos"}
                                        filterToQuery={searchText => filterToQuery(searchText, 'nombre')}
                                        label={"Recursos"}>
                            <AutocompleteInput optionText={"nombre"} validate={[required()]}/>
                        </ReferenceInput>

                        <SelectArrayInput source={"permisos"} label={"Permisos"} validate={[required()]}
                                          choices={[{id: 'create', name: 'Crear'},
                                              {id: 'edit', name: 'Editar'},
                                              {id: 'show', name: 'Mostrar'},
                                              {id: 'delete', name: 'Borrar'},
                                          ]}
                        />
                    </SimpleFormIterator>

                </ArrayInput>
            </SimpleForm>

        </Create>
    )
}

export const RolesEdit = props => {
    return (

        <Edit title={"Editar rol"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput source={"nombre"} label={"Nombre del rol"} validate={[required()]}/>
                <ArrayInput source={"permisosRecursos"} label={"Permisos de los recursos"} validate={required()}>
                    <SimpleFormIterator>
                    <ReferenceInput source={"recurso"} label={"Recurso"} reference={"recursos"}
                                    filterToQuery={searchText => filterToQuery(searchText, 'nombre')}>

                        <AutocompleteInput optionText={"nombre"} validate={[required()]}/>
                    </ReferenceInput>

                    <SelectArrayInput source={"permisos"} label={"Permisos"} validate={[required()]}
                                      choices={[{id: 'create', name: 'Crear'},
                                          {id: 'edit', name: 'Editar'},
                                          {id: 'show', name: 'Mostrar'},
                                          {id: 'delete', name: 'Borrar'},
                                      ]}
                    />
                    </SimpleFormIterator>

                </ArrayInput>
            </SimpleForm>
        </Edit>

    )
}
