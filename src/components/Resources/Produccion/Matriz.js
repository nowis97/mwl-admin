import React from "react";
import './Matriz.css'

const newMatrix = (rows, cols) => new Array(cols).fill(0).map((o, i) => new Array(rows).fill(0))

const getColumn = (anArray, columnNumber) => {
    return anArray.map(function(row) {
        return row[columnNumber];
    });
}

const getRow = (array,rowIndex) =>{
    return array[rowIndex];
}

export const Matriz = ({data,verticalNames,horizontalNames,titulo}) => {

    data = data.map(obj =>{

       if (obj.color){
           return obj;
       }

       if (typeof obj[verticalNames] === 'object'){
           return  {...obj,[verticalNames]:Object.values(obj[verticalNames]).join('-')}
       }

        if (typeof obj[horizontalNames] === 'object'){
            return  {...obj,[horizontalNames]:Object.values(obj[horizontalNames]).join('-')}
        }

        return obj;

    })

    const verticalValues = [...new Set((data.map(obj => {
        if (typeof obj[verticalNames] !== 'object'){
            return  obj[verticalNames]
        }
        return Object.values(obj[verticalNames]).join('-');

    })))];
    const horizontalValues = [...new Set((data.map(obj => {
        if (typeof obj[horizontalNames] !== 'object')
            return  obj[horizontalNames]

        return Object.values(obj[horizontalNames]).join('-');

    })))];







    /*const renderHeader = () => {
        return rowUniqueValues.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }
    */


    const crearMatriz = () =>{


        horizontalValues.unshift(titulo);

        const matrizNueva = newMatrix(horizontalValues.length + 1,verticalValues.length + 2)

        horizontalValues.forEach((value, index) => matrizNueva[0][index] = value);

        verticalValues.forEach((value, index) => matrizNueva[index+1][0] = value);

        data.forEach((value) => {
            const idxRow = (verticalValues.indexOf(value[verticalNames]) + 1)
            const idxCol = horizontalValues.indexOf(value[horizontalNames])
            matrizNueva[idxRow][idxCol] += value.cantidad
        })

        const lastIdxRow = getColumn(matrizNueva,0).length -1;

        const lastIdxCol = getRow(matrizNueva,0).length - 1

        for (let i = 1;i<horizontalValues.length;i++){
            matrizNueva[lastIdxRow][i] = getColumn(matrizNueva, i).reduce((acc, curr) => Number.isInteger(curr) ? acc + curr : acc, 0);
        }

        for (let i = 0;i<verticalValues.length;i++){
            matrizNueva[i+1][lastIdxCol] = getRow(matrizNueva,i+1).reduce((acc, curr) => Number.isInteger(curr) ? acc + curr : acc, 0);
        }

        matrizNueva[lastIdxRow][0] = '';
        matrizNueva[lastIdxRow][lastIdxCol] = '';
        matrizNueva[0][lastIdxCol] = '';



        return matrizNueva;


    }



    const renderBody = () => {

        return crearMatriz().map((row,i) =>{
            return (
                <tr key={i}>
                    {row.map((col,j) => (<td key={j}>{col}</td>))}
                </tr>
            )
        })




    }

    return (
        <>
            <table className={'matrix'}>
                {/*<thead>
                <tr>{"Titulo"}</tr>
                </thead>*/}
                <tbody>
                {renderBody()}
                </tbody>
            </table>
        </>
    )
}
