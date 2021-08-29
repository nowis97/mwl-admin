import React, {useCallback, useEffect, useState} from "react";
import {
    List,
    Datagrid,
    TextField,
    SelectInput,
    TextInput,
    Filter,
} from "react-admin";


const FiltersCliente = props =>{

    /*
     Para que el caso sea sensible a mayusculas y minusculas ponga el modificador 'i:' delante de nombre del campo en el cual
     desea que este se comporte asi, Ejemplo: '<TextInput source={"i:nombre"}/>'
     y manejelo por el dataProvider personalizado por el desarrollador
    */

    return <Filter {...props}>
         <TextInput source={"i:nombre"} label={"Nombre"} alwaysOn/>

         <SelectInput source="tipoCliente" label={"Tipo de cliente"} choices={[
                    { id: 'Normal', name: 'Normal' },
                    { id: 'Produccion', name: 'Produccion' },
                     { id: 'Comercial', name: 'Comercial' },
                    {id: "Corporativo",name:'Corporativo'}
         ]} alwaysOn/>

        <TextInput source={"i:usuarioInstagram"} label={"Usuario de instagram"}/>
        <TextInput source={"i:celular"} label={"Celular"}/>
        <TextInput source={"i:email"} label={"Email"}/>


           </Filter>
}

export const ListCliente = props =>{
    return (
        <List title={"Clientes"}  filters={<FiltersCliente/>} {...props}>
            <Datagrid rowClick={"edit"}>
                <TextField source={"nombre"}/>
                <TextField source={"usuarioInstagram"}/>
                <TextField source={"celular"}/>
                <TextField source={"email"}/>
                <TextField source={"tipoCliente"}/>
            </Datagrid>
        </List>
    );
}
