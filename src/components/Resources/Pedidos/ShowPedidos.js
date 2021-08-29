import {
    Show,
    TabbedShowLayout,
    Tab,
    SelectField,
    TextField,
    DateField,
    NumberField,
    BooleanField,
    ReferenceField,

}
    from 'react-admin';
import React from "react";
import {ProductosPedidos} from "./ProductosPedidos";

export const ShowPedidos = props => {




    return(
    <Show {...props}>
        <TabbedShowLayout>

            <Tab label={"Pedido"}>
                <BooleanField source="clienteRecibe" />
                <TextField source={"nombreRecibe"} label={"Nombre del receptor"}  />
                <ReferenceField source="clientesId" label={"Cliente"} reference="clientes">
                    <TextField source="nombre" />
                </ReferenceField>
                <SelectField source="tipoEntrega" label={"Tipo de entrega"} choices={[{id:'delivery',name:'Delivery'},{id:'retiro',name:'Retiro'}]} />
                <SelectField source="sector" allowEmpty choices={[
                    { id: 'ZN', name: 'Zona norte' },
                    { id: 'ZS', name: 'Zona sur' },
                    { id: 'ZC', name: 'Zona centro' },
                    {id: 'ZEN',name:'Extremo norte'},
                    {id:'ZES', name: 'Extremo sur'},
                    {id:'ZPA',name: 'Parte alta'},
                    {id:'COV',name:'Coviefi'}
                ]} />
                <DateField source="fechaEntrega" label={"Fecha de entrega"} />
                <DateField source="fechaPedido" label={"Fecha de pedido"} />
                <NumberField source="abono" />
                <NumberField source={"precioTotal"} label={"Precio total del pedido"}/>
                <TextField source="direccion" label={"Dirección de entrega"} />
                <TextField source="estado" />
                <TextField source="id" disabled />
                <ReferenceField source="asignadoAEntregadoPor" label={"Entregado por"} reference="usuarios">
                    <TextField source="username" />
                </ReferenceField>


            </Tab>
            <Tab label={"Productos"}>
                <ProductosPedidos/>

            </Tab>



        </TabbedShowLayout>
    </Show>)
};
