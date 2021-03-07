import React from "react";
import {List,Datagrid,TextField,ReferenceArrayField,SingleFieldList,ChipField,Filter,TextInput} from "react-admin";

const FiltersCategoria = props =>{
    return <Filter {...props}>
                <TextInput source={"i:nombre"} label={"Nombre"}/>
           </Filter>
}

export const ListCategoria = props =>{


    return (
        <List title={"Listar categorias"} filters={<FiltersCategoria/>} {...props} >
            <Datagrid rowClick={"edit"}>
                <TextField source={"nombre"} label={"Nombre"}/>
                <TextField source={"descripcion"} label={"Descripcion"}/>
                <ReferenceArrayField label="Subcategorias" reference="subcategorias" source="subcategorias">
                    <SingleFieldList>
                        <ChipField source="nombre" />
                    </SingleFieldList>
                </ReferenceArrayField>


            </Datagrid>
        </List>
    );
}
