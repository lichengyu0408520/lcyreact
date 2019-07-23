import React,{Component} from 'react'
import { Form, Icon, Input, Button,message} from 'antd';
import logo from '../../assets/images/logo.png'

import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqLogin } from '../../api';
import './login.less'
const Item=Form.Item;
class Login extends Component{
    handleSubmit = e => {
        e.preventDefault();
        /**
       * 对所有的表单进行统一验证
       */
      this.props.form.validateFields(async(err,{username,password})=>{
            if(!err){
                // alert(`发登陆的ajax请求, username=${username}, password=${password}`)
                const result=await reqLogin(username,password)
                //登录成功
                if(result.status===0){
                    //将user信息保存
                    const user=result.data;
                    storageUtils.saveUser(user)
                    //保存到内存中
                    memoryUtils.user=user;
                    //跳到管理界面
                    this.props.history.replace('/')
                    message.success('登录成功')
                }else{
                    message.error(result.msg)
                }
            }
            
        })
      };
    
    /**
     * 对密码进行自定义验证
     */
      validatePwd=(rule,value,callback)=>{
        value=value.trim();
        if(!value){
            callback('密码不能为空');
        }else if(value.length<4){
            callback('密码长度不能小于4');
        }else if(value.length>12){
            callback('密码长度不能大于12');
        }else{
            callback();//验证通过
        }
      }
        render(){
            const {getFieldDecorator}=this.props.form;
            return(
                <div className="login">
                    <div className="login-header">
                        <img src={logo} alt="logo"/>
                        <h1>后台管理系统</h1>
                    </div>
                    <section className='login-content'>
                        <h3>用户登陆</h3>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Item>
                                {
                                    getFieldDecorator('username',{
                                    initialValue:'',
                                    rules:[
                                        {require:true,whitespace:true,message:'用户名是必填项'},
                                        {min:4,message:'用户名长度不能少于4位'},
                                        {max:12,message:'用户名长度不能大于12位'},
                                        {pattern:/^[a-zA-Z0-9]+$/,message:'用户名必须是英文、数字或下划线组成'}
                                        ]
                                    })(
                                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        placeholder="用户名"/>
                                    )
                                }
                            </Item>
                            <Item>
                                {
                                    getFieldDecorator('password',{
                                        initialValue:'',
                                        rules:[
                                            {validator:this.validatePwd}
                                        ]
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                            type="password" placeholder="密码"/>
                                    )
                                }
                            </Item>
                            <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                            </Item>
                        </Form>
                        </section>
                </div>
            )        
        } 
    } 
const WarpperForm =Form.create()(Login)
export default WarpperForm