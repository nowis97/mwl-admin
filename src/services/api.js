import axios from 'axios';
import Cookies from "universal-cookie";

const URI = process.env.REACT_APP_API_URL;

const cookies = new Cookies()

const config = {
    headers: {Authorization: `Bearer ${cookies.get('token')}`}
}

export const agregarHistorial = (historial, idProducto) =>{
    return axios.patch(URI+'producciones/historial/'+idProducto,historial,config);
}

export const ponerEnProduccion = (idsSubproductos,pedidos,idProduccion) =>{
    return axios.patch(URI + 'producciones/producir',{pedidos,idsSubproductos,idProduccion},config)
}

export const cambiarEstadoPedido = (estado,idPedido) =>{
    return axios.patch(`${URI}pedidos/${idPedido}/cambiar-estado`,{estado},config)
}

export const imprimirEtiquetas = ids =>{
    return axios.patch(`${URI}pedidos/imprimir-etiquetas`,ids,config);

}

export const obtenerRepartidores = () =>{
    return axios.get(`${URI}usuarios/repartidores`,config)
}

export const asignarPedidosARepartidor = (repartidor,idsPedidos) =>
    axios.patch(`${URI}pedidos/${repartidor}/asignar`,idsPedidos,config)


