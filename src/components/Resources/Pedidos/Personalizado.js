import React, {Fragment, useState} from "react";
import {
    SelectInput,
    SimpleForm,
    FormDataConsumer,
    ArrayInput,
    SelectArrayInput,
    SimpleFormIterator,
    NumberInput,
    RadioButtonGroupInput,
    BooleanInput,
    useNotify,
    TextInput,

    ImageInput,
    ImageField, required
} from 'react-admin';
import {TextField} from "@material-ui/core";
import _ from 'lodash';
import {useForm, useField, useFormState} from 'react-final-form';
import {makeStyles} from "@material-ui/styles";
import './Personalizado.css';

export const useStyles = makeStyles({
    selectArrayInput: {
        minWidth: '170px'
    }
})

export const choicesColores = [
    {id: 'blanco', name: 'Blanco'},
    {id: 'rojo', name: 'Rojo'},
    {id: 'rosado', name: 'Rosado'},
    {id: 'verde_claro', name: 'Verde claro'},
    {id: 'verde_oscuro', name: 'Verde oscuro'},
    {id: 'celete', name: 'Celeste'},
    {id: 'azul', name: 'Azul'},
    {id: 'beige', name: 'Beige'},
    {id: 'amarillo', name: 'Amarillo'},
    {id: 'naranjo', name: 'Naranjo'},
    {id: 'morado', name: 'Morado'},
    {id: 'gris', name: 'Gris'},
    {id: 'negro', name: 'Negro'},
    {id: 'turquesa', name: 'Turquesa'},
    {id: 'calipso', name: 'Calipso'}
];

const TextFieldSaborActual = props => {
    debugger;
    const form = useForm()

    const splitFields = props.id.split('.');


    const indexes = splitFields.map(value => value.match(/\d+/, '')[0])

    const indexProductoPedidoActual = indexes[0]

    const indexSaboresActual = indexes[1];

    const formSabores = form.getFieldState(splitFields[0] + '.sabores')

    const saboresArray = formSabores ? formSabores.value : [];

    const saborActual = saboresArray[indexSaboresActual];

    const saborActualCopiado = saborActual ? JSON.parse(JSON.stringify(saborActual)) : {sabor: 'no elegido'};


    saborActualCopiado.sabor = _.capitalize(saborActualCopiado.sabor);

    return <TextField style={{marginTop: '10px'}} label={"Sabor actual"} record={saborActualCopiado}
                      defaultValue={saborActualCopiado.sabor}
                      InputProps={{readOnly: true}} variant={"outlined"}/>
}

const Personalizado = props => {
    const {getSource, setPrecioActual, producto} = props;
    const [disableAddSabores, setDisableAddSabores] = useState(false);
    const [disableAddCoberturas, setDisableAddCoberturas] = useState(false);
    const [disableAddBrillo, setDisableAddBrillo] = useState(false);
    const form = useForm();


    const classes = useStyles();


    const validateArrayPersonalizadoSabores = (values) => {
        if (!values) return;
        const tipoCaja = form.getFieldState(getSource('tamanoCaja')) ? form.getFieldState(getSource('tamanoCaja')).value : null

        let cantidadCaja = 0;
        switch (tipoCaja) {
            case 'chica':
                cantidadCaja = 6;
                break;
            case 'mediana':
                cantidadCaja = 9;
                break;
            case 'grande':
                cantidadCaja = 12;
                break;

        }
        if (!cantidadCaja) return;


        const cantidadTotal = _.sumBy(values, 'cantidad');


        if (cantidadTotal > cantidadCaja) {

            setDisableAddSabores(true);
            return 'La cantidad limite es ' + cantidadCaja + ' y tienes ' + cantidadTotal;

        } else if (cantidadTotal < cantidadCaja) {
            setDisableAddSabores(false);
            return 'Debes completar la cantidad restante que es ' + (cantidadCaja - cantidadTotal);
        }

        setDisableAddSabores(true)


        const nameCoberturas = getSource('coberturas');
        if (!nameCoberturas) return;
        const actualIndexProductoPedido = nameCoberturas.match(/\d+/, '')[0]


        const productosPedidos = form.getState().values.productosPedidos;

        const valoresCoberturas = productosPedidos[actualIndexProductoPedido].coberturas;


        if (!values || !valoresCoberturas) return;

        if (values.length !== valoresCoberturas.length) {
            return 'Los formularios de Sabores y Coberturas deben tener el mismo tamaño';
        }

        for (let i = 0, n = values.length; i < n; i++) {
            if (!values[i] || !valoresCoberturas[i]) continue;
            if (values[i].cantidad !== valoresCoberturas[i].cantidad)
                return `Los formularios ${i + 1} Sabor y ${i + 1} Cobertura deben tener la misma cantidad`;
        }


    }

    const validateArrayPersonalizadoCoberturas = (values) => {
        if (!values) return;

        const tipoCaja = form.getFieldState(getSource('tamanoCaja')) ? form.getFieldState(getSource('tamanoCaja')).value : null


        let cantidadCaja = 0;
        switch (tipoCaja) {
            case 'chica':
                cantidadCaja = 6;
                break;
            case 'mediana':
                cantidadCaja = 9;
                break;
            case 'grande':
                cantidadCaja = 12;
                break;

        }
        if (!cantidadCaja) return;


        const cantidadTotal = _.sumBy(values, 'cantidad');

        if (cantidadTotal < cantidadCaja) {

            setDisableAddCoberturas(false);
            return 'Debes completar la cantidad restante que es ' + (cantidadCaja - cantidadTotal);

        } else if (cantidadTotal > cantidadCaja) {
            setDisableAddCoberturas(true);
            return 'La cantidad limite es: ' + cantidadCaja + ' y tienes ' + cantidadTotal;
        }
        setDisableAddCoberturas(true);

        const nameSabores = getSource('sabores');
        if (!nameSabores) return;
        const actualIndexProductoPedido = nameSabores.match(/\d+/, '')[0]


        const productosPedidos = form.getState().values.productosPedidos;

        const valoresSabores = productosPedidos[actualIndexProductoPedido].sabores;

        if (!values || !valoresSabores) return;

        if (values.length !== valoresSabores.length) {
            return 'Los formularios de Sabores y Coberturas deben tener el mismo tamaño';
        }

        for (let i = 0, n = values.length; i < n; i++) {
            if (!values[i] || !valoresSabores[i]) continue;
            if (values[i].cantidad !== valoresSabores[i].cantidad)
                return `Los formularios ${i + 1} Cobertura y ${i + 1} Sabor deben tener la misma cantidad`;
        }


    }


    const validateMensaje = (value) => {
        const tipoCaja = form.getFieldState(getSource('tamanoCaja')) ? form.getFieldState(getSource('tamanoCaja')).value : null;
        let cantidadCajaCaracteres = 0;
        switch (tipoCaja) {
            case 'chica':
                cantidadCajaCaracteres = 30;
                break;
            case 'mediana':
                cantidadCajaCaracteres = 48;
                break;
            case 'grande':
                cantidadCajaCaracteres = 60;
                break;

        }
        if (!cantidadCajaCaracteres || !value) return;

        if (value.length > cantidadCajaCaracteres) {
            return ['Se superó la cantidad maxima de caracteres'];
        }


    }

    const validateBrillos = values => {
        if (!values) return;
        if (values.length > 2) {
            setDisableAddBrillo(true);
            return 'Debe tener maximo dos brillos';
        }
        setDisableAddBrillo(false);

    }


    return (
        <Fragment>
            <SelectInput source={getSource("tamanoCaja")} label={"Tamaño caja"} validate={required()}
                         choices={[
                             {id: 'chica', name: 'Caja chica (6)'},
                             {id: 'mediana', name: 'Caja mediana (9)'},
                             {id: 'grande', name: 'Caja grande (12)'}
                         ]}
            />

            <ArrayInput label={"Sabores"} source={getSource("sabores")} className={'arrayInputInside'}
                        validate={[validateArrayPersonalizadoSabores, required()]}>
                <SimpleFormIterator disableAdd={disableAddSabores}>
                    <SelectInput source={"sabor"} label={"Sabor"} choices={[
                        {id: 'manjar', name: 'Manjar'},
                        {id: 'frutilla', name: 'Frutilla'},
                        {id: 'nuez', name: 'Nuez'},
                        {id: 'mango', name: 'Mango'},
                        {id: 'maracuya', name: 'Maracuyá'},
                        {id: 'naranja', name: 'Naranja'},
                        {id: 'frambuesa', name: 'Frambuesa'}
                    ]}/>
                    <NumberInput source={"cantidad"} label={"Cantidad"}/>


                </SimpleFormIterator>
            </ArrayInput>

            <ArrayInput label={"Coberturas"} source={getSource("coberturas")} className={'arrayInputInside'}
                        validate={[validateArrayPersonalizadoCoberturas, required()]}>
                <SimpleFormIterator disableAdd={disableAddCoberturas}>

                    <TextFieldSaborActual/>

                    <RadioButtonGroupInput choices={[
                        {id: 'cafe', name: 'Cafe'},
                        {id: 'color', name: 'Color'},
                        {id: 'marmol', name: 'Marmol'},
                        {id: 'tornasol', name: 'Tornasol'},
                    ]}
                                           label={"Tipo de cobertura"}
                                           source={"tipoCobertura"} validate={required()}
                    />

                    <FormDataConsumer>
                        {({scopedFormData, getSource, ...rest}) => {
                            if (!scopedFormData) return null;

                            switch (scopedFormData.tipoCobertura) {
                                case 'marmol':
                                    return <Fragment>
                                        <br/>
                                        <SelectInput label={"Color de base"} choices={choicesColores}
                                                     source={getSource("marmol.colorBase")}/>
                                        <br/>
                                        <SelectInput label={"Color de Marmol"} source={getSource("marmol.colorMarmol")}
                                                     choices={[
                                                         {id: 'rojo', name: 'Rojo'},
                                                         {id: 'morado', name: 'Morado'},
                                                         {id: 'negro', name: 'Negro'},
                                                         {id: 'amarillo', name: 'Amarillo'},
                                                         {id: 'verde', name: 'Verde'},
                                                         {id: 'azul', name: 'Azul'},
                                                         {id: 'naranjo', name: 'Naranjo'},

                                                     ]}/>
                                        <br/>
                                        <SelectArrayInput className={classes.selectArrayInput} label={"Brillos"}
                                                          validate={validateBrillos} source={getSource("brillos")}
                                                          choices={[
                                                              {id: 'dorado', name: 'Dorado'},
                                                              {id: 'plateado', name: 'Plateado'},
                                                              {id: 'rojo', name: 'Rojo'},
                                                              {id: 'rosado', name: 'Rosado'},
                                                              {id: 'verde', name: 'Verde'},
                                                              {id: 'celeste', name: 'Celeste'},
                                                              {id: 'amarillo', name: 'Amarillo'},
                                                              {id: 'naranjo', name: 'Naranjo'},
                                                              {id: 'morado', name: 'Morado'}
                                                          ]}/>
                                    </Fragment>

                                case 'color':
                                    return <Fragment>
                                        <SelectInput source={getSource("color")} label={"Color"}
                                                     choices={choicesColores}/>
                                        <br/>
                                        <SelectArrayInput className={classes.selectArrayInput}
                                                          validate={validateBrillos} label={"Brillos"}
                                                          source={getSource("brillos")} choices={[
                                            {id: 'dorado', name: 'Dorado'},
                                            {id: 'plateado', name: 'Plateado'},
                                            {id: 'rojo', name: 'Rojo'},
                                            {id: 'rosado', name: 'Rosado'},
                                            {id: 'verde', name: 'Verde'},
                                            {id: 'celeste', name: 'Celeste'},
                                            {id: 'amarillo', name: 'Amarillo'},
                                            {id: 'naranjo', name: 'Naranjo'},
                                            {id: 'morado', name: 'Morado'}
                                        ]}/>
                                    </Fragment>

                                case 'tornasol':
                                    return <Fragment>

                                        <SelectInput source={getSource("tornasol.colorBase")} choices={choicesColores}
                                                     label={"Color de base"}/>
                                        <br/>
                                        <SelectInput source={getSource("tornasol.color1")} label={"Color Tornasol 1"}
                                                     choices={[
                                                         {id: 'rojo', name: 'Rojo'},
                                                         {id: 'rosado', name: 'Rosado'},
                                                         {id: 'verde', name: 'Verde'},
                                                         {id: 'celeste', name: 'Celeste'},
                                                         {id: 'azul', name: 'Azul'},
                                                         {id: 'amarillo', name: 'Amarillo'},
                                                         {id: 'naranjo', name: 'Naranjo'},
                                                         {id: 'morado', name: 'Morado'},
                                                         {id: 'negro', name: 'Negro'}
                                                     ]}/>
                                        <br/>
                                        <SelectInput label={"Color Tornasol 2"} source={getSource("tornasol.color2")}
                                                     choices={[
                                                         {id: 'rojo', name: 'Rojo'},
                                                         {id: 'rosado', name: 'Rosado'},
                                                         {id: 'verde', name: 'Verde'},
                                                         {id: 'celeste', name: 'Celeste'},
                                                         {id: 'azul', name: 'Azul'},
                                                         {id: 'amarillo', name: 'Amarillo'},
                                                         {id: 'naranjo', name: 'Naranjo'},
                                                         {id: 'morado', name: 'Morado'},
                                                         {id: 'negro', name: 'Negro'},
                                                         {id: 'gris', name: 'Gris'}
                                                     ]}/>
                                        <br/>

                                        <SelectArrayInput className={classes.selectArrayInput}
                                                          validate={validateBrillos} label={"Brillos"}
                                                          source={getSource("brillos")} choices={[
                                            {id: 'dorado', name: 'Dorado'},
                                            {id: 'plateado', name: 'Plateado'},
                                            {id: 'rojo', name: 'Rojo'},
                                            {id: 'rosado', name: 'Rosado'},
                                            {id: 'verde', name: 'Verde'},
                                            {id: 'celeste', name: 'Celeste'},
                                            {id: 'amarillo', name: 'Amarillo'},
                                            {id: 'naranjo', name: 'Naranjo'},
                                            {id: 'morado', name: 'Morado'}
                                        ]}/>

                                    </Fragment>
                            }

                        }}
                    </FormDataConsumer>

                    <NumberInput source={"cantidad"} label={"Cantidad"}/>
                </SimpleFormIterator>
            </ArrayInput>
            <br/>
            <TextInput source={getSource("mensaje")} label={"Mensaje"} validate={validateMensaje}/>
            <br/>

            <SelectInput label={"Decoración"} source={getSource("decoracion")} choices={[
                {id: 'flores', name: 'Flores'},
                {id: 'estrellas', name: 'Estrellas'},
                {id: 'zig_zag', name: 'Zig Zag'},
                {id: 'corazones', name: 'Corazones'},
                {id: 'confeti', name: 'Confeti'},
                {id: 'puntitos', name: 'Puntitos'},
                {id: 'curvos', name: 'Curvas'},
                {id: 'espirales', name: 'Espirales'},
                {id: 'otro', name: 'Otro'}
            ]}/>

            <FormDataConsumer>
                {() => {
                    const decoracionField = form.getFieldState(getSource('decoracion'));

                    if (!decoracionField) return null;

                    if (decoracionField.value === 'otro') {
                        return <TextInput source={getSource("decoracionOtro")}
                                          label={"Escriba la decoración"}/>
                    }
                }}
            </FormDataConsumer>
            <br/>


            <TextInput source={getSource("dibujoDescripcion")}
                       label={"Describa el dibujo"}/>

        </Fragment>
    )
}

export default Personalizado
