import React from "react";
import {List,Datagrid,TextField,ReferenceArrayField,SingleFieldList,ChipField} from "react-admin";

export const ListCategoria = props =>{
    return (
        <List title={"Listar categorias"} {...props}>
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