//services폴더는 실제로 db랑 통신하게되고, 일정 로직을 담고있는 class이다
import database from "../../../database"


// crud를 하게될 5가지 service가 들어있음
export class UserService{
    async finduserById(id){
        const user = await database.user.findUnique({
            where:{
                id
            }
        })
        if(!user){
            throw {status: 404, message: "유저를 찾을 수 없습니다."}
        }
        return user
    }
    async findUsers({skip, take}){
        const users = await database.user.findMany({
            skip,
            take
        })
        const count = await database.user.count()
        return {
            users,
            count
        }
    }
    async createUser(props){
        const newUser = await database.user.create({
            data :{
                name : props.name,
                email : props.email,
                age : props.age,
                phoneNumber : props.phoneNumber,
            }
        })
        return newUser.id
    }
    async updateUser(id){
        //에러를 핸들링해주기
        const isExist = await database.user.findUnique({
            where:{
                id
            }
        }) 
        if(!isExist){
            throw {status: 404, message:"유저를 찾을 수 없습니다."}
        }
        // 만약 테이블에서 id와 일치하는 데이터가 없는 경우 에러발생, 핸들링 불가
        await database.user.update({
            where:{
                id : isExist.id
            },
            data:{
                name : props.name,
                email : props.email,
                age : props.age,
                phoneNumber : props.phoneNumber,
            }
        })
    }
    async deleteUser(id){
        const isExist = await database.user.findUnique({
            where:{
                id
            }
        }) 
        if(!isExist){
            throw {status: 404, message:"유저를 찾을 수 없습니다."}
        }
        await database.user.delete({
            where:{
                id: isExist.id
            }
        })
    }
}