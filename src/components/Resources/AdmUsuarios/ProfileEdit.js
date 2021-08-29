import React, {useState} from "react";
import {
    minLength,
    required,
    SimpleForm,
    TextInput,
    useDataProvider,
    useNotify,
    PasswordInput,
    email
} from 'react-admin'
import Cookies from "universal-cookie";





const cookies = new Cookies();
export const ProfileEdit = (props) => {

    const user = cookies.get('user')
    const token = cookies.get('token')
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [saving, setSaving] = useState();
    const handleSave = (data) =>{
        debugger;
        if (data?.confirmPassword) delete data.confirmPassword;

        dataProvider.update('usuarios',{...data,verificationToken:token});

    }

    const confirmPassword = (value, allValues) => {
        console.log(value,allValues);

        if (String(value) !== String(allValues.password))
            return 'Las contraseñas son distintas';

        return [];

    }


    return (
            <SimpleForm save={handleSave} record={user ? user : {}}>
                <TextInput source="name" label={"Nombre de usuario"} validate={required()} />
                <TextInput type={"email"} source={"email"} validate={[required(),email()]}/>
                <PasswordInput source={"password"} label={"Contraseña"} validate={[minLength(8),required()]}/>
                <PasswordInput source={"confirmPassword"} label={"Confirme contraseña"} validate={[minLength(8),required(),confirmPassword]}/>

            </SimpleForm>
    );
};
