import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import {capitalize} from "lodash";

const useStyles = makeStyles({
    main: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: -8,
        marginBottom: -8,
    },
    chip: { margin: '9px 1.5px' },
});

const SimpleChipField = ({ record }) => {
    const classes = useStyles();

    return record ? (
        <span className={classes.main}>
            <Chip key={record}
                  className={classes.chip}
                  label={capitalize(record)}
            />

        </span>
    ) : null;
};

export default SimpleChipField;