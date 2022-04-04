// roles.js
const AccessControl = require("accesscontrol")
// const ac = new AccessControl()

let grantList = [
    {
        role: "admin",
        resource: "adminPage",
        action: "create:any",
        attributes: "*, !views",
    },
    {
        role: "admin",
        resource: "adminPage",
        action: "read:any",
        attributes: "*",
    },
    {
        role: "admin",
        resource: "video",
        action: "update:any",
        attributes: "*, !views",
    },
    {
        role: "admin",
        resource: "adminPage",
        action: "delete:any",
        attributes: "*",
    },
    {
        role: "nurse",
        resource: "adminPage",
        action: "delete:any",
        attributes: "*",
    },
    {
        role: "Doctor",
        resource: "video",
        action: "delete:any",
        attributes: "*",
    },
    { role: "Doctor", resource: "video", action: "read:any", attributes: "*" },
    {
        role: "user",
        resource: "video",
        action: "create:own",
        attributes: "*, !rating, !views",
    },
    { role: "user", resource: "video", action: "read:any", attributes: "*" },

    {
        role: "user",
        resource: "video",
        action: "update:own",
        attributes: "*, !rating, !views",
    },
    { role: "user", resource: "video", action: "delete:own", attributes: "*" },
]
// const ac = new AccessControl(grantList)

function roles () {
    // ac.grant("basic").readOwn("profile").updateOwn("profile")

    // ac.grant("supervisor").extend("basic").readAny("profile")

    // ac.grant("admin")
    //     .extend("basic")
    //     .extend("supervisor")
    //     .updateAny("profile")
    //     .deleteAny("profile")
    const ac = new AccessControl(grantList)
    return ac
}



exports.roles = roles
