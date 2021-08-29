import React, {Fragment, useState} from "react";
import {
    RadioButtonGroupInput, SelectInput, SelectArrayInput, TextInput,
    FormDataConsumer, ArrayInput, SimpleFormIterator, BooleanInput, NumberInput, required
} from 'react-admin';
import {choicesColores} from './Personalizado';
import {useForm} from "react-final-form";
import _ from 'lodash';
import {makeStyles} from "@material-ui/styles";
import './Personalizado.css'

const useStyles = makeStyles({
    selectArrayInput:{
        minWidth:'180px'
    },

    selectInput:{
        minWidth:'170px'
    }
})

const validateBrillos = values =>{
    if (!values) return ;
    if (values.length >2){
        return 'Debe tener maximo dos brillos';
    }

}

const validateColores = values =>{
    if (!values) return;

    if (values.length >3){
        return 'Debe haber tres colores o menos';
    }
}




const Celebracion = props =>{
    const [disableAddExtras,setDisableAddExtras] = useState(false);
    const form = useForm();
    const classes = useStyles();
    const {getSource} = props;

    const validateExtras = values =>{

        const cantidadExtrasAlfajores = _.sumBy(values,'cantidadExtra');
        const cantidadTotalAljafores = form.getFieldState('cantidad')? form.getFieldState('cantidad').value :0


        if (cantidadExtrasAlfajores >cantidadTotalAljafores){
            setDisableAddExtras(true);
            return 'No puede agregar mas extras a alfajores';
        }
        setDisableAddExtras(false);


    }


    return (
        <Fragment>
            <RadioButtonGroupInput source={getSource("formato")} label={"Formato"} choices={[
                {id:'individuales',name:'Individuales'},
                {id:'bandejas',name: 'Bandejas'}
            ]} validate={required()}/>
            <br/>

            <SelectInput choices={[
                {id:25,name:'25 unidades'},
                {id:50,name:'50 unidades'},
                {id:100,name: '100 unidades'}
            ]}
            source={getSource("cantidad")} label={"Cantidad de alfajores"} className={classes.selectInput} validate={required()}/>
            <br/>

            <SelectInput source={getSource("tamano")} choices={[
                {id:'alfajor_tradicional',name:'Alfajor tradicional (6cm)'},
                {id:'baby_alfajor',name: 'Alfajor baby (4cm)'}
            ]}
                         label={"Tamaño de alfajor"} validate={required()} />
            <br/>

            <SelectInput label={"Tematica"} source={getSource("tematica")} validate={required()} className={classes.selectInput} choices={[
                {id:'cumpleanos',name:'Cumpleaños'},
                {id:'baby_shower',name: 'Baby shower'},
                {id:'bautizo',name: 'Bautizo'},
                {id:'graduaciones',name:'Graduaciones'},
                {id:'otro',name: 'Otro'}
            ]}/>
            <br/>
            <FormDataConsumer>
                {() =>{
                    const fieldTematica = form.getFieldState(getSource('tematica'));

                    if (!fieldTematica) return null

                    return fieldTematica.value ==='otro' && <TextInput source={getSource("otraTematica")} label={"Escriba la tematica"}/>
                }}
            </FormDataConsumer>
            <br/>
            {/*<SelectArrayInput label={"Colores de preferencia"} className={classes.selectArrayInput} choices={choicesColores} source={getSource("colores")} validate={validateColores}/>*/}

            <TextInput source={getSource("mensajes")} label={"Mensajes"}/>


            <ArrayInput label={"Extras"} source={getSource("extras")} className={'arrayInputInside'} validate={validateExtras} >
                <SimpleFormIterator disableAdd={disableAddExtras}>
                    <NumberInput source={"cantidadExtras"} label={"Cantidad"}/>

                    <SelectInput source={"sabor"} label={"Sabor"} choices={[
                        {id:'manjar',name:'Manjar'},
                        {id:'frutilla',name: 'Frutilla'},
                        {id:'nuez',name:'Nuez'},
                        {id:'mango',name: 'Mango'},
                        {id:'maracuya',name: 'Maracuyá'},
                        {id:'naranja',name: 'Naranja'},
                        {id:'frambuesa',name: 'Frambuesa'}
                    ]} />

                    <RadioButtonGroupInput choices={[
                        {id:'cafe',name:'Cafe'},
                        {id: 'color',name: 'Color'},
                        {id:'marmol',name:'Marmol'},
                        {id:'tornasol',name: 'Tornasol'},
                    ]} validate={required()} source={"tipoCobertura"} label={"Tipo de cobertura"}/>

                    <FormDataConsumer>
                        {
                            ({formData,scopedFormData,getSource,...rest}) =>{
                               if (!scopedFormData) return null;

                               switch (scopedFormData.tipoCobertura) {
                                   case 'color':
                                       return <SelectInput source={getSource("color")} label={"Colores"} choices={choicesColores}/>
                                   case 'tornasol':
                                       return <Fragment>
                                           <SelectInput source={getSource("tornasol.colorBase")} choices={choicesColores} label={"Color de base"}/>
                                           <br/>
                                           <SelectInput source={getSource("tornasol.color1")} label={"Color Tornasol 1"} choices={[
                                               {id: 'rojo',name: 'Rojo'},
                                               {id:'rosado',name: 'Rosado'},
                                               {id: 'verde',name: 'Verde'},
                                               {id:'celeste',name: 'Celeste'},
                                               {id:'azul',name: 'Azul'},
                                               {id: 'amarillo',name: 'Amarillo'},
                                               {id:'naranjo',name: 'Naranjo'},
                                               {id:'morado',name: 'Morado'},
                                               {id: 'negro',name: 'Negro'}
                                           ]}/>
                                           <br/>
                                           <SelectInput label={"Color Tornasol 2"} source={getSource("tornasol.color2")} choices={[
                                               {id: 'rojo',name: 'Rojo'},
                                               {id:'rosado',name: 'Rosado'},
                                               {id: 'verde',name: 'Verde'},
                                               {id:'celeste',name: 'Celeste'},
                                               {id:'azul',name: 'Azul'},
                                               {id: 'amarillo',name: 'Amarillo'},
                                               {id:'naranjo',name: 'Naranjo'},
                                               {id:'morado',name: 'Morado'},
                                               {id: 'negro',name: 'Negro'},
                                               {id:'gris',name: 'Gris'}
                                           ]}/>

                                       </Fragment>
                                   case 'marmol':
                                       return <Fragment>
                                           <SelectInput label={"Color de base"} choices={choicesColores} source ={getSource("marmol.colorBase")}/>
                                           <br/>
                                           <SelectInput label={"Color de Marmol"} source={getSource("marmol.colorMarmol")} choices={[
                                               {id:'rojo',name:'Rojo'},
                                               {id:'morado',name: 'Morado'},
                                               {id:'negro',name: 'Negro'},
                                               {id:'amarillo',name:'Amarillo'},
                                               {id:'verde',name: 'Verde'},
                                               {id:'azul', name: 'Azul'},
                                               {id: 'naranjo',name: 'Naranjo'},

                                           ]} />
                                       </Fragment>



                               }
                            }
                        }
                    </FormDataConsumer>

                    <SelectArrayInput className={classes.selectArrayInput} validate={validateBrillos} label={"Brillos"} source={("brillos")} choices={[
                        {id:'dorado',name:'Dorado'},
                        {id:'plateado',name: 'Plateado'},
                        {id:'rojo',name: 'Rojo'},
                        {id: 'rosado',name: 'Rosado'},
                        {id: 'verde',name: 'Verde'},
                        {id: 'celeste',name: 'Celeste'},
                        {id: 'amarillo',name: 'Amarillo'},
                        {id: 'naranjo',name: 'Naranjo'},
                        {id:'morado',name: 'Morado'}
                    ]} />




                </SimpleFormIterator>

            </ArrayInput>



        </Fragment>
    );
}

export default Celebracion;