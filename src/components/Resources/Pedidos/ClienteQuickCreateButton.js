import React, {Fragment,useState} from "react";
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import {
    Create,
    FormWithRedirect,
    SelectInput,
    SimpleForm,
    TextInput,
    SaveButton,
    useCreate,
    useNotify,
    Toolbar
} from 'react-admin';
import {validateCelular, validateCliente} from "../Clientes/CreateCliente";
import Button from "@material-ui/core/Button";
import IconContentAdd from '@material-ui/icons/Add';
import {Grid, Typography} from "@material-ui/core";
import {useForm} from "react-final-form";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme =>({
    drawerPaper: {
        zIndex: 100,
        width: 280
    },
}))

const ClienteQuickCreateButton = props => {

    const {onChange} = props;
    const [showSideBar, setShowSideBar] = useState(false);
    const [create, {loading}] = useCreate('clientes');
    const notify = useNotify();
    const form = useForm();
    const classes = useStyles();
    const handleClick = () => {
        setShowSideBar(true)
    }

    const handleOnClose = () => {
        setShowSideBar(false)

    }


    const handleSubmit = async vals =>{

        create({payload:{data:vals}},
            {onSuccess:({data}) => {
                handleOnClose();
                form.change('clientesId',data.id);
                onChange();

            },onFailure:(error) =>{
                notify(error.message,'error')
                }}
        )




    }
    return (
        <Fragment>
            <IconButton onClick={handleClick}>
                <AddIcon/>
            </IconButton>
            <Drawer classes={{paper:classes.drawerPaper}} anchor={"right"} open={showSideBar} onClose={handleOnClose}>
                <FormWithRedirect save={handleSubmit} saving={loading} onSubmit={handleSubmit}  render= {(formProps) =>{
                    return (
                        <Grid container direction={"column"} justify={"center"} alignItems={"center"} spacing={1}>
                            <form>
                                <Typography variant="h5" style={{textAlign: 'center', marginTop: '20px'}} gutterBottom>
                                    Crear cliente
                                </Typography>
                                <Grid item>
                                    <TextInput label={"Nombre"} source={"nombre"} validate={validateCliente}/>
                                </Grid>
                                <Grid item>
                                    <TextInput label={"Usuario de Instagram"} source={"usuarioInstagram"}/>
                                </Grid>
                                <Grid>
                                    <TextInput label={"Celular"} source={"celular"} validate={validateCelular}
                                               type={"number"}/>
                                </Grid>
                                <Grid item>
                                    <SelectInput source="tipoCliente" choices={[
                                        {id: 'Normal', name: 'Normal'},
                                        {id: 'Produccion', name: 'Produccion'},
                                        {id: 'Comercial', name: 'Comercial'},
                                        {id: "Corporativo", name: 'Corporativo'}
                                    ]}/>
                                </Grid>


                                <SaveButton saving={formProps.saving}
                                            handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                                />


                            </form>
                        </Grid>

                    );
                }}  />

            </Drawer>
        </Fragment>
    );

}

export default ClienteQuickCreateButton;
