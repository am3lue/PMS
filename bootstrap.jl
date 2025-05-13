(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using PMS
const UserApp = PMS
PMS.main()
