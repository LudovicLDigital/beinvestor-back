const GroupMessage = require("../../models/group/group-message");
class GroupMessageRepository {
    /**
     *
     * @param groupId the id of the group wanted
     * @param pagination must be an object construct as {page: number, numberItem: number}
     * @returns {Promise<void>} will return an object with {results: is the array of object, total: the length of all row in database}
     */
    static async getAllMessageByGroupId(groupId, pagination){
        return await GroupMessage.query().select()
            .where('group_message.groupId', groupId)
            .page(pagination.page, pagination.numberItem).orderBy('created_at').throwIfNotFound();
    }

    /**
     * Create and return the object inserted in db
     * @param groupMessage group message datas
     * @returns {Promise<Objection.AnyQueryBuilder>}
     */
    static async createMessage(groupMessage){
        return await GroupMessage.query().insertGraphAndFetch({
            userInfoId: groupMessage.userInfoId,
            authorName: groupMessage.authorName,
            groupId: groupMessage.groupId,
            content: groupMessage.content,
        });
    }
    static async updateMessage(updatedGroupMessage){
        updatedGroupMessage.updated_at = new Date();
        return await GroupMessage.query().updateAndFetchById(updatedGroupMessage.id, updatedGroupMessage)
            .throwIfNotFound();
    }
    static async deleteAmessage(messageId){
        return await GroupMessage.query().deleteById(messageId).throwIfNotFound();
    }
    static async getLastGroupMessage(groupId){
        return await GroupMessage.query().select()
            .where('group_message.groupId', groupId)
            .whereIn('created_at',
                GroupMessage.query().select()
                    .max('created_at')
                    .where('group_message.groupId', groupId)
            )
            .throwIfNotFound();
    }
    static async getMessageCountForGroup(groupId){
        return await GroupMessage.query()
            .count()
            .where('group_message.groupId', groupId)
            .first()
            .throwIfNotFound();
    }
    static async getCountForAllMessageOfUser(userInfoId){
        return await GroupMessage.query()
            .where('group_message.userInfoId', userInfoId)
            .count()
            .first()
            .throwIfNotFound();
    }
    static async getCountUserSMessagesInGroup(userInfoId, groupId){
        return await GroupMessage.query()
            .count()
            .where({
                'group_message.userInfoId': userInfoId,
                'group_message.groupId': groupId
            })
            .first()
            .throwIfNotFound();
    }
}
module.exports = GroupMessageRepository;