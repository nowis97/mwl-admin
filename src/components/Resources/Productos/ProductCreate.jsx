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
    useQuery,
    useQueryWithStore


} from 'react-admin';
import { InputAdornment ,TextField as TFUI} from '@material-ui/core';
import {Autocomplete as AC} from 'mui-rff';

import { makeStyles } from '@material-ui/core/styles';


import {validatePrecio, validateCantidad, validateCantidadNoreq} from "../Inventario/CreateInventario";
import {Fragment, useEffect, useState} from "react";
import {filterToQuery} from "../../helpers/filterstoqueries";
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';


export const styles = {
    price: { width: '14em' },
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
            <TFUI defaultValue={data?data.marca:''} InputProps={{readOnly:true}} label={"Marca"} id={rest.formData.inventario.length}
           style={{marginBottom:'18px'}} />
            <br/>
            <TFUI defaultValue={data?data.unidadMedida:''} InputProps={{readOnly:true}} label={"Unidad de medida"} id={rest.formData.inventario.length}
                   style={{marginBottom:'18px'}} />


        </Fragment>;
    }
    return null;
}

const SubCategoriasAutoComplete = props =>{
    const categorias = useSelector(selectCategorias);


    const subcategorias = categorias[props.categoria]?categorias[props.categoria].subcategorias:[];

    const { loaded, error, data } = useQueryWithStore({
        type: 'getMany',
        resource: 'subcategorias',
        payload: { ids: subcategorias  }
    });

    if (!loaded && !data)
        return null

    return <AutocompleteInput source={"subCategoria"} label={"Subcategoria"} optionText={"nombre"} choices={data} validate={required()}/>
}





const useStyles = makeStyles(styles);

const selectCategorias = createSelector(
    state => state.admin,
    admin =>{
        if (admin && admin.resources) return admin.resources.categorias.data;
        return admin
    }

    );

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

                    <NumberInput
                        label ="Precio de venta"
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
                                        <NumberInput
                                        label = "Stock"
                                        source="stock"
                                        validate={validateCantidadNoreq}
                                        className={classes.stock}
                                    />


                                    </Fragment>
                                }

                                return <ReferenceInput reference={"recetario"} source={"receta"} label={"Nombre receta"} filterToQuery={searchText => filterToQuery(searchText,'nombre')}>
                                            <AutocompleteInput optionText={"nombre"} validate={required()} />
                                       </ReferenceInput>
                            }

                        }
                        }
                    </FormDataConsumer>

                    <ReferenceInput reference={"categorias"} source={"categoria"} label={"Categorias"} filterToQuery={searchText => filterToQuery(searchText,'nombre')}>
                        <AutocompleteInput optionText={"nombre"}/>
                    </ReferenceInput>

                    <FormDataConsumer>
                        {({formData,...rest}) =>{


                            if (!formData.categoria) return null

                            return <SubCategoriasAutoComplete categoria ={formData.categoria}/>







                        }}
                    </FormDataConsumer>


                    <ImageInput source="imagenRuta" multiple={false} label="Foto" accept="image/*">
                        <ImageField source="imagenRuta" title="title" />
                    </ImageInput>




                </FormTab>
                <FormTab label="personalizado" path="producto-personalizado">
                    {/*<FormCampos/>*/}
                    <ArrayInput source="campos" label={"Campos"} >
                        <SimpleFormIterator>
                            <TextInput source="nombre" label={"Nombre del campo"} validate={required('Campo requerido')} />
                            <SelectInput source="tipo" label={"Tipo de campo"} validate={required('Campo requerido')} choices={[
                                { id: 'text', name: 'Texto' },
                                { id: 'number', name: 'Numero' },
                                { id: 'select', name: 'Selección Multiple' }
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
                                                        <TextInput source={"id"} label={"Valor"} />
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

                                                    </SimpleFormIterator>
                                                </ArrayInput>
                                                </Fragment>
                                            )
                                        else return null;
                                    }


                                }}
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>

                {esSubproducto? null:
                <FormTab label={"Materias primas"} path={"inventario"}>
                    <ArrayInput source={"inventario"}>
                        <SimpleFormIterator >
                            {/*<TF name={"cantidad"} label={"Cantidad"} type={"number"}/>*/}
                             <ReferenceInput reference={"inventario"} source={"id"} label={"Materia Prima"} >
                                <AutocompleteInput  optionText={"nombreMaterial"} validate={required()} />
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
                </FormTab>
                }

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

                        <ArrayInput source={"subProductos"} validate={required()} >
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
