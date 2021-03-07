import React, {Fragment, useState} from "react";
import {ArrayInput,SimpleFormIterator,SelectInput, NumberInput} from 'react-admin';
import _ from 'lodash';
import {useForm} from "react-final-form";

const LIMITE_PROMO = 10;
const PromoDelivery = props =>{
    const [disableAddPromoDelivery,setDisableAddPromoDelivery] = useState(false);

    const validatePromoDelivery = values =>{
        console.log(values);
            const cantidadTotal = _.sumBy(values,'cantidad');
            if (cantidadTotal >LIMITE_PROMO){
                setDisableAddPromoDelivery(true);
                return 'Sobrepasaste la cantidad limite';

            }
            if (!values) return;
            for (const obj of values){
                if (!obj) return;
                if (obj.sabor !== 'manjar' && obj.cantidad > 4){
                    return 'Sobrepasaste la cantidad limite de '+ obj.sabor;
                }
            }


            setDisableAddPromoDelivery(false);
    }



    return (<Fragment>
        <ArrayInput source={"alfajores"} validate={validatePromoDelivery}>
            <SimpleFormIterator disableAdd={disableAddPromoDelivery}>
                <SelectInput label={"Sabor"} source={"sabor"} choices={[
                    {id:'manjar',name:'Manjar'},
                    {id:'frutilla',name: 'Frutilla'},
                    {id: 'nuez',name: 'Nuez'},
                    {id:'mango',name: 'Mango'},
                    {id:'maracuya',name: 'Maracuyá'},
                    {id:'naranja',name: 'Naranja'},
                    {id:'frambuesa',name: 'Frambuesa'}
                ]}/>

                <NumberInput source={"cantidad"} label={"Cantidad"}/>

            </SimpleFormIterator>
        </ArrayInput>
    </Fragment>);
}

export default PromoDelivery;