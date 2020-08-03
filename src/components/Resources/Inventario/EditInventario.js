import {Edit, FormDataConsumer, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextInput} from "react-admin";
import * as React from "react";
import {validataUnidadMedida, validateBase, validateCantidad, validatePrecio} from "./CreateInventario";
import {CostoUnitario} from './CreateInventario';
import {InputAdornment} from "@material-ui/core";
const CreateInventario = props =>{
    return(
        <Edit title={"Editar materia prima"} {...props}>
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
        </Edit>
    )
}

export default CreateInventario;