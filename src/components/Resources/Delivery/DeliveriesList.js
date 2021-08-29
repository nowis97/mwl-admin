import React, {cloneElement, Fragment, useState} from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    ReferenceField,
    SelectField,
    Filter,
    SelectInput,
    BooleanField,
    ReferenceInput,
    BooleanInput,
    AutocompleteInput,
    DateInput,
    TopToolbar,
    useListContext,
    sanitizeListRestProps,
    BulkDeleteButton,
    Button,
    linkToRecord,
    useNotify, useRefresh, useUnselectAll
} from "react-admin";
import {useHistory} from 'react-router-dom';
import {filterToQuery} from "../../helpers/filterstoqueries";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {TruckDelivery} from 'mdi-material-ui';
import CropFreeIcon from '@material-ui/icons/CropFree';
import QrReader from 'react-qr-scanner';
import useSound from "use-sound";
import load from '../../../assets/readed.mp3';
import {cambiarEstadoPedido} from "../../../services/api";

import Cookies from "universal-cookie";

const cookies = new Cookies()

const ActionsDeliveries = ({setOpenDialogQR,...props}) =>{


    const {
        className,
        exporter,
        filters,
        maxResults,
        ...rest
    } = props;
    const {
        currentSort,
        resource,
        displayedFilters,
        filterValues,
        hasCreate,
        basePath,
        selectedIds,
        showFilter,
        total,
    } = useListContext();
    return <TopToolbar {...sanitizeListRestProps(rest)}>
        {filters && cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: 'button',
        })}
        <Button label={"Escanear"} onClick={() => setOpenDialogQR(prevState => ({ open:!prevState.open,clickBy:'escanear'}))}>
            <CropFreeIcon/>
        </Button>
        <Button label={"Entregar"} onClick={() => setOpenDialogQR(prevState => ({ open:!prevState.open,clickBy:'entregar'}))}>
            <TruckDelivery/>
        </Button>
    </TopToolbar>
}

const FiltersDeliveries = props =>{
    return <Filter {...props}>
        <SelectInput source="sector" allowEmpty choices={[
            { id: 'ZN', name: 'Zona norte' },
            { id: 'ZS', name: 'Zona sur' },
            { id: 'ZC', name: 'Zona centro' },
            {id: 'ZEN',name:'Extremo norte'},
            {id:'ZES', name: 'Extremo sur'},
            {id:'ZPA',name: 'Parte alta'},
            {id:'COV',name:'Coviefi'}
        ]} alwaysOn />
        <SelectInput source="tipoEntrega" choices={[{id:'delivery',name:'Delivery'},{id:'retiro',name:'Retiro'}]} alwaysOn/>
        <BooleanInput source={"clienteRecibe"} label={"Cliente recibe"}/>
        <DateInput source={"fechaEntrega"} label={"Fecha de entrega"} alwaysOn />

        <ReferenceInput source="clientesId" label={"Cliente"} reference="clientes" filterToQuery={searchText => filterToQuery(searchText,'nombre')}>
            <AutocompleteInput optionText={"nombre"}  />
        </ReferenceInput>

    </Filter>
}


const chooserVideoInput = (filteredDevices,videoDevices) =>{
    return videoDevices[videoDevices.length -1].deviceId || filteredDevices[0].deviceId;
}

const ButtonEntregarPedidos = ({selectedIds,...props}) =>{
    const notify = useNotify();
    const refresh = useRefresh();
    const unselectedAll = useUnselectAll();

    const handleClick = () =>{
        Promise.all(selectedIds.map(id => cambiarEstadoPedido('Entregado',id))).then(
            res =>{
                notify('Pedido(s) entregado(s)');
                refresh();
                unselectedAll('delivery')

            }
        )
            .catch(reason => {
                notify('Ocurrió un error',"error")
                console.error(reason);
            })

    }

    return <Button label={"Entregar"} onClick={handleClick}>
        <TruckDelivery/>
    </Button>
}

const BulkActionsDeliveries = props =>{

    return (
        <Fragment>
            <BulkDeleteButton {...props}/>
            <ButtonEntregarPedidos {...props} />
        </Fragment>
    )
}

export const DeliveriesList = props =>{
    const [openDialogQR,setOpenDialogQR] = useState({open:false,clickBy:''});


    const notify = useNotify();
    const history = useHistory();
    const [playReadedSound] = useSound(load);



    const handleCloseDialog = () =>{
        setOpenDialogQR({open:false,clickBy: ''})
    }



    const handleScan = data =>{
        if (data){
            handleCloseDialog()
            notify('Codigo QR identificado')
            playReadedSound()
            if (navigator.vibrate)
                navigator.vibrate(200)

            if (openDialogQR.clickBy === 'escanear') {
                history.push(linkToRecord('pedidos', data, 'show'))
            }else if (openDialogQR.clickBy === 'entregar'){
                cambiarEstadoPedido('Entregado',data).then( () => {
                        notify('Pedido entregado');
                    }
                ).catch(err =>{
                    console.error(err)
                    notify('Ocurrió un error','error')
                }).finally(() => {
                    setOpenDialogQR({open: false,clickBy: ''})
                })
            }


        }
    }


    const handleError = err =>{
        notify('Hubo un error al procesar el codigo QR '+err.message,'error')
    }

    return (
        <Fragment>
            <List title={"Entregas"} {...props} bulkActionButtons={<BulkActionsDeliveries/>} filter={{usuario:cookies.get('user')?.email}} filters={<FiltersDeliveries/>} actions={<ActionsDeliveries setOpenDialogQR={setOpenDialogQR}/>}>
                <Datagrid>
                    <TextField source="direccion" />
                    <SelectField source="sector" allowEmpty choices={[
                        { id: 'ZN', name: 'Zona norte' },
                        { id: 'ZS', name: 'Zona sur' },
                        { id: 'ZC', name: 'Zona centro' },
                        {id: 'ZEN',name:'Extremo norte'},
                        {id:'ZES', name: 'Extremo sur'},
                        {id:'ZPA',name: 'Parte alta'},
                        {id:'COV',name:'Coviefi'}
                    ]} />
                    <DateField source="fechaEntrega" />
                    <DateField source="fechaPedido" />
                    <NumberField source="precioTotal" />
                    <SelectField source="tipoEntrega" choices={[{id:'delivery',name:'Delivery'},{id:'retiro',name:'Retiro'}]}/>
                    <ReferenceField source="clientesId" label={"Cliente"} reference="clientes">
                        <TextField source="nombre" />
                    </ReferenceField>
                    <BooleanField source={"clienteRecibe"} label={"Cliente recibe"}/>
                    <TextField source={"nombreRecibe"} label={"Nombre receptor"}/>
                    <TextField source={"numeroCelularRecibe"} label={"Numero celular"}/>

                </Datagrid>
            </List>
            <Dialog
                open={openDialogQR.open}
                onClose={handleCloseDialog}
                maxWidth={"md"}
            >
                <DialogTitle>
                    Lector QR
                </DialogTitle>
                <DialogContent>
                    <QrReader
                        chooseDeviceId={chooserVideoInput}
                        onError={handleError}
                        onScan={handleScan}
                        facingMode={"rear"}
                        style={{width:'100%'}}

                        maxImageSize={500}

                    />

                </DialogContent>

            </Dialog>
        </Fragment>
    );
}
