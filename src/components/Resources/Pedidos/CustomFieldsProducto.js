import React, {Fragment} from "react";
import {SelectInput,TextInput,required,NumberInput,SelectArrayInput} from 'react-admin';
import _ from 'lodash';


const createUI = (fields,getSource) =>{
   return fields.map((value,index) => {
        switch (value.tipo) {
            case 'select':

                if (value.permitirMultipleSeleccion){
                    return (
                        <div key={index}>
                            <SelectArrayInput label={_.capitalize(value.nombre)} source={getSource(value.nombre.toLowerCase())} optionText={"id"} choices={value.values} validate={value.esRequerido? required():null}  />
                        </div>
                    );
                }
                return (
                    <div key={index}>
                        <SelectInput label={_.capitalize(value.nombre)} source={ getSource(value.nombre.toLowerCase())} optionText={"id"} choices={value.values} validate={value.esRequerido? required():null } />
                    </div>);
            case 'text':
                return (<div key={index}>
                    <TextInput label={_.capitalize(value.nombre)} source={getSource(value.nombre.toLowerCase())} validate={value.esRequerido? required():null}/>
                </div>)
            case 'number':
                return ( <div key={index}> <NumberInput validate={value.esRequerido? required():null} label={_.capitalize(value.nombre)} source={getSource(value.nombre.toLowerCase())} />
                </div>)

        }
    })}

const CustomFieldsProducto = props =>{

    const {getSource} = props;
    const {fields} = props;
    return (<Fragment>
        {createUI(fields,getSource)}
    </Fragment>)
}
export default CustomFieldsProducto