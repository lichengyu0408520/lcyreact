import React, { Component } from 'react'
import { 
  Card,
  Table, 
  message,
  Button,
  Modal,
  Form
} from 'antd';
import LinkButton from '../../components/linkbutton';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import { formateDate } from '../../utils/dataUtils'
import { PAGE_SIZE } from '../../utils/Constants'
import AddForm from './add-form'
import AuthForm from './auth-form'
import  memoryUtils from '../../utils/memoryUtils'
/**
 * 角色管理
 */

export default class Role extends Component {

  state = {
    roles:[],
    isShowAdd:false,//是否显示添加界面
    isShowAuth:false,//是否显示设置权限界面
  }

  constructor (props) {
    super(props)
    this.authRef = React.createRef()
  }

  /**
   * 初始化列
   */
  initColumns = () =>{
    this.columns=[
      {
        title:'角色名称',
        dataIndex:'name',
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render: create_time =>formateDate(create_time)
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render: auth_time =>formateDate(auth_time)
      },
      {
        title:'授权人',
        dataIndex:'auth_name',
      },
      {
        title:'操作',
        render: (role) =><LinkButton onClick={()=>this.showAuth(role)}>
          设置权限
        </LinkButton>
      }
    ]
  }

  /**
   * 显示权限设置的界面
   */
  showAuth = (role) =>{
    this.role=role
    this.setState({
      isShowAuth:true
    })
  }
  /**
   * 异步获取分类列表的显示
   */
  getRoles = async() =>{
    const result = await reqRoles();
    if(result.status===0){
      //取出分类列表
      const roles = result.data;
      //更新分类列表
      this.setState({
        roles
      })
    }else{
      message.error('获取分类列表失败了');
    }
  }

  /**
   * 添加角色
   */
  // addRole = ()=>{
  //   //进行表单统一验证
  //   this.from.validateFields(async(error,values)={
  //     if(!error){
  //       //隐藏显示框
  //       this.setState({
  //         isShowAdd:false
  //       })
  //       //收集数据
  //       const { roleName } =values
  //       this.resetFields()
  //       //发送添加请求
  //       const result = await reqAddRole( roleName ) 
  //       //根据结果提示/更新显示
  //       if(result.status===0){
  //         message.success('添加角色成功')
  //         //新产生的角色
  //         const role =result.data
  //         // 更新roles状态: 基于原本状态数据更新
  //         this.setState({state =>({
  //           roles:[...state.roles,role]
  //         }))
  //       }else{
  //         message.error('添加角色失败')
  //       }
  //     }
  //   })
  // }
  addRole = () => {
    // 进行表单验证, 只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if (!error) {
        // 隐藏确认框
        this.setState({
          isShowAdd: false
        })

        // 收集输入数据
        const { roleName } = values
        this.form.resetFields()

        // 请求添加
        const result = await reqAddRole(roleName)
        // 根据结果提示/更新列表显示
        if (result.status === 0) {
          message.success('添加角色成功')
          // this.getRoles()
          // 新产生的角色
          const role = result.data
          // 更新roles状态
          /*const roles = this.state.roles
          roles.push(role)
          this.setState({
            roles
          })*/

          // 更新roles状态: 基于原本状态数据更新
          this.setState(state => ({
            roles: [...state.roles, role]
          }))

        } else {
          message.success('添加角色失败')
        }
      }
    })
  }

    /*
    给角色授权
    */
    updateRole = async() =>{
      // 隐藏确认框
      this.setState({
        isShowAuth: false
    })
    const {role} = this
    role.menus = this.authRef.current.getMenus()
    role.auth_time = Date.now()
    role.auth_name=memoryUtils.user.username
    const result = await reqUpdateRole(role)
    if(result.status===0){
      message.success('角色授权成功了')
      this.setState({
        roles: [...this.state.roles]
      })
    }else{
      message.error('角色授权失败了')
    }
  }



  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {
    const { roles,isShowAdd,isShowAuth } = this.state;
    const role =this.role||{}
    const title = (
      <Button type="primary" onClick={()=>this.setState({ isShowAdd:true })}>
        创建角色
      </Button>
    )
    return (
      <Card title = {title}>
        <Table 
          border = {true} 
          rowKey = "_id"
          columns = {this.columns}
          dataSource = {roles}
          pagination = {{ defaultPageSize:PAGE_SIZE,showQuickJumper:true }}
        />

        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=>{
            this.setState({isShowAdd:false})
            this.form.resetFields()
          }}
        >
          <AddForm 
            setForm={(from)=>this.form = from}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=>{
            this.setState({ isShowAuth:false })
          }}        
        >
          <AuthForm ref={this.authRef} role={role}/>
        </Modal>
  
      </Card>
    )
  }
}
