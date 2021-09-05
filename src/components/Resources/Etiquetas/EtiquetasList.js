import {List, Pagination, Loading, TopToolbar, BooleanInput, sanitizeListRestProps} from "react-admin";
import * as React from "react";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";
import QRCodeStyling from 'qr-code-styling'
import {cloneElement, Fragment, useRef, useState} from "react";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import logo from '../../../assets/logo.png';
import {useReference,useGetMany,SelectInput,DateInput,Filter,useListContext} from 'react-admin'
import {useReactToPrint} from "react-to-print";
import {Button} from "@material-ui/core";
import PrintIcon from '@material-ui/icons/Print';
import {imprimirEtiquetas} from "../../../services/api";
import {ColorPicker} from "material-ui-color";


const FiltersEtiquetas = props => {
    return <Filter {...props}>
                <SelectInput source={"estado"} allowEmpty choices={[
                    {id:'Creado',name:'Creado'},
                    {id:'Empaquetando',name: 'Empaquetando'},
                    {id:'En produccion',name: 'En Producción'},
                    {id:'Entregado',name:'Entregado'},
                    {id:'Listo para entregar',name: 'Listo para entregar'},
                    {id:'Cancelado',name: 'Cancelado'}
                ]}/>
                <DateInput source={"fechaEntrega"} label={"Fecha de entrega"} alwaysOn/>
                <BooleanInput source={"etiquetaImpresa"} label={"Etiqueta impresa"} alwaysOn/>


           </Filter>
}




const ActionsEtiquetas = ({handlePrint,setColorEtiqueta,colorEtiqueta,...props}) =>{

    const {
        className,
        exporter,
        filters,
        maxResults,
        ids,
        ...rest
    } = props;
    const {
        currentSort,
        resource,
        displayedFilters,
        filterValues,
        showFilter,
    } = useListContext();


    return <TopToolbar {...sanitizeListRestProps(rest)} >
        {filters && cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: 'button',
        })}
            <Button variant={"outlined"} onClick={() => handlePrint(ids)}  color={"primary"} startIcon={<PrintIcon/>}> Imprimir </Button>
        <ColorPicker value={colorEtiqueta} hideTextfield onChange={color => setColorEtiqueta(color)} />
    </TopToolbar>
}


export const EtiquetasList = props =>{


    const componentRef = useRef();

    const [colorEtiqueta,setColorEtiqueta] = useState({});


    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    })

    const handleImprimir = (ids) =>{
        handlePrint();

        imprimirEtiquetas(ids).then(res => console.log(res));
    }

    return (<List
            {...props}
            bulkActionButtons={null}
            perPage={10}
            pagination={<Pagination rowsPerPageOptions={[5, 10, 20]}/>}
            actions={<ActionsEtiquetas colorEtiqueta={colorEtiqueta} setColorEtiqueta={setColorEtiqueta} handlePrint={handleImprimir}/>}
            filters={<FiltersEtiquetas/>}
        >
            <GridListEtiquetas colorEtiqueta={colorEtiqueta} ref={componentRef}/>

        </List>);
}






const useStyles = makeStyles(theme => ({
    root: {
        margin:'4px',
        borderRadius: theme.spacing(2), // 16px
        transition: '0.3s',
        position: 'relative',
        overflow: 'initial',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border:'1px solid rgba(0, 0, 0, 0.32)'
    },

    media: {
        width: '88%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing(-3),
        height: 0,
        paddingBottom: '48%',
        borderRadius: theme.spacing(2),
        backgroundColor: '#fff',
        position: 'relative',
        '&:after': {
            content: '" "',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)',
            borderRadius: theme.spacing(2), // 16
            opacity: 0.5,
        },
    },
    gridList: {
        margin: 3,
        maxWidth:500
    },
    cardMedia:{
        width:'auto',
        margin:'5px'
    },
    detalles:{
        width:'100%',
        maxWidth:450
    }

}));

const getColsForWidth = (width) => {
    if (width === 'xs') return 2;
    if (width === 'sm') return 3;
    if (width === 'md') return 4;
    if (width === 'lg') return 5;
    return 6;
};

const times = (nbChildren, fn) => Array.from({ length: nbChildren }, (_, key) => fn(key));


const LoadingGridListEtiquetas = ({
                             width,
                             nbItems = 20,
                         }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <GridList
                cellHeight={180}
                cols={getColsForWidth(width)}
                className={classes.gridList}
            >
                {' '}
                {times(nbItems, key => (
                    <GridListTile key={key}>
                        <div className={classes.placeholder} />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
};

const LoadedGridListEtiquetas = React.forwardRef(({ ids, data, basePath, width,colorEtiqueta },ref) => {
    const classes = useStyles();

    if (!ids || !data) return null;

    return (

            <GridList
                className={classes.gridList}
                style={{margin:'10px'}}
                spacing={30}
                ref={ref}

            >
                {ids.map(id => (
                        <CardQR color={colorEtiqueta}  imgLogo={logo} pedido={data[id]} dataToShow={data[id].id}/>
                ))}
            </GridList>

    );
});


const GridListEtiquetas = React.forwardRef( ({ loaded, ...props },ref) =>
    loaded ? <LoadedGridListEtiquetas ref={ref} {...props} /> : <LoadingGridListEtiquetas ref={ref} {...props} />);



const CardQR = ({dataToShow,imgLogo,pedido,color}) =>{
    const classes = useStyles();

    const referenceCliente = useReference({id:pedido.clientesId,reference:'clientes'})

    const ids = pedido.productosPedidos.map(val => val.idProducto);

    const getManyProductos = useGetMany('productos',ids)

    const [loaded,setLoaded] = useState(false);




    const [dataImage,setDataImage] = useState('');
    const qrcode = new QRCodeStyling({
        width: 160,
        height: 160,
        data: dataToShow,
        image: imgLogo,
        dotsOptions: {
            color: "#5f3a14",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#fdfdfd",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            imageSize: 0.5
        }
    })

    qrcode._canvasDrawingPromise.then(() =>{
        setDataImage(qrcode._canvas.getCanvas().toDataURL())
        setLoaded(true)
    })

    if (!loaded) return <Loading/>

    const getNombreRecibe = () =>{
        if (pedido.clienteRecibe){
            return referenceCliente.loaded? referenceCliente.referenceRecord.nombre:'';
        }
        return pedido.nombreRecibe? pedido.nombreRecibe:'';
    }

    const getCelularInstagram = () =>{
        if (!pedido.numeroCelularRecibe){
            return referenceCliente.loaded?referenceCliente.referenceRecord.celular + ' - '+
                referenceCliente.referenceRecord.usuarioInstagram:''
        }

        return pedido.numeroCelularRecibe
    }


    const getCantidadProductos = () =>{
        let cantidad = 0;
        if (pedido){
            for (const producto of pedido.productosPedidos) {
                if (producto.cantidad){
                    cantidad += producto.cantidad;
                }else cantidad += 1;
            }
            return cantidad;
        }

        return cantidad;
    }

    return (
        <Fragment>
        <Card className={(classes.root)} style={color.css} variant={"outlined"}>

                <CardContent  >
                    <Typography component="h4" variant="h5">
                        {getNombreRecibe()}
                    </Typography>
                    <Typography variant={"subtitle1"}>
                        {getCelularInstagram()}
                    </Typography>

                    <Typography variant="subtitle1" color="textSecondary">
                        {
                            getManyProductos.loaded?getManyProductos.data.map(value => value.nombre).join('-'):''
                        }
                    </Typography>
                    <Typography variant={"subtitle1"}>
                        { '$'+(pedido.precioTotal?pedido.precioTotal:'No definido')}
                    </Typography>
                    <Typography variant={"subtitle1"}>
                        {
                            moment(pedido.fechaEntrega).format('DD-MM-YYYY') + ' - '+ (pedido.direccion?pedido.direccion:'')
                        }
                    </Typography>
                </CardContent>
            <CardMedia
                className={classes.cardMedia}
                title="Código QR"
                src={dataImage}
                component={"img"}
            />

        </Card>
            <div className={classes.detalles}>
                <Typography style={{lineHeight:'1'}} variant={"overline"}>
                    Tipo de entrega: {pedido.tipoEntrega}
                </Typography>
                <br/>
                <Typography variant={"overline"} style={{lineHeight:'1'}}>
                    Observaciones: {pedido.observaciones?pedido.observaciones:''}
                </Typography>
                <br/>
                <Typography variant={"overline"} style={{lineHeight:'1'}}>
                    Tarjeta: {pedido.tarjeta? `De: ${pedido.tarjeta.de} - Para: ${(pedido.tarjeta.para)}`:''}
                </Typography>
                <br/>
                <Typography variant={"overline"} style={{lineHeight:'1'}}>
                    {getManyProductos.loaded?getManyProductos.data.map((value,index) => {
                        let detallesProductos = ''
                        if (value.nombre){
                            detallesProductos += value.nombre + ' - '
                        }

                        if (pedido.productosPedidos[index] && pedido.productosPedidos[index].cantidad){
                            detallesProductos += pedido.productosPedidos[index].cantidad;
                        }

                        return detallesProductos
                    }).join(';'):''}
                </Typography>


            </div>

        </Fragment>
    )
}

export default (GridListEtiquetas);
