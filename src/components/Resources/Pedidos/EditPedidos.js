import {
    ArrayInput, AutocompleteInput,
    BooleanInput,
    Edit, DateInput,
    FormDataConsumer,
    FormTab, NumberInput,
    RadioButtonGroupInput, SelectInput, SimpleFormIterator,
    TabbedForm, TextInput,
    required, ReferenceInput
} from "react-admin";
import React, {Fragment, useMemo, useState} from "react";
import {useSelector} from 'react-redux';
import _ from "lodash";
import ClienteReferenceInput from "./ClienteReferenceInput";
import Personalizado from "./Personalizado";
import Celebracion from "./Celebracion";
import CajaSorprende from "./CajaSorprende";
import CustomFieldsProducto from "./CustomFieldsProducto";
import {
    celebracionesPrecio,
    personalizadoPrecio,
    productoPersonalizadoPrecio,
    selectorProductos
} from "./CreatePedidos";
import {getTimeZoneLocal} from "../../helpers/helpers";
import {validateCelular} from "../Clientes/CreateCliente";
import {filterToQuery} from "../../helpers/filterstoqueries";




const EditPedidos = props =>{


    const productos = useSelector(selectorProductos);


    const [productosPedidos,setProductosPedidos] = useState([]);



    const transform = data =>{
        if (data.tieneTarjeta){
            delete data.tieneTarjeta;
            Object.assign(data,{ tarjeta:{de:data.de,para:data.para}})
            delete data.de;
            delete data.para;
        }

        debugger;
        if (!data.fechaEntrega.includes('T'))
            data.fechaEntrega = (new Date(data.fechaEntrega+" "+ getTimeZoneLocal() )).toJSON();




        return data;
    }

    const precioPedidos = formData => {
        let precioTotalPedidos = 0;
        if (!formData) return precioTotalPedidos;
        if (formData.length === 0) return precioTotalPedidos;


        for (const scopedFormData of formData) {
            if (!scopedFormData) return precioTotalPedidos;
            const producto = _.find(productos,{id:scopedFormData.idProducto})
            if (!producto) return precioTotalPedidos;

            switch (producto.nombre) {
                case "Personalizado":
                    precioTotalPedidos += producto.precio;

                    precioTotalPedidos += personalizadoPrecio(scopedFormData,producto);
                    break;
                case "Celebraciones":
                    precioTotalPedidos += producto.precio;
                    precioTotalPedidos += celebracionesPrecio(scopedFormData,producto);
                    break;
                default:
                    if (producto.productoPersonalizado) {
                        precioTotalPedidos += producto.precio;
                        precioTotalPedidos += productoPersonalizadoPrecio(scopedFormData, producto);
                    }
                    if (scopedFormData.cantidad){
                        precioTotalPedidos += producto.precio * scopedFormData.cantidad;
                    }else{
                        precioTotalPedidos += producto.precio;
                    }
                    break;

            }

        }



        return (precioTotalPedidos)

    }

    const precioPedidosCalculado = useMemo( () => precioPedidos(productosPedidos),[productosPedidos,productos]);



    return (
        <Edit {...props} transform={transform}>
            <TabbedForm redirect={"list"}>

                <FormTab label={"Editar Pedido"}>
                    <ClienteReferenceInput source={"clientesId"} label={"Cliente"} reference={"clientes"}/>

                    <RadioButtonGroupInput source={'tipoEntrega'} choices={[{id:'delivery',name:'Delivery'},{id:'retiro',name:'Retiro'}]} />

                    <BooleanInput label={"Tarjeta"} source={"tieneTarjeta"}/>
                    <FormDataConsumer>
                        {
                            ({formData,...rest}) =>{
                                if (formData.tarjeta){
                                    return <Fragment>
                                        <TextInput source={"tarjeta.de"} label={"De"} validate={required()}/>
                                        <TextInput source={"tarjeta.para"} label={"Para"} validate={required()}/>
                                    </Fragment>
                                }

                            }
                        }
                    </FormDataConsumer>


                    <BooleanInput label={"¿Cliente recibe/retira el pedido?"} source={"clienteRecibe"}/>

                    <FormDataConsumer>
                        {
                            ({formData,...rest})=>
                                !formData.clienteRecibe &&
                                <Fragment>
                                    <TextInput source={"nombreRecibe"} label={"Nombre receptor"} validate={required()}/>
                                    <br/>
                                    <NumberInput source={"numeroCelularRecibe"} label={"Numero de celular"} validate={validateCelular}/>
                                </Fragment>
                        }
                    </FormDataConsumer>
                    <FormDataConsumer>
                        {
                            ({formData}) =>{
                                return  formData.tipoEntrega === 'delivery' &&
                                    <>
                                        <TextInput source={"direccion"} label={"Dirección de entrega"} validate={required()}/>
                                        <br/>

                                        <SelectInput source="sector" allowEmpty validate={required()} choices={[
                                            { id: 'ZN', name: 'Zona norte' },
                                            { id: 'ZS', name: 'Zona sur' },
                                            { id: 'ZC', name: 'Zona centro' },
                                            {id: 'ZEN',name:'Extremo norte'},
                                            {id:'ZES', name: 'Extremo sur'},
                                            {id:'ZPA',name: 'Parte alta'},
                                            {id:'COV',name:'Coviefi'}
                                        ]} />
                                    </>
                            }
                        }
                    </FormDataConsumer>

                    <DateInput source={"fechaEntrega"} label={"Fecha de entrega"} isRequired={true}/>

                    <TextInput source={"observaciones"} label={"Observación"} multiline/>
                </FormTab>
                <FormTab label={"Productos para pedir"} >
                    <ArrayInput label={"Productos"} source={"productosPedidos"} >
                        <SimpleFormIterator >
                            <ReferenceInput filter={{esSubproducto:false}} reference={"productos"} source={"idProducto"} label={"Producto"} filterToQuery={searchText => filterToQuery(searchText,'nombre')}>
                                <AutocompleteInput optionText={"nombre"} validate={required()}  />
                            </ReferenceInput>

                            <FormDataConsumer>
                                {({
                                      formData, // The whole form data
                                      scopedFormData,// The data for this item of the ArrayInput
                                      getSource, // A function to get the valid source inside an ArrayInput
                                      ...rest
                                  }) =>{

                                    if (!scopedFormData) return;
                                    const producto = _.find(productos,{id:scopedFormData.idProducto})
                                    if (!producto) return null;
                                    switch (producto.nombre){
                                        case 'Personalizado':
                                            return <Personalizado getSource={getSource} />
                                        case 'Celebraciones':
                                            return <Celebracion getSource={getSource}/>
                                        case "Caja sorprende":
                                            return <CajaSorprende getSource={getSource} campos={producto.productoPersonalizado.campos}/>

                                        default:
                                            if (producto.productoPersonalizado)
                                                return <CustomFieldsProducto getSource={getSource} fields={producto.productoPersonalizado.campos}/>
                                            //return <NumberInput source={getSource("cantidad")} label={"Cantidad"}/>
                                            return null;

                                    }

                                }

                                }

                            </FormDataConsumer>
                            {<FormDataConsumer>
                                {({formData}) =>{
                                    setProductosPedidos(formData.productosPedidos)

                                }}
                            </FormDataConsumer>}

                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
                <div style={{width:'100%',
                    display:'inline-flex',
                    alignItems:'flex-end',
                    flexDirection:'column',
                    justifyContent:'center',
                    marginRight:'1%',
                }}>
                    <span >  Precio: ${precioPedidosCalculado}</span>
                </div>


            </TabbedForm >



        </Edit>
    );
}

export default EditPedidos;