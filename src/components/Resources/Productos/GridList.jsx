import * as React from 'react';
import MuiGridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';
import withWidth  from '@material-ui/core/withWidth';
import { linkToRecord } from 'ra-core';
import { NumberField } from 'react-admin';
import { Link } from 'react-router-dom';


const URI = process.env["REACT_APP_API_URL"];

const useStyles = makeStyles(theme => ({
    root: {
        margin: '-2px',
    },
    gridList: {
        width: '100%',
        margin: 0,
    },
    tileBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
    },
    placeholder: {
        backgroundColor: theme.palette.grey[300],
        height: '100%',
    },
    price: {
        display: 'inline',
        fontSize: '1em',
    },
    link: {
        color: '#fff',
    },
}));

const getColsForWidth = (width) => {
    if (width === 'xs') return 2;
    if (width === 'sm') return 3;
    if (width === 'md') return 4;
    if (width === 'lg') return 5;
    return 6;
};

const times = (nbChildren, fn) => Array.from({ length: nbChildren }, (_, key) => fn(key));


const LoadingGridList = ({
    width,
    nbItems = 20,
}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <MuiGridList
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
            </MuiGridList>
        </div>
    );
};

const LoadedGridList = ({ ids, data, basePath, width }) => {
    const classes = useStyles();
    if (!ids || !data) return null;

    return (
        <div className={classes.root}>
            <MuiGridList
                cellHeight={180}
                cols={getColsForWidth(width)}
                className={classes.gridList}
            >
                {ids.map(id => (
                    <GridListTile
                        // @ts-ignore
                        component={Link}
                        key={id}
                        to={linkToRecord(basePath, data[id].id)}
                    >
                        <img src={ URI +'images/'+data[id].imagenRuta} alt="" />
                        <GridListTileBar
                            className={classes.tileBar}
                            title={data[id].nombre}
                            subtitle={
                                <span>
                                    {data[id].stock}{' '}-{' $'}
                                    <NumberField
                                        className={classes.price}
                                        source="precio"
                                        record={data[id]}
                                        color="inherit"
                                        locales={'es-CL'}

                                    />
                                </span>
                            }
                        />
                    </GridListTile>
                ))}
            </MuiGridList>
        </div>
    );
};


const GridList = ({ loaded, ...props }) =>
    loaded ? <LoadedGridList {...props} /> : <LoadingGridList {...props} />;

export default withWidth()(GridList);
