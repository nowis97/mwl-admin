import * as React from "react";
import {
    Create,
    TextInput,
    required,
    TabbedForm,
    FormTab,
    ArrayInput,
    SimpleFormIterator, AutocompleteInput, ReferenceInput, FormDataConsumer,
    NumberInput


}
    from 'react-admin';

import RichTextInput from 'ra-input-rich-text';
import {Inventarios} from "../Productos/ProductCreate";
import {validateCantidad} from "../Inventario/CreateInventario";
import {filterToQuery} from "../../helpers/filterstoqueries";



const CreateRecetario = props =>{
    return (
        <Create title={"Crear Recetas"} {...props} >
            <TabbedForm redirect={"list"}>
                <FormTab label={"Receta"}>
                    <TextInput label ={"Nombre de la receta"} source={"nombre"} validate ={required("Campo requerido")} />
                    <ArrayInput source={"inventario"} validate={required("Inventario requerido")}>
                        <SimpleFormIterator>
                            <ReferenceInput reference={"inventario"} perPage={700} source={"id"} label={"Materia Prima"} filterToQuery={searchText => filterToQuery(searchText,'nombreMaterial')} >
                                <AutocompleteInput optionText={"nombreMaterial"} />
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

        </Create>
    );
}

export default CreateRecetario;