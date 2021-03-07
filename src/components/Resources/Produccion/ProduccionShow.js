import {ArrayField, Datagrid, DateField, NumberField, ReferenceField, SimpleShowLayout, TextField,Show,TopToolbar} from "react-admin";
import React, {useEffect, useState} from "react";
import {useStore} from 'react-redux';
import {Button} from "@material-ui/core";

const ProduccionesSubProductos = props =>{
    debugger;

    const subProductosProducir = useState([]);

    const store = useStore()

    useEffect(() =>{
        const productosPedidos = props.record;

    },[props.record])



    return <ArrayField source={"subProductosPedidosProduccion"} {...props}>
        <Datagrid isRowSelectable={() => true}>
            <ReferenceField source="idProducto" reference="productos">
                <TextField source="nombre" />
            </ReferenceField>
            <NumberField source="cantidadTotal" label={"Cantidad a producir"} />
            <DateField source="fechaEntrega" label={"Fecha de entrega"} />

        </Datagrid>
    </ArrayField>
}



export const ProduccionShow = props =>{




    return (
        <Show {...props} >
            <SimpleShowLayout>
                <ProduccionesSubProductos/>
            </SimpleShowLayout>

        </Show>
    );
}

export default ProduccionShow;