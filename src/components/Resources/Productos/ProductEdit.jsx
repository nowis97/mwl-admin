import * as React from 'react';
import {
    Edit,
    FormTab,
    NumberInput,
    SelectInput,
    TabbedForm,
    TextInput,
    required,
    ImageInput,
    ImageField,
    ArrayInput,
    SimpleFormIterator,
    FormDataConsumer,
    BooleanInput,
    AutocompleteInput,
    ReferenceInput,
    useQuery,
    TextField

} from 'react-admin';
import { InputAdornment ,TextField as TFUI} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';


import {validatePrecio, validateCantidad, validateCantidadNoreq} from "../Inventario/CreateInventario";
import {Fragment, useState} from "react";
import {filterToQuery} from "../../helpers/filterstoqueries";


export const styles = {
    price: { width: '14em' },
    width: { width: '7em' },
    height: { width: '7em' },
    stock: { width: '7em' },
    widthFormGroup: { display: 'inline-block' },
    heightFormGroup: { display: 'inline-block', marginLeft: 32 },
};


const Inventarios = ({scopedFormData,...rest}) => {
    const { data, loading } = useQuery({
        type: 'getOne',
        resource: 'inventario',
        payload: { id: scopedFormData.id }
    });

    if (!loading){

        return <Fragment key={rest.formData.inventarios.length}>
            <TFUI defaultValue={data?data.marca:''} InputProps={{readOnly:true}} label={"Marca"} id={rest.formData.inventarios.length}
                  style={{marginBottom:'18px'}} />
            <br/>
            <TFUI defaultValue={data?data.unidadMedida:''} InputProps={{readOnly:true}} label={"Unidad de medida"} id={rest.formData.inventarios.length}
                  style={{marginBottom:'18px'}} />


        </Fragment>;
    }
    return null;
}

const PreviewImage = ({ record,source }) => {
    const API_URI = process.env["REACT_APP_API_URL"];
    if (typeof (record) == "string") {
            record = {
            [source]: API_URI +'images/'+ record
        }
    }
        return <ImageField record={record}  source={ source} />
    }



const useStyles = makeStyles(styles);

const ProductEdit = props => {
    const classes = useStyles();
    const [esSubproducto,setEsSubproducto] = useState(false);


    return (
        <Edit {...props}>
            <TabbedForm>
                <FormTab label="Editar Producto">
                    <TextInput
                        source="nombre"
                        label={"Nombre"}
                        validate={required()}
                    />

                    <TextField source={"estado"} label={"Estado actual"}/>

                    <BooleanInput label={"Subproducto"} source={"esSubproducto"}/>

                    <TextInput multiline source="descripcion" label="Descripción" />

                    <TextInput source={"costo"} label={"Costo unitario"} disabled/>

                    <NumberInput source={"porcentajeGanancia"} label={"Porcentaje de ganancia"} format ={value =>  value *100}
                                 className={classes.price}
                                 InputProps={{
                                     endAdornment: (
                                         <InputAdornment position="end">
                                             %
                                         </InputAdornment>
                                     ),
                                 }} disabled/>

                    <NumberInput
                        label ="Precio"
                        source="precio"
                        validate={validatePrecio}
                        className={classes.price}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormDataConsumer>
                        {({ formData, ...rest }) => {
                            if (formData){
                                if (!formData.esSubproducto){
                                    return <Fragment>

                                        <br/>
                                        <NumberInput
                                            label = "Stock"
                                            source="stock"
                                            validate={validateCantidadNoreq}
                                            className={classes.stock}
                                        />


                                    </Fragment>
                                }

                                return <ReferenceInput reference={"recetario"} source={"receta"} label={"Nombre receta"} filterToQuery={searchText => filterToQuery(searchText,'nombre')} >
                                    <AutocompleteInput optionText={"nombre"}/>
                                </ReferenceInput>
                            }

                        }
                        }
                    </FormDataConsumer>

                    <ReferenceInput reference={"categorias"} source={"categoria"} label={"Categorias"} filterToQuery={searchText => filterToQuery(searchText,'nombre')}>
                        <AutocompleteInput  optionText={"nombre"} />
                    </ReferenceInput>
                    <ReferenceInput reference={"subcategorias"} source={"subCategoria"} label={"Subcategorias"} filterToQuery={searchText => filterToQuery(searchText,'nombre')}>
                        <AutocompleteInput  optionText={"nombre"} />
                    </ReferenceInput>
                    {/*
                        <AutoCompleteDynamic _fullLarge={false} _required={true} resSrc={"categorias"}
                                             _label={"Categoria"} _name={"categoria"}/>
                        <AutoCompleteDynamic _fullLarge={false} _required={true} resSrc={"subcategorias"} _label={"Subcategoria"} _name={"subcategoria"}/>
                    */}

                        <ImageInput source={"imagenRuta"}>
                        <PreviewImage source={"imagenRuta"}/>
                        </ImageInput>

                </FormTab>
                <FormTab label="Personalizado" path="producto-personalizado">
                    {/*<FormCampos/>*/}
                    <ArrayInput source={"productoPersonalizado.campos"} label={"Campos"}>
                        {/*<EditPersonalizado {...props}/>*/}
                        {<SimpleFormIterator >
                            <TextInput source={"nombre"}  label={"Nombre del campo"} />

                            <SelectInput source="tipo" label={"Tipo de campo"} choices={[
                                { id: 'text', name: 'Texto' },
                                { id: 'number', name: 'Numero' },
                                { id: 'select', name: 'Selección Multiple' },
                            ]} />

                            <BooleanInput label={"Obligatorio"} source={"esObligatorio"}/>
                            <BooleanInput label={"Costo extra"} source={"tieneCostoExtra"}/>
                            <FormDataConsumer>
                                {({scopedFormData,getSource}) =>{
                                    if (!scopedFormData) return null;
                                    return scopedFormData.tieneCostoExtra && <NumberInput
                                        label ="Precio de agregado"
                                        source={getSource("precioAgregado")}
                                        validate={validatePrecio}
                                        className={classes.price}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    $
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                }}
                            </FormDataConsumer>

                            <FormDataConsumer>
                                {({ formData, scopedFormData,getSource, ...rest }) => {
                                    if (scopedFormData){
                                        if (scopedFormData.tipo ==='select')
                                            return (
                                                <Fragment>
                                                    <BooleanInput label={"Permitir multiple elección"} source={getSource("permiteMultipleSeleccion")}/>
                                                <ArrayInput source={getSource("values")} label={"Valores seleccionables"}>
                                                    <SimpleFormIterator>
                                                        <TextInput validate={required()} source={"id"} label={"Valor"} />
                                                        <BooleanInput label={"Costo extra"} source={"tieneCostoExtra"}/>
                                                        <FormDataConsumer>
                                                            {({scopedFormData,getSource}) =>{
                                                                if (!scopedFormData) return null;
                                                                return scopedFormData.tieneCostoExtra && <NumberInput
                                                                    label ="Precio de agregado"
                                                                    source={ getSource("precioAgregado")}
                                                                    validate={validatePrecio}
                                                                    className={classes.price}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                $
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                />
                                                            }}
                                                        </FormDataConsumer>
                                                    </SimpleFormIterator>
                                                </ArrayInput>
                                                </Fragment>
                                            )
                                        else return null;
                                    }


                                }}
                            </FormDataConsumer>
                        </SimpleFormIterator>}
                    </ArrayInput>
                </FormTab>

                {esSubproducto? null:
                <FormTab label={"Materias primas"} path={"inventario"}>
                    <ArrayInput source={"inventarios"}>
                        <SimpleFormIterator >
                            {/*<TF name={"cantidad"} label={"Cantidad"} type={"number"}/>*/}
                            <ReferenceInput reference={"inventario"} source={"id"} label={"Materia Prima"} filterToQuery={searchText => filterToQuery(searchText,'nombreMaterial')} >
                                <AutocompleteInput  optionText={"nombreMaterial"} />
                            </ReferenceInput>
                            <FormDataConsumer>

                                {({  scopedFormData,
                                      getSource,
                                      ...rest }) => {

                                    if (scopedFormData) {
                                        return (
                                            <Inventarios scopedFormData={scopedFormData} {...rest}/>

                                        );
                                    }

                                    return null;
                                }}



                            </FormDataConsumer>


                            <NumberInput label={"Cantidad requerida"} source={"cantidad"} validate={esSubproducto?validateCantidadNoreq:validateCantidad} InputProps={{
                                endAdornment: (
                                    <InputAdornment  position="end">
                                        {''}
                                    </InputAdornment >
                                ),
                            }} />

                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>}

                <FormDataConsumer>
                    {({ formData}) => {
                        if (formData){
                            setEsSubproducto(formData.esSubproducto);

                        }

                    }
                    }
                </FormDataConsumer>



                {esSubproducto?
                    null
                    :
                    <FormTab label={"Subproductos"} path={"subproductos"}>

                        <ArrayInput source={"subProductos"} >
                            <SimpleFormIterator>
                                <ReferenceInput reference={"productos"} source={"id"} label={"Producto"} filterToQuery={searchText => filterToQuery(searchText,'nombre')} >
                                    <AutocompleteInput optionText={"nombre"} validate={required()}/>
                                </ReferenceInput>
                                <NumberInput label={"Cantidad"} source={"cantidad"} validate={validateCantidad} />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </FormTab>

                }


            </TabbedForm>
        </Edit>
    );
};

export default ProductEdit;
