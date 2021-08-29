import * as React from "react";
import {
    Edit,
    TextInput,
    required,
    TabbedForm,
    FormTab,
    ArrayInput,
    SimpleFormIterator,
    ReferenceInput,
    AutocompleteInput,
    FormDataConsumer,
    useQuery, NumberInput,


}
    from 'react-admin';

import RichTextInput from 'ra-input-rich-text';
import {Inventarios} from "../Productos/ProductCreate";
import {Fragment} from "react";
import {TextField as TFUI} from "@material-ui/core";
import {validateCantidad} from "../Inventario/CreateInventario";
import {filterToQuery} from "../../helpers/filterstoqueries";


const EditRecetario = props =>{
    return (
        <Edit title={"Editar receta"} {...props} >
            <TabbedForm redirect={"list"}>
                <FormTab label={"Receta"}>
                    <TextInput label ={"Nombre de la receta"} source={"nombre"} validate ={required("Campo requerido")} />
                    <ArrayInput source={"inventario"}>
                        <SimpleFormIterator>
                            <ReferenceInput reference={"inventario"} perPage={700} source={"id"} label={"Materia Prima"} filterToQuery={searchText => filterToQuery(searchText,"nombreMaterial")} >
                                <AutocompleteInput  optionText={"nombreMaterial"} />
                            </ReferenceInput>
                            <NumberInput source={"cantidad"} label={"Cantidad requerida"} validate={validateCantidad}/>
                            <FormDataConsumer>

                                {({  scopedFormData,
                                      ...rest }) => {

                                    if (scopedFormData) {
                                        return (
                                            <Inventarios scopedFormData={scopedFormData} {...rest}/>
                                        );
                                    }

                                    return null;
                                }}
                            </FormDataConsumer>

                        </SimpleFormIterator>
                    </ArrayInput>
                </FormTab>
                <FormTab label={"Detalles"}>
                    <RichTextInput label={"Receta"} source={"detalles"}/>
                </FormTab>
            </TabbedForm>

        </Edit>
    );
}
export const InventariosEdit = ({scopedFormData,...rest}) => {
    const { data, loading } = useQuery({
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

export default EditRecetario;


