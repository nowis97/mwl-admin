import * as React from "react";
import {
    Create,
    SimpleForm,
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


const CreateRecetario = props =>{
    return (
        <Create title={"Crear Recetas"} {...props} >
            <TabbedForm redirect={"list"}>
                <FormTab label={"Receta"}>
                    <TextInput label ={"Nombre de la receta"} source={"nombre"} validate ={required("Campo requerido")} />
                    <ArrayInput source={"inventario"}>
                        <SimpleFormIterator>
                            <ReferenceInput reference={"inventario"} source={"id"} filter={{categoria:'5f211802ce2bc83f7c994bee'}} label={"Materia Prima"} >
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