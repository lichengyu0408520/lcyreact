import React, { Component } from 'react'

import menuList  from '../../config/menuConfig.jsx'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'


const { TreeNode } = Tree
const Item = Form.Item


/*
添加分类的form组件
*/

export default class AuthFrom extends Component {

    static propsTypes = {
        role:PropTypes.object
    }

    // state = {
    //     checkedKeys:[]
    // }

    constructor (props) {
        super(props)
        //根据传入的munes来更新checkedKeys的状态
        const { menus } = this.props.role
        this.state = {
            checkedKeys:menus
        }
    }
    /**
     * 父组件需要我点击确定时选中的值 作为menus返回
     */

    getMenus = () => this.state.checkedKeys

    /**
     *  进行勾选操作时的回调
     *  checkedKeys：最新的勾选的node的数组
     */
    handleCheck = (checkedKeys) =>{
       //更新状态
       this.setState({
        checkedKeys
       })
    }

    getTreeNodes = (menuList) => {
        //根据menuList生成树
        console.log(menuList)
        return menuList.reduce((pre, item) => {
          pre.push(
            <TreeNode title={item.title} key={item.key}>
              {item.children ? this.getTreeNodes(item.children) : null}
            </TreeNode>
          )
          return pre
        }, [])
      }

    componentWillMount () {
        console.log('componentWillMount')
        this.treeNodes = this.getTreeNodes(menuList)
    }

    /**
     *组件接收到新的标签属性时就会执行（初始显示时不会调用）
     nextProps:接收到包含新的属性的对象
     */

    componentWillReceiveProps (nextProps) {
        console.log('componentWillReceiveProps')
        const { menus } = nextProps.role
        this.setState({
            checkedKeys:menus
        })
    }

    render() {
        const { role } = this.props
        //根据state中的checkedKeys来显示
        const {checkedKeys} =this.state
        const formItemLayout = {
            labelCol: { span:4 },
            wrapperCol: { span:15 }
        }

        return (
            <div>
               <Item label="角色名称" {...formItemLayout}>
                    <Input placeholder={role.name} disabled/>
               </Item>
               <Tree
                    checkable
                    onCheck={this.handleCheck}
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    //checkedKeys:如果传入父节点 key，则子节点自动选中；相应当子节点 key 都传入，父节点也自动选中
               >
                   <TreeNode title="平台权限" key="All">
                       { this.treeNodes}
                   </TreeNode>
               </Tree>
            </div>
        )
    }
}
