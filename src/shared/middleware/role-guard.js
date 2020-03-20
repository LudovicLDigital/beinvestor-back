const { roles } = require('../util/roles');
const guard = {
    haveAccess(action, resource) {
        return async (req, res, next) => {
            try {
                let haveAccess = false;
                for (let i = 0; i < req.user.data.roles.length; i++) {
                    const permission = roles.can(req.user.data.roles[i].title)[action](resource);
                    if (permission.granted) {
                        haveAccess = true;
                    }
                }
                if (!haveAccess) {
                    return res.status(401).json({
                        error: "You don't have enough permission to perform this action"
                    });
                }
                next()
            } catch (error) {
                next(error)
            }
        }
    }
};
module.exports = guard;