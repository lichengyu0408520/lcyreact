import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { Link,withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import './index.less'
const { SubMenu } = Menu;
/*
左侧导航组件
 */

class LeftNav  extends Component {
    /**
 * 根据指定菜单数据列表产生<Menu>的子节点数组：使用 reduce + 递归
 */
    getMenuNodes2=(menuList)=>{
        // 得到当前请求的path
        const path = this.props.location.pathname
        return menuList.reduce((pre,item)=>{
            //可能向pre添加Item
            if(!item.children){
                pre.push(
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
                }else{
                    const cItem = item.children.find(cItem => cItem.key === path)
                    if (cItem) {
                    this.openKey = item.key
                    }
                    pre.push(
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {this.getMenuNodes2(item.children)}
                    </SubMenu> 
                    )
                }
            //可能向pre添加SubMenuItem
            return pre;
        },[])
    }
/**
 * 根据指定菜单数据列表产生<Menu>的子节点数组：使用 map() + 递归
 */
    getMenuNodes=(menuList)=>{
        //得到当前请求的path
        const path=this.props.location.pathname;
        return menuList.map(item=>{
            if(!item.children){
                return(
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
                 }else{
                    // indexOf()方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1
                    if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                        this.openKey = item.key
                      }
                    return(
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                    {this.getMenuNodes(item.children)}
                    </SubMenu> 
                    )
                }
            })
        }
    componentWillMount () {
        this.menuNodes = this.getMenuNodes2(menuList)
    }
    render() {
        // const menuNodes= this.getMenuNodes2(menuList)
        //得到当前请求路径, 作为选中菜单项的key
        const selecteKey=this.props.location.pathname;
        console.log('selecteKey',selecteKey)
        return (
            <div className="left-nav">
                <Link to='/home' className='logo-link'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
           {/* 
            defaultSelectedKeys: 总是根据第一次指定的key进行显示
            selectedKeys: 总是根据最新指定的key进行显示
            */}
                <Menu
                    selectedKeys={[selecteKey]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                {
                    this.menuNodes
                    // this.getMenuNodes(menuList)
                    // this.getMenuNodes2(menuList)
                }    
                </Menu>
            </div>
        )
      }
    }
   
 /*
    withRouter: 高阶组件: 包装非路由组件返回一个包装后的新组件, 新组件会向被包装组件传递history/location/match属性
     */
    export default withRouter(LeftNav)
    /*
    2个问题:
      1). 自动选中对应的菜单项
      2). 有可能需要自动菜单项
     */