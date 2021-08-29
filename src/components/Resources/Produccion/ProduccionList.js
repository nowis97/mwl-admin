import React, {Fragment, useState} from "react";
import {
    List,
    Datagrid,
    ReferenceField,
    NumberField,
    DateField,
    ArrayField,
    TextField,
    ShowButton,
    Filter,
    DateInput,

}
    from 'react-admin';

import {Button} from "@material-ui/core";


const PedidosAProducir = props =>{

    return <ArrayField source={"pedidos"} record={props.record} {...props}>
            <Datagrid>
                <TextField source={"id"}/>
                <DateField source={"fechaPedido"} label={"Fecha de pedido"}/>
                <TextField source={"estado"} label={"Estado"}/>
                <NumberField source={"precioTotal"} label={"Precio total"}/>
                <ReferenceField source="clientesId" label={"Cliente"} reference="clientes">
                    <TextField source="nombre" />
                </ReferenceField>


            </Datagrid>
        </ArrayField>


}

const FiltersProduccion = props => {

    return <Fragment>
                <Filter {...props}>
                    <DateInput label={"Fecha de inicio"} source={"date_lte"} alwaysOn />
                    <DateInput label={"Fecha de termino"} source={"date_gte"} alwaysOn />
                </Filter>


           </Fragment>
}

export const ProduccionList = props =>{
   return <List {...props} filters={<FiltersProduccion/>}>
        <Datagrid expand={<PedidosAProducir/>}  >
            <TextField label={"ID"} source={"id"}/>
            <NumberField source="cantidadTotalProducir" label={"Cantidad total a producir"}/>
            <NumberField source={"cantidadTotalProducida"} label={"Cantidad total producida"}/>
            <DateField source="fechaEntrega" label={"Fecha de entrega"}/>
            <ShowButton label={"Ver Subproductos"}/>
        </Datagrid>
    </List>
}
