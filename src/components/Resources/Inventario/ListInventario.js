import React from "react";
import {List, Datagrid, TextField, ReferenceField, NumberField,Filter,TextInput,ReferenceInput,SelectInput} from "react-admin";

const FiltersInventario = props =>{
    return <Filter {...props}>
                <ReferenceInput reference={"categorias-inventario"} source={"categoria"} label={"Categoria"}>
                    <SelectInput optionText={"nombre"} alwaysOn/>
                </ReferenceInput>

        <TextInput source={"i:nombreMaterial"} label={"Nombre del material"} alwaysOn/>

           </Filter>

}

export const ListInventario = props =>{
    return (
        <List title={"Materias primas"} filters={<FiltersInventario/>} {...props}>
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
