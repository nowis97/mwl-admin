import * as React from 'react';
import {
    Create,
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
    useDataProvider,
    AutocompleteInput,
    ReferenceInput,
    ReferenceField,
    useInput,
    useQuery,
    TextField

} from 'react-admin';
import { InputAdornment ,MenuItem,TextField as TFUI} from '@material-ui/core';
import {Autocomplete as AC, TextField as TF} from 'mui-rff';

import { makeStyles } from '@material-ui/core/styles';
import {Field, useField,useForm} from 'react-final-form';
import RichTextInput from 'ra-input-rich-text';

import {validatePrecio, validateCantidad, validateCantidadNoreq} from "../Inventario/CreateInventario";
import {Fragment, useEffect, useState} from "react";


export const styles = {
    price: { width: '7em' },
    width: { width: '7em' },
    height: { width: '7em' },
    stock: { width: '7em' },
    widthFormGroup: { display: 'inline-block' },
    heightFormGroup: { display: 'inline-block', marginLeft: 32 },
};

export const AutoCompleteDynamic = ({resSrc,_label,_required,_name,_fullLarge,className}) =>{
   const [choices,setChoices] = useState([]);
    const dataProvider = useDataProvider();
    useEffect(() =>{
        dataProvider.getAll(resSrc).then((res) => {
            return setChoices(res.data);
        });
    },[]);



    return (
        <AC
            className={className}
            name={_name}
            options={choices}
            label={_label}
            getOptionValue={ option => option.id}
            getOptionLabel={ option =>option.nombre}
            required={_required}
            fullWidth={_fullLarge || false}
            style={{marginBottom:'20px'}}


       />

    );

}

export const Inventarios = ({scopedFormData,...rest}) => {
    const { data, loading, error } = useQuery({
        type: 'getOne',
        resource: 'inventario',
        payload: { id: scopedFormData.id }
    });

    if (!loading){
        return <Fragment key={rest.formData.inventario.length}>
            <TFUI defaultValue={data.json.marca} InputProps={{readOnly:true}} label={"Marca"} id={rest.formData.inventario.length}
           style={{marginBottom:'18px'}} />
            <br/>
            <TFUI defaultValue={data.json.unidadMedida} InputProps={{readOnly:true}} label={"Unidad de medida"} id={rest.formData.inventario.length}
                   style={{marginBottom:'18px'}} />


        </Fragment>;
    }
    return null;
}



const useStyles = makeStyles(styles);

const ProductCreate = props => {
    const classes = useStyles();
    const [esSubproducto,setEsSubproducto] = useState(false);


    return (
        <Create {...props}>
            <TabbedForm redirect={"list"}>
                <FormTab label="Crear Producto">
                    <TextInput
                        autoFocus
                        source="nombre"
                        label={"Nombre"}
                        validate={required()}
                    />

                    <BooleanInput label={"Subproducto"} source={"esSubproducto"}/>

                    <TextInput multiline source="descripcion" label="Descripción" />

                    <FormDataConsumer>
                        {({ formData, ...rest }) => {
                            console.log(formData,'subproduct' );
                            if (formData){
                                if (!formData.esSubproducto){
                                    return <Fragment>
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
                                    <br/>
                                    <NumberInput
                                        label = "Stock"
                                        source="stock"
                                        validate={validateCantidadNoreq}
                                        className={classes.stock}
                                    />


                                    </Fragment>
                                }

                                return <ReferenceInput reference={"recetario"} source={"receta"} label={"Nombre receta"} >
                                            <AutocompleteInput optionText={"nombre"} validate={required()} />
                                       </ReferenceInput>
                            }

                        }
                        }
                    </FormDataConsumer>

                    <ReferenceInput reference={"categorias"} source={"categoria"} label={"Categorias"}>
                        <AutocompleteInput  optionText={"nombre"} />
                    </ReferenceInput>
                    <ReferenceInput reference={"subcategorias"} source={"subCategoria"} label={"Subcategorias"} >
                        <AutocompleteInput  optionText={"nombre"} />
                    </ReferenceInput>
                    {/*
                        <AutoCompleteDynamic _fullLarge={false} _required={true} resSrc={"categorias"}
                                             _label={"Categoria"} _name={"categoria"}/>
                        <AutoCompleteDynamic _fullLarge={false} _required={true} resSrc={"subcategorias"} _label={"Subcategoria"} _name={"subcategoria"}/>
                    */}


                    <ImageInput source="imagenRuta" multiple={false} label="Foto" accept="image/*">
                        <ImageField source="imagenRuta" title="title" />
                    </ImageInput>

                </FormTab>
                <FormTab label="personalizado" path="producto-personalizado">
                    {/*<FormCampos/>*/}
                    <ArrayInput source="campos" label={"Campos"}>
                        <SimpleFormIterator>
                            <TextInput source="nombre" label={"Nombre del campo"} />
                            <SelectInput source="tipo" label={"Tipo de campo"} choices={[
                                { id: 'text', name: 'Texto' },
                                { id: 'number', name: 'Numero' },
                                { id: 'select', name: 'Selección Multiple' },
                            ]} />

                            <BooleanInput label={"Requerido"} source={"esRequerido"}/>



                            <FormDataConsumer>
                                {({ formData, scopedFormData,getSource, ...rest }) => {

                                    if (scopedFormData){
                                        if (scopedFormData.tipo ==='select')
                                            return (
                                                <ArrayInput source={getSource("values")} label={"Valores seleccionables"}>
                                                    <SimpleFormIterator>
                                                        <TextInput source={"nombre"} label={"Valor"} />
                                                    </SimpleFormIterator>
                                                </ArrayInput>
                                            )
                                        else return null;
                                    }


                                }}
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>

                <FormTab label={"Materias primas"} path={"inventario"}>
                    <ArrayInput source={"inventario"}>
                        <SimpleFormIterator >
                            {/*<TF name={"cantidad"} label={"Cantidad"} type={"number"}/>*/}
                             <ReferenceInput reference={"inventario"} source={"id"} label={"Materia Prima"} >
                                <AutocompleteInput  optionText={"nombreMaterial"} />
                            </ReferenceInput>
                            <FormDataConsumer>

                                {({  scopedFormData,
                                      getSource,
                                      ...rest }) => {
                                    console.log(scopedFormData);

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
                            {/*intentar que el form consumer con reference manyfields*/}

                            {/*<AutoCompleteDynamic _label={"Materia"} _name={"id"} _required={true} resSrc={"inventario"}/>*/}

                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>

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

                        <ArrayInput source={"subproductos"}>
                            <SimpleFormIterator>
                                <ReferenceInput reference={"productos"} source={"id"} label={"Producto"} filter={{esSubproducto:true}} >
                                    <AutocompleteInput optionText={"nombre"}/>
                                </ReferenceInput>
                                <NumberInput label={"Cantidad"} source={"cantidad"} />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </FormTab>

                }


            </TabbedForm>
        </Create>
    );
};

export default ProductCreate;
