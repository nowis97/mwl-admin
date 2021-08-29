import React, {Fragment, useEffect, useState} from "react";
import {
    Datagrid,
    ReferenceField,
    NumberField,
    DateField,
    ArrayField,
    TextField,
    SimpleShowLayout,
    Show,
    TopToolbar,
    useNotify,
    useRefresh,
    fetchStart,
    fetchEnd
}
    from 'react-admin';

import {useSelector,useDispatch} from 'react-redux';
import {Factory} from 'mdi-material-ui';
import {Matriz} from "./Matriz";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Checkbox from "@material-ui/core/Checkbox";

import {ponerEnProduccion} from "../../../services/api";
import {createSelector} from "reselect";
import PrintIcon from "@material-ui/icons/Print";
import FormControlLabel from "@material-ui/core/FormControlLabel";


const agruparPersonalizadosColor = (personalizados) => { // `data` is an array of objects, `keys` is the array of keys (or property accessor) to group by
     const helper ={}                             // reduce runs this anonymous function on each element of `data` (the `item` parameter,;

    return personalizados.reduce((acc, current) => {
        if (current.tipoCobertura === 'marmol' ||  current.tipoCobertura === 'tornasol')
            return acc;

        const key = current.color +'-'+ current.sabor;
        if (!helper[key]){
            helper[key] = Object.assign({},current);
            acc.push(helper[key]);
        }else {
            helper[key].cantidad += current.cantidad;

        }
        return acc;
    }, []); // {} is the initial value of the storage
};

const agruparMarmol = (personalizadosMarmol) =>{
    const helper = {};
    return personalizadosMarmol.reduce((acc, current) => {

        const key = current.marmol.colorBase+'-'+current.marmol.colorMarmol+'-'+ current.sabor;

        if (!helper[key]){
            helper[key] = Object.assign({},current);
            acc.push(helper[key]);
        }else {
            helper[key].cantidad += current.cantidad;
        }
        return acc;
    }, []); // {} is the initial value of the storage
}

const juntarPersonalizados = props =>{
    const subProductosProducir = props.record.subproductosProducir;

    const coberturas = subProductosProducir.map(obj => obj.coberturas).flat();

    const sabores = subProductosProducir.map(obj => obj.sabores).flat();

    return  coberturas.map((currObj,currIdx) => {
        if (currObj.tipoCobertura === 'cafe'){
            currObj.color = currObj.tipoCobertura;
            currObj.tipoCobertura = 'color';
        }
        return ({...currObj, sabor: sabores[currIdx].sabor})
    })
}

const filtrarMarmol = props =>{

    const personalizados = juntarPersonalizados(props);

    return personalizados.filter(obj => obj.tipoCobertura === 'marmol');


}

const createTablePersonalizadoColorSabor = (props) => {

    return agruparPersonalizadosColor(juntarPersonalizados(props))


}

const CheckBoxArrayField = props =>{

    const [checked,setChecked] = useState(props.record[props.source]? props.record[props.source]:false)

    const handleChecked = e => {
        e.stopPropagation();
        setChecked(prevState =>{
            props.handleIdChecked(props.record['idProducto'],!prevState)
            return !prevState
        })


    }



    return <Checkbox checked={checked} onClick={handleChecked} disabled={props.record[props.source]} />
}

const ExpandSubProducto = props =>{
    const personalizado = useSelector(state => {
        const productos = Object.values(state.admin.resources.productos.data)
        return productos.find(obj => obj.nombre === 'Personalizado')

    })
    if (!personalizado)  return <h3> No hay datos </h3>


    if (props.record.idProducto === personalizado.id ){




        props.record.subproductosPersonalizadoColorSabor = createTablePersonalizadoColorSabor(props);

        props.record.subproductosPersonalizadoMarmolSabor = agruparMarmol(filtrarMarmol(props))
        debugger;

        return <Fragment>
            <Matriz data={props.record.subproductosPersonalizadoColorSabor} verticalNames={"color"} horizontalNames={"sabor"} titulo={"Sabor y color"}/>
            <br/>
            <Matriz data={props.record.subproductosPersonalizadoMarmolSabor} verticalNames={"marmol"} horizontalNames={"sabor"} titulo={"Marmol"}/>
        </Fragment>


        /*
        return <SimpleShowLayout {...props}>
                    <ArrayField source={"subproductosPersonalizadoColorSabor"}  label={"Por color y sabor"}  >
                        <Datagrid>
                            <TextField source={"color"} label={"Color"}/>
                            <TextField source={"sabor"} label={"Sabor"}/>
                            <NumberField source={"cantidad"} label={"Cantidad"}/>
                        </Datagrid>
                    </ArrayField>

                    <ArrayField source={"subproductosPersonalizadoMarmolSabor"} label={"Marmol"}>
                        <Datagrid>
                            <TextField source={"marmol.colorBase"} label={"Color base"}/>
                            <TextField source={"marmol.colorMarmol"} label={"Color marmol"}/>
                            <NumberField source={"cantidad"} label={"Cantidad"}/>
                        </Datagrid>
                    </ArrayField>
               </SimpleShowLayout>
               */


    }

    return <h3> No hay datos </h3>
}

const selectorPedidos = createSelector(state => state.admin,
    admin => {
        if (admin.resources){
            if (admin.resources.pedidosActuales)
                return  admin.resources.pedidosActuales.props.data;
        }

        return []
    })


export const ProduccionesSubProductos = ({setIdsProduccion,allSelected,setIdProduccionActual,...props}) =>{

    const dispatch = useDispatch()


    useEffect(() =>{
        if (props.record) {
            if (props.record.pedidos)
                dispatch({type: 'RA/REGISTER_RESOURCE', payload: {name: 'pedidosActuales', data: props.record.pedidos}})
        }
    },[])

    useEffect(() =>{
     if (props.record) {
         if (props.record.id)
            setIdProduccionActual(props.record.id);
     }
    },[props.record])

    useEffect(() =>{
        if (allSelected){
            if (props.record.subProductosPedidosProduccion){
                const idsSubProductosProduccion = props.record.subProductosPedidosProduccion.map(obj => obj.idProducto)
                setIdsProduccion(idsSubProductosProduccion)
            }

        }else{
            if (props.record){
                if (props.record.subProductosPedidosProduccion)
                        setIdsProduccion([]);
            }

        }
    },[allSelected])


    const handleIdChecked = (id,push) =>{
        setIdsProduccion(prevState => {
            const foundCheckBoxSelected = prevState.find(obj => obj === id)
            if (!foundCheckBoxSelected && push) {
                prevState.push(id);
                return prevState
            }

            if (foundCheckBoxSelected && push) return prevState

            if (foundCheckBoxSelected && !push) {
                return prevState.filter(value => value !== id);
            }

            return prevState;
        })
    }

    return <ArrayField source={"subProductosPedidosProduccion"} {...props}>
            <Datagrid rowClick={"expand"} expand={<ExpandSubProducto/>}>
                <ReferenceField source="idProducto" reference="productos" label={"Nombre producto"}>
                    <TextField source="nombre" />
                </ReferenceField>
                <NumberField source="cantidadTotal" label={"Cantidad a producir"} />
                <NumberField source={"cantidadEnProduccion"} label={"Cantidad en produccion"}/>
                <NumberField source={"cantidadFaltante"} label={"Cantidad faltante"}/>
                <DateField source="fechaEntrega" label={"Fecha de entrega"} />

                <CheckBoxArrayField source={"enProduccion"} handleIdChecked={handleIdChecked}/>

            </Datagrid>
    </ArrayField>
}

const ActionsProduccionShow = props =>{
    const {handlePrint} = props
    return <TopToolbar>
        <Button variant={"outlined"} onClick={() => props.setOpenDialog(true)} disabled={props.disabledButton} color={"primary"} startIcon={<Factory/>}> Producir </Button>
        <Button variant={"outlined"} onClick={() => window.print()}  color={"primary"} startIcon={<PrintIcon/>}> Imprimir </Button>

    </TopToolbar>
}



const ShowProduccion = props =>{
    const notify = useNotify()
    const refresh = useRefresh();
    const dispatch = useDispatch()

    const [openDialog,setOpenDialog] = useState(false);

    const [idsSubProductoProduccion,setIdsSubProductoProduccion] = useState([]);

    const [disabledButton,setDisabledButton] = useState(false);

    const [idProduccionActual,setIdProduccionActual] = useState('');

    const [allSelected,setAllSelected] = useState(false);

    const pedidosActuales = useSelector(selectorPedidos);

    const handleCloseDialog = () => setOpenDialog(false);

    const handleAllSelected = (event) => {
        setAllSelected(event.target.checked)
    }

    const handleAccept = () => {
        handleCloseDialog()
    }

    const handleSubmit = () => {
        dispatch(fetchStart())
        setDisabledButton(true)
        ponerEnProduccion(idsSubProductoProduccion,pedidosActuales,idProduccionActual)
            .then(res =>{
                setIdsSubProductoProduccion([])
                notify('Subproductos en producción','success')
                refresh();

            })
            .catch(err =>{
            notify('Error:'+err.message,'warning')
        }).finally(
            ()=>{
                setDisabledButton(false)
                setOpenDialog(false)
                dispatch(fetchEnd())
            }
        )

    }



    return (
        <Fragment >
        <Show {...props}  actions={<ActionsProduccionShow setOpenDialog={setOpenDialog} disabledButton={disabledButton}/>}>
            <SimpleShowLayout>
                <ProduccionesSubProductos  allSelected={allSelected} setIdsProduccion={setIdsSubProductoProduccion} setIdProduccionActual={setIdProduccionActual}/>
            </SimpleShowLayout>



        </Show>
            <Dialog
                open={openDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"¿Desea poner en producción estos subproductos seleccionados?"}</DialogTitle>

                <DialogContent>
                    <FormControlLabel
                        control={<Checkbox  onChange={handleAllSelected} />}
                        label="Seleccione el Checkbox para poner todos los subproductos en producción"
                    />
                </DialogContent>

                    <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Rechazar
                    </Button>
                    <Button onClick={handleSubmit} color="primary" autoFocus>
                        Aceptar
                    </Button>
                    </DialogActions>

            </Dialog>
            </Fragment>
    );
}

export default ShowProduccion;