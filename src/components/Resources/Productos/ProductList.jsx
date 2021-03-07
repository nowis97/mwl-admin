import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import {
    Filter,
    List,
    Pagination,
    ReferenceInput,
    TextInput,
    SelectInput,
    useTranslate,
    BooleanInput
} from 'react-admin';
import GridList from './GridList';

const useQuickFilterStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(3),
    },
}));
const QuickFilter = ({ label }) => {
    const translate = useTranslate();
    const classes = useQuickFilterStyles();
    return <Chip className={classes.root} label={translate(label)} />;
};



export const ProductFilter = props => (
    <Filter {...props}>
        <TextInput source="i:nombre" label={"Nombre del producto"} alwaysOn />
        <ReferenceInput
            source="categoria"
            reference="categorias"
            label={"Categoria"}
        >
            <SelectInput optionText={"nombre"} />
        </ReferenceInput>

        <BooleanInput source={"esSubproducto"}/>
    </Filter>
);

const ProductList= props => {
     return (<List
            {...props}
            filters={<ProductFilter/>}
            perPage={20}
            pagination={<Pagination rowsPerPageOptions={[10, 20, 40]}/>}
            sort={{field: 'nombre', order: 'ASC'}}
        >
            <GridList/>
        </List>);
    };

export default ProductList;
