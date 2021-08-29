import React, {Fragment, useState} from "react";
import {ArrayInput, SimpleFormIterator, SelectInput,NumberInput,SelectArrayInput} from 'react-admin';
import {useStyles} from "./Personalizado";
import _ from 'lodash';

const CANTIDAD_LIMITE =7;

const mensajesDefault = [
    {id:'te_amo',name:'Te Amo'},
    {id:'te_adoro',name: 'Te Adoro'},
    {id:'te_extraño', name: 'Te Extraño'},
    {id:'te_quiero',name: 'Te Quiero'},
    {id: 'love',name: 'Love'},
    {id:'feliz_cumpleaños',name:'Feliz Cumpleaños' },
    {id:'eres_lo_mejor',name: 'Eres lo mejor' },
    {id:'exito',name: 'Éxito'},
    {id:'me_gustas',name: 'Me gustas'}
];

const dibujosDefault = [
    {id:'corazon',name:'Corazón'},
    {id:'estrella',name: 'Estrella'},
    {id:'chanchito',name: 'Chanchito'},
    {id:'flor',name: 'Flor'},
    {id:'emojis',name: 'Emojis'}
];

const cajaDefault = [
    {id:'dorada',name:'Dorada'},
    {id:'plateada',name: 'Plateada'},
    {id:'roja',name: 'Roja'},
    {id:'puntos',name: 'Puntos'},
    {id:'love',name: 'Love'},
    {id:'corazones',name: 'Corazones'},
    {id:'hb_azul',name: 'HB Azul'},
    {id:'hb_rosado',name: 'HB Rosado'},
    {id:'hb_cafe',name: 'HB Café'},
    {id:'flores_rosadas',name: 'Flores rosadas'},
    {id:'flores_moradas',name: 'Flores moradas'}
];

const CajaSorprende = props =>{

    const {campos} =  props;

    const {getSource} = props;

    const mensajes = _.find(campos,{nombre:'mensajes'});

    const dibujos = _.find(campos,{nombre:'dibujos'});

    const caja = _.find(campos,{nombre:'caja'});

    const [cantidadTotal,setCantidadTotal] = useState(0);

    const classes = useStyles();


    const validateMensajes = values =>{
        if (!values) return ;

        setCantidadTotal(prevState => prevState + 1)
        if (cantidadTotal > CANTIDAD_LIMITE)
            return ['Ha superado la cantidad maxima'];

    }

    const validateDibujos = values =>{
        if (!values) return;

        setCantidadTotal(prevState => prevState + 1)
        if (cantidadTotal > CANTIDAD_LIMITE)
            return ['Ha superado la cantidad maxima'];

    }
    return (
        <Fragment>
            <SelectArrayInput label={"Mensajes"} className={classes.selectArrayInput} optionText={mensajes?'id':'name'} validate={validateMensajes}  source={getSource("mensajes")} choices={mensajes? mensajes.values:mensajesDefault}/>
            <br/>
            <SelectArrayInput source={getSource("dibujos")} className={classes.selectArrayInput} optionText={mensajes?'id':'name'} validate={validateDibujos} label={"Dibujos"} choices={dibujos? dibujos.values:dibujosDefault}/>
            <br/>
            <SelectInput label={"Color de caja"} optionText={mensajes?'id':'name'} source={getSource("caja")} choices={caja? caja.values:cajaDefault}/>
        </Fragment>
    );
}

export default CajaSorprende;