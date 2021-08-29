import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import QrReader from 'react-qr-scanner'
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import useSound from "use-sound";
import soundReaded from '../../../../assets/readed.mp3'
import {useNotify,useRefresh} from 'react-admin'
import {cambiarEstadoPedido} from "../../../../services/api";
import {Button} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(2),
        minWidth: 130,
    },

}));

const chooserVideoInput = (filteredDevices,videoDevices) =>{
    return filteredDevices[filteredDevices.length-1].deviceId || videoDevices[videoDevices.length -1].deviceId;
}

export const CambiarEstadoPedido = props =>{
    const classes = useStyles();
    const [soundRecognized] = useSound(soundReaded);
    const notify = useNotify()
    const refresh = useRefresh();

    const [estado,setEstado] = useState('');

    const [openReaderQR,setOpenReaderQR] = useState(true);



    const handleChange = (event) => {
        setEstado(event.target.value);
    };

    const handleError = err =>{
        console.error(err);
    }

    const handleScan = data =>{
        if (data){
            if (navigator.vibrate)
                navigator.vibrate(300);

            soundRecognized();
            if (!estado) {
                notify('Seleccione el estado','warning')
                return;
            }
            setOpenReaderQR(false);
            cambiarEstadoPedido(estado,data).then(res =>{
                console.log(res)
                notify('Estado actualizado')
                refresh()
            })
            .catch(err => {
                notify(err.response.data.error.message,'error')
            })

        }
    }
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
        >
            <Grid item={5}>
                <Typography variant="h5" align={"center"}  gutterBottom>
                    Escanee algun pedido para cambiar su estado
                </Typography>
            </Grid>

            <Grid item xs={10} >
                {
                    openReaderQR?
                        <QrReader
                            chooseDeviceId={chooserVideoInput}
                            onError={handleError}
                            onScan={handleScan}
                            style={{width:'95%'}}
                            maxImageSize={500}

                        />:null
                }

            </Grid>

            <Grid item>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Estado</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={estado}
                        onChange={handleChange}
                        label="Age"
                    >

                        <MenuItem value={"Empaquetando"}>Empaquetando</MenuItem>
                        <MenuItem value={"En produccion"}>En Producción</MenuItem>
                        <MenuItem value={"Listo para entregar"}>Listo para entregar</MenuItem>
                        <MenuItem value={"Entregado"}>Entregado</MenuItem>
                        <MenuItem value={"Cancelado"}>Cancelado</MenuItem>

                    </Select>
                </FormControl>

            </Grid>

            <Button onClick={() => setOpenReaderQR(true)}>
                Escanear de nuevo
            </Button>

        </Grid>
    )
}
