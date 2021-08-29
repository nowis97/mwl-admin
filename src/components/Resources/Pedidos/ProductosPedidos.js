import React, {Fragment, useEffect} from "react";
import {
    ArrayField, SimpleShowLayout, Datagrid, ReferenceField, TextField, NumberField,
    SingleFieldList,useQueryWithStore
} from 'react-admin';
import {capitalize,startCase} from 'lodash'
import SimpleChipField from "../../helpers/SimpleChipField";
import {useSelector} from 'react-redux'
import {createSelector} from "reselect";

const isCamelCase = name => !name.match(/[\s_-]/g);
export const dotNotationToWord = dotNotation =>{
    return capitalize(dotNotation.replace('.',' '))
}

export const isDotNotation = dotNotation => dotNotation.includes('.');

const selectorProductos = createSelector(state => state.admin,
    admin => admin.resources.productos.data
    )

export const ProductoPedido = props =>{



    const productos = useSelector(selectorProductos);

    const subProductos = productos[props.record.idProducto].subProductos || [];

    Object.assign(props.record,{subProductos})


    const setComponents = (record,previousKey = undefined) =>{
        const recordCopied = JSON.parse(JSON.stringify(record));
        if (!recordCopied) return null;

        if (recordCopied.idProducto )
            delete recordCopied.idProducto;


        const campos = Object.keys(recordCopied);


        return campos.map((value, index) => {
            const tipo = typeof recordCopied[value];
            let label = '';





            if (previousKey){
                value = previousKey + '.' + value;
            }
            if (isDotNotation(value)){
                label = dotNotationToWord(value)
            }else {
                label = startCase(value);
            }


            switch (tipo) {
                case "string":
                    return  <TextField source={value} label={ label}/>
                case "number":
                    return <NumberField source={value} label={label} />
                case "object":{
                    if (Array.isArray(recordCopied[value]) && typeof recordCopied[value][0] === 'string') {


                        return <ArrayField source={value} label={label}>
                            <SingleFieldList linkType={false}>
                                <SimpleChipField/>
                            </SingleFieldList>
                        </ArrayField>



                    }else if ((Array.isArray(recordCopied[value]) && (typeof recordCopied[value][0] === 'object'))){
                        const arrayOfObjects = recordCopied[value];
                        const keysAllArray = arrayOfObjects.map( value => Object.keys(value));
                        const allKeysInArrayObject = keysAllArray.flat();
                        const uniqueKeysInArrayObject = [...new Set(allKeysInArrayObject)]

                        return <ArrayField source={value} sortable={false} key={index}>
                            <Datagrid>
                                {uniqueKeysInArrayObject.map((val,index) =>{
                                    const foundValue = arrayOfObjects.find(obj => obj[val])[val];
                                    if (val === 'id'){
                                        return <ReferenceField reference={"productos"} source={val} label={"Nombre"} key={index} >
                                                    <TextField source={"nombre"}/>
                                               </ReferenceField>
                                    }
                                    return setComponents({[val]:foundValue});

                                })}

                            </Datagrid>
                        </ArrayField>





                    }else{
                        return setComponents(recordCopied[value],value)
                    }

                }



            }
        })



    }

    return (<>
            <SimpleShowLayout {...props} >
                {setComponents({...props.record,subProductos})}
            </SimpleShowLayout>
        </>
    )
}

export const ProductosPedidos = props =>{
    debugger;
    return (
        <ArrayField source={"productosPedidos"} {...props} >
            <Datagrid rowClick={"expand"} expand={<ProductoPedido/>}>
                <ReferenceField source="idProducto" label={"Producto"} reference="productos">
                    <TextField source="nombre" />
                </ReferenceField>
                <ReferenceField source="idProducto" label={"Precio"} reference="productos">
                    <TextField source="precio" />
                </ReferenceField>
            </Datagrid>

        </ArrayField>
    )
}
