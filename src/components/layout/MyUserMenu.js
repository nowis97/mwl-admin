import React from "react";
import { UserMenu, MenuItemLink } from "react-admin";
import SettingsIcon from "@material-ui/icons/Settings";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const MyUserMenu = (props) => {
     const user = cookies.get('user');

    return (
        <UserMenu  {...props}>
            <MenuItemLink
                to="/mi-perfil"
                primaryText={"Perfil de "+ user.name || '' }
                leftIcon={<SettingsIcon />}
            />
        </UserMenu>
    );
};

export default MyUserMenu;
