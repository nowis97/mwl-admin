import React, {Fragment, useMemo, useState} from "react";
import {
    Create,
    AutocompleteInput,
    ReferenceInput,
    TextInput,
    SelectInput,
    DateInput,
    NumberInput,
    ArrayInput,
    SimpleFormIterator,
    TabbedForm,
    FormTab,
    RadioButtonGroupInput,
    BooleanInput,
    FormDataConsumer,
    required,
} from 'react-admin';
import ClienteReferenceInput from "./ClienteReferenceInput";
import Personalizado from "./Personalizado";
import Celebracion from "./Celebracion";
import _ from 'lodash';
import CajaSorprende from "./CajaSorprende";
import CustomFieldsProducto from "./CustomFieldsProducto";
import {getTimeZoneLocal} from "../../helpers/helpers";
import {validateCelular} from "../Clientes/CreateCliente";
import {filterToQuery} from "../../helpers/filterstoqueries";
import {createSelector} from "reselect";
import {useSelector} from 'react-redux'

export const selectorProductos = createSelector(
    state => state.admin,
    admin => Object.values(admin.resources.productos.data)
    )

export const productoPersonalizadoPrecio = (scopedFormData,producto) =>{
    if (!scopedFormData) return;
    let sumUnitaria = 0;
    let cantidad = 1;
    const propiedadesObjetos = Object.keys(scopedFormData);
    if (scopedFormData.hasOwnProperty('idProducto') && propiedadesObjetos.length ===1) return sumUnitaria;


    for (const prop of propiedadesObjetos) {
        const campo = _.find(producto.productoPersonalizado.campos,{nombre:prop});
        if (!campo) continue;

        switch (campo.tipo) {
            case "select":
                if (campo.permiteMultipleSeleccion){
                    const selecteds = scopedFormData[prop];
                    for (const selected of selecteds) {
                        const objSeleccionado = _.find(campo.values,{id:selected});
                        if (objSeleccionado.precioAgregado){
                            sumUnitaria += objSeleccionado.precioAgregado;
                        }
                    }
                    break;

                }
                const valorSeleccionado = _.find(campo.values,{id:scopedFormData[prop]})
                if (valorSeleccionado)
                    sumUnitaria += valorSeleccionado.precioAgregado;

                break;
            case "text":
                if (scopedFormData[prop].length > 0)
                    sumUnitaria += campo.precioAgregado;

                break;
            case "number":
                if (prop.toLowerCase().includes('cantidad')){
                    cantidad = scopedFormData[prop];
                    break;
                }

                if (scopedFormData[prop] >0)
                    sumUnitaria+= campo.precioAgregado;

                break;

        }
    }
    return (sumUnitaria * cantidad);



}

export const celebracionesPrecio = (scopedFormData,producto) =>{
    let sumPrecios = 0;
    if (!scopedFormData || !(scopedFormData.tamano)) return sumPrecios;

    const tamanoAlfajor = _.find(producto.productoPersonalizado.campos,{nombre:scopedFormData.tamano});

    const tamanoAlfajorCantidad = _.find(tamanoAlfajor.values,{id:String(scopedFormData.cantidad)});

    sumPrecios += tamanoAlfajorCantidad.precioAgregado;

    if (!scopedFormData.extras) return sumPrecios;

    const tipoCoberturaAgregados = _.find(producto.productoPersonalizado.campos,{nombre:'tipoCobertura'});

    let sum = 0;
    const brillosCobertura = _.find(tipoCoberturaAgregados.values,{id: 'brillos'})

    for (const extra of scopedFormData.extras) {
        if (extra) {
            if (Object.keys(extra).length < 4) return sum + sumPrecios;
        } else return sum+ sumPrecios;

        const tipoCobertura = _.find(tipoCoberturaAgregados.values,{id:extra.tipoCobertura})

        sum += (tipoCobertura.precioAgregado? tipoCobertura.precioAgregado:1) * extra.cantidadExtras;
        if (extra.brillos && extra.brillos.length >= 1){
            sum += brillosCobertura.precioAgregado * extra.brillos.length;
        }



    }

     return sum + sumPrecios;

}
export const personalizadoPrecio = (scopedFormData,producto) =>{
    let sum = 0;
    let sumBrillos = 0;
    if (!scopedFormData) return 0;
    const {coberturas} = scopedFormData;
    if (!coberturas) return sum;


    const valuesTipoCoberturas = producto.productoPersonalizado.campos[0].values;



    for (const tipoCobertura of valuesTipoCoberturas) {
        const foundCobertura = _.find(coberturas,{tipoCobertura: tipoCobertura.id})
        if (foundCobertura){
            sum += tipoCobertura.precioAgregado;
            if (foundCobertura.brillos && foundCobertura.brillos.length >=1 && sumBrillos ===0) {
                sumBrillos += tipoCobertura.precioAgregado;
            }
            continue;
        }

    }
    return ( sum + sumBrillos );



}

const CreatePedidos = props =>{



    const productos = useSelector(selectorProductos)

    const [productosPedidos,setProductosPedidos] = useState([]);

    const transform = data =>{
        if (data.mostrarCantidad) delete data.mostrarCantidad

        if (data.tieneTarjeta){
            delete data.tieneTarjeta;
            Object.assign(data,{ tarjeta:{de:data.de,para:data.para}})
            delete data.de;
            delete data.para;
        }else {
            delete data.tieneTarjeta;
        }

            data.fechaEntrega = (new Date(data.fechaEntrega+" "+ getTimeZoneLocal() )).toJSON();





        return data;
    }

    const precioPedidos = formData => {
        let precioTotalPedidos = 0;
        if (!formData) return precioTotalPedidos;

        let cantidadProducto = 1;

        for (const scopedFormData of formData) {
            if (!scopedFormData) return precioTotalPedidos;
            const producto = _.find(productos,{id:scopedFormData.idProducto})

            switch (producto?.nombre) {
                case "Personalizado":
                    precioTotalPedidos += producto.precio;

                    precioTotalPedidos += personalizadoPrecio(scopedFormData,producto);
                    break;
                default:
                    if (producto?.productoPersonalizado){
                        precioTotalPedidos += producto.precio;
                        precioTotalPedidos += productoPersonalizadoPrecio(scopedFormData,producto);
                        }
                    if (scopedFormData?.cantidad){
                        precioTotalPedidos += producto.precio * scopedFormData.cantidad;
                    }else{
                        precioTotalPedidos += producto?producto.precio:0;
                    }
                    break;

            }

        }



        return (precioTotalPedidos)

    }

    const precioPedidosCalculado = useMemo( () => precioPedidos(productosPedidos),[productosPedidos]);


    return (
      <Create {...props} transform={transform}>
          <TabbedForm redirect={"list"} initialValue={{fechaEntrega:new Date()}}>

              <FormTab label={"Pedido"}>
              <ClienteReferenceInput source={"clientesId"} label={"Cliente"} reference={"clientes"}/>

              <RadioButtonGroupInput source={'tipoEntrega'} choices={[{id:'delivery',name:'Delivery'},{id:'retiro',name:'Retiro'}]} validate={required()} />

                  <BooleanInput label={"Tarjeta"} source={"tieneTarjeta"}/>
                  <FormDataConsumer>
                      {
                          ({formData,...rest}) =>{
                              return  formData.tieneTarjeta &&  <Fragment>
                                  <TextInput source={"de"} label={"De"} validate={required()}/>
                                  <TextInput source={"para"} label={"Para"} validate={required()}/>
                              </Fragment>
                          }
                      }
                  </FormDataConsumer>


                  <BooleanInput label={"¿Cliente  recibe/retira el pedido?"} source={"clienteRecibe"}/>

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

                              <BooleanInput source={"mostrarCantidad"} label={"Comprar más"} defaultValue={false}/>

                              <FormDataConsumer>
                                  {({scopedFormData,getSource}) =>{
                                      if (!scopedFormData) return null;

                                      if (scopedFormData.mostrarCantidad)
                                          return <NumberInput label={"Cantidad"} source={getSource('cantidad')} validate={[required()]} min={1} />

                                      return null;

                                  }}
                              </FormDataConsumer>


                              <FormDataConsumer>
                                  {({
                                        formData, // The whole form data
                                        scopedFormData,// The data for this item of the ArrayInput
                                        getSource, // A function to get the valid source inside an ArrayInput
                                        ...rest
                                    }) =>{

                                      if (!scopedFormData) return;
                                      const producto = _.find(productos,{id:scopedFormData.idProducto})
                                      switch (producto?.nombre){
                                          case 'Personalizado':
                                              return <Personalizado getSource={getSource} />
                                          case 'Celebraciones':
                                              return <Celebracion getSource={getSource}/>
                                          case "Caja sorprende":
                                              return <CajaSorprende getSource={getSource} campos={producto.productoPersonalizado.campos}/>

                                          default:
                                              if (producto?.productoPersonalizado)
                                                  return <CustomFieldsProducto getSource={getSource} fields={producto.productoPersonalizado.campos}/>

                                              return null;
                                              //return <NumberInput source={getSource("cantidad")} label={"Cantidad"} validate={required()}/>

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



      </Create>
    );
}

export default CreatePedidos;
