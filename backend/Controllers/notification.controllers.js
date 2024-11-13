import Notification from "../Models/notification.model.js"
export const getNotifications = async (req ,res)=>{
    try {
        const user = req.user;
        const notifs = await Notification.find({to : user._id}).sort({createdAt : -1}).populate({
            path : "from",
            select :"-password"

        })
        await Notification.updateMany({to: user._id} , {read : true})
        res.status(200).json(notifs)
    } catch (error) {
        console.log(error)
        res.status(500).send({error : "Error at getNotification controller"})
        }
}
export const deleteNotification = async (req ,res)=>{
    try {
        const id = req.id;
        const notif = await Notification.findById(id);
        if(!notif){
            return res.status(400).send({error: "Notfication not found"})

        }
        await Notification.findOneAndDelete(id);
        res.status(200).send({message : "Notification deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error : "Error at deleteNotification controller"})
        }
}
export const clearNotifications= async (req ,res)=>{
    try {
        
        await Notification.deleteMany({to : req.user._id});
    
        res.status(200).send({message : "Notification deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error : "Error at deleteNotification controller"})
        }
}