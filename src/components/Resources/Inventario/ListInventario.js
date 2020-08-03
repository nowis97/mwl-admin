import React from "react";
import {List, Datagrid, TextField, ReferenceField, NumberField} from "react-admin";

export const ListInventario = props =>{
    return (
        <List title={"Materias primas"} {...props}>
            <Datagrid rowClick={"edit"}>
                <TextField label={"Nombre del material"} source={"nombreMaterial"} />
                <ReferenceField reference={"categorias-inventario"} source={"categoria"} label={"Categoria"}>
                    <TextField source={"nombre"}/>
                </ReferenceField>
                <TextField  label={"Marca"} source={"marca"} />
                <NumberField label={"Precio"} source={"precio"} />
                <NumberField label={"Cantidad Utilizada"} source={"cantidadUtilizada"} />
                <NumberField label={"Cantidad"} source={"cantidad"} />
                <TextField label={"Unidad de Medida"} source={"unidadMedida"} />
                <NumberField label={"Costo Unitario"} source={"costoUnitario"} emptyText={"0"} />

            </Datagrid>
        </List>
    );
}