import Search, { SearchProps } from "antd/es/input/Search";
import {Avatar, Button, Dropdown, MenuProps, Space, TreeSelect, Typography, message} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import SubHeader from "./SubHeader.tsx";
import {openLoginModal} from "../../state/modalutil.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../state/reduxStore.ts";
import {clearAuthToken} from "../../state/authslice.ts";
import {fetchWrapper} from "../../api/helper";
import categoryBlue from "../../assets/categoryBlue.png";
import { Category, Tag } from "../../interfaces.ts";

const {Title} = Typography

function CustomHeader() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagIDs, setTagIDs] = useState<number[]>([]);

    const navigate = useNavigate();

    const handleSearch = (searchString: string) => {
        navigate(`/searching/${searchString}`, { state: {tagIDs: tagIDs}, replace: true });
      };

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if(value !== "")
            console.log(info?.source, value), handleSearch(value)
        else
            message.error("Bitte geben Sie einen Suchbegriff ein!")
    };

    const [filterBtn, setFilterBtn] = useState(false)

    const onFilterBtn = () => {
        if (filterBtn == true)
            setFilterBtn(false)
        else
            setFilterBtn(true)
    }


    const { SHOW_PARENT } = TreeSelect;
    const [treeData, setTreeData] = useState<any[]>([]);

    const [value, setValue] = useState<string[]>([]);

    const onChange = (newValue: string[]) => {
      console.log('onChange ', newValue);
      setValue(newValue);
      const keyListTags:number[] = [];
      for (let index = 0; index < newValue.length; index++) {
        const key = Number(treeData.find(item => item.value === newValue[index])?.key);
        if(isNaN(key)){
            const tag = Number(tags.find(item => item.name === newValue[index])?.id);
            keyListTags.push(tag)
        }
        else{
            for (let index = 0; index < tags.length; index++) {
                const tagID = Number(tags[index].id);
                if (tags[index].categoryID == key && !keyListTags.includes(tagID))
                {
                    keyListTags.push(tagID);
                }
            }
        }
      }
      setTagIDs(keyListTags);
      console.log(tagIDs);
    };
  
    const tProps = {
      treeData,
      value,
      onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: 'Bitte wählen Sie einen Filter',
      style: {
        width: '100%',
      },
    };

    const [subHeader, setSubHeader] = useState(<div style={{height: "32px", width: "1px"}}/>)

    //TODO: implement global state for logged in
    const loggedIn = useSelector((state: RootState) => !!state.auth.authtoken)
    const dispatch = useDispatch()

    const location = useLocation();

    const [name, setName] = useState('')

    useEffect(() => {
        if (location.pathname.includes("discover") || location.pathname.includes("detail") || location.pathname.includes("profile") || location.pathname.includes("searching")) {
            setSubHeader(<SubHeader/>)
        } else {
            setSubHeader(<></>)
        }
        fetchWrapper.get('api/v1/users').then(res => setName(res.payload.name))
        fetchWrapper.get('api/v1/tags').then(res => setTags(res.payload))
        fetchWrapper.get('api/v1/category').then(res => setCategories(res.payload))
        updateTreeDataWithCategories(categories, tags);
    }, [location.pathname])

    const updateTreeDataWithCategories = (categories: Category[], tags: Tag[]) => {
        const updatedTreeData = categories.map((category) => ({
          title: category.name,
          value: category.name,
          key: category.id,
          children: tags
            .filter((tag) => tag.categoryID === category.id)
            .map((tag) => ({
              title: tag.name,
              value: tag.name,
              key: tag.id,
          })),
        }));
        setTreeData(updatedTreeData);
      };

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
                height:"56px",
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
                {loggedIn ?
                    <Space.Compact size="large" direction="vertical" style={{marginTop:"8px", marginBottom:"8px"}}>
                        <Space.Compact size="large" style={{margin: "auto"}} >
                            <Button onClick={onFilterBtn}><img src={categoryBlue} style={{width:"20px", marginLeft:"-5px", marginRight:"-5px", marginBottom:"-2px"}} /></Button>
                            <Search placeholder="Kursangebote suchen" size="large" style={{maxWidth: "400px"}}allowClear onSearch={onSearch} autoComplete="off"/>
                        </Space.Compact>
                    {filterBtn ?
                        <TreeSelect {...tProps} style={{position:"relative", zIndex:"1"}}/>
                        : <div></div>
                    }
                    </Space.Compact>
                    :<div></div>
                }
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