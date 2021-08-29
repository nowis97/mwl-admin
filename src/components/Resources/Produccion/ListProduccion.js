import React, { useState} from "react";
import {List,
    Datagrid,
    ReferenceField,
    NumberField,
    DateField,
    TextField,
    ShowButton,
    useNotify,
    useRedirect,

    }
    from 'react-admin';
import {makeStyles} from "@material-ui/styles";

import {agregarHistorial} from "../../../services/api";
import moment from "moment";

const useStyles = makeStyles(theme =>({
    drawerPaper: {
        zIndex: 100,
        width: 300
    },
}))
 const ListProduccion = props => {
        const classes = useStyles()
     const notify = useNotify();
     const redirect = useRedirect();
     const [open,setOpen] = useState(false);
     const [actualRecord,setActualRecord] = useState({});

     const handleClose = () => setOpen(false);

     const handleSubmit = (formValues) => {
         console.log(actualRecord);
         formValues.idProduccion = actualRecord.id;
         agregarHistorial(formValues,actualRecord.productoId).then(res =>{
             notify('Asignado correctamente','info')
             redirect('/producciones')

         }).catch(err=>{
             notify('Error: '+ err.response.data.error.message,"error");
         }).finally(() => handleClose())

     }

    const validateFecha = (values,allValues) =>{
         if (moment(values) <= moment(actualRecord.fechaProduccion)){
             return  'La fecha debe ser mayor que la fecha de producción'
         }

         return [];
    }

    return (
        <List {...props}>
             <Datagrid >
                 <ReferenceField source="productoId" reference="productos" label={"Nombre producto"}>
                     <TextField source="nombre"/>
                 </ReferenceField>
                 <NumberField source="cantidadProducir" label={"Cantidad a producir"}/>
                 <NumberField source={"cantidadProducida"} label={"Cantidad producida"}/>
                 <DateField source="fechaProduccion" label={"Fecha de producción"}/>
                 <ShowButton/>
             </Datagrid>
            </List>
     );

 }
export default ListProduccion;
