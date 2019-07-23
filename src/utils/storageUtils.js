/**
 * 操作loal数据中的工具函数模块
 */
import store from 'store'
const USER_KEY='user_key'
export default {
    /**
     * 保存user
     */
    saveUser(user){
        store.set(USER_KEY,user);
    },
    /**
     * 返回一个user对象，如果没有返回一个空对象
     */
    getUser () {
        return store.get(USER_KEY) || {}
    },
     /**
     * 删除保存user
     */
    removeUser () {
        store.remove(USER_KEY)
    }
}