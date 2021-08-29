import React from "react";
import {Create,ReferenceInput,AutocompleteInput,NumberInput,SimpleForm} from 'react-admin';

const CreateProduccion = props =>{
    return (<Create {...props}  >
        <SimpleForm redirect={"list"}>
            <ReferenceInput reference={"productos"} label={"Subproductos"} source={"productoId"} filter={{esSubproducto:true}}>
                <AutocompleteInput optionText={"nombre"}  />
            </ReferenceInput>
            <NumberInput source={"cantidadProducir"} label={"Cantidad para producir"}/>
        </SimpleForm>
    </Create>
    );
}

export default CreateProduccion;