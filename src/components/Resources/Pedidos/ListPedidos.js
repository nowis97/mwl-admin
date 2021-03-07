import React, {cloneElement, Fragment, useEffect, useState} from "react";
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
    CreateButton,
    ExportButton,
    Button,
    linkToRecord,
    useNotify,
    fetchStart,
    fetchEnd,
    BulkDeleteButton, useUnselectAll, useRefresh, FormWithRedirect, required, FunctionField
} from "react-admin";
import {useHistory} from 'react-router-dom';
import {filterToQuery} from "../../helpers/filterstoqueries";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CropFreeIcon from '@material-ui/icons/CropFree';
import QrReader from 'react-qr-scanner';
import {StateMachine,TruckDelivery} from "mdi-material-ui";
import useSound from "use-sound";
import load from '../../../assets/readed.mp3';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogActions from "@material-ui/core/DialogActions";
import {useDispatch} from 'react-redux'
import {asignarPedidosARepartidor, cambiarEstadoPedido, obtenerRepartidores} from "../../../services/api";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(2),
        minWidth: 130,
        maxWidth:300
    },

}));

const ActionsPedidos = ({setOpenDialogQR,...props}) =>{


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
                <CreateButton basePath={basePath} />
                <Button label={"Escanear"} onClick={() => setOpenDialogQR(prevState => !prevState)}>
                    <CropFreeIcon/>
                </Button>
                <ExportButton
                    disabled={total === 0}
                    resource={resource}
                    sort={currentSort}
                    filterValues={filterValues}
                    maxResults={maxResults}
                />


           </TopToolbar>
}

const FiltersPedidos = props =>{
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
        <DateInput source={"fechaEntrega"} label={"Fecha de entrega"}/>

        <ReferenceInput source="clientesId" label={"Cliente"} reference="clientes" filterToQuery={searchText => filterToQuery(searchText,'nombre')}>
            <AutocompleteInput optionText={"nombre"}  />
        </ReferenceInput>

        <SelectInput source={"estado"} allowEmpty choices={[
            {id:'Creado',name:'Creado'},
            {id:'Empaquetando',name: 'Empaquetando'},
            {id:'En produccion',name: 'En Producción'},
            {id:'Entregado',name:'Entregado'},
            {id:'Listo para entregar',name: 'Listo para entregar'},
            {id:'Cancelado',name: 'Cancelado'}
        ]}/>

    </Filter>
}

const PedidosBulkActionsButtons = props =>{

    return (<Fragment>
                <ButtonCambiarEstado {...props} />
                <ButtonAsignarPedido {...props} />
                <BulkDeleteButton {...props}/>
           </Fragment>)
}

const ButtonAsignarPedido = ({selectedIds,...props}) =>{

    const [open,setOpen] = useState(false);

    const notify = useNotify()
    const dispatch = useDispatch();
    const unselectAll = useUnselectAll()
    const refresh = useRefresh()



    const [disabled,setDisabled] = useState(false);

    const [repartidores,setRepartidores] = useState([])


    const classes = useStyles();

    useEffect(() =>{
       obtenerRepartidores().then(res => {
           setRepartidores(res.data)
       })
    },[])


    const handleCloseDialog = () =>{
        setOpen(false)
    }

    const handleClick = () =>{
        setOpen(true);
    }

    const handleAsignar = data =>{
        if (!data) notify('Seleccione algun repartidor')

        if (selectedIds?.length === 0) {
            notify('Seleccione algun pedido')
            return;
        }

        dispatch(fetchStart())
        asignarPedidosARepartidor(data.repartidor,selectedIds).then(
            res =>{
                setDisabled(true)
                notify('Pedidos asignados')
                refresh()
            }
        ).catch(err =>{
            notify(err.message,'error')
        }).finally(() =>{
            dispatch(fetchEnd());
            setDisabled(false);

            handleCloseDialog()
            unselectAll('pedidos')
            dispatch(fetchEnd())
        })




    }

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
            >
                <DialogTitle>
                    Asignar repartidor
                </DialogTitle>

                <FormWithRedirect
                    onSubmit={handleAsignar}
                    save={handleAsignar}
                    render ={(formsProps) => (
                        <form >
                        <DialogContent>
                            <AutocompleteInput validate={[required()]} options={{suggestionsContainerProps:{
                                    style:{ zIndex:999999}
                                }}}  optionText={"username"} source={"repartidor"} choices={repartidores} />

                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleCloseDialog} label={"Rechazar"} />

                        <Button onClick={formsProps.handleSubmit} label={"Asignar"} disabled={disabled} />

                        </DialogActions>
                        </form>
                    )}
                />

            </Dialog>
            <Button label={"Asignar repartidor"} onClick={handleClick}>
                <TruckDelivery/>
            </Button>
        </Fragment>
    )

}

const ButtonCambiarEstado = ({selectedIds}) =>{

    const [open,setOpen] = useState(false);

    const [estado,setEstado] = useState('');

    const [disabled,setDisabled] = useState(false);


    const classes = useStyles();

    const notify = useNotify();

    const refresh = useRefresh()

    const unselectAll = useUnselectAll()


    const handleCloseDialog = () =>{
        setOpen(false)
    }

    const handleClick = () =>{
        setOpen(true);
    }

    const handleChange = e =>{
        setEstado(e.target.value);

    }

    const handleAceptar = () =>{
        setDisabled(true);

        Promise.all(selectedIds.map(id => cambiarEstadoPedido(estado,id)))
            .then(res =>{
                notify('Estado(s) cambiado(s)')
                handleCloseDialog()
                refresh()
            })
            .catch(reason => {
                console.error(reason);
                notify('Hubo un error al actualizar estados','error')
            })
            .finally(() =>{
                setDisabled(false)
                unselectAll('pedidos')
            })

    }

    return <Fragment>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
            >
                <DialogTitle>
                    Cambiar estado
                </DialogTitle>
                <DialogContent>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel >Estado</InputLabel>
                        <Select
                            value={estado}
                            onChange={handleChange}
                            label="Estado"
                        >
                            <MenuItem value={"Empaquetando"}>Empaquetando</MenuItem>
                            <MenuItem value={"En produccion"}>En Producción</MenuItem>
                            <MenuItem value={"Listo para entregar"}>Listo para entregar</MenuItem>
                            <MenuItem value={"Entregado"}>Entregado</MenuItem>
                            <MenuItem value={"Cancelado"}>Cancelado</MenuItem>
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} label={"Rechazar"} disabled={disabled}/>

                    <Button onClick={handleAceptar} label={"Aceptar"} />

                </DialogActions>
            </Dialog>
                <Button label={"Cambiar estado"} onClick={handleClick}>
                    <StateMachine/>
                </Button>
           </Fragment>
}


const chooserVideoInput = (filteredDevices,videoDevices) =>{
    return filteredDevices[filteredDevices.length -1].deviceId;
}

export const ListPedidos = props =>{
    const [openDialogQR,setOpenDialogQR] = useState(false);


    const notify = useNotify();
    const history = useHistory();
    const [playReadedSound] = useSound(load);



    const handleCloseDialog = () =>{
        setOpenDialogQR(false)
    }



    const handleScan = data =>{
        if (data){
            handleCloseDialog()
            notify('Codigo QR identificado')
            playReadedSound()
            if (navigator.vibrate)
                navigator.vibrate(200)

            history.push(linkToRecord('pedidos',data,'show'))
        }
    }


    const handleError = err =>{
        notify('Hubo un error al procesar el codigo QR '+err.message,'error')
    }

    return (
        <Fragment>
            <List title={"Pedidos"}  {...props} filters={<FiltersPedidos/>} bulkActionButtons={<PedidosBulkActionsButtons/>} actions={<ActionsPedidos setOpenDialogQR={setOpenDialogQR}/>}>
                <Datagrid rowClick={"show"}>
                    <TextField source={"estado"}/>
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
                    <ReferenceField source="asignadoAEntregadoPor" linkType={false} label={"Entregado por"} reference="usuarios">
                        <TextField source="username" />
                    </ReferenceField>
                    <FunctionField source="id" render={record => record.id.substr(record.id.length -3)} />


                </Datagrid>
            </List>
            <Dialog
                open={openDialogQR}
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
