import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    ReferenceInput,
    required,
    NumberInput,
    SelectInput,
    minLength,
    maxLength,
    number,
    minValue,
    maxValue,
    FormDataConsumer
}
    from 'react-admin';

import {TextField,InputAdornment} from "@material-ui/core";

export const validateBase = [required("Campo obligatorio"),]
export const validatePrecio = [required("Campo obligatorio"), minValue(0,"Precio debe ser positivo"),maxValue(1000000,"No puede superar los 10000000"),
    number("Debe ser un numero") ];

export const validateCantidad = [required("Campo obligatorio"),minValue(0,"Debe se mayor a uno"),
    maxValue(1000,"No puede superar los 1000"),number("Debe ser un numero")]

export const validateCantidadNoreq = [minValue(0,"Debe se mayor a uno"),
    maxValue(1000,"No puede superar los 1000"),number("Debe ser un numero")];

export const validataUnidadMedida = [required("Campo obligatorio"),minLength(0,"Debe tener al menos un caracter"),
    maxLength(3,"No puede exceder los tres caracteres")]


const CreateInventario = props =>{
   return(
       <Create title={"Crear materia prima"} {...props}>
            <SimpleForm redirect={"list"}>
                <TextInput label={"Nombre del material"} source={"nombreMaterial"} validate={validateBase} />
                <ReferenceInput reference={"categorias-inventario"} label={"Categoria"} source={"categoria"}>
                    <SelectInput optionText={"nombre"}/>
                </ReferenceInput>
                <TextInput  label={"Marca"} source={"marca"} />
                <NumberInput label={"Precio"} source={"precio"} validate={validatePrecio} InputProps={{startAdornment:<InputAdornment position={"start"}>$</InputAdornment>}}/>
                <NumberInput label={"Cantidad"} source={"cantidad"} validate={validateCantidad}/>
                <TextInput label={"Unidad de Medida"} source={"unidadMedida"} validate={validataUnidadMedida}/>
                <FormDataConsumer>
                    {({
                          formData, // The whole form data
                          ...rest
                      }) => {
                        return <CostoUnitario formData={formData}/>
                    }

                    }
                </FormDataConsumer>
            </SimpleForm>
        </Create>
   )
}

const CostoUnitario = ({formData}) =>{
    console.log(formData);
    return (<TextField label={"Costo unitario"}
                       InputProps={{
                           endAdornment: <InputAdornment position="start">{'$/' +(formData?formData.unidadMedida:'') }</InputAdornment>,
                           readOnly:true
                       }}
                       value={parseFloat(Math.round((formData.precio/formData.cantidad) * 100) / 100).toFixed(2)}
                       />);
}

export {CreateInventario,CostoUnitario};