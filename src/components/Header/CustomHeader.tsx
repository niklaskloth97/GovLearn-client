import Search from "antd/es/input/Search";
import {Avatar, Button, Dropdown, MenuProps, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import SubHeader from "./SubHeader.tsx";
import {openLoginModal} from "../../state/modalutil.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../state/reduxStore.ts";
import {clearAuthToken} from "../../state/authslice.ts";

const {Title} = Typography

function CustomHeader() {

    const [subHeader, setSubHeader] = useState(<div style={{height: "32px", width: "1px"}}/>)

    //TODO: implement global state for logged in
    const loggedIn = useSelector((state: RootState) => !!state.auth.authtoken)
    const dispatch = useDispatch()

    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("discover") || location.pathname.includes("detail") || location.pathname.includes("profile")) {
            setSubHeader(<SubHeader/>)
        } else {
            setSubHeader(<></>)
        }
    }, [location.pathname])

    const [name, setName] = useState('')

    const token = useSelector((state: RootState) => state.auth.authtoken as string)

    useEffect(() => {

        fetch('http://localhost:8080/api/v1/users', {
            method: 'GET',
            headers: new Headers({Authorization: `Bearer ${token}`})
        }).then(response => response.json()).then(data => {
            setName(data.payload.name)
        })

    })

    //TODO: refactor avatar to component
    //TODO: dont show search bar on landing page
    //TODO: placeholder for avatar/loginbutton so it doesnt jump around

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a rel="noopener noreferrer" href="profile">
                    Eingeloggt als:
                    <span style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: "120px",
                        display: "block",
                    }}>
                    {name}
                </span>

                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Einstellungen
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Placeholder
                </a>
            ),
        },
        {
            key: '4',
            label: (
                <a onClick={() => {dispatch(clearAuthToken())}}>
                    Ausloggen
                </a>
            ),
            danger: true,
        },
    ];

    return (
        <div style={{width: "100%", height: "100%"}}>
            <div style={{
                margin: "0 auto",
                maxWidth: "1200px",
                width: "100%",
                height: "56px",
                display: "flex",
                verticalAlign: "middle",
                gap: "10px",
                padding: "0px 10px",
            }}>
                <Title level={3}
                       style={{
                           margin: "auto auto auto 0px",
                           minWidth: "100px",
                           color: "#3f3f3f"
                       }}>
                    <a href="/discover" style={{color: "#212321"}}>
                        Govlearn
                    </a>
                </Title>
                <Search placeholder="Kursangebote suchen" size="large" style={{maxWidth: "400px", margin: "auto"}}
                        allowClear/>
                {loggedIn ?
                    <div style={{margin: "auto 0px auto auto", minWidth: "32px", lineHeight: "0px"}}>
                        <Dropdown menu={{items}} placement="bottomRight" arrow={{pointAtCenter: true}}
                                  trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Avatar icon={<UserOutlined/>}/>
                            </a>
                        </Dropdown>
                    </div>
                    :
                    <Button type="primary" size="large" style={{margin: "auto 0px auto auto", minWidth: "32px"}}
                            onClick={() => {openLoginModal("login")}}>Anmelden</Button>
                }


            </div>
            {subHeader}
        </div>
    );
}

export default CustomHeader;